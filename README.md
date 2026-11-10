# Happy Birthday

온라인 롤링페이퍼 페이지입니다.

## 메시지 넣기

`messages.js` 의 배열을 아래 형식으로 채우고 push 하면 1~2분 뒤 페이지에 반영됩니다.

```js
{ name: "이름", message: "메시지\n줄바꿈은 이렇게" },
```

## 실물 출력

브라우저에서 인쇄(⌘P)하면 A4 2열 카드 레이아웃으로 출력됩니다. 인쇄 설정에서 "배경 그래픽"을 켜 주세요.

## 배경음악

`music.js` 에 오케스트라 편곡(인트로 팡파르 → 1절 C장조 → 전조 → 2절 D장조 풀 오케스트라)이 들어 있습니다.
악기 샘플은 [FluidR3 GM soundfont](https://github.com/gleitz/midi-js-soundfonts) (Frank Wen, CC BY 3.0)에서 필요한 음만 `sounds/` 에 담았습니다.
