# Real-device checklist — A Love Story

Written for: Abraham, checking on a Mac (Safari) and an iPhone 12 mini (Safari).
Takes about 15 minutes per device. Note anything odd: what you saw, roughly where in the film, and on which device.

## Before you start

1. Stop any preview server that's already running (the terminal running `vite preview`). Don't use `vite preview` for this check: under the `/a-love-story/` path it answers Safari's script requests with "not found" and you'd get a blank page. Instead, in the project folder run:
   ```
   npm run build && npm run preview:pages -- --host
   ```
   This serves the build exactly the way GitHub Pages will.
2. Open the film at its published path:
   - **Mac:** `http://localhost:4180/a-love-story/`
   - **iPhone (same Wi-Fi):** the `on your phone →` link the terminal prints (for example `http://192.168.68.121:4180/a-love-story/`)
3. On the iPhone, test in normal Safari (not a private tab) first, then repeat the starred (★) items in a private tab.

## The checks

Tick each one, or write what went wrong.

### Loading and opening
- [ ] The red string and "A Love Story" appear almost at once; the string untangles; **Begin** appears.
- [ ] Tapping **Begin**: the string falls like a streak of rain, and the umbrella opening plays (he walks in, the umbrella opens over her, the title appears).
- [ ] ★ Scrolling during the opening skips straight to its end.

### Scrolling (iPhone especially)
- [ ] Scroll slowly through chapter 1: the picture **does not jump** when Safari's address bar shrinks or grows.
- [ ] His drop hangs from the umbrella's edge, swells and turns blue, lets go, and becomes the painted drop among the roses.
- [ ] The roses look smooth while falling (no stutter you'd notice in a film).
- [ ] Inside her rose (chapter 3), the words hand over from his handwriting to her typeface, word by word, and stay readable.
- [ ] The petal storm (chapter 5) stays smooth on the iPhone.
- [ ] Every line of text is readable at the size your phone shows it.

### Play
- [ ] **Play** scrolls the film by itself; touching the screen (or scrolling on the Mac) pauses it.
- [ ] Letting Play reach the end: the credits roll; the Play button disappears; **Watch again** takes you to the top and replays the opening.

### Phone-specific
- [ ] Rotate the iPhone sideways mid-story, then back: you stay at the same moment.
- [ ] ★ Lock the phone (or switch apps) for a few seconds mid-story and come back: the film is where you left it and still moves.

### Ending
- [ ] The credits link opens abrahamnaiborhu.com.
- [ ] "Mr. Nobody" and the ripple are visible in the dark (turn your brightness to a normal level).

### Reduced motion (optional, iPhone)
- [ ] Settings → Accessibility → Motion → **Reduce Motion** on, then reload: no opening animation; scrolling shows still frames that dip to dark between beats; every line readable. Turn it back off afterwards.

## What to send back

For each device: which items passed, which didn't (with a screenshot or a short description), and your iOS / macOS and Safari versions (Settings → General → About → iOS version; Safari → About Safari on the Mac).
