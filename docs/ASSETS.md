# Asset register — original demo concepts

## Status and provenance

All six SVG files below are original generated vector artwork authored specifically for this demonstration. Their geometry, architectural scenes, material shading and embedded lettering were created locally; no external images, traced photography, official product assets, logos, stock art or downloaded fonts were used. No Audi design assets or copied Audi layouts are included.

**The scooter is an imaginary design. It is not a VinFast product photograph, not an accurate representation of Evo Lite, and not evidence of real equipment, specifications, performance, safety or available colors.** The showroom and city are fictional places. The lettering `STUDIO / 01` is a generic concept caption, not a manufacturer mark.

### License

Original generated SVG artwork: **CC0-1.0 (public-domain dedication, to the extent permitted by applicable law)**. No third-party asset license or attribution obligation has been introduced by this asset set. Attribution is optional: “Original concept illustration for showroom demo.” The dedication applies to these original SVG illustrations only; it does not grant rights in third-party trademarks, real product designs or later replacement photographs.

TODO: The project owner should approve final commercial provenance/licensing and replacement media permissions before public release. Do not label this artwork “official” or “accurate product photography.”

## Files and replacement mapping

Every illustration uses `viewBox="0 0 1200 760"`. The large scooter colorways share identical side-view geometry, framing and wheel positions to prevent layout jump when switching colors. Each has a Vietnamese `<title>` and `<desc>` linked by `aria-labelledby`.

| Local source | Public path / expected replacement path | Intended use | Background |
| --- | --- | --- | --- |
| `public/images/scooter-ivory.svg` | `/images/scooter-ivory.svg` | Large ivory concept scooter; hero or product color selector | Transparent; restrained translucent ground shadow |
| `public/images/scooter-graphite.svg` | `/images/scooter-graphite.svg` | Large graphite concept scooter; same silhouette | Transparent; restrained translucent ground shadow |
| `public/images/scooter-blue.svg` | `/images/scooter-blue.svg` | Large cobalt concept scooter; same silhouette | Transparent; restrained translucent ground shadow |
| `public/images/detail.svg` | `/images/detail.svg` | Material/tech detail editorial card | Charcoal studio |
| `public/images/city.svg` | `/images/city.svg` | Lifestyle editorial card | Neutral architectural scene |
| `public/images/showroom.svg` | `/images/showroom.svg` | Showroom/editorial/careers illustration | Neutral architectural interior |

The three scooter compositions keep the product large and centered, facing right. The illustrated side view includes wheels, alloy spokes, drilled disc, caliper, fork, rear suspension, body panel seams, saddle stitching, handlebar, brake lever, mirrors, lamp, indicator and small fasteners. Gradients are used only for material/volume shading and the subdued ground shadow, never decorative neon.

To replace an illustration without code changes, put properly licensed media at its listed public path, preserving the format and aspect ratio. For raster photographs, use an appropriate extension (for example `/images/scooter-ivory.webp`) and update every consumer referencing that path; **do not put raster bytes in an `.svg` file**. The editorial image paths live in `src/data/editorial.ts`; hero/product paths must be updated wherever their consuming components declare them. Remove or revise concept disclaimers only after the imagery and claims have been verified. Keep meaningful alt text on rendered `<img>`/image components: internal SVG titles are not a substitute for consumer-level accessible labeling.

## Editorial content

`src/data/editorial.ts` exports:

- `news`: three Vietnamese demo posts, ISO sample dates, `body: string[]` and local image paths.
- `jobs`: three explicitly fictional role examples; no active vacancy or verified employer claim.
- `servicePackages`: three sample packages with clearly marked unverified illustrative prices, not offers or quotes.
- `faqs`: five demo service FAQs including the imagery and warranty/authorization disclaimers.

All content is sample copy. TODO verification markers cover dates, prices/tax, service scope, qualifications, real addresses, appointment handling, manufacturer authorization, actual availability and publication approval. No official relationship, warranty, launch announcement, recruiting campaign or technical specification is asserted.

## Verification

The asset set should be checked using Python's standard-library `xml.etree.ElementTree` to parse each SVG. Confirm the six expected filenames, SVG namespace, exact viewBox, nonempty Vietnamese title/description, no scripts or external image references, and no full-canvas background on the three hero scooter files. XML parsing validates syntax, not product accuracy or final visual approval.

### Executed checks

- Python stdlib `xml.etree.ElementTree`: **6/6 SVG files parsed successfully**; SVG namespace, exact `0 0 1200 760` viewBox, Vietnamese title/description and accessible ID references passed.
- Checked for script elements, external image elements, external `href` URLs and load handlers: none found.
- TypeScript compiler `transpileModule`: no syntax diagnostics in `src/data/editorial.ts`.
- Evaluated exports: **3 news posts, 3 jobs, 3 service packages, 5 FAQs**. All news image paths resolve to existing local SVGs.
- These are asset/data checks, not a full application build or browser visual verification.

TODO: Review final rendering at desktop/mobile sizes against the actual charcoal hero stage. Confirm accessible alt text in consuming components and replace demo content only after stakeholder approval.
