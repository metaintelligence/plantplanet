# Template-specific prompt: storytelling

Generate a narrative plant storytelling page.

Required experience:

- The page should feel like a short guided story a visitor can read at the plant.
- Build a clear narrative arc: opening hook, plant voice or guide voice, 2 to 3 story beats, and a closing reflection.
- Adapt the scenario:
  - `nameSecret`: focus on names and visible clues without inventing unsupported etymology.
  - `dayInLife`: describe a day around the plant using observable traits.
  - `timeTravel`: connect origin/habitat and seasonal changes.
  - `climateSurvival`: connect habitat, conservation, and climate sensitivity.
  - `extinction`: use care and hope; avoid fear-heavy wording for children.
- Use selected `focusTopics` as story beats.
- If audience includes `children`, write in warm, simple Korean with short paragraphs.

Layout requirements:

- Hero: immersive plant image and a narrative title that is not the internal content name.
- Story path: 3 to 4 numbered or titled beats, each with one compact paragraph.
- Observation prompt: a small section asking the visitor to look, touch only with eyes, or compare shapes.
- Closing: a conservation or garden etiquette message.

Bad-output avoidance:

- Do not make a database profile with labels like family/origin/habitat as the main story.
- Do not output a generic fairy tale unrelated to the plant data.
- Do not use long paragraphs.
- Do not invent cultural legends, medicinal claims, or historical facts not supported by the available data.
