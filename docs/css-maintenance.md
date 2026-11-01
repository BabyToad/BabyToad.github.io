# CSS maintenance

Theme values live in `assets/css/base/themes.css`; shape, type, spacing and layout
measurements live in `base/variables.css`. Use the canonical names directly. The
shared entry is `styles.scss`; feature-sheet loading is described in
[stylesheet-loading.md](stylesheet-loading.md).

## Container cascade

The sole shared `.content-container` definition is in `layouts/content.css`:
42rem maximum width, auto inline margins, `2rem` padding, 19px/1.65 typography,
`min-height: calc(100vh - 200px)`, flex column. The later content sheet's padding
and display already won over grid.css; only its font size and line height needed
moving. At 768px the base padding is `1rem 1.5rem`, at 480px it is `1rem`.
Post, project, essay and fuel selectors have greater specificity and retain their
grid, padding and width overrides. Thoughts and plain pages use the base.

## Responsive rules

The existing cascade needs three **general** thresholds: 480px (narrow phone),
768px (mobile chrome and spacing), 900px (single reading column / TOC).
New shared rules should reuse these. Moving all existing rules onto three values
would change rendering between those values, contrary to this migration's
no-visual-change requirement. These existing exceptions are deliberate:

| Threshold | Reason to retain |
| --- | --- |
| 600px | Blog/Thoughts date gutters stack, radio panels tighten, SRS ratings wrap. These have different content constraints from the mobile nav. |
| 1200px | Wide post/essay/fuel/project grids reduce columns or track widths; bench fits the viewport. Moving this to 900px would leave oversized grids in between. |
| 640px | Player chapter/theatre controls hide and volume control shrinks, independently of page chrome. |
| 400px | SRS rating buttons need a full row on the narrowest screens. |
| 32rem | Footer sign-off takes its own row when the footer links and signature stop fitting. Keep the font-relative threshold. |
| 1339.98px / 1340px | Paired inline/margin sidenote modes: the reading column plus two margins needs this measured width. Keep the existing fractional boundary. |

The nav's 769px lower bound is the inclusive desktop complement of 768px, not a
fourth layout tier. FWF's glossary starts multiple tracks at min-width 768px;
its redundant max-width 767px rule is folded into the default single track.
Unused utility tiers disappear with utilities.css. Media features for print,
reduced motion and forced colours are independent of viewport thresholds.

## Priority overrides

Five `!important` declarations remain: four in the global reduced-motion block,
and the mobile FWF popup's `left: 50%`, which must override its dynamically
positioned inline style. The bench width override now wins through source order
at the end of its feature sheet. Do not reintroduce helper-class priorities.

The bench document still contains its original inline style block: only its nine
legacy variable references changed. Its standalone iframe has a separate local
palette; those locally defined properties do not depend on site aliases. The
gallery renderer also retains its old fallback property read; its first choice
is the canonical `--ink`, so it does not require an alias.
