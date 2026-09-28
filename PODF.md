---
version: alpha
name: Adaline
description: A calm, high-contrast AI brand with an editorial feel, monospaced accents, and a light organic palette.
colors:
  primary: "#203b14"
  secondary: "#2e3b28"
  tertiary: "#c5ccb6"
  neutral: "#fbfdf6"
  surface: "#fbfdf6"
  on-surface: "#0a1d08"
  muted: "#6f7a67"
  border: "#e5e7eb"
  accent-soft: "#edf3df"
  error: "#b42318"
typography:
  headline-display:
    fontFamily: Akkurat
    fontSize: 53px
    fontWeight: 400
    lineHeight: 64px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Akkurat
    fontSize: 40px
    fontWeight: 400
    lineHeight: 48px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Akkurat
    fontSize: 24px
    fontWeight: 400
    lineHeight: 29px
    letterSpacing: 0px
  headline-sm:
    fontFamily: Fragment Mono
    fontSize: 31px
    fontWeight: 400
    lineHeight: 37px
    letterSpacing: 0.07em
  body-lg:
    fontFamily: Akkurat
    fontSize: 18px
    fontWeight: 400
    lineHeight: 26px
    letterSpacing: 0px
  body-md:
    fontFamily: Akkurat
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-sm:
    fontFamily: Akkurat
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  label-lg:
    fontFamily: Fragment Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0.14em
  label-md:
    fontFamily: Fragment Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0.14em
  label-sm:
    fontFamily: Akkurat
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 28px
  full: 9999px
spacing:
  xs: 12px
  sm: 20px
  md: 34px
  lg: 58px
  xl: 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    padding: "13px 24px"
    height: "40px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
    padding: "13px 24px"
    height: "40px"
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: "16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  chip:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
---

# Adaline

## Overview
Adaline feels calm, intelligent, and quietly premium. The page uses a spacious editorial composition with a lot of breathing room, which makes the brand feel confident rather than loud, and approachable rather than technical. The visual tone is organic and restrained, with a subtle AI/engineering edge introduced through monospaced labels and a diagrammatic illustration.

## Colors
- **Primary (#203b14):** A deep forest green used for the main CTA, brand marks, and the strongest text emphasis. It anchors the interface and gives the brand its grounded, botanical character.
- **Secondary (#2e3b28):** A softened dark green used for secondary button text and less prominent dark UI moments. It keeps contrast high without feeling as stark as pure black.
- **Tertiary (#c5ccb6):** A muted sage border tone that supports outlines, subtle separators, and secondary button strokes. It helps the UI feel light and understated.
- **Neutral / Surface (#fbfdf6):** A warm off-white background that fills nearly the entire screen. This creates a paper-like, editorial canvas and keeps the layout airy.
- **On-surface (#0a1d08):** The darkest text color, used for headlines and core reading content. It provides crisp readability while still feeling slightly green-tinted and brand-aligned.
- **Muted (#6f7a67):** A soft olive-gray for supporting copy, labels, and trust-copy. It reduces visual weight without drifting into true gray.
- **Border (#e5e7eb):** A very light neutral border used where structure is needed, such as cards and fine dividers. It stays nearly invisible in the overall composition.
- **Accent-soft (#edf3df):** A pale green wash used for chips and status-like surfaces. It adds warmth and a hint of organic texture without competing with the primary color.
- **Error (#b42318):** Reserved for validation or destructive states; it is not a visible brand color in the screenshot but should remain a clear, conventional alert tone.

## Typography
The system pairs Akkurat for prose and display text with Fragment Mono for labels, chips, and tech-forward UI accents. Headlines are light in weight, highly legible, and use negative letter spacing to feel refined rather than decorative. Body copy is comfortably sized and open, matching the generous whitespace of the layout.

Label and CTA treatment is notably uppercase with expanded tracking, especially in pill elements and nav actions. That mono styling gives the brand a precise, computational flavor that contrasts with the softer main type. Headline hierarchy should stay restrained: large sizes, normal weight, and tight spacing rather than bold or condensed treatment.

## Layout
The page uses a wide, fixed-max-width hero layout with a strong left/right split: copy and actions on the left, illustration on the right. Spacing is expansive and deliberate, with large vertical gaps between the header, hero, and trust section. The scale feels rhythmic rather than dense, using roughly 12px, 20px, 34px, 58px, and 96px jumps to maintain calm visual pacing.

Cards and smaller containers should use modest internal padding rather than heavy framing. Section padding should remain generous, but content blocks should not become boxed-in; the system depends on open negative space more than grid lines. Alignment is crisp and mostly left-anchored, with centered trust logos as a secondary, balancing band near the bottom.

## Elevation & Depth
The interface is intentionally flat. Depth comes from contrast, border outlines, and tonal separation rather than shadows or layered surfaces. The only notable “lift” is the faint 1px stroke treatment on interactive elements and containers, which keeps the UI clean and modern.

Because the background is already soft and light, elevation should be subtle and restrained. Avoid heavy blur, large drop shadows, or glossy treatments; they would conflict with the editorial simplicity of the brand.

## Shapes
The shape language is rounded but disciplined. Buttons use a pronounced pill radius, while cards are only gently rounded to keep structure without softness overload. Overall, the system feels calm and approachable, with curves applied where interaction needs warmth and straight edges preserved where clarity matters.

## Components
Buttons are the most defined component family. `button-primary` should be a filled forest-green pill with white mono text, compact horizontal padding, and a minimum height around 40px. `button-secondary` should be transparent with a light sage border and darker text, matching the outline treatment in the hero. `button-tertiary` can be text-only and should remain minimal, used sparingly for inline actions or low-emphasis links.

Buttons should feel crisp rather than heavy: no shadows, no gradients, no oversized corners beyond the pill shape. Hover states should deepen the green or slightly strengthen the border, but stay within the same muted palette. Disabled states should reduce contrast, not introduce new colors.

Cards should be plain and lightly bordered, as reflected by the `card` token. Use a neutral surface, subtle border, and modest padding. Cards should read as content holders, not as elevated panels.

Inputs should mirror the same quiet geometry as buttons: soft rounding, thin borders, and ample internal padding. Focus states should favor a green-tinted ring or border reinforcement rather than a dramatic glow. Validation states should be clear but restrained, preserving the calm mood of the form system.

Chips and pills should use the pale green accent surface with mono labels and uppercase tracking where appropriate. They should feel informative and editorial, not urgent or interactive-heavy. In the hero, the eyebrow chip works as a label badge rather than a clickable tag.

Navigation links and small utility actions should stay understated, using Akkurat or mono labels depending on context. The top nav and trust logos should remain visually light so the hero headline and primary CTA retain focus. Illustration and decorative code art can be detailed, but they should not compete with the core conversion path.

## Do's and Don'ts
- Do keep the interface spacious and let the background breathe around content.
- Do use the deep green primary color for the main action and strongest emphasis only.
- Do use monospaced labels for small navigational and chip-like elements to preserve the tech/editorial contrast.
- Do keep shadows minimal or absent; rely on borders and contrast for structure.
- Don't introduce saturated blues, reds, or bright accent colors that break the calm palette.
- Don't make headlines bold or overly compressed; the system depends on light, elegant display type.
- Don't add heavy cards, dark panels, or glossy effects that fight the paper-like surface.
- Don't crowd the layout with too many aligned blocks; preserve the open, airy hierarchy.