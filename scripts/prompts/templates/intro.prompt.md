# Template-specific prompt: intro

Generate a concise plant introduction page.

Required experience:

- The page should help a visitor understand "What is this plant, what should I notice now, and why does it matter?"
- Prioritize a calm field-guide experience over a dense database profile.
- Use 3 to 5 well-composed sections depending on `estimatedTime`.
- Highlight the current season using `plant.seasonHighlights[settings.season]` or `plant.seasonHighlights.auto`.
- Use `plant.features` and `plant.observationTips` as visitor observation prompts, not raw bullet dumps.

Layout requirements:

- Hero: plant image, Korean visitor-facing title, scientific name as a subtitle, and one short summary sentence.
- Quick facts: family, habitat, flowering season, and size may appear as compact Korean facts.
- Observation section: "지금 볼 포인트" with 2 to 4 short observation prompts.
- Meaning section: one conservation or ecological message.
- Optional footer: image source can appear subtly, but not as a primary card.

Bad-output avoidance:

- Do not call the page "intro" or "식물 소개 템플릿".
- Do not expose raw category values like `tree`, `shrub`, or `herb`; map them to Korean when needed.
- Do not let DB facts dominate the first viewport.
- Do not make more than one large image.
