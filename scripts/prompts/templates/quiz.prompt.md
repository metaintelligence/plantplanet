# Template-specific prompt: quiz

Generate a visitor-facing educational quiz page.

Required experience:

- The main experience must be an interactive quiz, not a list of database cards.
- Use `useState` to track the selected answer for each question and reveal immediate feedback.
- Build 3 to 4 quiz questions maximum for `estimatedTime` of `1min` or less.
- Each question must have:
  - a short Korean question sentence,
  - 3 answer choices,
  - one correct answer,
  - a friendly explanation shown after selection.
- Questions must be derived from `plant.features`, `plant.observationTips`, `plant.seasonHighlights`, `plant.conservationMessage`, and selected `focusTopics`.
- If `focusTopics` includes `nameOrigin`, include one question or clue about the Korean/common/scientific name without inventing false etymology.
- If `focusTopics` includes `cultureHistory`, include one culture/history or human-use observation question only when supported by the provided plant data; otherwise frame it as "사람들이 관찰해 온 특징".
- If the audience includes `children`, use short sentences, warm encouragement, and avoid academic wording.

Layout requirements:

- Hero: a friendly Korean title, one-sentence mission, plant image, and a clear "퀴즈 시작" cue.
- Main section: quiz cards with large answer buttons and feedback states.
- Supporting section: only 2 to 3 compact observation hints before or after the quiz.
- Closing section: a short conservation or garden etiquette message.
- Use high-contrast answer buttons. Selected/correct/wrong states must be visually clear.
- Keep the page compact. Do not show settings JSON, raw enum chips, image URLs, plant IDs, or developer labels.

Bad-output avoidance:

- Do not label generated sections as "Question 1" unless they are real quiz questions.
- Do not render `content.sections` directly as all quiz questions.
- Do not show `settings.template`, `settings.purpose`, `settings.tone`, `settings.deploymentUse`, or `settings.fieldLocation` as raw text.
- Do not use English labels such as "Quiz route", "Season clue", "Botanical snapshot", "Plant features", or "Before answering".
- Do not make pale text on white or translucent panels.

Useful helper maps to include when relevant:

- audience: children -> 어린이, adults -> 성인, foreigners -> 외국인
- season: spring -> 봄, summer -> 여름, autumn -> 가을, winter -> 겨울, auto -> 오늘
- focus: nameOrigin -> 이름의 비밀, cultureHistory -> 사람과 식물 이야기
