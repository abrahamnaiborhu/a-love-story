# Codex Batch 02 — The film's images

Status: ready to generate · Written for: Codex (image generation), run by Abraham
Based on: STORYBOARD v0.3 (continuous-fall revision), Codex Test Batch 01, Study 03 findings (2026-10-24)

## What this batch is

All the images the film needs, split into two groups:

- **Group A: opening and fall.** Everything from the umbrella to the moment he lands in her rose. **Generate this group first.** It becomes the first real, connected piece of the site, and we check it on screen before generating Group B.
- **Group B: inside her rose to the end.** Chapters 3–5. Generate after Group A is reviewed, so anything we learn carries over.

**Kept from Batch 01:** `01-him.png`, `02-her.png`, `03b-rose-watercolour.png` stay in use. Several prompts below use them as references so everything matches.

**Not in this batch, because I draw them in SVG:** rain, the drop, running water on the umbrella, ripples, the pool of water, text.

**Fixes from Batch 01 built into these prompts:** softer wet fabric instead of glittery sequins, her coat vermilion rather than crimson, and the same light on everything (cold blue key from the upper left, warm amber rim from behind).

## How to run it

- Paste **each prompt on its own**. Where a prompt names a **reference image**, give Codex that file too if it can take image references; if it can't, the written description is enough.
- Save into `docs/creative/codex/batch-02/` with the exact filenames given. Keep extra variations as `-v2`, `-v3`.
- Tell me when **Group A** is in. I'll check it in a study before you start Group B.

---

# Group A — Opening and fall

## A1 — Street plate, landscape · `a1-street-landscape.png`

```
WHERE THIS GOES
The background of the opening scene of a scroll-told cinematic website called "A Love Story",
on laptops and desktops. A man and a woman (separate cut-out photographs) will stand in the
middle of this street, under an umbrella, in the rain. The rain itself is added later as an
animation, so this plate is the empty street they stand in.

WHAT IT SHOWS
An empty city street at night in the rain, seen from a standing person's eye height, looking
along the street. Wet asphalt in the lower third, shining with long vertical reflections of
shop lights and street lamps. Buildings and shopfronts on both sides and in the distance, their
windows and signs dissolved into soft round bokeh: warm amber, a few cold blue, one or two red.
The centre of the frame, where the couple will stand, is calm and darker, with nothing
distracting behind them. No people, no cars.

WHY IT LOOKS THIS WAY (THE VIBE)
The film opens on a cold, blue, lonely city, and the woman's red coat must be the only strong
warm colour in it. The street is a stage: beautiful, rainy, melancholy, but quiet in the middle
so the two figures read clearly. It should feel like the first frame of a sad love song.

LOOK
Cinematic night photography, 35mm film still, very shallow depth of field so the city is a
wash of bokeh, fine film grain. Overall cold cobalt-blue colour, warm amber light sources, deep
shadows, wet reflective ground. Low-key and high contrast.

TECHNICAL
Landscape, 1536 x 1024. The horizon (where the street meets the buildings) at about 55% of the
height from the top. The ground plane must continue to the bottom edge so figures can stand on
it. Fully opaque image, no transparency.

AVOID
No people, no silhouettes, no cars, no umbrellas, no readable signs or text, no logos,
no watermarks. Not illustrated, not 3D render.
```

## A2 — Street plate, portrait (phones) · `a2-street-portrait.png`

```
WHERE THIS GOES
The background of the opening scene of a scroll-told cinematic website called "A Love Story",
on phones (tall screens). A man and a woman (separate cut-out photographs) will stand in this
street under an umbrella in the rain; the rain is animated on top later.

WHAT IT SHOWS
The same kind of street as a landscape version: an empty city street at night in the rain,
eye height, wet asphalt shining with long vertical reflections, buildings and shopfronts
dissolved into soft round bokeh (warm amber, a few cold blue, one or two red). Because the
frame is tall, show more sky and building height above and more wet reflective ground below.
The centre, where the couple will stand, is calm and darker. No people, no cars.

WHY IT LOOKS THIS WAY (THE VIBE)
A cold, blue, lonely city where the woman's red coat will be the only strong warm colour.
Beautiful, rainy, melancholy, and quiet in the middle so the two figures read clearly.

LOOK
Cinematic night photography, 35mm film still, very shallow depth of field, fine film grain.
Cold cobalt-blue overall, warm amber light sources, deep shadows, wet reflective ground.

TECHNICAL
Portrait, 1024 x 1536. The horizon at about 50% of the height. The ground plane continues to
the bottom edge. Fully opaque image, no transparency.

AVOID
No people, no silhouettes, no cars, no umbrellas, no readable signs or text, no logos,
no watermarks. Not illustrated, not 3D render.
```

## A3 — Clear umbrella, open · `a3-umbrella-open.png`

```
WHERE THIS GOES
The umbrella in the opening scene of a scroll-told cinematic website called "A Love Story".
A man holds it over a woman in the rain, tilted toward her. It is a separate layer placed over
a photograph of the two of them. Rain running down it and one drop forming at its edge are
animated on top later.

WHAT IT SHOWS
One open, clear transparent plastic umbrella (a dome-shaped "bubble" umbrella), seen from
slightly below and from behind, the way someone standing a few metres behind the couple would
see it. The canopy is clear, so it shows only what clear plastic shows at night: thin bright
edge highlights, the curve of the dome catching light, faint panel seams, and many small rain
beads sitting on its surface. A slim dark metal shaft goes straight down from the centre to a
curved J-shaped handle at the bottom. Tilted about 10 degrees to the right.

WHY IT LOOKS THIS WAY (THE VIBE)
The umbrella is how he protects her: the first act of love in the story. Clear plastic keeps
both of them visible through it and makes the rain on it beautiful. It must feel like part of
the same photograph as the people: lit by the same cold blue light from the upper left, with a
warm amber glint from behind.

LOOK
Cinematic night photography, 35mm film still, fine film grain. Cold cobalt-blue highlights on
the plastic, small warm amber glints, sharp rain beads.

TECHNICAL
Square, 1024 x 1024. The whole umbrella in frame including the handle, centred, filling about
85% of the width. On a pure black (#000000) background: the clear plastic will be composited
by its brightness, so everything that is not plastic, shaft or rain bead must be pure black.
No hand.

AVOID
No hand, no person, no colour tint in the plastic, no patterns or prints, no text, no logos,
no watermarks. Not illustrated, not 3D render.
```

## A4 — Clear umbrella, closed · `a4-umbrella-closed.png`

```
WHERE THIS GOES
The same umbrella as in the opening of "A Love Story", before it opens: the man carries it
closed as he walks into the scene, then opens it over the woman. A separate layer over the
photograph of him.

WHAT IT SHOWS
The same clear transparent plastic dome umbrella, closed and loosely folded, held vertically,
canopy at the top and the curved J handle at the bottom. Wet, with rain beads on the folded
plastic. Slim dark metal shaft.

WHY IT LOOKS THIS WAY (THE VIBE)
It must be unmistakably the same umbrella as the open one, in the same cold blue night light
with a warm amber glint, so it can open in his hand without a visible change of object.

LOOK
Cinematic night photography, 35mm film still, fine film grain. Cold blue highlights on the
plastic, small warm amber glints, sharp rain beads.

TECHNICAL
Portrait, 1024 x 1536. The whole closed umbrella in frame, vertical, centred. On a pure black
(#000000) background, because it will be composited by brightness. No hand.

AVOID
No hand, no person, no colour tint, no patterns, no text, no logos, no watermarks.
Not illustrated, not 3D render.
```

## A5 — Him, walking in · `a5-him-walking.png`

```
REFERENCE IMAGE: docs/creative/codex/01-him.png (same man, same coat, same lighting).

WHERE THIS GOES
The man in the opening of a scroll-told cinematic website called "A Love Story", in the few
seconds when he walks into the rain toward a woman who has no umbrella. A cut-out layer that
slides in from the left over a street background. His closed umbrella is added separately.

WHAT IT SHOWS
The same man as the reference: tall, slim, long dark navy wool overcoat, dark trousers and
shoes, short wet hair. Full body, mid-stride, walking toward the right of the frame, seen from
three-quarters behind, so his face is turned away and never readable. His right arm hangs
slightly forward, hand loosely closed as if carrying a closed umbrella by its handle (no
umbrella in the image). Rain on his shoulders and hair.

WHY IT LOOKS THIS WAY (THE VIBE)
He is walking toward the moment that starts the whole story: gentle, purposeful, anonymous.
"Vague but strong": a clear, readable silhouette and posture, details dissolved into shadow.
His colour is cobalt blue, so he is lit by cold blue light. A melancholy film still.

LOOK
Cinematic night photography, 35mm film still, shallow depth of field, fine film grain. Cold
cobalt-blue key light from the upper left, a thin warm amber rim light from behind. The wool
coat is wet with a soft sheen and fine droplets, not sparkly or sequin-like. Low-key, high
contrast, no face visible.

TECHNICAL
Portrait, 1024 x 1536. Full body, head to shoes, with space around. Isolated on a fully
transparent background (PNG with alpha). If transparency is not possible, use a flat plain
light-grey background with no shadow or floor.

AVOID
No umbrella. No visible face or eyes. No street, floor or scenery. No extra people. No text,
logos or watermarks. Not illustrated, not cartoon, not 3D render.
```

## A6 — Field roses, closed buds · `a6-buds.png`

```
REFERENCE IMAGE: docs/creative/codex/03b-rose-watercolour.png (match this painting style exactly).

WHERE THIS GOES
"A Love Story" is a scroll-told cinematic website. A drop of water (the man) falls through a
sky full of flowers that open as he passes, toward one big red rose (the woman). These are the
flowers in that sky, before they open. They are cut out and scattered at many sizes and depths.

WHAT IT SHOWS
Four separate rosebuds, closed and tight, each with a short piece of stem and one small leaf,
at different angles. Two in vermilion red, one deep crimson, one red turning violet at the
tips. Arranged in a 2 x 2 grid with wide empty space between them so they can be cut apart.

WHY IT LOOKS THIS WAY (THE VIBE)
In this film people are photographs but love is painted: the flowers are a glowing watercolour
layer over real life. These buds are love about to happen. The colour runs from her vermilion
toward their purple, because the closer he gets to her, the more purple the world turns.

LOOK
Ink and watercolour illustration matching the reference: wet-in-wet colour blooms and bleeds,
soft granulation, a few fine confident ink lines at the petal edges, glowing transparent layers
of red, crimson and violet, highlights left as bare paper, a few tiny water droplets.

TECHNICAL
Square, 1024 x 1024. Each bud fully inside its own quarter with generous margins, nothing
touching or overlapping. Isolated on a fully transparent background (PNG with alpha). If
transparency is not possible, use a flat plain white background.

AVOID
No vase, no ground, no people, no text, no logos, no watermarks. Not photographic, not 3D,
not flat vector, not cartoon.
```

## A7 — Field roses, half open · `a7-half-open.png`

```
REFERENCE IMAGE: docs/creative/codex/03b-rose-watercolour.png (match this painting style exactly).

WHERE THIS GOES
"A Love Story" is a scroll-told cinematic website. A drop of water (the man) falls through a
sky full of flowers that open as he passes, toward one big red rose (the woman). These are the
same flowers, halfway open. They are cut out and scattered at many sizes and depths.

WHAT IT SHOWS
Four separate roses, half open: outer petals loosening and curling back, centres still tight.
Seen from different angles (one from above, one from the side, two three-quarter). Two
vermilion red, one crimson-to-magenta, one violet-purple. Arranged in a 2 x 2 grid with wide
empty space between them.

WHY IT LOOKS THIS WAY (THE VIBE)
Love opening up as he falls toward her. People are photographs, love is painted. The colour
runs from her vermilion toward their purple.

LOOK
Ink and watercolour illustration matching the reference: wet-in-wet blooms and bleeds, soft
granulation, a few fine ink lines at the petal edges, glowing transparent red, crimson and
violet, bare-paper highlights, a few tiny water droplets.

TECHNICAL
Square, 1024 x 1024. Each rose fully inside its own quarter with generous margins, nothing
touching. Isolated on a fully transparent background (PNG with alpha). If transparency is not
possible, use a flat plain white background.

AVOID
No vase, no ground, no people, no text, no logos, no watermarks. Not photographic, not 3D,
not flat vector, not cartoon.
```

## A8 — Field roses, full bloom in purple · `a8-full-purple.png`

```
REFERENCE IMAGE: docs/creative/codex/03b-rose-watercolour.png (match this painting style exactly).

WHERE THIS GOES
"A Love Story" is a scroll-told cinematic website. A drop of water (the man) falls through a
sky full of flowers toward one big red rose (the woman). When he lands in her, every flower in
the sky bursts into full bloom at once and purple petals rain down: the most beautiful frame of
the film. These are the flowers in full bloom.

WHAT IT SHOWS
Four separate roses in full, generous bloom, at different angles, in purples: one deep violet,
one lilac-purple, one magenta-purple, one purple with red at its heart. Arranged in a 2 x 2
grid with wide empty space between them.

WHY IT LOOKS THIS WAY (THE VIBE)
His colour is blue and hers is red; their love is purple, like "Purple Rain". This is love at
its peak: warm, overwhelming, luminous.

LOOK
Ink and watercolour illustration matching the reference: wet-in-wet blooms and bleeds, soft
granulation, a few fine ink lines at the petal edges, glowing transparent violet, magenta and
crimson, bare-paper highlights, a few tiny water droplets.

TECHNICAL
Square, 1024 x 1024. Each rose fully inside its own quarter with generous margins, nothing
touching. Isolated on a fully transparent background (PNG with alpha). If transparency is not
possible, use a flat plain white background.

AVOID
No vase, no ground, no people, no text, no logos, no watermarks. Not photographic, not 3D,
not flat vector, not cartoon.
```

## A9 — Loose petals · `a9-petals.png`

```
REFERENCE IMAGE: docs/creative/codex/03b-rose-watercolour.png (match this painting style exactly).

WHERE THIS GOES
"A Love Story" is a scroll-told cinematic website. These loose rose petals drift past the
falling drop of water (the man) at every depth, and later rain down in purple. They are cut out,
spun and scattered: some tiny in the distance, some huge and blurred in the foreground.

WHAT IT SHOWS
Nine separate single rose petals, each at a different angle and curl: some flat, some cupped,
some twisted, one seen edge-on. Three vermilion red, three crimson-magenta, three violet-purple.
Arranged in a 3 x 3 grid with wide empty space between them.

WHY IT LOOKS THIS WAY (THE VIBE)
Petals are the rain of love in this story: "Purple Rain". People are photographs, love is
painted, so the petals glow like watercolour against the dark.

LOOK
Ink and watercolour illustration matching the reference: wet-in-wet colour pooling toward the
edges, soft granulation, a fine ink line on some edges, glowing transparent colour, bare-paper
highlights.

TECHNICAL
Square, 1024 x 1024. Each petal fully inside its own ninth of the frame with generous margins,
nothing touching. Isolated on a fully transparent background (PNG with alpha). If transparency
is not possible, use a flat plain white background.

AVOID
No whole flowers, no stems, no people, no text, no logos, no watermarks. Not photographic,
not 3D, not flat vector, not cartoon.
```

## A10 — Her rose, closed and opening · `a10-her-rose-bud.png` and `a10-her-rose-opening.png`

Run this prompt **twice**: first with the STATE line as written, then replacing it with the second STATE line.

```
REFERENCE IMAGE: docs/creative/codex/03b-rose-watercolour.png (this is the same rose; keep its
colours, petal shapes, leaves and painting style).

WHERE THIS GOES
"A Love Story" is a scroll-told cinematic website. The woman is a red rose. A drop of water
(the man) falls toward her through a sky of blooming flowers and lands in her heart; she blooms
because she drinks him. As he falls closer, her rose is seen opening, until the moment he lands
and it is in full bloom (the reference image).

STATE: A large, closed rosebud, petals wrapped tight, just starting to loosen at the tip.
(second run, replace with) STATE: The same rose halfway open: outer petals curling back, the
centre still closed, the first small cup forming at the heart.

WHAT IT SHOWS
The same rose as the reference, in the STATE above, seen from slightly above, with a short piece
of stem and the same leaves. Light glows through the thinnest petals from behind.

WHY IT LOOKS THIS WAY (THE VIBE)
People are photographs, love is painted. Her colour is vermilion red with crimson and violet in
the shadows. She should feel like the brightest, warmest thing in the whole sky.

LOOK
Ink and watercolour illustration exactly matching the reference: wet-in-wet blooms and bleeds,
soft granulation, fine ink lines at the petal edges, glowing transparent red, crimson and
violet, bare-paper highlights, a few tiny water droplets.

TECHNICAL
Square, 1024 x 1024. The rose centred at the same position and scale as the reference, so the
three states can be swapped in place. Isolated on a fully transparent background (PNG with
alpha). If transparency is not possible, use a flat plain white background.

AVOID
No vase, no people, no text, no logos, no watermarks. Not photographic, not 3D, not flat
vector, not cartoon.
```

---

# Group B — Inside her rose to the end
*Generate after Group A has been reviewed.*

## B1 — Inside her rose, open · `b1-inside-open.png`

```
REFERENCE IMAGE: docs/creative/codex/03b-rose-watercolour.png (match this painting style and
these exact reds).

WHERE THIS GOES
"A Love Story" is a scroll-told cinematic website. The man is water that has fallen into the
heart of a red rose (the woman). This is chapter 3, "Becoming her": we are inside her flower,
in the small pool at its heart, looking up. It must feel like home: warm, glowing, safe.

WHAT IT SHOWS
The view from the very bottom of the rose's cup, looking straight up. Petals rise on every side
like curved, glowing walls, layer behind layer, lit from behind so light shines through them in
red, crimson and warm violet. At the top centre, the opening of the rose: a round patch of soft
purple-dark night sky with a few drifting petals. The petal walls are smooth and soft, with fine
veins visible where the light comes through.

WHY IT LOOKS THIS WAY (THE VIBE)
Being inside her is like being inside a lantern: belonging. "Hotel California": a beautiful
place you will never leave. For now it should only feel beautiful, with the walls just
noticeable. Their love is purple, so the light mixes red with violet.

LOOK
Ink and watercolour illustration matching the reference: wet-in-wet blooms and bleeds, glowing
transparent layers, soft granulation, fine ink lines at petal edges, bare-paper highlights
where the light is strongest.

TECHNICAL
Square, 1024 x 1024. The opening exactly at the centre, about 30% of the frame wide.
Fully opaque, full frame.

AVOID
No people, no stems seen from outside, no text, no logos, no watermarks. Not photographic,
not 3D, not flat vector, not cartoon.
```

## B2 — Inside her rose, closing in · `b2-inside-closing.png`

```
REFERENCE IMAGE: docs/creative/codex/batch-02/b1-inside-open.png (the same view; only the
petals have moved).

WHERE THIS GOES
"A Love Story", chapter 3 turning into chapter 4: the same view from inside the red rose, but
time has passed. The image cross-fades from the open version, so it must match it exactly
except for what changes.

WHAT IT SHOWS
The exact same view from the bottom of the rose's cup, looking up, but the petals have leaned
inward: the glowing walls are closer and taller, and the opening at the top centre is smaller,
about half its previous size. The light through the petals is a deeper, more saturated red,
with less violet.

WHY IT LOOKS THIS WAY (THE VIBE)
"Hotel California": the place that felt like home is closing around him. Her red is taking
over; their purple is leaving. Still beautiful, but now it is walls.

LOOK
Ink and watercolour illustration exactly matching the reference.

TECHNICAL
Square, 1024 x 1024. The opening exactly at the centre, about 15% of the frame wide.
Fully opaque, full frame.

AVOID
No people, no text, no logos, no watermarks. Not photographic, not 3D, not flat vector,
not cartoon.
```

## B3 — Her rose, curling and drying · `b3-her-rose-curling.png`

```
REFERENCE IMAGE: docs/creative/codex/03b-rose-watercolour.png (the same rose; keep its shape,
leaves and painting style).

WHERE THIS GOES
"A Love Story", chapter 4, "Losing himself". The rose (the woman) has drunk the water (the man).
She is at her most vivid, and he is fading. The image cross-fades from the full-bloom
reference, so it must sit in the same place at the same scale.

WHAT IT SHOWS
The same rose, seen from the same angle, but its petals have curled inward, holding tight, and
their outer edges have begun to dry: thin brownish crisp edges and a few small tears. The
centre is a strong, vivid vermilion red, more intense than ever. The pool of water at its heart
is much smaller, almost gone. A few thorns are visible on the stem.

WHY IT LOOKS THIS WAY (THE VIBE)
"Sign of the Times": quiet grief. She is thriving on him while he disappears. Beautiful and a
little cruel at once.

LOOK
Ink and watercolour illustration exactly matching the reference, with dry-brush texture on the
drying edges.

TECHNICAL
Square, 1024 x 1024. Same position and scale as the reference. Isolated on a fully transparent
background (PNG with alpha). If transparency is not possible, use a flat plain white background.

AVOID
No vase, no people, no text, no logos, no watermarks. Not photographic, not 3D, not flat
vector, not cartoon.
```

## B4 — Torn petals · `b4-torn-petals.png`

```
REFERENCE IMAGE: docs/creative/codex/03b-rose-watercolour.png (match this painting style).

WHERE THIS GOES
"A Love Story", chapter 5, "Losing her". Her petals tear loose and are ripped away by the wind,
one, then another, then all at once. These are those petals, cut out and thrown across the
screen. They should hurt, like broken glass, not drift softly.

WHAT IT SHOWS
Nine separate torn rose petals, each with a ragged torn edge where it ripped away from the
flower, some creased or folded, a few with dry brown edges. Mostly vermilion and crimson, two
darkening toward brown-red. Arranged in a 3 x 3 grid with wide empty space between them.

WHY IT LOOKS THIS WAY (THE VIBE)
The break. Sharp and violent instead of beautiful. Her colour is leaving with them.

LOOK
Ink and watercolour illustration matching the reference, with sharper, harder edges on the
torn sides and dry-brush texture.

TECHNICAL
Square, 1024 x 1024. Each petal fully inside its own ninth with generous margins, nothing
touching. Isolated on a fully transparent background (PNG with alpha). If transparency is not
possible, use a flat plain white background.

AVOID
No whole flowers, no people, no text, no logos, no watermarks. Not photographic, not 3D,
not flat vector, not cartoon.
```

## B5 — The bare stem · `b5-bare-stem.png`

```
REFERENCE IMAGE: docs/creative/codex/03b-rose-watercolour.png (the same rose's stem and leaves).

WHERE THIS GOES
"A Love Story", the end of chapter 5: the longest, quietest pause of the film. Every petal is
gone. What is left of the man (grey water) slips off this stem and falls into nothing.

WHAT IT SHOWS
The same rose's stem, now bare: the empty green-brown calyx at the top where the flower was,
the same leaves (one dried and curling), a few thorns. Nothing else. Painted mostly in faded,
desaturated greys and dull greens, with only a faint trace of red at the calyx.

WHY IT LOOKS THIS WAY (THE VIBE)
Emptiness after loss. The colour has gone with her. It should feel cold and quiet.

LOOK
Ink and watercolour illustration matching the reference, but drained: thin washes, more bare
paper, fewer colour blooms.

TECHNICAL
Portrait, 1024 x 1536. The stem upright and centred, the calyx at about 30% from the top.
Isolated on a fully transparent background (PNG with alpha). If transparency is not possible,
use a flat plain white background.

AVOID
No petals, no flowers, no people, no text, no logos, no watermarks. Not photographic, not 3D,
not flat vector, not cartoon.
```

## B6 — Her, strong · `b6-her-strong.png`

```
REFERENCE IMAGE: docs/creative/codex/02-her.png (same woman, same coat, same lighting).

WHERE THIS GOES
"A Love Story", chapter 4, "Losing himself". The woman (whose flower has drunk the man) is at
her most vivid and certain, while he is only a fading reflection. A cut-out layer seen faintly
through the glowing petals.

WHAT IT SHOWS
The same woman as the reference, full body, seen from three-quarters behind, face turned away
and never readable. Same long belted coat, now a vivid vermilion orange-red. Standing tall and
upright, head lifted, shoulders back, confident: the opposite of the hunched, cold woman in the
rain. Hair dry now, moving slightly.

WHY IT LOOKS THIS WAY (THE VIBE)
She has everything he gave her. "Vague but strong": a clear, beautiful silhouette, details in
shadow. She should feel strong, not cruel.

LOOK
Cinematic night photography, 35mm film still, shallow depth of field, fine film grain. Same
light as the reference: cool blue key from the upper left, warm amber rim from behind. The
coat's red rich and saturated. Wool with a soft sheen, not sparkly.

TECHNICAL
Portrait, 1024 x 1536. Full body, head to shoes. Isolated on a fully transparent background
(PNG with alpha). If transparency is not possible, use a flat plain light-grey background.

AVOID
No umbrella, no visible face or eyes, no scenery, no extra people, no text, no logos,
no watermarks. Not illustrated, not 3D render.
```

## B7 — Her, walking away · `b7-her-leaving.png`

```
REFERENCE IMAGE: docs/creative/codex/02-her.png (same woman, same coat, same lighting).

WHERE THIS GOES
"A Love Story", chapter 5, "Losing her". As her petals tear away in the wind, the woman walks
out of the frame and takes the red with her. A cut-out layer that moves away and out of frame.

WHAT IT SHOWS
The same woman, full body, seen directly from behind, walking away mid-stride, small steps,
not looking back. Same long belted coat in vivid vermilion, the hem and belt ends lifted by
wind. Hair blowing to one side.

WHY IT LOOKS THIS WAY (THE VIBE)
The moment she leaves. Not dramatic, just gone. The last warm colour leaving his world.

LOOK
Cinematic night photography, 35mm film still, shallow depth of field, slight motion blur on
the coat hem, fine film grain. Same lighting as the reference. Wool with a soft sheen.

TECHNICAL
Portrait, 1024 x 1536. Full body, head to shoes. Isolated on a fully transparent background
(PNG with alpha). If transparency is not possible, use a flat plain light-grey background.

AVOID
No umbrella, no face, no scenery, no extra people, no text, no logos, no watermarks.
Not illustrated, not 3D render.
```

---

## What I'll check when Group A comes back

| Check | Looking for |
|---|---|
| Street plates | Calm, dark centre for the couple; horizon heights as asked; no people or readable signs |
| Umbrella | Pure black background; clear plastic reads by its highlights; matches his fist height and angle |
| Him walking | Same man and coat as `01-him.png`; softer wet fabric |
| Watercolour sets | Same style as the 03B rose; items separable (no overlaps); real transparency |
| Her rose states | Same rose, same position and scale across bud → opening → full bloom |
| Colour | Her vermilion; purple growing through the field flowers |
