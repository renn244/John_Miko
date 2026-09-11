# TODO Fixes

## Next batch: Mobile workspace bottom cutoff and Settings (MOB_AUTH_002, MOB_SET_001–004) — implemented; native retest pending

Prioritize this batch before refund visibility/email and Maintenance badges. Code changes are implemented; this section retains the agreed scope and native verification checklist. No completed phone retest is claimed. Preserve React Hook Form default submit validation; add no mode or reValidateMode overrides.

0. **MOB_AUTH_002 — Bottom workspace cutoff (included in this batch).** Screenshot received September 11 shows a Maintenance ticket clipped at the bottom of the scroll viewport, with a blank strip between the visible card and the bottom tab bar. User reports the same issue in Maintenance, Kitchen, and Resort workspaces. Inspect shared CustomSafeAreaView bottom inset handling together with the tab navigator and list/scroll-container sizing; the shared wrapper currently adds bottom safe-area padding even inside tab screens, making duplicate bottom spacing a candidate cause, not yet proven. Correct the shared layout so content can use the available area above the tabs, while preserving Android system-navigation clearance. Verify on all three workspaces that the last card, list footer/load-more controls, and Settings actions can scroll fully into view. Check gesture navigation and three-button navigation, small screens, and enlarged text. A partial card at an intermediate scroll position alone does not prove unreachable content; verify both the unwanted gap and end-of-list reachability on device.
1. **MOB_SET_001 — Profile layout (small).** ProfileCard currently fits avatar, name/contact information, and Active status in one row; the name is capped at max-w-36 and one line. Give the name wrapping space and place role/status badges on a separate wrapping row so they cannot cover it. Check long names, narrow phones, and enlarged system text across all three staff Settings routes. The original screenshot remains useful for confirming the exact reported symptom; do not claim it was reproduced from source alone.
2. **MOB_SET_003 — Contact validation (small once format is settled).** Mobile and web profile schemas only require a nonempty contact number. Backend UpdateProfileDto uses IsNumberString with default options. Its installed validator accepts leading plus/minus signs and decimal points (verified locally with the validator library; not a database save test). Use an explicit phone rule consistently in mobile Settings, shared web/admin Settings, and the profile API. Proposed baseline is the existing booking convention: 10–15 ASCII digits, preserving leading zeros. Local-only versus international format, with a leading + now explicitly disallowed by the user; the accepted length/local-versus-international digit sequence still needs aligning with the existing convention; do not silently strip characters or treat every + as universally invalid. Before implementation, test the profile save path with isolated data and capture the tester's exact input when available. Cover letters, signs, decimal points, embedded spaces, length boundaries, accepted examples, and persistence after reload.
3. **MOB_SET_004 — Password strength (small to medium).** Both mobile and web Settings schemas lack strength checks. UpdatePasswordDto checks presence/type/matching confirmation; the service checks the current password then hashes the new value without a strength check. Mobile and web reset forms require 8 characters, lowercase, uppercase, a number, and a special character. Proposed policy is parity with those reset forms, now agreed by the user for mobile, web/admin Settings, and backend. First test the actual server validation/service path with isolated data; then align Settings clients and backend, retaining wrong-current-password, matching-confirmation, and different-password checks. Check reset endpoint consistency too. No real QA account credentials should be changed merely for planning; keep the tester failure provisional until save-path behavior is verified.
4. **MOB_SET_002 — Existing photo controls (investigation/verification first; small to medium if fixes are needed).** The current source already has ProfilePhotoControl with upload/replace/remove, rendered by StaffSettingsScreen for all three staff roles. It uses PROFILE_AVATAR uploads and PATCH /auth/profile-image; successful saves invalidate the profile query. Reconcile the tested app build with this source and inspect whether scrolling/layout hides the controls. Reuse this implementation; do not create a duplicate. Test gallery/camera permissions and cancellation, a QA image upload/replace/remove, invalid type/size, upload/save failures, and persistence after reopening Settings and signing in again. Native picker behavior needs device/emulator verification; web fixtures cannot establish that.

**User decisions confirmed:** Contact numbers must contain digits only; reject + and - (and other nondigit characters) instead of silently stripping them. Apply the existing reset-form password-strength requirements to Settings across mobile, shared web/admin forms, and the backend. Keep default React Hook Form submit validation.

**Uploader source check:** All three staff routes render StaffSettingsScreen, which mounts ProfilePhotoControl directly between ProfileCard and ProfileDetailsForm. The upload control is not conditional on having a photo or on staff role; only Remove is conditional on an existing photo. This confirms wiring in the current checkout, not visibility in the installed phone build. Missing controls on the phone remain unresolved pending inspection of that running build/screen.

**Completion checks:** targeted backend validation/service tests, mobile type/lint checks and native Settings verification; frontend checks for shared web changes. Record which checks used fixtures versus the real API/device. Workspace cutoff is included in this batch. Web password-reset redirect remains a separate QA item unless investigation identifies a shared cause.

## Mobile Settings/workspace implementation results

- **MOB_AUTH_002:** CustomSafeAreaView now detects the bottom-tab height context and avoids adding a second bottom safe-area inset inside tab screens. Standalone screens retain their bottom inset; caller styles compose with inset styles. Applies to Maintenance, Kitchen, Resort, and their shared Settings screens.
- **MOB_SET_001:** Profile name and contact text can wrap; role and Active/status badges occupy a separate wrapping row. Avatar size is preserved and badges are constrained to card width.
- **MOB_SET_003:** Mobile and shared web/admin Settings and UpdateProfileDto accept only 10–15 ASCII digits. Signs, whitespace, decimal points, letters, and out-of-range lengths are rejected. Leading zeros are preserved. No form mode/reValidateMode overrides added.
- **MOB_SET_004:** Mobile/web Settings schemas enforce the existing reset-form strength policy. Backend change and reset DTOs share an AccountPassword decorator. The change-password service additionally blocks reusing the current password. Static help text explains requirements.
- **MOB_SET_002:** Existing photo controls remain wired into all three staff Settings routes. Fixed silent upload failures by displaying uploader errors; added file-limit guidance and saving feedback. Existing replace/remove behavior and profile-query refresh are retained. Visibility in the tester's installed build remains unverified.

**Verification:** 23 backend tests passed, exercising the actual validation pipe and service paths with an isolated mocked database, including contact saves, password hashing/current-password/reuse rejection, and photo save/replace/remove. 38 checks against actual mobile/web Zod schemas passed. Mobile TypeScript and targeted lint passed. Android production JavaScript/Hermes export passed (not an installed APK). The existing upload helper rejected unsupported formats and files over 10 MB before any network request in isolated checks. Targeted web Settings lint passed. Frontend production build passed with the existing large-chunk advisory. No live account, password, photo upload, or database record was changed during verification.

**Native retest required:** No Android phone/emulator was attached. Rebuild/reload the app from this checkout, then verify the bottom gap and last-item reachability in all three workspaces, long names at enlarged system font sizes, and camera/gallery upload/replace/remove with a QA image. A JavaScript export or browser fixture is not a native phone visual/picker test.

## Mobile QA findings reported September 10, 2026 — pending

These are manual phone-test reports, recorded September 11. Screenshots are still pending where noted. The current Settings/workspace batch has code fixes documented above and below; native phone retests remain pending. Other findings retain their original pending status.

- **Workspace content cutoff (MOB_AUTH_002):** Login and role routing passed. Screenshot received September 11 shows a Maintenance card clipped above a blank strip before the bottom tab bar; user reports the same symptom in Resort and Kitchen. Included in the current batch. Investigate shared safe-area/tab/list layout and verify bottom controls and final list items are reachable on all three workspaces; installed build and display details remain to be checked.
- **Profile name overlapped by Active badge (MOB_SET_001):** The functional profile-display test passed, but the badge blocks part of the full name in mobile Settings. Await screenshot. Adjust layout so both name and status remain readable, including long names and larger text sizes.
- **Missing mobile profile-photo controls (MOB_SET_002):** Tester reported this case not executable because controls were absent in the tested app. Current source inspection found upload/replace/remove controls already wired into all three staff Settings routes. Reconcile the tested build and visibility, then verify persistence and validation with a QA image; do not assume a new implementation is needed.
- **Contact-number validation (MOB_SET_003):** Required validation works, but character validation does not work properly: plus signs/other unsupported characters are allowed. The current mobile form only checks for a nonempty contact number. Confirm accepted local/international formats and test actual save behavior before aligning client/server validation. Exact failing input is still needed.
- **Settings password-strength inconsistency (MOB_SET_004):** Incorrect current password and confirmation mismatch were rejected. Tester reports weak-password validation is missing. Local Settings schema checks presence, matching confirmation and difference from current password; reset schema enforces length and character requirements. Keep provisional QA failure against the existing strength expectation. Confirm intended policy and whether the server accepts a weak password before changing implementation or test wording. Recheck web/admin consistency as part of investigation.
- **Web staff password-reset redirect (related to MOB_AUTH_007):** Mobile email delivery, resend and reset-link flow passed. Tester reports the email reset link works for mobile but does not redirect correctly for web staff recovery. Investigate web/mobile reset destinations and route handling; do not treat the working mobile flow as failed. Exact web destination/error remains to be captured.
- **Kitchen queue date scope (MOB_KIT_001) — implemented; native retest pending:** Mobile defaults to Today & upcoming, requesting only service dates on/after the resort-local current date (UTC+8), ordered nearest first. History shows dates before today, newest first, and retains all status filters so past completed and pending orders remain accessible. The API intersects date/search/status filters with the chosen scope; selecting an old date cannot bypass the active boundary. Pull-to-refresh reloads the queue; the backend reevaluates the resort-local date on each request. A screen left open past midnight updates on its next successful refresh, without a client timer or duplicate date filtering. Switching scopes clears the selected date. Existing unscoped web requests retain their behavior. Nine backend tests, mobile TypeScript, targeted mobile ESLint, and backend build passed. Native toggle/filter/scroll behavior still requires testing in the rebuilt app with the updated backend.
- **Web staff-report header density:** On the Admin Staff Report Details page, the header subtitle currently repeats the report title, full internal ID, and submission timestamp (for example, “QA general report · cmtworfu8002zgaqyfr19anyy · Submitted Sep 11, 2026, 4:20 PM”). Keep only the report ID in this top subtitle; the title and submitted time are already available in the detail content. Verify long IDs remain readable on narrow desktop widths.

**QA account note:** Tester deactivated Kitchen Staff Torralba for MOB_AUTH_005 and changed a QA password during reset/Settings testing. Reactivation and updated credential-sheet status have not been reported. Check these before the Kitchen pass; do not record passwords here.

Ordered from easiest to implement and verify to most involved. Effort labels are relative scope estimates, not time commitments.

The original staff queue item is split so the Kitchen cleanup can ship independently. This list retains the existing scope; additional feature suggestions from the review are not added here.

## 1. Kitchen queue UI cleanup — implemented

**Effort:** Small. A focused presentation change with no booking rules or database changes.

- Replace the desktop-only Kitchen metric cards with compact All orders, Pending, and Completed badges. Keep existing mobile order status badges and desktop search, filters, and order groups. Summary counts reflect the filtered queue.

**Verify:** Check desktop and narrow layouts; confirm search, filters, order groups, and order navigation still work.

## 2. Admin Settings email validation consistency — implemented

**Effort:** Small. The field already uses React Hook Form; align format validation, inline errors, and save state.

- Make the Settings email field use the same React Hook Form validation and inline-error behavior as Name and Contact Number.
- Validate email format through the Zod schema and inline errors. Keep React Hook Form default submit validation with no mode or reValidateMode overrides. Keep Save enabled for dirty forms so submission can trigger validation; use noValidate on the form to let React Hook Form handle errors.

**Verify:** Try empty, malformed, and valid emails; verify no validation before the first submit, inline submit errors, and successful submission after correction. Preserve default React Hook Form revalidation after submission.

## 3. Broken navigation links — implemented

**Effort:** Small, after reproduction. The confirmation targets /my-bookings and /. Navigation now commits synchronously through the DOM RouterProvider before resetting selection, replacing the timer that could race the Booking page redirect. Confirmation navigation replaces the current history entry.

- Fix the **View My Bookings** confirmation action (previously described as View My History) so it reaches /my-bookings.
- Fix the **Back to Home** link so it returns to the public home page instead of redirecting incorrectly.
- Verify both links for an authenticated guest and an unauthenticated visitor where applicable.

**Verify:** Follow both links after booking confirmation as a signed-in guest; check public Home access while signed out and the expected sign-in behavior for protected booking history.

## 4. Guest feedback eligibility — implemented

**Effort:** Small. Ownership checking already exists; add the status restriction in the backend and guest UI.

- Allow a guest to create feedback only for their own **Completed** or **Cancelled** booking.
- Block feedback creation for Pending or Confirmed bookings. Eligibility uses booking status; payment approval or rejection alone does not grant eligibility.
- Keep the feedback action hidden or disabled until the booking is eligible, with clear guidance when a guest opens an ineligible booking.

**Verify:** Allow own Completed/Cancelled bookings; reject own Pending/Confirmed bookings and every booking owned by another guest through direct API requests. Verify the UI agrees, including incomplete bookings regardless of payment status.

## 5. Refund proof after payment rejection

**Effort:** Small to medium. Proof storage and an admin Refunded preview already exist; complete the relevant displays without rebuilding the refund workflow.

- Keep the existing refund workflow for rejected payments, but display the uploaded refund image/proof in the rejected-payment details.
- Show it to the relevant admin and guest booking views together with the rejection reason, refund amount, and recorded-refund status.

**Verify:** Record a refund for a rejected payment and verify proof, reason, amount, and recorded status in admin and owner guest views. Check missing-proof records and unauthorized access. The payment changes to Refunded, so verify that state too.

## 6. Maintenance summary badges

**Effort:** Small to medium. A separate summary query already exists, but it receives list filters. Keep totals scoped to the staff member while removing search/list-filter dependence.

- Replace the active Staff Maintenance metric cards with compact persistent summary badges for Pending, In Progress, and High Priority.
- Fetch the Maintenance badge totals separately from the filtered ticket list so they remain stable while a user searches or filters tickets.
- No equivalent change is needed in Staff Resort: its booking and report pages have no dashboard metric cards. Their visible Today/Upcoming and report-status group counts are list counts and should change with the active search or filters.

**Verify:** Change search, status, and priority filters: ticket results should change while badge totals stay stable. Update a ticket and confirm totals refresh; check narrow layouts and empty/loading states.

## 7. Completion-date safeguard

**Effort:** Medium. Requires shared schedule interpretation, backend enforcement, and action states on relevant clients.

- Do not allow an Admin or staff member to mark a booking **Completed** before its actual check-out date and time.
- Enforce the rule in the backend as well as disabling or explaining the action in the UI, so it cannot be bypassed by a direct request.

**Verify:** With a controlled clock, reject completion just before checkout and allow it at/after checkout for day and overnight stays. Verify direct requests and UI behavior use resort-local time.

## 8. Same-day booking and rescheduling cutoff

**Effort:** Medium. Touches guest booking, manual booking, rescheduling, and time-sensitive availability displays.

- Prevent a guest or Admin from creating or rescheduling a booking into a stay whose check-in time has already passed on the selected calendar date.
- Compare the resort-local current date and time against the selected stay option’s actual check-in time (for example, 8:00 AM Day Stay or 7:00 PM Overnight), rather than blocking the entire current date at midnight.
- Keep a same-day stay selectable only until its check-in cutoff; after that, hide or disable it with a clear “check-in time has passed” message. Enforce the rule in the backend as well as the UI.

**Verify:** Test before, exactly at, and after each stay cutoff; document the exact-boundary rule. Cover overnight stays, future dates, a form left open past cutoff, and direct create/reschedule requests.

## 9. Accommodation soft deletion

**Effort:** Medium to large. Needs a schema migration, retire/restore actions, and consistent public and booking-query exclusions while preserving history.

- Add an Admin action to retire an accommodation without permanently deleting its database record.
- Retired accommodations must be hidden from the public accommodation and booking flows, while past bookings and reports keep their original accommodation references.
- Provide a way for Admin to view and restore retired accommodations when needed.

**Verify:** Retire an accommodation with existing bookings; verify history and reports still work, public browsing hides it, and direct booking/reschedule requests cannot target it. Restore it and verify it becomes available again.

## 10. Walk-in booking recording

**Effort:** Large. Build on manual booking support, then add source tracking, staff permissions, payment handling, and report integration. This has the widest regression surface.

- Add an Admin/staff walk-in recorder for guests who arrive without an online reservation.
- Capture the same operational essentials as an online booking: accommodation and stay option, check-in/check-out schedule, guest/contact details, party count, charges, payment method/status, and any add-ons or food orders.
- Mark records clearly as **Walk-in** so daily booking, occupancy, payment, revenue, kitchen, and maintenance reports can include or filter them accurately without confusing them with online reservations.
- Use the same availability, capacity, time-cutoff, payment, cancellation, and completion rules as online bookings; enforce them in the backend as well as the UI.

**Verify:** Create a walk-in with payments, add-ons, and food; check availability/capacity, allowed roles, cancellation/completion, and every affected report. Verify online and manual reservations remain distinguishable.

**Requirement to resolve before implementation:** Applying the online cutoff unchanged would block a walk-in arriving after the scheduled check-in time. Decide whether staff can record a late arrival and how its arrival/check-out times should be handled. No exception is assumed by this ordering.

## Verification for items 1–4

- Frontend production build passed (large-chunk advisory remains).
- Feedback service tests passed: 10 tests, including allowed statuses, blocked statuses, ownership, and missing bookings.
- Browser checks use actual components in an isolated localhost fixture harness with mocked API responses; no live account or booking data was changed.
- Verified no email error while typing or on blur before first submit, inline invalid-email error on submit, and successful corrected submission against the fixture.
- Verified both real confirmation handlers with the actual Booking page: /my-bookings and / reached correctly, with selection cleared and no accommodation redirect. The harness seeds confirmation state; full booking submission and signed-in route guards were not exercised.
- Verified feedback action visibility for all four booking statuses and direct Confirmed/Completed feedback page behavior.
- Verified desktop Kitchen badges, search/status-filter counts, and order navigation using fixture data.
- Verified Kitchen layouts at 1440x900 and 390x844, and required-email errors on submission.
- Targeted ESLint passed for all six changed frontend files; changed-file diff whitespace checks passed.
- Fresh browser session had no console errors or warnings. Temporary harness startup issues were resolved before verification.
- Remaining live checks: authenticated end-to-end booking/payment submission, real profile persistence, and full role/route-guard integration.
