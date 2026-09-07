# Homepage implementation ledger

Source: Conloca file `OxxksZFS8hzKoFTeSRdFGs`, section `40002391:9972`, inspected read-only through the Figma Console Desktop Bridge on 2026-09-07.

## Reference frames

| Frame | Node | Width | Height | Composition |
| --- | --- | ---: | ---: | --- |
| Homepage - Developers - >1280 | 40002749:33603 | 1440 | 6459.606 | Eight-column hero; four-column feature grid; three pricing cards |
| Homepage - Developers - 1280 / 1024 | 40002426:4064 | 1024 | 7974.940 | Eight-column hero; three-column feature grid; pricing introduction beside stacked cards |
| Homepage - Developers - 1024 / 640 | 40002427:20368 | 640 | 8757.273 | Stacked hero; two-column feature grid; stacked pricing |
| Homepage - Developers - <640 | 40002441:868 | 393 | 8269.635 | Compact hero; single-column feature grid; stacked pricing |

The mobile reference contains a 62px iPhone status bar and 86px Safari toolbar. These are device chrome and are excluded from the website. Its page-content height is 8121.635px. Frame dimensions are verification viewports; document height remains content driven.

## Layout rules recorded before implementation

- Breakpoint compositions are <640, 640–1023, 1024–1280, and >1280. Shared inner content stops at 1376px. The 1440px reference has 32px outer gutters; intermediate full-bleed feature grids have 8px gutters; mobile artwork sections have 4px gutters.
- Desktop hero uses eight equal grid columns with 16px gutters. Copy spans three columns and media spans five. Copy has 60px vertical padding and 32px between its growing heading area and the bottom carousel/actions. Heading max-width is 432px, 48px Inter Display Bold, 48px leading. Intro text max-width is 432px, 16px Inter Italic, 170% leading, with a bold first sentence. Hero heights are 880px at 1440 and 752px at 1024. Media stretches vertically with 20px top/bottom insets, aspect ratio 801.909/840, and a 174px left inset; the video rotates within it.
- Below 1024px, hero copy centers above the video over the exact textured source background. The Astro badge precedes the heading, and actions follow it. At 640px, heading is 52px Black; below 640px it is 32px Black. The 640px hero panel fills the available 955px reference space; compact panel is 530px. Video overlaps the panel bottom. Intro text moves below with 120px/156px top padding and 32px/72px bottom padding.
- Three feature banners have 8px gaps, 814px height and 24px padding on desktop, 872px height at tablet, and 600px height on mobile. Their border participates in layout. Radii are 28/24/20px. Desktop feature copy aligns to the bottom and artwork sits beside/above it. Below 1024px, copy precedes artwork and audience switches disappear. Headings are 48/40/32px; descriptions are 16px italic, 170% line height. Exact source artwork scales independently within clipping containers; the page never scales as a whole.
- Feature title uses Inter Display Black: 72px desktop, 56px tablet, 32px mobile. Decorative Git/Astro badges and file labels retain source exports. Desktop/tablet title band is 666.607px; mobile title band has 196px top and 96px bottom padding.
- Feature grid: four columns and three 326.667px rows above 1280; three columns and five 326.667px rows from 1024–1280; two columns with two 200px rows followed by four 326.667px rows at tablet; seven 372px cards on mobile. Desktop/tablet gaps are 12px; mobile gaps are 8px. Cards have 24px padding, source artwork, bottom-aligned copy and source gradient scrims. Text is 20px/30px, becoming 16px/24px on mobile.
- Pricing desktop has 196px top/96px bottom padding and 48px gaps; cards share 681px height. Medium composition places a 440px introductory column beside filling stacked cards with a 48px gap. Tablet uses 132px top padding and 24px gutters; mobile uses 72px top padding, 16px heading gutters and 8px card gutters. Pricing cards have 8px padding, white summaries of 296px desktop/272px compact height, and 16px gaps between feature rows. Summaries grow if copy needs more space. Buttons use the source instance overrides: 44px height, 12px radius, bold text.
- Footer has a 1424px maximum width, 24px padding, 28px logo, and 31px navigation gaps. It stacks at tablet and wraps its action to a separate row on mobile. Mobile links are 14px; other widths use 16px.

## Components, tokens, and interactions

- Reuse ConlocaHeader, ConlocaFooter, ConlocaButton, and ConlocaSegmentedControl after checking their main-component identities, public contracts, and stories. Source illustration groups are static artwork, not page controls. Export artwork as SVG and backgrounds as original image bytes; do not flatten page sections or live controls.
- Add the missing ConlocaCarouselProgress from the base-nova Progress primitive. Figma component set 40002171:2498 has Active=True/False, a 2×20px track, 1000px radius, and an active fill that leaves 12px unfilled. Track binds to color/stroke/strong; fill binds to color/stroke/stronger.
- Semantic identities and alias chains are recorded in figma-homepage-variables.json. Generated token CSS remains read-only. Bind foreground, surface, accent, stroke, sunken, and primary colors to their corresponding existing semantic variables. Primitive-bound lime colors remain primitive bindings. Background black overlays are exact untokenized 20% values. Other local exceptions are source geometry, gradients, typography, and shadow measurements.
- Developer and content-editor copy comes from the supplied breakpoints and adjacent content-editor frame 40002207:13631. User authorized homepage placeholders for header links, and YouTube video zNGWdTLWktY starting at 48 seconds in an overlay. Modal must close on Escape/backdrop/close button, trap focus, restore focus, stop playback when closed, and honor reduced motion.
- Specialized component-development context returned a REST rate-limit error. Required metadata was retrieved through read-only Desktop Bridge execution, with no fallback to other Figma servers.

## Verification

- Compared the full page and individual sections with all four reference frames. Browser section boundaries reproduce the Figma geometry; fractional layout rounding accumulates to less than 0.1px at the footer. The 393px website excludes the reference's device chrome.
- Checked widths 393, 394, 480, 516, 638, 639, 640, 641, 768, 832, 1023, 1024, 1025, 1152, 1279, 1280, 1281, 1439, 1440, 1441, and 1600. No horizontal page overflow, missing images, or hero action/video overlap.
- Corrected the reusable header's desktop threshold to 1024px to match the supplied page instance. The previous component threshold was 1025px. Duplicate homepage destinations now retain unique navigation keys.
- Preserved the 530px compact hero minimum while allowing its content and overlapping, aspect-ratio-constrained video to grow between 393px and 639px. This keeps actions clear of the video at intermediate widths.
- Annual billing uses $96, $180, and $2400 per year, as authorized. Audience switches remain synchronized. The automatic message carousel pauses on hover/focus, supports explicit pause/manual selection, and responds to reduced-motion preference changes.
- The requested YouTube video plays inside the modal. Verified close-button dismissal, Escape with focus in the host dialog, focus restoration, iframe removal on close, and keyboard entry into the player. YouTube owns keyboard events while focus is inside its cross-origin iframe; users can return to the close control with Shift+Tab.
- The production static build hydrates without browser errors. All 14 Vitest tests pass, covering existing components, annual/monthly billing, synchronized audience selection, manual carousel navigation, modal opening/dismissal/focus restoration, and automated accessibility checks. Color contrast requires browser layout and is excluded from the jsdom accessibility test.
- Lint, strict type checking, static prerender build, and Storybook build pass. Verified dialog play assertions and progress variants in the running Storybook, with Docs and editable controls available.

### Asset and local-value details

- Exact source SVG artwork is used for feature banners, bento cards, and title decorations; tablet/mobile publishing, Git, fragments, and title decoration variants use their corresponding source exports. The Markdown illustration uses a 2× Figma PNG export compressed to WebP to preserve the emoji that the SVG exporter replaced with a square.
- The localization SVG retains its source paths and filters. Its outer viewport extends from 801px to the inspected 834px rendered extent to include the overflowing Kyle cursor label; CSS retains the original artwork scale.
- Background images and the demo poster come from the original Figma image bytes. WebP compression reduces the background downloads, while local Inter and Inter Display fonts retain the source typography.
- Local values cover measured layout geometry, font metrics, rotation, original gradients and effects, and the source's untokenized black overlays. Progressive Figma background blur is represented by a masked CSS backdrop blur. The video dialog's backdrop, dimensions, and dismissal affordance are application behavior requested by the user, with no supplied modal frame.
- Generated design-token files and Figma remain unchanged. No temporary component representations remain. Reused: ConlocaHeader, ConlocaButton, ConlocaSegmentedControl. Added: ConlocaCarouselProgress and ConlocaDialog.

## Follow-up: audience backgrounds and timed progress

Source rechecked through the Console Desktop Bridge on 2026-09-07. The user's latest directions supersede the initial demo-link behavior and static progress snapshot.

- Hero and header demo actions are homepage links. Only the video preview's play control opens the YouTube overlay.
- Content-editor hero background: node `40002207:13651`, top image `eeefca71aa089065feabbf8060dde81548ddfe98`, Fill sizing, no black overlay on desktop. Compact layouts retain their existing 20% black overlay for the white heading. The lower image is obscured by this opaque fill.
- Content-editor banner 1: `40002207:13657`, image `3e2faf3edf148bf240a533f98de430a5caeafc3e`; banner 2: `40002207:13724`, image `510642cbe895f80d7fee3342b3245df88e03d343` (the existing developer hero asset); banner 3: `40002207:13737`, image `537ce6801fe05f1f45c280d8d9db5ca252c09182`. All three use Fill sizing and the source's 20% black overlay. Audience changes update these backgrounds at every responsive composition.
- Progress instance `40002172:6206` resolves to `40002171:2497` in component set `40002171:2498`. Its 2×27px track and 2×15px active snapshot bind to `color/stroke/strong` and `color/stroke/stronger`. The user's requested timer animation now fills the entire track from top to bottom over the existing eight-second interval. Compact layouts retain their rotated horizontal composition.
- Expose a numeric 0–100 `value` on ConlocaCarouselProgress, preserving the Active axis, Base UI semantics, refs, and natural 2×20px size. Use one elapsed-time clock for both the fill and the next slide; pause on hover, keyboard interaction, explicit pause, hidden tabs, and reduced motion. Resume remaining time, and reset when selecting another message or audience.

Follow-up verification: all 14 tests, lint, strict type checking, static prerender build, and Storybook build pass. Browser samples confirm smooth elapsed progress, advancement at the end of the eight-second interval, pause/resume without resetting, and a full-height 100% state. Compared editor backgrounds at 1440, 1024, 640, and 393px and verified switching back restores all developer backgrounds. Both demo links target `/`; the video play control retains the overlay. Token bindings remain unchanged.

## Follow-up: footer maximum width

Rechecked footer frame `40002749:34473` through the Console Desktop Bridge on 2026-09-07. It fills its 1440px parent within 8px gutters and measures 1424×76px, with horizontal space-between layout and 24px padding. The live node's maximum-width property reads 1432px; the user's explicit instruction takes precedence and sets the website maximum to 1424px instead of 1376px. This is a local layout value; the existing token bindings and compact layout rules remain applicable.

Verified widths 393, 639, 640, 1023, 1024, 1025, 1440, and 1600px: the footer fills the available width until 1424px, then stays centered, with no horizontal page overflow. Its three Storybook layouts match the source dimensions, and keyboard focus remains visible. Lint, strict type checking, all 18 tests, the static prerender build, and the Storybook build pass.

The footer now uses reusable component set `40002778:44930`, which defines `Breakpoint=>1024`, `Breakpoint=1024 - 640`, and `Breakpoint=< 640` variants plus the `CTA button` boolean property. The React component accepts a readonly navigation array of `{ label, url }`, an optional configurable action, and accessible logo/navigation labels. It uses the source semantic tokens for primary background and inverted foreground, the exact local Conloca logo, and the existing secondary ConlocaButton.
