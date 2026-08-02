# Web UI consistency rules

Use these rules for public, guest, and admin web work. This is a refinement system: preserve the existing product redesign and change a pattern only when it is inconsistent or clearly incorrect.

## Button sizing

Use the existing `Button` sizes in `src/components/ui/button.tsx`. Do not introduce new button size variants or wrapper components for sizing.

| Role | Size | Use |
|---|---:|---|
| Standard action | `default` / 36px | Primary actions, Back, Cancel, Save, Submit, Retry, and View Details |
| Compact supporting action | `sm` / 32px | Filters, Add actions, View All, and card-level supporting actions |
| Hero call to action | `lg` / 40px | Reserved for intentional marketing hero actions |
| Normal icon button | `icon` / 36px | Standalone icon actions such as back, profile, close, and send |
| Item quantity control | `icon-sm` / 32px | Repeated plus, minus, and remove controls inside an item row |

Do not apply manual responsive height or size overrides to ordinary buttons. A labelled action keeps its assigned size at every breakpoint.

The only intentional 44px controls are mobile navigation, virtual-tour viewer controls, and feedback rating stars.

## Button color semantics

- Primary commitment: `default`
- Back or cancel: `outline`
- Filter: active `default`, inactive `outline`
- Supporting actions on a normal surface: `outline`
- Tertiary text action: `link` or `ghost`

Reserve `secondary` for a button that needs contrast over a dark or primary-colored surface.

Use shared theme variants. Do not add hard-coded action backgrounds for a primary button.

## Page canvas

- Public browsing routes use `bg-background`: Home, About, Amenities, Menu, Accommodation, Virtual Tour, and public status pages.
- Signed-in guest and authentication workflows keep `bg-muted/30` so their white task cards remain clearly elevated.
- Authentication recovery screens do not place imagery behind the form. Resort imagery, when used, remains inside the Login or Sign Up surface rather than competing with a recovery task.
- Navigation and the footer use `bg-background`; do not use page-level `bg-white` values.
- Inner sections, cards, heroes, and feature bands may use a different surface when their content needs hierarchy. The page canvas rule does not flatten those intentional layers.

## Authentication role selection

- Guest sign in is the default state.
- Admin access is a tertiary text action, not a competing side-by-side option or provider picker.
- Changing roles keeps the same credentials form and vertically expands or collapses the admin context with reduced-motion support.

## Footer placement

- `GuestPageShell` owns the viewport-height flex column.
- The shared footer uses `mt-auto`, so it occupies the bottom of a short page without adding a page-specific spacer.
- A status page centers its content with `flex-1`; do not simulate viewport height with a `min-h` calculation alongside the footer.

## Quick review

- Book Now, booking-flow Continue, Save, Submit, Back, and Cancel should all read as the 36px standard action.
- Menu, accommodation, My Bookings, and pre-order filters should all use the 32px compact filter treatment.
- Repeated item quantity controls should all use the same 32px icon treatment.
- A 40px button should be reserved for an intentional hero CTA, not a normal page action.
