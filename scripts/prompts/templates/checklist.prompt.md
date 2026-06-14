# Template-specific prompt: checklist

Generate an observation checklist page.

Required experience:

- The page should help visitors inspect the plant step by step.
- Use simple checklist items based on `plant.observationTips`, `plant.features`, and seasonal highlight.
- Use `useState` to allow checklist items to be checked off.
- Include a small progress indicator such as completed count.
- For `estimatedTime` of `1min` or less, use 4 to 5 checklist items maximum.

Layout requirements:

- Hero: Korean checklist title, plant image, and short instruction.
- Checklist: large readable rows with checkbox controls and short labels.
- Detail cards: 2 to 3 supporting facts that help complete the checklist.
- Closing: one reflection prompt or conservation message.

Bad-output avoidance:

- Do not make a static bullet list when the template is checklist.
- Do not show raw DB IDs, raw enum labels, or settings JSON.
- Do not create tiny checkboxes or cramped text.
- Do not ask visitors to physically handle or damage the plant.
