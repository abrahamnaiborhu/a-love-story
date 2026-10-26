# Codex Batch 03 — The last of the water

Status: ready to generate · Written for: Codex (image generation), run by Abraham
Based on: STORYBOARD v0.3 (chapters 5–6), Sprint 3 review (2026-10-26)

## Why this batch exists

In chapters 5 and 6, the last of the water (him) is still drawn in code as flat, solid shapes. Next to the watercolour stem and the photographs they look like clip-art. These five images replace them with **painted water in the same watercolour style**, so the water belongs to the same painting.

What they do in the film:

1. The water **keeps the shape of her rose's cup** for a moment after the petals are gone (C1).
2. It settles into **a red drop resting in the empty calyx** (C2).
3. Its **red bleeds away like watercolour washing out** (C5), drifting off after her, and the drop is left **clear and grey** (C3, in exactly the same place as C2).
4. In chapter 6 the grey drop **slides off and falls** into black (C4).

The ripple in the black stays as it is.

**Added: his drop in chapters 1–2 (D1a, D1b, D2).** His blue drop is also still drawn in code. In chapter 1 it hangs from the clear umbrella, in a world of photographs, so it becomes **a photographed drop**: first clear (D1a), then turning blue as it swells (D1b, the same drop). In chapter 2 he falls through a world of watercolour flowers, so the falling drop becomes **a painted drop** (D2). As he falls in love he changes from a real drop into a painted one, since love is painted. The tiny beads running down the umbrella stay drawn; they're too small to need images.

## How to run it

- Paste **each prompt on its own**. Give Codex the **reference images** named in each prompt if it can take them.
- Generate **C2 before C3** and **D1a before D1b**: the second of each pair is the same drop with only its colour changed.
- Save into `docs/creative/codex/` with these names: `c1-water-cup.png`, `c2-drop-red.png`, `c3-drop-grey.png`, `c4-drop-falling.png`, `c5-red-bleed.png`, `d1a-drop-clear.png`, `d1b-drop-blue.png`, `d2-drop-falling-painted.png`. Keep extra variations as `-v2`.
- **Transparency matters most in this batch.** Water is see-through, so the edges and the body of each drop must be partly transparent in the PNG, not painted on a white or coloured background.

---

## C1 — Water holding the cup's shape · `c1-water-cup.png`

```
REFERENCE IMAGES: docs/creative/codex/b5-bare-stem.png and docs/creative/codex/03b-rose-watercolour.png
(match this ink-and-watercolour style exactly).

WHERE THIS GOES
"A Love Story" is a scroll-told cinematic website. The man is water; the woman is a red rose. In
this moment her petals have just been torn away by the wind, and for one breath the water that was
cupped in her heart still holds the shape of the rose's cup, floating in the air with nothing
around it. Then it collapses. It sits just above an empty rose calyx on a bare stem (painted
separately, the first reference).

WHAT IT SHOWS
A small body of water floating on its own, shaped like the inside of a rose's cup: a shallow,
rounded bowl shape, wider than it is tall, with a softly curved bottom and a gently domed top
surface. The water is tinted with her red: translucent crimson-vermilion, darker and denser at the
bottom and edges, lighter and almost clear near the top. A bright highlight along the upper edge,
a few tiny bubbles inside, faint traces of petal-shaped curves still pressed into its sides.

WHY IT LOOKS THIS WAY (THE VIBE)
This is the most fragile moment of the film: she is gone, but he still has her shape. It should
feel delicate and impossible, like water remembering a flower. People in this film are photographs
but love is painted, so this is watercolour, not a photo of water.

LOOK
Ink and watercolour illustration matching the references: wet-in-wet colour, soft granulation,
a fine confident ink line along part of the edge, glowing transparent red, bare-paper highlight.

TECHNICAL
Square, 1024 x 1024. The water centred, about 45% of the frame wide. Fully transparent background
(PNG with alpha), and the water itself partly transparent: lighter areas should let whatever is
behind show through. No paper texture outside the water.

AVOID
No rose, no petals, no stem, no glass, no bowl or container, no background, no text, no logos,
no watermarks. Not photographic, not 3D, not flat vector, not cartoon.
```

## C2 — A red drop resting in the calyx · `c2-drop-red.png`

```
REFERENCE IMAGES: docs/creative/codex/b5-bare-stem.png (match this style; the drop will sit in
this calyx) and docs/creative/codex/03b-rose-watercolour.png (the drops on its petals).

WHERE THIS GOES
"A Love Story" is a scroll-told cinematic website. The man is water. After his love (a red rose)
has lost all her petals, what is left of him settles as a single drop resting inside the empty
calyx at the top of the bare stem (painted separately). At this moment he is still tinted with her
red. The next image is the same drop with the red drained out of it.

WHAT IT SHOWS
One single water droplet, seen from the side, resting on a surface: a round bead, very slightly
flattened at the bottom where it sits, with a sharp bright highlight near the top left and a small
soft reflected light near the bottom right. Translucent, tinted crimson-vermilion, deeper red at
the lower edge, almost clear near the highlight. A fine dark edge line on one side, like the
droplets painted on the reference rose.

WHY IT LOOKS THIS WAY (THE VIBE)
Small and quiet: everything that is left of him, still carrying her colour. Delicate, a little sad.
It must look like it belongs in the same painting as the stem.

LOOK
Ink and watercolour illustration matching the references: transparent glazes, soft wet edges,
fine ink accent, bare-paper highlight.

TECHNICAL
Square, 1024 x 1024. The drop centred, about 40% of the frame wide, its flattened base at about
62% of the height. Fully transparent background (PNG with alpha); the drop partly transparent so
the stem behind it can show through.

AVOID
No stem, no calyx, no leaves, no surface drawn under it, no shadow, no background, no text, no
logos, no watermarks. Not photographic, not 3D, not flat vector, not cartoon.
```

## C3 — The same drop, drained and grey · `c3-drop-grey.png`

```
REFERENCE IMAGE: docs/creative/codex/c2-drop-red.png (the SAME drop; keep its exact shape, size,
position and highlights; only its colour changes).

WHERE THIS GOES
"A Love Story": the woman has walked away and taken her red with her. This is the same drop of
water as the reference, in exactly the same place and shape, after the colour has drained out of
it. The website cross-fades from the red drop to this one in place.

WHAT IT SHOWS
The identical droplet, now clear and colourless: pale cool grey water, mostly transparent, with the
same bright highlight top left, the same reflected light bottom right and the same fine dark edge
line, but no red at all. Perhaps one faint, almost invisible pink trace at the very bottom edge.

WHY IT LOOKS THIS WAY (THE VIBE)
Nothing of her is left in him, and nothing of him either. It should feel empty and cold, but still
beautiful, like clear water at night.

LOOK
Ink and watercolour illustration matching the reference exactly, with grey-blue transparent glazes
instead of red.

TECHNICAL
Square, 1024 x 1024, identical framing to the reference so the two can be swapped in place. Fully
transparent background (PNG with alpha); the drop mostly transparent.

AVOID
Any change of shape, size or position. No stem, no surface, no shadow, no background, no text, no
logos, no watermarks. Not photographic, not 3D, not flat vector, not cartoon.
```

## C4 — The grey drop falling · `c4-drop-falling.png`

```
REFERENCE IMAGE: docs/creative/codex/c3-drop-grey.png (same water, same style and colour).

WHERE THIS GOES
"A Love Story", the last chapter, "Mr. Nobody": the clear grey drop slips off the empty calyx and
falls through darkness into nothing. This image is that drop in mid-fall, shown against black.

WHAT IT SHOWS
The same clear grey water as the reference, now falling: a classic falling-drop shape, round at
the bottom and drawn out into a fine point at the top, slightly elongated by speed. A sharp
highlight on one side, a faint reflected light on the other, a fine dark edge line.

WHY IT LOOKS THIS WAY (THE VIBE)
Small, alone, falling. The last thing of him we see. Quiet, not dramatic.

LOOK
Ink and watercolour illustration matching the reference: pale grey-blue transparent glazes,
soft wet edges, a fine ink accent, a bare-paper highlight.

TECHNICAL
Portrait, 1024 x 1536. The drop centred, about 25% of the frame wide, point upward. Fully
transparent background (PNG with alpha); the drop partly transparent.

AVOID
No motion lines, no splash, no stem, no background, no text, no logos, no watermarks.
Not photographic, not 3D, not flat vector, not cartoon.
```

## C5 — Her red bleeding away · `c5-red-bleed.png`

```
REFERENCE IMAGE: docs/creative/codex/03b-rose-watercolour.png (match its reds and its
wet-in-wet watercolour blooms).

WHERE THIS GOES
"A Love Story": as the woman walks away, the red drains out of the man's last drop of water and
follows her. This is that red: not an object, but colour itself washing away, like watercolour
pigment bleeding through wet paper. The website lets it drift away from the drop toward her and
dissolve.

WHAT IT SHOWS
A soft, loose watercolour bloom of red pigment with no defined object: denser and darker
crimson-vermilion at its left end, spreading and feathering out toward the right into thin,
streaky, wet-edged trails that fade to nothing, with the typical cauliflower edges of wet
watercolour and a few granulated specks. Longer than it is tall.

WHY IT LOOKS THIS WAY (THE VIBE)
She takes her colour with her. It should feel gentle and irreversible: a stain lifting off, not an
explosion.

LOOK
Pure wet-in-wet watercolour: transparent red glazes, feathered bleeding edges, granulation, no
ink lines.

TECHNICAL
Landscape, 1536 x 1024. The bloom centred, filling about 75% of the width. Fully transparent
background (PNG with alpha); the pigment partly transparent, fading to fully transparent at its
edges. No paper texture outside the pigment.

AVOID
No drop shapes, no flowers, no petals, no background, no text, no logos, no watermarks.
Not photographic, not 3D, not flat vector, not cartoon.
```

---

## D1a — A clear drop hanging from the umbrella (photograph) · `d1a-drop-clear.png`

```
REFERENCE IMAGE: docs/creative/codex/a3-umbrella-open.png (the clear umbrella this drop hangs from;
match its light and its rain beads).

WHERE THIS GOES
"A Love Story" is a scroll-told cinematic website. Night, rain, a man holds a clear umbrella over
a woman. Rain runs down the umbrella and gathers into one drop hanging from the edge of the
umbrella on her side. That drop is the man himself; it will let go and fall for her. This image is
the drop as it first forms. It is placed exactly at the umbrella's rim, over a photographed night
street, and grows larger as the visitor scrolls.

WHAT IT SHOWS
A single water drop hanging from above, photographed in macro: a teardrop shape with a narrow neck
at the top (where it would cling to the rim) swelling into a round, heavy bottom. Perfectly clear
water. Inside it, the blurred night city is refracted upside down as tiny soft bokeh: warm amber
and cool blue points of light. A crisp white highlight on the upper left, a thin bright rim of
light along its right edge, a darker refracted edge along the bottom.

WHY IT LOOKS THIS WAY (THE VIBE)
This drop is the whole story's main character: small, fragile, about to fall in love. It belongs
to the same cinematic night photograph as the umbrella and the couple: cold blue key light from the
upper left, warm amber glints from behind.

LOOK
Cinematic macro photography at night, shallow depth of field, fine film grain, real refraction
and reflections.

TECHNICAL
Portrait, 1024 x 1536. The drop centred, its top neck touching the top edge of the frame, about
35% of the frame wide. Fully transparent background (PNG with alpha), with the drop itself partly
transparent where real water would be. If transparency is not possible, use a pure black (#000000)
background.

AVOID
No umbrella, no rim, no hand, no other drops, no background scene outside the drop, no text,
no logos, no watermarks. Not illustrated, not 3D render.
```

## D1b — The same drop, turned blue (photograph) · `d1b-drop-blue.png`

```
REFERENCE IMAGE: docs/creative/codex/d1a-drop-clear.png (the SAME drop; keep its exact shape, size,
position, highlights and refractions; only its colour changes).

WHERE THIS GOES
"A Love Story": as the drop hanging from the umbrella grows heavy, it fills with the man's colour,
cobalt blue, the moment before he lets go and falls for her. The website cross-fades from the
clear drop to this one in place.

WHAT IT SHOWS
The identical hanging drop, now filled with a deep, luminous cobalt blue, as if lit from inside:
richer and darker at the round bottom, lighter toward the neck, the refracted city lights inside
now tinted blue, the same white highlight upper left and the same bright rim on the right.

WHY IT LOOKS THIS WAY (THE VIBE)
This is him: his colour is cobalt blue. It should feel alive and full, like a heart about to fall.

LOOK
Cinematic macro photography at night matching the reference exactly, with a cobalt-blue tint.

TECHNICAL
Portrait, 1024 x 1536, identical framing to the reference so the two can be swapped in place.
Fully transparent background (PNG with alpha), the drop partly transparent. If transparency is not
possible, use a pure black (#000000) background.

AVOID
Any change of shape, size or position. No umbrella, no other drops, no background, no text,
no logos, no watermarks. Not illustrated, not 3D render.
```

## D2 — His drop falling through the flowers (painted) · `d2-drop-falling-painted.png`

```
REFERENCE IMAGES: docs/creative/codex/03b-rose-watercolour.png (match its ink-and-watercolour style
and the water drops painted on its petals) and docs/creative/codex/d1b-drop-blue.png (the same drop,
which this painting becomes).

WHERE THIS GOES
"A Love Story": the blue drop has let go of the umbrella and is falling through a sky of
watercolour flowers that open as he passes, toward her red rose. In this world love is painted,
so as he falls he becomes a painted drop. This image falls down the middle of the screen with
painted petals and roses all around it; the website gradually tints it toward purple as he nears
her.

WHAT IT SHOWS
A single falling water drop: round at the bottom and drawn out into a fine point at the top,
slightly elongated by its fall. Translucent cobalt-blue watercolour, deeper blue at the bottom
edge, lighter toward the point, a bare-paper highlight on the upper left, a fine confident ink line
along one side, a soft glow of colour bleeding just past its edge.

WHY IT LOOKS THIS WAY (THE VIBE)
Falling in love: light, luminous, a little reckless. It must look like it belongs among the painted
roses, not like a photograph or a vector icon.

LOOK
Ink and watercolour illustration matching the rose reference: transparent glazes, wet edges,
granulation, a fine ink accent.

TECHNICAL
Portrait, 1024 x 1536. The drop centred, about 25% of the frame wide, point upward. Fully
transparent background (PNG with alpha); the drop partly transparent.

AVOID
No flowers, no petals, no motion lines, no splash, no background, no text, no logos,
no watermarks. Not photographic, not 3D, not flat vector, not cartoon.
```

---

## What I'll check when they come back

| Check | Looking for |
|---|---|
| Real transparency | The stem shows through the drops; no white or coloured box around them |
| Same painting | Same watercolour hand as the stem and the rose |
| C2 ↔ C3, D1a ↔ D1b | Identical shape and position, so each colour change cross-fades in place |
| D1a/D1b | Real photographic water that matches the umbrella's light; neck at the top edge so it can hang from the rim |
| D2 | Painted, among the watercolour roses; reads as the same drop as D1b |
| Scale | Drops small enough to sit in the calyx |
| C5 | Reads as colour washing away, not as an object |
