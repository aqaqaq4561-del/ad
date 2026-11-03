# 광고소재 제작기

**문구 추천 → 내가 고르기 → 고른 문구 그대로 소재 제작**

## 처음 한 번
```powershell
npm install
npx playwright install chromium
copy .env.example .env   # 그리고 .env 에 GEMINI_API_KEY 입력
```

## 1) 문구 추천받기
```powershell
npm run copy -- virginroad
npm run copy -- virginroad --n 15 --angle "연말 시즌, 30대 후반 직장인 대상"
```
- 번호가 붙은 후보가 나오고 `output/virginroad/copy/` 에 md 로도 저장됩니다.
- ★확정 = `brands/virginroad.json` 의 `approved_copy` 에 넣어 둔 문구.
- 금지어(성혼율·보장·AI 상투어 등)가 들어간 후보는 자동 제외됩니다.

## 2) 고른 번호로 소재 만들기
```powershell
npm run make -- virginroad --pick 1,4            # 문구마다 3개씩, 매번 다른 레이아웃·장면
npm run make -- virginroad --pick 2 --variants 6 --format story
npm run make -- virginroad --text "직접 쓴 문구" --highlight "강조할 부분"
npm run make -- virginroad --pick 1 --no-image   # 사진 없이 레이아웃만 미리보기 (무료)
```
- 결과: `output/virginroad/<시간>/index.html` 을 열면 전부 한눈에 보입니다.
- **고른 문구는 글자 하나 바꾸지 않습니다.** 문구는 AI 이미지가 아니라 코드로 얹고, 렌더 후 실제 글자를 다시 읽어 일치하는지 검사합니다.
- 사진은 Gemini가 만들고, 다른 Gemini 모델이 검수합니다(노을·야간, 플라스틱 피부, 숙소만 보이는 사진, 손·얼굴 오류, 이미지 속 글자). 불합격이면 최대 3번까지 다시 만듭니다.
- `manifest.json` 에 소재마다 후킹 유형·레이아웃·장면 태그가 저장됩니다 → 나중에 성과와 연결해 잘 되는 조합을 학습하는 데 씁니다.

## 수정하는 곳
| 바꾸고 싶은 것 | 파일 |
|---|---|
| 확정 문구, 뱃지, 금지어, 색상, 장면 목록 | `brands/virginroad.json` |
| 성과 좋았던 소재 자료 | `data/virginroad/winners.md`, `data/virginroad/winners/` |
| 레이아웃 디자인 | `src/layouts.js` |
| 문구 작성 규칙 | `src/copywriter.js` |

