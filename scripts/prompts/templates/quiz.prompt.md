# 콘텐츠 유형별 프롬프트: 퀴즈

방문자가 식물을 보며 바로 풀 수 있는 교육형 퀴즈 페이지를 만드세요.

필수 경험:

- 핵심 경험은 데이터 카드 목록이 아니라 퀴즈입니다.
- `deploymentUse`가 `staticPoster`가 아니라면 `useState`를 사용해 선택한 답과 즉시 피드백을 보여줍니다.
- `deploymentUse`가 `staticPoster`라면 상호작용 없이 질문, 정답, 짧은 해설이 한 화면 안에 읽히는 포스터로 구성합니다.
- `estimatedTime`이 `1min` 이하이면 질문은 3개 이하로 제한합니다. `3min`이어도 4개를 넘기지 않습니다.
- 각 질문은 짧은 한국어 질문, 3개의 선택지, 정답, 친근한 해설을 갖습니다.
- 질문은 `plant.features`, `plant.observationTips`, `plant.seasonHighlights`, `plant.conservationMessage`, 선택된 `focusTopics`, `extraRequest`에서 도출합니다.
- `focusTopics`에 `nameOrigin`이 있으면 이름이나 학명/일반명과 관련된 단서를 포함하되, 근거 없는 어원을 지어내지 않습니다.
- `focusTopics`에 `cultureHistory`가 있으면 제공 데이터로 뒷받침되는 범위에서 사람과 식물의 관계를 묻습니다. 근거가 부족하면 “사람들이 관찰해 온 특징”으로 안전하게 표현합니다.
- 대상이 어린이라면 짧은 문장, 따뜻한 격려, 쉬운 어휘를 사용합니다.

권장 구조:

- 첫 화면: 방문자용 한국어 제목, 한 문장 미션, 식물 이미지, “퀴즈 시작”에 해당하는 명확한 시각 신호.
- 본문: 큰 답변 버튼과 명확한 정답/오답/선택 상태를 가진 퀴즈 카드.
- 보조: 문제를 풀기 전에 볼 관찰 힌트 2~3개.
- 마무리: 보전 메시지 또는 정원 관람 예절 한 문장.

피해야 할 출력:

- `content.sections`를 그대로 질문 목록으로 쓰지 않습니다.
- “Question 1”, “Quiz route”, “Botanical snapshot” 같은 영어/구현 레이블을 쓰지 않습니다.
- 원시 설정값(`quiz`, `education`, `friendly`, `children`, `mobile`)을 화면에 노출하지 않습니다.
- 흰 배경 위 흐린 글씨, 연한 반투명 패널, 작은 답변 버튼을 사용하지 않습니다.
- 정답 피드백이 없는 죽은 UI를 만들지 않습니다.
