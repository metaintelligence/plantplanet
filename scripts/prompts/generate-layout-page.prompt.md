You are generating one React layout component for the HanGarden content manager.

Create exactly this file and do not edit any other files:

{{targetFile}}

Component contract:

- Export a default React function component named `{{componentName}}`.
- Props type must be:

```ts
interface GeneratedLayoutProps {
  content: GeneratedContent;
  plant: PlantRecord;
}
```

- Import the types exactly like this:

```ts
import type { GeneratedContent, PlantRecord } from '../../types/content';
```

Role and product intent:

- Build a real visitor-facing arboretum content page, not an admin/debug page and not a database dump.
- HanGarden pages are opened by visitors on mobile QR, kiosk, education, or exhibition screens.
- The page must feel intentionally authored for the selected template `{{template}}`, target audience, purpose, location, season, tone, and extra request.
- The generated page must be immediately demo-worthy: clear hierarchy, polished spacing, readable Korean copy, and a complete user flow.

Data context:

- Runtime props:
  - `content`: generated content metadata and sections.
  - `plant`: selected plant record from `frontend/public/mock_db.json`.
- Use `plant` props rather than hardcoded mock DB values.
- Use `content.sections.map(...)` somewhere in the component, but do not blindly turn every section into the primary experience. Reframe sections into the template flow.
- Render `section.items` only when useful and present.
- Use `plant.image.url` and `plant.image.alt` for the primary image.
- You may use fields such as `plant.habitat`, `plant.origin`, `plant.family`, `plant.features`, `plant.conservationMessage`, `plant.observationTips`, `plant.seasonHighlights`, `plant.image.source`, and `plant.similarPlantIds`.

User-facing language rules:

- Default to Korean UI copy when `settings.languages` includes `ko`.
- Do not expose enum/raw values like `quiz`, `education`, `1min`, `friendly`, `children`, `mobileCourse`, `cultureHistory`, `nameOrigin`, `tree`, or plant IDs as visible labels.
- Convert enum values into natural Korean labels in helper maps inside the component.
- `content.settings.contentName` and `content.title` may be internal management names. Do not use them as the main visitor H1 if they contain underscores, timestamps, or IDs. Create a visitor-facing title from `plant.koreanName`, template, purpose, audience, and focus topics.
- Keep scientific names and DB fields as supporting content, not the emotional center of the page.

Quality rules learned from previous bad output:

- Do not make a developer dashboard, field reference sheet, or DB card wall.
- Do not place low-contrast text on pale translucent backgrounds.
- Do not render the settings JSON, image source URL, raw license text, or similar plant IDs in the primary visitor flow.
- Do not use English section labels when the requested language is Korean.
- Do not use gradients or translucent panels that reduce readability.
- Do not make a long page when `estimatedTime` is `10sec`, `30sec`, or `1min`; prioritize a compact experience.
- Do not make every `content.sections` entry look like the same card. Differentiate hero, main interaction, supporting facts, and closing message.
- Do not show "Generated Page", "Plant record challenge", "Botanical snapshot", "Image record", "Plant ID", or similar implementation labels.
- Do not output dead UI. If a template implies interaction, implement simple local state with React hooks.

Implementation constraints:

- Keep the component self-contained and TypeScript-safe.
- You may use React hooks without importing React explicitly if the project JSX runtime allows it, but import `useMemo` or `useState` from `react` when needed.
- You may use existing CSS classes such as `layout-kicker`, `ai-generated-layout`, `ai-generated-hero`, `ai-generated-chip-row`, `ai-generated-focus-band`, `ai-generated-section-grid`, and `ai-generated-section-card`.
- You may add inline style objects inside this component when the existing classes are insufficient.
- Do not import external packages.
- Do not use `dangerouslySetInnerHTML`.
- Do not read from network, localStorage, cookies, or browser globals.
- Do not create or modify registry, manifest, CSS, package, config, or other files. The caller script will update registry files after this component is created.

Required output quality checklist before writing the file:

- The first viewport clearly communicates what the visitor should do.
- The visible text is natural Korean and matches the audience.
- The selected template has a complete structure, not a generic collection of cards.
- The selected focus topics are reflected in the main content.
- The plant DB enriches the content without overwhelming it.
- All visible text has enough contrast and sensible spacing.
- The page remains usable on mobile-sized widths through responsive inline styles or existing responsive classes.
- The component compiles as TSX.

Mock plant database context:

```json
{{mockDbSummary}}
```

Settings JSON string array:

```json
{{settingsJsonArray}}
```

Parsed primary settings object:

```json
{{settingsJson}}
```

Template-specific instructions are below. They override generic suggestions when there is a conflict.

{{templatePrompt}}

Write the complete TSX component to `{{targetFile}}`.
