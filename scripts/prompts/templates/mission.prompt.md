# Template-specific prompt: mission

Generate a field mission page for visitors.

Required experience:

- The page should give the visitor a clear action to perform near the plant.
- Use a mission structure: mission briefing, steps, evidence/check result, and closing message.
- Use `plant.observationTips`, `plant.features`, and current season highlight to create concrete tasks.
- For `estimatedTime` of `1min` or less, use 3 mission steps maximum.
- If audience includes `children`, use playful but safe instructions.

Layout requirements:

- Hero: mission title, plant image, estimated time in Korean, and a clear start cue.
- Mission steps: large step cards with simple verbs such as "찾아보기", "비교하기", "생각하기".
- Result section: a simple completion callout or "오늘의 발견" note.
- Safety/etiquette: remind visitors not to pick leaves, flowers, or fruit.

Bad-output avoidance:

- Do not make generic information cards instead of tasks.
- Do not ask visitors to touch, pick, smell closely, climb, or damage plants.
- Do not expose raw enum values or internal content names.
- Do not create more steps than the requested time can support.
