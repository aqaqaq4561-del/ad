// 레이아웃 템플릿. 문구는 전부 코드로 얹기 때문에 글자가 바뀌거나 깨지지 않는다.
// 각 레이아웃: photoBox(W,H) = 사진 영역 크기, composition = 이미지 생성 시 구도 지시, html(ctx)

const esc = (s = "") => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function headlineHTML({ headline, highlight }) {
  let h = esc(headline);
  if (highlight) {
    const e = esc(highlight);
    const i = h.indexOf(e);
    if (i >= 0) h = h.slice(0, i) + `<em>${e}</em>` + h.slice(i + e.length);
  }
  // 줄마다 span 으로 감싸서, 의도한 줄이 중간에 꺾이지 않도록 글자 크기를 맞춘다
  return h.split("\n").map((l) => `<span class="ln">${l}</span>`).join("");
}

const badgesHTML = (badges, cls = "") =>
  badges.map((b) => `<span class="badge ${cls}" data-copy="badge">${esc(b)}</span>`).join("");

function page(ctx, body) {
  const { W, H, brand } = ctx;
  const c = brand.colors;
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600;700;900&display=swap">
<style>
:root{--bg:${c.bg};--ink:${c.ink};--muted:${c.muted};--accent:${c.accent};--accent-l:${c.accent_light};--card:${c.card}}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{position:relative;font-family:Pretendard,'Malgun Gothic',sans-serif;color:var(--ink);background:var(--bg);word-break:keep-all;-webkit-font-smoothing:antialiased}
.serif{font-family:'Noto Serif KR',serif}
.photo{background-image:url(${ctx.img});background-size:${ctx.fit};background-position:center;background-repeat:no-repeat;background-color:var(--bg)}
.hl{font-weight:800;line-height:1.28;letter-spacing:-0.02em}
.hl .ln{display:block}
.hl.nowrap .ln{white-space:nowrap}
.hl em{font-style:normal;color:var(--accent)}
.dark .hl em{color:var(--accent-l)}
.sub{font-weight:500;line-height:1.45;letter-spacing:-0.01em}
.badges{display:flex;flex-wrap:wrap;gap:14px}
.badge{display:inline-block;padding:14px 26px;border-radius:999px;font-size:30px;font-weight:700;white-space:nowrap;letter-spacing:-0.01em}
.badge.light{background:rgba(255,255,255,.94);color:var(--ink)}
.badge.glass{background:rgba(255,255,255,.18);color:#fff;border:2px solid rgba(255,255,255,.7);backdrop-filter:blur(6px)}
.badge.line{background:transparent;color:var(--accent);border:2px solid var(--accent)}
.fitbox{overflow:hidden;display:flex;flex-direction:column}
</style></head><body>${body}
<script>
window.__fit = () => {
  const res = [];
  document.querySelectorAll('[data-fit]').forEach(el => {
    const box = el.closest('.fitbox');
    const max = +el.dataset.max, min = +el.dataset.min;
    const tall = () => box.scrollHeight > box.clientHeight + 8;
    const wide = () => el.scrollWidth > el.clientWidth + 1 || box.scrollWidth > box.clientWidth + 1;
    const shrink = (over) => { let s = max; el.style.fontSize = s + 'px'; while (over() && s > min) { s -= 2; el.style.fontSize = s + 'px'; } return s; };
    // 1차: 줄마다 한 줄로 유지(nowrap) 하면서 맞추기
    el.classList.add('nowrap');
    let s = shrink(() => tall() || wide());
    if (tall() || wide()) { // 안 되면 줄바꿈 허용하고 다시
      el.classList.remove('nowrap');
      s = shrink(tall);
    }
    res.push({ size: s, overflow: tall() || wide() });
  });
  return res;
};
</script></body></html>`;
}

const hl = (ctx, { max, min, color = "inherit", serif = true, align = "left" }) =>
  `<div class="hl ${serif ? "serif" : ""}" data-copy="headline" data-fit data-max="${max}" data-min="${min}" style="color:${color};text-align:${align}">${headlineHTML(ctx.copy)}</div>`;
const sub = (ctx, { size = 36, color = "var(--muted)", align = "left", mt = 22 }) =>
  ctx.copy.sub ? `<div class="sub" data-copy="sub" style="font-size:${size}px;color:${color};text-align:${align};margin-top:${mt}px">${esc(ctx.copy.sub)}</div>` : "";

export const LAYOUTS = {
  // 1) 풀블리드 사진 + 하단 그라데이션 위 큰 헤드라인
  hero_bottom: {
    photoBox: (W, H) => ({ w: W, h: H }),
    composition: "Place the people's faces in the upper 55% of the frame. Keep the bottom 40% calm and simple (table surface, floor, soft blur) because large text will be overlaid there.",
    html: (ctx) => {
      const { W, H } = ctx;
      return page(ctx, `
<div class="photo" style="position:absolute;inset:0"></div>
<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0) 38%,rgba(18,14,10,.55) 62%,rgba(18,14,10,.86) 100%)"></div>
<div class="dark fitbox" style="position:absolute;left:72px;right:72px;bottom:${72 + 80}px;height:${Math.round(H * 0.34)}px">
  <div style="flex:1 1 0"></div>
  ${hl(ctx, { max: 100, min: 64, color: "#fff" })}
  ${sub(ctx, { size: 38, color: "rgba(255,255,255,.92)" })}
</div>
<div class="badges" style="position:absolute;left:72px;right:72px;bottom:64px">${badgesHTML(ctx.badges, "glass")}</div>`);
    },
  },

  // 2) 상단 크림 패널에 헤드라인, 하단 사진
  cream_top: {
    photoBox: (W, H) => ({ w: W, h: Math.round(H * 0.58) }),
    composition: "Medium shot, people centered and filling the frame, faces clearly visible.",
    html: (ctx) => {
      const { W, H } = ctx;
      const top = Math.round(H * 0.42);
      return page(ctx, `
<div class="fitbox" style="position:absolute;left:80px;right:80px;top:84px;height:${top - 84 - 40}px;justify-content:center">
  ${hl(ctx, { max: 96, min: 60 })}
  ${sub(ctx, { size: 36 })}
</div>
<div class="photo" style="position:absolute;left:0;right:0;bottom:0;height:${H - top}px"></div>
<div class="badges" style="position:absolute;left:60px;right:60px;bottom:56px">${badgesHTML(ctx.badges, "light")}</div>`);
    },
  },

  // 3) 비교형: 카페 소개팅 vs 버진로드
  compare: {
    photoBox: (W, H) => ({ w: W, h: Math.round(H * 0.42) }),
    composition: "Medium-wide shot, people interacting naturally, faces visible, horizontal composition.",
    html: (ctx) => {
      const { W, H, brand } = ctx;
      const ph = Math.round(H * 0.42);
      const { left, right } = brand.compare;
      const inCompare = [...left.items, ...right.items, left.label, right.label].join(" ");
      const rest = ctx.badges.filter((b) => !inCompare.includes(b));
      const card = (side, dark) => `
<div style="flex:1;border-radius:28px;padding:34px 34px;background:${dark ? "var(--ink)" : "#E9E4DC"};color:${dark ? "#fff" : "var(--muted)"}">
  <div data-copy="compare" style="font-size:30px;font-weight:700;opacity:.8">${esc(side.label)}</div>
  ${side.items.map((it) => `<div data-copy="compare" style="font-size:${dark ? 40 : 36}px;font-weight:${dark ? 800 : 600};margin-top:14px;${dark ? "" : "text-decoration:line-through;text-decoration-thickness:2px"}">${esc(it)}</div>`).join("")}
</div>`;
      return page(ctx, `
<div class="photo" style="position:absolute;left:0;right:0;top:0;height:${ph}px"></div>
<div style="position:absolute;left:64px;right:64px;top:${ph + 48}px;bottom:56px;display:flex;flex-direction:column;justify-content:center;gap:30px">
  <div class="fitbox" style="height:${Math.round(H * 0.16)}px;justify-content:center">${hl(ctx, { max: 80, min: 56 })}</div>
  <div style="display:flex;gap:20px">${card(left, false)}${card(right, true)}</div>
  ${rest.length ? `<div class="badges">${badgesHTML(rest, "line")}</div>` : ""}
  ${sub(ctx, { size: 32, mt: 0 })}
</div>`);
    },
  },

  // 4) 말풍선형: 사진 위 대화 말풍선에 헤드라인
  bubble: {
    photoBox: (W, H) => ({ w: W, h: H }),
    composition: "Place the people in the lower-right two thirds of the frame. Keep the upper-left area calm and uncluttered (wall, window, sky, soft blur) for a speech bubble overlay.",
    html: (ctx) => {
      const { W, H } = ctx;
      return page(ctx, `
<div class="photo" style="position:absolute;inset:0"></div>
<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(18,14,10,.6) 0%,rgba(0,0,0,0) 26%)"></div>
<div style="position:absolute;left:64px;top:80px;width:${Math.round(W * 0.8)}px;background:#fff;border-radius:44px;padding:48px 52px;box-shadow:0 18px 50px rgba(0,0,0,.18)">
  <div class="fitbox" style="max-height:${Math.round(H * 0.3)}px">
    ${hl(ctx, { max: 84, min: 56, serif: false })}
    ${sub(ctx, { size: 34, mt: 18 })}
  </div>
  <div style="position:absolute;left:90px;bottom:-34px;width:0;height:0;border-left:22px solid transparent;border-right:34px solid transparent;border-top:40px solid #fff"></div>
</div>
<div class="badges" style="position:absolute;left:64px;right:64px;bottom:60px">${badgesHTML(ctx.badges, "light")}</div>`);
    },
  },

  // 5) 액자형: 여백 있는 사진 + 아래 세리프 헤드라인 (중앙 정렬)
  frame: {
    photoBox: (W, H) => ({ w: W - 120, h: Math.round(H * 0.52) }),
    composition: "Intimate medium close-up, the people fill the frame, faces clearly visible.",
    html: (ctx) => {
      const { W, H } = ctx;
      const ph = Math.round(H * 0.52);
      return page(ctx, `
<div class="photo" style="position:absolute;left:60px;right:60px;top:60px;height:${ph}px;border-radius:12px;box-shadow:0 14px 40px rgba(0,0,0,.12)"></div>
<div class="fitbox" style="position:absolute;left:72px;right:72px;top:${60 + ph + 44}px;bottom:170px;justify-content:center">
  ${hl(ctx, { max: 88, min: 56, align: "center" })}
  ${sub(ctx, { size: 34, align: "center" })}
</div>
<div class="badges" style="position:absolute;left:60px;right:60px;bottom:64px;justify-content:center">${badgesHTML(ctx.badges, "line")}</div>`);
    },
  },

  // 6) 뱃지 그리드형: 핵심 조건을 각각 큰 타일로 분리
  badge_grid: {
    photoBox: (W, H) => ({ w: W, h: Math.round(H * 0.46) }),
    composition: "Medium shot, people interacting and smiling, faces visible, horizontal composition.",
    html: (ctx) => {
      const { W, H } = ctx;
      const ph = Math.round(H * 0.46);
      const tiles = ctx.badges
        .map((b) => `<div style="background:var(--card);border-radius:22px;padding:28px 20px;text-align:center;font-size:38px;font-weight:800;color:var(--ink);box-shadow:0 4px 18px rgba(0,0,0,.05)"><span data-copy="badge">${esc(b)}</span></div>`)
        .join("");
      return page(ctx, `
<div class="photo" style="position:absolute;left:0;right:0;top:0;height:${ph}px"></div>
<div style="position:absolute;left:64px;right:64px;top:${ph + 44}px;bottom:60px;display:flex;flex-direction:column;gap:30px">
  <div class="fitbox" style="flex:1;justify-content:center">${hl(ctx, { max: 84, min: 56 })}${sub(ctx, { size: 34, mt: 16 })}</div>
  <div style="display:grid;grid-template-columns:repeat(${ctx.badges.length === 3 ? 3 : 2},1fr);gap:16px">${tiles}</div>
</div>`);
    },
  },
};

export const FORMATS = {
  feed: { W: 1080, H: 1350 },
  square: { W: 1080, H: 1080 },
  story: { W: 1080, H: 1920 },
};

const RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"];
export function nearestAspect(w, h) {
  const r = w / h;
  return RATIOS.reduce((best, a) => {
    const [x, y] = a.split(":").map(Number);
    return Math.abs(Math.log(x / y / r)) < Math.abs(Math.log(best.v / r)) ? { a, v: x / y } : best;
  }, { a: "1:1", v: 1 }).a;
}
