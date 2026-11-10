# Happy Birthday

온라인 롤링페이퍼 페이지입니다.

## 메시지

- **사이트에서 직접 남기기:** 「✍️ 메시지 남기기」로 쓴 글은 Firestore(`enzo-784b0`)에 저장되고 바로 붙습니다. 다른 사람이 쓴 글도 20초마다 자동으로 나타납니다.
- **이상한 글 지우기:** [Firebase 콘솔 › Firestore › messages](https://console.firebase.google.com/project/enzo-784b0/firestore/databases/-default-/data/~2Fmessages) 에서 해당 문서를 삭제합니다. (보안 규칙상 사이트에서는 새 글 쓰기만 되고, 수정·삭제는 안 됩니다. 규칙은 `firebase/firestore.rules`)
- **따로 받은 메시지 넣기:** `messages.js` 의 배열을 아래 형식으로 채우고 push 하면 1~2분 뒤 반영됩니다.

```js
{ name: "이름", message: "메시지\n줄바꿈은 이렇게" },
```

## 실물 출력

브라우저에서 인쇄(⌘P)하면 A4 2열 카드 레이아웃으로 출력됩니다. 인쇄 설정에서 "배경 그래픽"을 켜 주세요.

## 배경음악

`music.js` 에 오케스트라 편곡(인트로 팡파르 → 1절 C장조 → 전조 → 2절 D장조 풀 오케스트라)이 들어 있습니다.
악기 샘플은 [FluidR3 GM soundfont](https://github.com/gleitz/midi-js-soundfonts) (Frank Wen, CC BY 3.0)에서 필요한 음만 `sounds/` 에 담았습니다.
