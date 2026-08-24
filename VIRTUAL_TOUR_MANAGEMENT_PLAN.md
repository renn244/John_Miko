# Virtual Tour Management Implementation Plan

This is the implementation contract for an agent working on the `virtual-tour-management` branch. Complete phases in order and verify each phase before continuing. Do not connect development code or Prisma commands to the production database.

## Product Decisions Already Locked

- The tour has exactly one starting scene.
- When the tour is empty, show **Create starting scene**.
- Do not show a general **New scene** button after the starting scene exists.
- New scenes are normally created from a Navigation hotspot using **Create connected scene**.
- A Navigation hotspot may also link to an existing scene.
- Creating a Navigation hotspot and a new connected scene is one atomic action; never save an unfinished hotspot between requests.
- Information hotspots show content and never change scenes.
- Remove Category; it has no current guest or management purpose.
- Admin uploads one 2:1 equirectangular panorama. JMPort creates the lightweight preview and fixed 8x4 JPG tile set automatically.
- Hotspot and camera coordinates are captured visually and remain hidden from normal form fields.
- A destination scene opens in its saved default direction unless that Navigation hotspot has an optional custom arrival view.
- Keep the existing JMPort `AdminLayout` and the existing Photo Sphere Viewer guest experience.

## Non-Goals

- No VR/AR mode, floor-map editor, drag-and-drop route graph, analytics dashboard, or hotspot scheduling.
- Do not redesign unrelated admin pages.
- Do not replace the existing viewer library.
- Keep development connected only to the local PostgreSQL database. Cloudinary uploads may be enabled explicitly for real media testing.

## Phase 0 — Development Safety Gate

Most of this phase is already implemented. Confirm it before schema work.

1. Start the locally installed PostgreSQL service with pgvector available.
2. Run `npm run prisma:migrate:dev` against the local PostgreSQL database.
3. Confirm backend startup loads `.env.development.local`.
4. Confirm the development database guard rejects a remote PostgreSQL hostname.
5. Keep email, Expo push, and RAG disabled locally. Enable media uploads only when Cloudinary testing is intended.

**Gate:** local PostgreSQL is reachable, Prisma commands use localhost, and `npm run build` passes.

## Phase 1 — Prisma Models and Backend Module

### Data Model

Add these enums to `backend/prisma/schema.prisma`:

- `VirtualTourSceneStatus`: `DRAFT`, `PUBLISHED`, `HIDDEN`
- `VirtualTourHotspotType`: `NAVIGATION`, `INFORMATION`

Add these models:

### `VirtualTour`

- `id`, `name`, `startingSceneId?`, `createdAt`, `updatedAt`
- Relation to all scenes.
- Optional one-to-one relation to the starting scene.
- The service maintains one main tour record; do not expose arbitrary tour creation.

### `VirtualTourScene`

- `id`, `tourId`, `name`, `slug`
- `status`
- `originalUrl?`, `previewUrl?`, `tilesBaseUrl?`
- `tileCols` default `8`, `tileRows` default `4`, `panoramaWidth?`
- `initialYaw` and `initialPitch` as floats, default `0`; these store the scene's visually captured default view
- `createdAt`, `updatedAt`
- Relations for outgoing and incoming hotspots.

### `VirtualTourHotspot`

- `id`, `sourceSceneId`, `type`, `label`, `icon?`
- `yaw` and `pitch` as floats
- `targetSceneId?` for Navigation hotspots
- `targetYaw?` and `targetPitch?` for an optional per-connection custom arrival view
- `infoTitle?`, `infoDescription?`, `infoImageUrl?` for Information hotspots
- `isActive` default `true`, `createdAt`, `updatedAt`
- Deleting a source scene may cascade its outgoing hotspots.
- Deleting a target scene must be blocked while incoming hotspots reference it.

Each hotspot type has its own endpoint and DTO:

- Navigation requires `targetSceneId`; incomplete Navigation hotspots are rejected by its DTO.
- Information requires `infoTitle` and `infoDescription`; its DTO does not contain Navigation fields.
- Yaw and pitch must be finite numbers within the viewer-supported range.
- The Navigation service validates same-tour targets, self-navigation, and paired custom-arrival coordinates.

### Backend Files

Create `backend/src/virtual-tour/` with:

- `virtual-tour.module.ts`
- `virtual-tour.controller.ts` for public reads
- `virtual-tour-admin.controller.ts` for admin mutations
- `virtual-tour.service.ts`
- `dto/virtual-tour.dto.ts`
- focused service and controller specs

Register `VirtualTourModule` in `backend/src/app.module.ts`.

### API Contract

Public:

- `GET /virtual-tour` — return availability, starting scene ID, and published scenes with active valid hotspots.

Admin, protected by `AuthGuard`, `RolesGuard`, and `Role.ADMIN`:

- `GET /admin/virtual-tour` — complete editor state.
- `POST /admin/virtual-tour/starting-scene` — allowed only when no starting scene exists.
- `PATCH /admin/virtual-tour/scenes/:sceneId` — name and visually captured default view.
- `POST /admin/virtual-tour/scenes/:sceneId/navigation-hotspots` — create a Navigation hotspot linked to an existing scene.
- `POST /admin/virtual-tour/scenes/:sceneId/information-hotspots` — create an Information hotspot.
- `POST /admin/virtual-tour/scenes/:sceneId/connected-scene` — transactionally create a Navigation hotspot and its new draft destination scene together.
- `PATCH /admin/virtual-tour/navigation-hotspots/:hotspotId` — edit a Navigation hotspot.
- `PATCH /admin/virtual-tour/information-hotspots/:hotspotId` — edit an Information hotspot.
- `DELETE /admin/virtual-tour/hotspots/:hotspotId`.
- `POST /admin/virtual-tour/scenes/:sceneId/publish`.
- `POST /admin/virtual-tour/scenes/:sceneId/hide`.
- `POST /admin/virtual-tour/scenes/:sceneId/draft`.
- `DELETE /admin/virtual-tour/scenes/:sceneId` — reject starting scenes and scenes with incoming links using HTTP 409.

Publishing requires the scene panorama to be `READY` and every active Navigation hotspot to have a target. Public responses must omit unpublished scenes and Navigation hotspots whose target is not published.

**Gate:** migrations apply locally; service tests cover starting-scene uniqueness, conditional hotspot rules, optional arrival-view validation, publish validation, public filtering, the atomic connected-scene transaction, and deletion conflicts.

## Phase 2 — Single Panorama Upload and Backend Slicing

### Upload Endpoint and Package Contract

- Add `POST /admin/virtual-tour/scenes/:sceneId/panorama` using multipart upload.
- Require one multipart field named `panorama`.
- Accept JPG or PNG originals up to 60 MB.
- Reject originals that are not approximately 2:1.
- Validate the original through a reusable Nest upload pipe before processing.

### Ingestion

1. Preserve the original image.
2. Normalize the viewer image to an exact 2:1 size divisible by the 8x4 grid, capped at 8192x4096 without enlarging smaller panoramas.
3. Generate a lightweight WebP preview and 32 JPG tiles named `0_0.jpg` through `3_7.jpg` with Sharp.
4. Save `originalUrl`, `previewUrl`, `tilesBaseUrl`, width, columns, and rows together after storage succeeds.
5. On failure, return the upload error without changing the scene's existing panorama fields.

Panorama readiness is derived from the complete stored asset fields. Upload progress and errors remain request state because ingestion is synchronous.

Slicing remains synchronous inside the upload request. Temporary upload and generated tile files are always cleaned after success or failure.

### Storage Boundary

Use the existing Cloudinary configuration through `VirtualTourStorageService`:

- Upload the validated original, generated preview, and 32 generated slices to public Cloudinary assets under `public/virtual-tour/scenes`.
- Keep the storage service boundary so the panorama service and database remain storage-agnostic.
- Preserve the exact slice names in Cloudinary so the tiled viewer can request `0_0.jpg` through `3_7.jpg`.
- Roll back assets from a partially failed Cloudinary package upload.
- Use Cloudinary for all panorama delivery; legacy local panorama serving has been removed.

Do ingestion synchronously. Upload progress and failures stay in the frontend mutation state; panorama readiness is derived from the complete stored asset fields. Do not add a worker or queue.

**Gate:** upload tests cover the original requirement, file type, ratio, 8192px cap, generated slice names/count, temporary-file cleanup, Cloudinary storage and rollback failure handling, and saved metadata. A real uploaded panorama renders from generated Cloudinary tiles.

## Phase 3 — Admin Panorama Editor

### Integration Files

- Add route `/admin/virtual-tour` in `frontend/src/App.tsx`.
- Add **Virtual Tour** under the System section in `frontend/src/page/Admin/AdminLayout.tsx`.
- Create `frontend/src/page/Admin/VirtualTourManagement.tsx`.
- Create components under `frontend/src/components/pageComponents/Admin/VirtualTour/`.
- Add types in `frontend/src/types/admin/virtual-tour.type.ts`.
- Add API functions in `frontend/src/api/admin/virtual-tour.api.ts`.
- Add React Query hooks in `frontend/src/hooks/admin/virtual-tour.hook.ts` using the existing API/hook conventions.

### UI States

1. **Empty tour:** explanation plus **Create starting scene** form.
2. **Scene selected:** compact connected-scene list, large panorama canvas, scene status, and Save/Preview/Publish/Hide actions. The editor and draft preview use the tiled adapter: show the lightweight preview immediately as the base image, then progressively load the visible generated tiles for full detail.
3. **Add hotspot mode:** choose Navigation or Information, then click the panorama; the editor captures coordinates without displaying numeric fields.
4. **Hotspot selected:** the right inspector edits that hotspot instead of showing generic scene details.
5. **Create connected scene:** collect the clicked hotspot position and new scene details, then create and link both atomically before requesting the panorama upload.
6. **Uploading/failed:** disable conflicting actions and show mutation progress/error recovery. The upload form requests one original panorama; after transfer completes it indicates that backend processing is still running.

Hotspot inspector fields:

- Shared: type, label, icon, active state, delete. Position is edited visually on the panorama, not through numeric coordinates.
- Navigation: link an existing scene or create a connected scene. Default to the destination scene's saved view; offer an optional **Set arrival view** action that captures a per-connection override visually.
- Information: title, description, optional image.

Keep the panorama dominant. Do not add summary-stat cards, category fields, or a second navigation shell. Use existing JMPort components, spacing, dialogs, buttons, and validation patterns.

**Gate:** admin can create the starting scene, upload its panorama, place/edit both hotspot types, create a connected target scene, preview, publish, hide, and receive understandable validation errors.

## Phase 4 — Dynamic Guest Viewer

**Status: Complete (August 18, 2026).**

Refactor the existing files rather than rebuilding the viewer:

- `frontend/src/page/VirtualTour.tsx`
- `frontend/src/components/pageComponents/VirtualTour/VirtualTourViewer.tsx`
- `frontend/src/hooks/useVirtualTourViewer.ts`
- `frontend/src/components/pageComponents/VirtualTour/tourMarkers.ts`
- `frontend/src/components/pageComponents/VirtualTour/tourNavigation.ts`
- `frontend/src/types/virtual-tour.type.ts`

Add `frontend/src/api/virtual-tour.api.ts` and a public query hook. Replace `VIRTUAL_TOUR_SCENES` and the hard-coded `SceneId` union with API data keyed by database IDs. Preserve current fullscreen, zoom, transition, marker, preloading, and information-panel behavior.

Handle three public states: loading, tour unavailable, and viewer ready. Never fall back to the Olde Bryan Inn sample content.

**Gate:** opening `/virtual-tour` starts at the published starting scene, Navigation hotspots change scenes, Information hotspots open details, and no draft/hidden data appears in network responses.

## Phase 5 — Verification and Documentation

**Status: In progress.** Review and complete the following stages in order. For each stage, the developer reviews the listed code and behavior, records issues, fixes them, reruns the relevant checks, and marks the stage complete before continuing.

### Phase 5A — Scope and Architecture Review

**Status: Complete (August 22, 2026).**

- Confirm the implementation still matches the documented objectives and locked product decisions.
- Trace the complete flow: admin input, API validation, database state, Cloudinary storage, and public output.
- Confirm there is one managed tour, one starting scene, and no general scene creation outside the connected-scene flow.
- Identify obsolete compatibility code, configuration, dependencies, and documentation. Remove an item only after confirming no database record or runtime path still uses it.

Review these files in order:

1. `VIRTUAL_TOUR_MANAGEMENT_PLAN.md` — approved behavior and boundaries.
2. `backend/prisma/schema.prisma` — persisted tour, scene, and hotspot structure.
3. `backend/prisma/migrations/20260817134500_add_virtual_tour_management/migration.sql` — initial database changes.
4. `backend/prisma/migrations/20260818120000_add_virtual_tour_arrival_view/migration.sql` — optional arrival-view changes.
5. `backend/src/virtual-tour/virtual-tour.module.ts` — backend dependency boundary.
6. `backend/src/app.module.ts` — backend module registration.
7. `frontend/src/App.tsx` — public and admin route registration.
8. `frontend/src/page/Admin/AdminLayout.tsx` — admin navigation entry.

**Gate:** the implemented behavior and architecture match the approved scope, with no unexplained feature or dependency.

### Phase 5B — Backend Code Review

- Review the Prisma models and migrations for constraints, relations, defaults, and unnecessary fields.
- Review controllers, DTOs, pipes, services, and guards for project consistency and clear responsibilities.
- Review panorama ingestion: one original, backend preview/tile generation, temporary disk handling, validation, Cloudinary upload, rollback, and cleanup.
- Review scene and hotspot lifecycle rules, publish validation, authorization, errors, and deletion conflicts.
- Review development environment safety and confirm production database endpoints cannot be used accidentally.

#### Locked Refactor Rules

- This is a complete simplification pass over the virtual-tour backend, not a targeted fix for `updateHotspot`.
- Review every virtual-tour class, helper, type, conditional, and abstraction. Keep it only when it protects required behavior or makes the main flow easier to understand.
- Follow the project's full-update DTO pattern. Do not use `PartialType` for scene or hotspot updates.
- The frontend must submit the complete editable scene or hotspot payload when updating.
- A scene update contains `name`, `initialYaw`, and `initialPitch`.
- A hotspot update contains the complete common fields and sends non-applicable Navigation or Information fields as `null`.
- Pass validated DTO fields directly to Prisma with `data: body` or a simple spread when relationship fields must be added.
- Do not build update objects with repeated conditional spreads such as `...(body.name !== undefined ? ... : {})`.
- Do not manually trim scene names, hotspot labels, titles, descriptions, icons, or other DTO strings inside the service.
- Let DTO validation define accepted input. Do not repeat basic DTO checks in the service.
- Use `cleanPrismaWhere` only for optional query/filter objects. Virtual-tour update payloads are complete objects, so they do not need it.
- Keep manual mapping only where the virtual-tour rules genuinely require it, such as clearing fields that belong to the other hotspot type or adding relation IDs.
- Do not introduce repository, mapper, factory, or additional validation classes during the refactor.

#### Refactor Sequence

##### Phase B1 — DTOs, Controllers, and Core Tour Service

**Status: Complete (August 22, 2026).**

- Replace partial update DTOs with explicit full-update DTOs.
- Remove redundant DTOs, decorators, and service checks while preserving required request validation.
- Keep controllers as thin endpoint-to-service delegation with clear type-specific URLs and existing authorization.
- Use separate Navigation and Information endpoints, DTOs, and service methods so invalid cross-type fields are impossible in the request contract.
- Simplify every method in `VirtualTourService`, including admin reads, public reads, scene creation and updates, hotspot creation and updates, connected-scene creation, status changes, and deletion.
- Use direct Prisma `data` objects and simple spreads instead of field-by-field conditional construction.
- Remove repeated string normalization, duplicated hotspot mapping, unnecessary temporary objects, and trivial helpers.
- Shape the public API through small private scene and hotspot transformers with explicit response fields.
- Keep only genuine domain validation and the two atomic creation transactions.

**Gate:** the core service is straightforward from top to bottom, existing API behavior is preserved, and its focused tests and backend build pass.

##### Phase B2 — Panorama Upload Flow

- Keep `VirtualTourPanoramaUploadPipe` as the multipart validation boundary with focused tests.
- Keep preview generation, synchronous Cloudinary storage, the final database update, and temporary-file cleanup in one clear service flow.
- Preserve the Sharp compatibility wrapper required by the current TypeScript module configuration.
- Keep `virtual-tour-upload.config.ts` limited to necessary Multer disk storage, filenames, counts, size limits, and shared image constants.

**Gate:** valid and invalid upload cases remain covered, temporary files are always cleaned, and the panorama service is readable as one linear workflow.

##### Phase B3 — Cloudinary Storage

- Keep `VirtualTourStorageService` only as the Cloudinary boundary.
- Flatten unnecessary interfaces, wrapper methods, option builders, and nested control flow.
- Preserve the exact Cloudinary paths, bounded concurrency, stored URLs, and partial-upload rollback.
- Reuse the existing Cloudinary provider without adding another media abstraction.

**Gate:** storage success and rollback tests pass, and the storage service contains only work that is specific to storing a panorama package.

##### Phase B4 — Module, Compatibility, and Tests

- Remove deleted providers and imports from `VirtualTourModule` and the controllers.
- Remove low-value tests that only repeat Nest delegation and move upload validation coverage beside the panorama service.
- Keep focused tests for business rules, authorization metadata, public filtering, upload cleanup, status failure, Cloudinary storage, and rollback.
- Remove dead constants, types, dependencies, debug code, and compatibility code that is no longer used.
- The legacy local panorama route was removed after the development records were reset for Cloudinary re-upload.
- Run backend lint, build, Prisma validation, and the focused virtual-tour/media tests.

**Gate:** the entire virtual-tour backend follows existing project patterns, contains no unnecessary layer, and preserves the verified admin and public behavior.

Review the implementation in this order:

1. Request and API boundary:
   - `backend/src/virtual-tour/dto/virtual-tour.dto.ts`
   - `backend/src/virtual-tour/virtual-tour-admin.controller.ts`
   - `backend/src/virtual-tour/virtual-tour.controller.ts`
2. Tour business rules:
   - `backend/src/virtual-tour/virtual-tour.service.ts`
3. Panorama ingestion and storage:
   - `backend/src/virtual-tour/virtual-tour-upload.config.ts`
   - `backend/src/virtual-tour/virtual-tour-panorama-upload.pipe.ts`
   - `backend/src/virtual-tour/virtual-tour-panorama.service.ts`
   - `backend/src/virtual-tour/virtual-tour-storage.service.ts`
4. Shared Cloudinary integration:
   - `backend/src/media/cloudinary.provider.ts`
   - `backend/src/media/media.module.ts`
   - `backend/src/media/media-policy.ts`
   - `backend/src/media/media.service.ts`
5. Environment and application integration:
   - `backend/src/config/environment.ts`
   - `backend/prisma.config.ts`
   - `backend/src/prisma/prisma.service.ts`
   - `backend/src/main.ts`
6. Tests, read beside the matching implementation:
   - `backend/src/virtual-tour/virtual-tour-admin.controller.spec.ts`
   - `backend/src/virtual-tour/virtual-tour.controller.spec.ts`
   - `backend/src/virtual-tour/virtual-tour.service.spec.ts`
   - `backend/src/virtual-tour/virtual-tour-panorama-upload.pipe.spec.ts`
   - `backend/src/virtual-tour/virtual-tour-panorama.service.spec.ts`
   - `backend/src/virtual-tour/virtual-tour-storage.service.spec.ts`
   - `backend/src/media/media.service.spec.ts`

Run:

```powershell
cd backend
npm run build
npm test -- --runInBand
npx prisma validate
```

**Gate:** backend review issues are resolved and the build, virtual-tour tests, and Prisma validation pass.

### Phase 5C — Admin Frontend Code Review

**Status: Complete (August 23, 2026).**

- Refactored the management page into query/layout orchestration plus a feature-local editor hook.
- Added project-standard React Hook Form and Zod forms for starting scenes, scene settings, and both hotspot types. Hotspot forms now contain only user-editable fields; captured panorama coordinates and preserved model fields are assembled by their type-specific editors.
- Split Navigation and Information API methods and request types so each endpoint receives its DTO directly without a generic hotspot type or runtime property removal.
- Added focused Navigation and Information editor components for mutations, payload construction, visual movement, destination/arrival actions, and delete-target selection. The shared hotspot inspector now only chooses and frames the correct editor.
- Limited the admin store to state shared across sibling components: hotspot selection plus panorama-upload, scene-delete, and hotspot-delete targets. WebGL, placement, arrival, preview, unsaved workflow, and form state remain local.
- Made panorama upload, scene deletion, and hotspot deletion standalone store-controlled dialogs. The panorama dialog shell and specialized single-file upload form are separate components.
- Centralized scene-status presentation and removed manual field validation, obsolete generic hotspot methods, repeated state setters, and dead request-shaping helpers.

Review these files from data flow to UI:

1. `frontend/src/types/admin/virtual-tour.type.ts`
2. `frontend/src/types/media.type.ts`
3. `frontend/src/api/admin/virtual-tour.api.ts`
4. `frontend/src/hooks/admin/virtual-tour.hook.ts`
5. `frontend/src/hooks/admin/virtual-tour-panorama-upload.hook.ts`
6. `frontend/src/page/Admin/VirtualTourManagement.tsx`
7. `frontend/src/components/pageComponents/Admin/VirtualTour/VirtualTourSceneRail.tsx`
8. `frontend/src/components/pageComponents/Admin/VirtualTour/VirtualTourPanoramaCanvas.tsx`
9. `frontend/src/components/pageComponents/Admin/VirtualTour/VirtualTourSceneInspector.tsx`
10. `frontend/src/components/pageComponents/Admin/VirtualTour/VirtualTourHotspotInspector.tsx`
11. `frontend/src/components/pageComponents/Admin/VirtualTour/VirtualTourPanoramaUploadDialog.tsx`
12. `frontend/src/components/pageComponents/Admin/VirtualTour/virtual-tour-admin.css`

Run:

```powershell
cd ../frontend
npm run build
npm run lint
```

**Gate:** the admin editor follows project patterns, has no known broken management action, and the relevant frontend checks pass.

### Phase 5D — Public Integration Review

**Status: Complete (August 23, 2026).**

- Reconstructed the existing `outside` and `bar-one` test panoramas from the committed 8x4 slices, converted their temporary upload packages to the current `{row}_{column}.jpg` contract, and uploaded them through the real admin workflow.
- Verified that Resort Entrance and Bar One use development Cloudinary originals, previews, and tiles and that only published database scenes are returned by `GET /virtual-tour`.
- Verified the starting scene, tiled panorama rendering, Navigation in both directions, Information hotspot details, zoom controls, and the configured Zoom + fade transition.
- Verified the public viewer at desktop size and at a 390x844 mobile viewport without browser console errors.
- Verified that an unauthenticated request to the admin virtual-tour endpoint returns `401` while the public endpoint remains accessible.
- Verified the editor-side incoming-hotspot deletion guard and the backend rules that reject deleting the starting scene or a referenced scene. The focused service suite passes all 13 tests.
- The unavailable-tour state was exercised during the earlier empty development-data setup; synchronous upload failures retain the previous panorama and surface the request error through the upload mutation.
- The generated originals and renamed upload packages remain outside the repository in the local temporary directory; no generated panorama asset was added to source control.

- Confirm `/virtual-tour` obtains published data only from the public API.
- Verify starting-scene loading, tiled panoramas, Navigation and Information hotspots, saved default views, optional custom arrival views, and Zoom + fade transitions.
- Verify loading, empty, failure, and unavailable-scene states.
- Verify desktop and mobile layouts, keyboard/mouse/touch interaction, and browser console/network behavior.

Review these files from API response to rendered viewer:

1. `frontend/src/types/virtual-tour.type.ts`
2. `frontend/src/api/virtual-tour.api.ts`
3. `frontend/src/hooks/virtual-tour.hook.ts`
4. `frontend/src/page/VirtualTour.tsx`
5. `frontend/src/page/VirtualTour.css`
6. `frontend/src/lib/constant/VIRTUAL_TOUR.constant.ts`
7. `frontend/src/hooks/useVirtualTourViewer.ts`
8. `frontend/src/components/pageComponents/VirtualTour/VirtualTourViewer.tsx`
9. `frontend/src/components/pageComponents/VirtualTour/tourMarkers.ts`
10. `frontend/src/components/pageComponents/VirtualTour/tourNavigation.ts`
11. `frontend/src/components/pageComponents/VirtualTour/TourInfoPanel.tsx`
12. `frontend/src/components/pageComponents/VirtualTour/TourControls.tsx`

Manually test:

- fresh empty-tour onboarding;
- a three-scene connected route;
- incomplete hotspot publish blocking;
- panorama replacement and failure recovery;
- deletion conflict messaging;
- admin authorization;
- guest desktop and mobile layouts;
- production endpoints are not contacted during development.

**Gate:** the complete admin-to-public workflow succeeds using real development data and Cloudinary assets.

### Phase 5E — Cleanup and Documentation Review

**Status: Complete (August 23, 2026).**

- The application no longer references the legacy local panorama route; runtime panorama uploads and delivery use Cloudinary only. The existing tracked panorama fixtures remain available for local upload-package testing.
- Review the final diff for secrets, generated panorama files, debug code, unrelated edits, and stale dependencies.
- Align the existing capstone manuscript with the verified implementation, including the single-panorama backend-slicing workflow, Cloudinary storage, hotspot management, optional arrival views, and API-driven guest viewer.
- Record final test results. Screenshots are optional capstone evidence and are not a development-completion requirement.
- Commit the reviewed work by logical area when possible. Never include `.env.development.local`, generated panorama files, or production secrets.

Review these cleanup and documentation files:

1. `backend/package.json` and `backend/package-lock.json` — required dependencies and scripts only.
2. `backend/.env.example` — documented variables without secrets or obsolete settings.
3. `.gitignore` and `backend/.gitignore` — temporary uploads, local environment files, and generated assets remain excluded.
4. `README.md` — development and media setup matches the final system.
5. `VIRTUAL_TOUR_MANAGEMENT_PLAN.md` — implementation status and final test evidence.
6. The latest capstone manuscript — objectives, scope, architecture, workflow, screenshots, and test discussion match the verified implementation.

**Gate:** code and documentation describe the same verified system and the Definition of Done is satisfied.

Final review results:

- Fixed connected-scene creation so the hotspot's Active setting is saved.
- Clear a saved arrival override when a Navigation hotspot is redirected to a different destination.
- Corrected scene-deletion copy so it no longer claims that Cloudinary assets are deleted.
- Updated the local panorama generator to emit the current `{row}_{column}.jpg` slice names.
- Aligned `README.md` with local-only development database protection, explicit integration flags, Cloudinary setup, and the single-panorama backend-slicing workflow.
- Backend virtual-tour tests pass: 6 suites and 33 tests.
- Shared Cloudinary media-policy tests pass: 1 suite and 51 tests.
- Backend build, targeted implementation lint, Prisma validation, and Prisma generation pass.
- Frontend production build and targeted virtual-tour lint pass. Repository-wide lint still reports pre-existing issues outside the virtual-tour scope and strict lint errors in legacy test mocks.
- No generated panorama files, local environment files, screenshots, or production secrets were added by this final review. No commit has been created.

## Definition of Done

- Admin manages the tour entirely inside the existing AdminLayout.
- Scenes are created from the starting-scene flow or through Navigation hotspots.
- Panorama upload produces the preview and fixed 8x4 JPG tiles synchronously on the backend.
- Both hotspot types are editable on the panorama.
- Guest viewer is fully API-driven and exposes published content only.
- Local development cannot modify the production database; Cloudinary media uploads are enabled only when explicitly configured.
- Backend and frontend builds pass, and virtual-tour tests cover the critical rules.
