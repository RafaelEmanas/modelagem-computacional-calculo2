/* Questão 1 — Domínio, imagem e curvas de nível. */
(function () {
  "use strict";
  const L = window.Lab, C = L.C;
  const root = document.getElementById("q1");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => Array.from(root.querySelectorAll(s));

  const V = 4.2;          // meia-largura das vistas 2D
  const R = 4;            // meia-largura da cena 3D
  const LN4 = Math.log(4);
  const TWO_PI = 2 * Math.PI;

  // ------------------------------------------------------------------
  // Definição matemática de cada função
  // ------------------------------------------------------------------
  const FN = {
    f1: {
      tex: "f_1(x,y)=\\sqrt{9-x^2-y^2}",
      imageTex: "\\operatorname{Im}(f_1)=[0,3]",
      z: (r2) => (r2 <= 9 ? Math.sqrt(Math.max(0, 9 - r2)) : NaN),
      zlo: -1, zhi: 4, cmin: -1, cmax: 4, cDef: 1.5, cmapLo: 0, cmapHi: 3,
      contours: [0, 0.5, 1, 1.5, 2, 2.5, 3],
      crit: [[0, "0"], [3, "3"], [4, "4"], [-1, "−1"]],
      pts: [[0, 0, "(0, 0)"], [1, 1, "(1, 1)"], [3, 0, "(3, 0)"], [3, 3, "(3, 3)"]],
      image: [{ lo: 0, hi: 3, lc: true, hc: true }],
      radii: () => {
        const r = [];
        for (let k = 0; k <= 56; k++) r.push(3 * (1 - Math.pow(1 - k / 56, 2)));
        return r;
      },
      check(a, b) {
        const s = 9 - a * a - b * b;
        const t = "9-a^2-b^2 = 9-" + L.texArg(a) + "^2-" + L.texArg(b) + "^2 = " + L.texNum(s);
        if (s >= -1e-12) {
          return { ok: true, tex: t, msg: "O radicando não é negativo, então a raiz real existe: <b>f₁(a,b) = √" + L.fmt(Math.max(s, 0)) + " ≈ " + L.fmt(Math.sqrt(Math.max(s, 0))) + "</b>." + (Math.abs(s) < 1e-9 ? " O ponto está na fronteira, que <b>pertence</b> ao domínio (√0 = 0)." : "") };
        }
        return { ok: false, tex: t, msg: "O radicando é <b>negativo</b>, e não existe raiz real de número negativo. Condição que falhou: <b>x² + y² ≤ 9</b>." };
      },
      level(c) {
        if (c < 0) return { ex: false, msg: "√ nunca é negativa, então nenhum ponto tem f₁ = " + L.fmt(c) + ". Como c &lt; 0, c está fora da imagem [0, 3]." };
        if (c > 3) return { ex: false, msg: "Resolver f₁ = c dá x² + y² = 9 − c² &lt; 0, impossível. Como c &gt; 3, c está fora da imagem [0, 3]." };
        const r2 = 9 - c * c;
        return { ex: true, r: Math.sqrt(Math.max(r2, 0)), tex: "x^2+y^2 = 9-c^2 = " + L.texNum(r2), msg: "" };
      },
    },
    f2: {
      tex: "f_2(x,y)=\\ln(4-x^2-y^2)",
      imageTex: "\\operatorname{Im}(f_2)=(-\\infty,\\ln 4]",
      z: (r2) => (r2 < 4 ? Math.log(4 - r2) : NaN),
      zlo: -5, zhi: 2, cmin: -5, cmax: 2, cDef: 0, cmapLo: -5, cmapHi: LN4,
      contours: [LN4, 1, 0.5, 0, -0.5, -1, -2, -3, -4],
      crit: [[LN4, "ln 4"], [0, "0"], [1.8, "1,8"], [-4, "−4"]],
      pts: [[0, 0, "(0, 0)"], [1, 1, "(1, 1)"], [2, 0, "(2, 0)"], [3, 0, "(3, 0)"]],
      image: [{ lo: -Infinity, hi: LN4, lc: false, hc: true }],
      radii: () => {
        const r = [];
        for (let k = 0; k < 58; k++) r.push(2 * (1 - Math.pow(1 - k / 58, 3)));
        return r;
      },
      check(a, b) {
        const s = 4 - a * a - b * b;
        const t = "4-a^2-b^2 = 4-" + L.texArg(a) + "^2-" + L.texArg(b) + "^2 = " + L.texNum(s);
        if (s > 1e-12) {
          return { ok: true, tex: t, msg: "O argumento do logaritmo é <b>positivo</b>: <b>f₂(a,b) = ln " + L.fmt(s) + " ≈ " + L.fmt(Math.log(s)) + "</b>." };
        }
        if (Math.abs(s) <= 1e-12) {
          return { ok: false, tex: t, msg: "O argumento é <b>zero</b>, e ln 0 não está definido. O ponto está na fronteira x² + y² = 4, que <b>não pertence</b> ao domínio. Condição que falhou: <b>x² + y² &lt; 4</b> (desigualdade estrita)." };
        }
        return { ok: false, tex: t, msg: "O argumento é <b>negativo</b>, e o logaritmo real só aceita números positivos. Condição que falhou: <b>x² + y² &lt; 4</b>." };
      },
      level(c) {
        const e = Math.exp(c), r2 = 4 - e;
        if (r2 < 0) return { ex: false, msg: "Resolver f₂ = c dá x² + y² = 4 − eᶜ &lt; 0, pois eᶜ &gt; 4. Como c &gt; ln 4 ≈ 1,386, c está fora da imagem (−∞, ln 4]." };
        return { ex: true, r: Math.sqrt(r2), tex: "x^2+y^2 = 4-e^c = " + L.texNum(r2), msg: "" };
      },
    },
    f3: {
      tex: "f_3(x,y)=\\dfrac{1}{x^2+y^2-1}",
      imageTex: "\\operatorname{Im}(f_3)=(-\\infty,-1]\\cup(0,\\infty)",
      z: (r2) => (Math.abs(r2 - 1) < 1e-12 ? NaN : 1 / (r2 - 1)),
      zlo: -5, zhi: 5, cmin: -5, cmax: 5, cDef: 2, cmapLo: -5, cmapHi: 5,
      contours: [-5, -3, -2, -1.5, -1, 0.1, 0.25, 0.5, 1, 2, 5],
      crit: [[-1, "−1"], [-0.5, "−0,5"], [0, "0"], [1, "1"]],
      pts: [[0, 0, "(0, 0)"], [1, 0, "(1, 0)"], [2, 0, "(2, 0)"], [0.5, 0.5, "(0,5; 0,5)"]],
      image: [{ lo: -Infinity, hi: -1, lc: false, hc: true }, { lo: 0, hi: Infinity, lc: false, hc: false }],
      radii: null, // malha própria (duas peças)
      check(a, b) {
        const s = a * a + b * b - 1;
        const t = "a^2+b^2-1 = " + L.texArg(a) + "^2+" + L.texArg(b) + "^2-1 = " + L.texNum(s);
        if (Math.abs(s) > 1e-9) {
          return { ok: true, tex: t, msg: "O denominador é <b>diferente de zero</b>: <b>f₃(a,b) = 1/" + L.texNum(s).replace("{,}", ",") + " ≈ " + L.fmt(1 / s) + "</b>. O ponto está " + (s < 0 ? "dentro" : "fora") + " da circunferência unitária." };
        }
        return { ok: false, tex: t, msg: "O denominador é <b>zero</b>: divisão por zero. O ponto está sobre a circunferência x² + y² = 1. Condição que falhou: <b>x² + y² ≠ 1</b>." };
      },
      level(c) {
        if (Math.abs(c) < 1e-12) return { ex: false, msg: "f₃ = 0 exigiria 1/(x² + y² − 1) = 0, mas o numerador é 1 e uma fração com numerador não nulo nunca vale 0. Logo c = 0 está fora da imagem." };
        const r2 = 1 + 1 / c;
        if (r2 < -1e-12) return { ex: false, msg: "Resolver f₃ = c dá x² + y² = 1 + 1/c &lt; 0 quando −1 &lt; c &lt; 0. Como x² + y² − 1 ≥ −1, o denominador nunca fica entre −1 e 0, então 1/(x² + y² − 1) nunca cai em (−1, 0): esses c estão fora da imagem." };
        return { ex: true, r: Math.sqrt(Math.max(r2, 0)), tex: "x^2+y^2 = 1+\\tfrac{1}{c} = " + L.texNum(r2), msg: "" };
      },
    },
  };
  // ------------------------------------------------------------------
  // Estado e utilidades
  // ------------------------------------------------------------------
  const state = { fn: "f1", view: "domain", a: 1, b: 1, c: FN.f1.cDef };
  const meshCache = {};

  function buildMesh(id) {
    if (meshCache[id]) return meshCache[id];
    const f = FN[id];
    let rs;
    if (id === "f3") {
      const inner = [], outer = [];
      for (let k = 0; k < 44; k++) inner.push(1 - Math.pow(1 - k / 44, 3));
      for (let k = 1; k <= 56; k++) outer.push(1 + 2.6 * Math.pow(k / 56, 3));
      rs = inner.concat([NaN], outer);
    } else rs = f.radii();
    const th = L.linspace(0, TWO_PI, 121);
    const x = [], y = [], z = [];
    rs.forEach((r) => {
      const rx = [], ry = [], rz = [];
      th.forEach((t) => {
        if (Number.isNaN(r)) { rx.push(0); ry.push(0); rz.push(NaN); return; }
        rx.push(r * Math.cos(t)); ry.push(r * Math.sin(t));
        let v = f.z(r * r);
        if (!(v >= f.zlo && v <= f.zhi)) v = NaN; // corta assíntotas
        rz.push(v);
      });
      x.push(rx); y.push(ry); z.push(rz);
    });
    return (meshCache[id] = { x, y, z });
  }

  const colorOf = (f, c) => L.colorAt((c - f.cmapLo) / (f.cmapHi - f.cmapLo));

  // ------------------------------------------------------------------
  // Vista: domínio no plano xy
  // ------------------------------------------------------------------
  function layout2D(extra) {
    return Object.assign({
      margin: { l: 38, r: 14, t: 10, b: 34 },
      paper_bgcolor: "rgba(0,0,0,0)",
      font: L.font, showlegend: false, dragmode: false, hovermode: false,
      xaxis: { range: [-V, V], constrain: "domain", fixedrange: true, title: { text: "x" }, gridcolor: "rgba(20,35,59,.08)", zerolinecolor: C.ink2, tickfont: { size: 11 } },
      yaxis: { range: [-V, V], constrain: "domain", fixedrange: true, title: { text: "y" }, scaleanchor: "x", scaleratio: 1, gridcolor: "rgba(20,35,59,.08)", zerolinecolor: C.ink2, tickfont: { size: 11 } },
    }, extra);
  }

  function pointTrace2D(chk) {
    return {
      type: "scatter", mode: "markers",
      x: [state.a], y: [state.b],
      marker: { size: 13, color: chk.ok ? C.ok : C.fail, symbol: chk.ok ? "circle" : "diamond", line: { color: "#fff", width: 2 } },
      hoverinfo: "skip",
    };
  }

  function drawDomain() {
    const f = FN[state.fn], chk = f.check(state.a, state.b);
    const traces = [];
    const open = state.fn === "f2";
    if (state.fn === "f3") {
      const c = L.circle(1);
      traces.push({ type: "scatter", mode: "lines", x: c.x, y: c.y, line: { color: C.fail, width: 3.5, dash: "dash" }, hoverinfo: "skip" });
    } else {
      const rr = state.fn === "f1" ? 3 : 2, c = L.circle(rr);
      traces.push({ type: "scatter", mode: "lines", x: c.x, y: c.y, fill: "toself", fillcolor: C.okTint, line: { color: C.ok, width: 3.5, dash: open ? "dash" : "solid" }, hoverinfo: "skip" });
    }
    traces.push(pointTrace2D(chk));
    const lay = layout2D({
      plot_bgcolor: state.fn === "f3" ? C.okTint : C.outBg,
      annotations: [{
        x: state.fn === "f3" ? 0 : 0, y: 0, xref: "x", yref: "y", showarrow: false, yshift: -22,
        text: state.fn === "f1" ? "x² + y² ≤ 9" : state.fn === "f2" ? "x² + y² < 4" : "", font: { size: 14, color: C.ok },
      }],
    });
    Plotly.react($("#q1-p-domain"), traces, lay, L.cfg2D);
    $("#q1-legend").innerHTML = legendHTML();
  }

  function legendHTML() {
    if (state.fn === "f1") return '<span class="sw"><i class="area"></i>domínio</span><span class="sw"><i></i>fronteira incluída</span><span class="sw"><i class="out"></i>fora do domínio</span>';
    if (state.fn === "f2") return '<span class="sw"><i class="area"></i>domínio</span><span class="sw"><i class="dash"></i>fronteira excluída</span><span class="sw"><i class="out"></i>fora do domínio</span>';
    return '<span class="sw"><i class="area"></i>domínio (dentro e fora do círculo)</span><span class="sw"><i class="dash fail"></i>x² + y² = 1 excluída</span>';
  }

  // ------------------------------------------------------------------
  // Vista: superfície 3D com o plano z = c
  // ------------------------------------------------------------------
  function drawSurface() {
    const f = FN[state.fn], m = buildMesh(state.fn), lv = f.level(state.c), chk = f.check(state.a, state.b);
    const traces = [{
      type: "surface", x: m.x, y: m.y, z: m.z, surfacecolor: m.z,
      colorscale: L.CS, cmin: f.cmapLo, cmax: f.cmapHi, showscale: false,
      lighting: { ambient: 0.78, diffuse: 0.55, specular: 0.12, roughness: 0.7 }, hoverinfo: "skip", connectgaps: false,
    }];
    // plano z = c
    const pc = lv.ex ? C.ok : C.fail;
    traces.push({
      type: "surface", x: [-R, R], y: [-R, R], z: [[state.c, state.c], [state.c, state.c]],
      showscale: false, opacity: 0.2, colorscale: [[0, pc], [1, pc]], hoverinfo: "skip",
    });
    // curva de nível sobre a superfície
    if (lv.ex) {
      if (lv.r < 1e-6) {
        traces.push({ type: "scatter3d", mode: "markers", x: [0], y: [0], z: [state.c], marker: { size: 6, color: C.ok }, hoverinfo: "skip" });
      } else {
        const c = L.circle(lv.r);
        traces.push({ type: "scatter3d", mode: "lines", x: c.x, y: c.y, z: c.x.map(() => state.c), line: { color: C.ok, width: 7 }, hoverinfo: "skip" });
      }
    }
    // ponto escolhido
    const v = f.z(state.a * state.a + state.b * state.b);
    if (chk.ok && v >= f.zlo && v <= f.zhi) {
      traces.push({ type: "scatter3d", mode: "markers", x: [state.a], y: [state.b], z: [v], marker: { size: 6, color: C.ok, line: { color: "#fff", width: 2 } }, hoverinfo: "skip" });
    } else if (!chk.ok) {
      traces.push({ type: "scatter3d", mode: "lines", x: [state.a, state.a], y: [state.b, state.b], z: [f.zlo, f.zhi], line: { color: C.fail, width: 5, dash: "dash" }, hoverinfo: "skip" });
    }
    const ax = (t, rng) => ({ range: rng, title: { text: t }, gridcolor: "rgba(20,35,59,.12)", zerolinecolor: "rgba(20,35,59,.35)", backgroundcolor: "rgba(0,0,0,0)", showbackground: false, tickfont: { size: 10 } });
    const lay = {
      margin: { l: 0, r: 0, t: 0, b: 0 }, paper_bgcolor: "rgba(0,0,0,0)", font: L.font, showlegend: false,
      uirevision: state.fn,
      scene: {
        xaxis: ax("x", [-R, R]), yaxis: ax("y", [-R, R]), zaxis: ax("z", [f.zlo, f.zhi]),
        aspectmode: "manual", aspectratio: { x: 1, y: 1, z: 0.8 },
        camera: { eye: L.EYE },
      },
    };
    Plotly.react($("#q1-p-surface"), traces, lay, L.cfg3D);
  }

  // ------------------------------------------------------------------
  // Vista: curvas de nível
  // ------------------------------------------------------------------
  function drawLevel() {
    const f = FN[state.fn], lv = f.level(state.c), chk = f.check(state.a, state.b);
    const traces = [];
    const rr = state.fn === "f1" ? 3 : state.fn === "f2" ? 2 : 1, bc = L.circle(rr);
    traces.push({ type: "scatter", mode: "lines", x: bc.x, y: bc.y, line: { color: C.ink2, width: 1.5, dash: "dot" }, hoverinfo: "skip" });
    f.contours.forEach((c) => {
      const l = f.level(c);
      if (!l.ex) return;
      const col = colorOf(f, c);
      if (l.r < 1e-6) traces.push({ type: "scatter", mode: "markers", x: [0], y: [0], marker: { size: 7, color: col, line: { color: C.ink, width: 1 } }, hoverinfo: "skip" });
      else { const k = L.circle(l.r); traces.push({ type: "scatter", mode: "lines", x: k.x, y: k.y, line: { color: col, width: 2 }, hoverinfo: "skip", opacity: 0.85 }); }
    });
    if (lv.ex) {
      if (lv.r < 1e-6) traces.push({ type: "scatter", mode: "markers", x: [0], y: [0], marker: { size: 13, color: C.ok, line: { color: "#fff", width: 2 } }, hoverinfo: "skip" });
      else { const k = L.circle(lv.r); traces.push({ type: "scatter", mode: "lines", x: k.x, y: k.y, line: { color: C.ok, width: 5 }, hoverinfo: "skip" }); }
    }
    traces.push({
      type: "scatter", mode: "markers", x: [state.a], y: [state.b],
      marker: { size: 9, color: "rgba(0,0,0,0)", line: { color: chk.ok ? C.ok : C.fail, width: 2 }, symbol: chk.ok ? "circle" : "diamond" }, hoverinfo: "skip",
    });
    Plotly.react($("#q1-p-level"), traces, layout2D({ plot_bgcolor: "#fff" }), L.cfg2D);
  }

  // ------------------------------------------------------------------
  // Leituras (veredictos) e faixa da imagem
  // ------------------------------------------------------------------
  function chip(ok, text) {
    return '<span class="chip ' + (ok ? "chip-ok" : "chip-fail") + '">' + text + "</span>";
  }

  function updateReads() {
    const f = FN[state.fn], chk = f.check(state.a, state.b), lv = f.level(state.c);
    const rp = $("#q1-read-point"), rl = $("#q1-read-level");
    rp.innerHTML = chip(chk.ok, chk.ok ? "(a, b) pertence ao domínio" : "(a, b) não pertence ao domínio") +
      ' <span style="color:var(--ink-2)">com (a, b) = (' + L.fmt(state.a, 2) + "; " + L.fmt(state.b, 2) + ")</span>" +
      '<div class="math"></div><div>' + chk.msg + "</div>";
    L.tex(rp.querySelector(".math"), chk.tex);
    if (lv.ex) {
      rl.innerHTML = chip(true, "Há curva de nível para c = " + L.fmt(state.c, 3)) +
        '<div class="math"></div><div>' + (lv.r < 1e-6
          ? "O nível é um <b>único ponto</b>, a origem: é o valor extremo da função."
          : "A curva é a circunferência de raio <b>" + L.fmt(lv.r) + "</b> centrada na origem.") + "</div>";
      L.tex(rl.querySelector(".math"), lv.tex);
    } else {
      rl.innerHTML = chip(false, "Sem curva de nível para c = " + L.fmt(state.c, 3)) + "<div>" + lv.msg + "</div>";
    }
  }

  function updateStrip() {
    const f = FN[state.fn], W = 600, H = 58, pad = 16;
    const X = (v) => pad + ((Math.min(f.cmax, Math.max(f.cmin, v)) - f.cmin) / (f.cmax - f.cmin)) * (W - 2 * pad);
    const y = 28;
    let s = '<svg class="strip" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Imagem da função na reta real e posição de c">';
    s += '<line x1="' + pad + '" x2="' + (W - pad) + '" y1="' + y + '" y2="' + y + '" stroke="' + C.line + '" stroke-width="2"/>';
    for (let t = Math.ceil(f.cmin); t <= f.cmax; t++) {
      s += '<line x1="' + X(t) + '" x2="' + X(t) + '" y1="' + (y - 3) + '" y2="' + (y + 3) + '" stroke="' + C.ink2 + '"/>';
      s += '<text x="' + X(t) + '" y="' + (y + 18) + '" text-anchor="middle">' + L.fmt(t, 0) + "</text>";
    }
    f.image.forEach((g) => {
      const x0 = isFinite(g.lo) ? X(g.lo) : pad - 6, x1 = isFinite(g.hi) ? X(g.hi) : W - pad + 6;
      s += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y + '" y2="' + y + '" stroke="' + C.ok + '" stroke-width="7" stroke-linecap="butt"/>';
      if (isFinite(g.lo)) s += '<circle cx="' + x0 + '" cy="' + y + '" r="5.5" fill="' + (g.lc ? C.ok : C.panel) + '" stroke="' + C.ok + '" stroke-width="2.5"/>';
      if (isFinite(g.hi)) s += '<circle cx="' + x1 + '" cy="' + y + '" r="5.5" fill="' + (g.hc ? C.ok : C.panel) + '" stroke="' + C.ok + '" stroke-width="2.5"/>';
    });
    const ok = f.level(state.c).ex, col = ok ? C.ok : C.fail, cx = X(state.c);
    s += '<line x1="' + cx + '" x2="' + cx + '" y1="4" y2="' + (y + 8) + '" stroke="' + col + '" stroke-width="2.5"/>';
    s += '<path d="M' + (cx - 5) + " 3 L" + (cx + 5) + " 3 L" + cx + ' 11 Z" fill="' + col + '"/>';
    s += "</svg>";
    $("#q1-strip").innerHTML = s;
    L.tex($("#q1-image"), f.imageTex);
  }

  // ------------------------------------------------------------------
  // Atualização geral
  // ------------------------------------------------------------------
  function show() {
    const v = state.view;
    ["domain", "surface", "level"].forEach((k) => { $("#q1-p-" + k).hidden = k !== v; });
    $$("#q1-view button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.view === v)));
    $$(".ctl[data-for]").forEach((el) => { el.hidden = !el.dataset.for.split(" ").includes(v); });
    $("#q1-read-point").hidden = !(v === "domain" || v === "surface");
    $("#q1-read-level").hidden = !(v === "level" || v === "surface");
    $("#q1-legend").hidden = v !== "domain";
    $("#q1-strip-box").hidden = v !== "level" && v !== "surface";
    $("#q1-stage").dataset.view = v;
  }

  function render() {
    show();
    updateReads();
    updateStrip();
    if (state.view === "domain") drawDomain();
    else if (state.view === "surface") drawSurface();
    else drawLevel();
    L.resizeSoon($("#q1-p-" + state.view));
    $("#q1-a").value = round2(state.a);
    $("#q1-b").value = round2(state.b);
    $("#q1-c").value = state.c;
    $("#q1-c-out").textContent = L.fmt(state.c, 3);
  }

  const round2 = (v) => Math.round(v * 100) / 100;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function setFn(id) {
    if (!FN[id] || id === state.fn) return;
    state.fn = id;
    state.c = FN[id].cDef;
    const f = FN[id], cr = $("#q1-c");
    cr.min = f.cmin; cr.max = f.cmax;
    $$("#q1-fn button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.fn === id)));
    L.tex($("#q1-formula"), f.tex);
    $("#q1-pt-presets").innerHTML = "<span>Pontos:</span>" + f.pts.map((p, i) => '<button class="preset" data-i="' + i + '">' + p[2] + "</button>").join("");
    $("#q1-c-presets").innerHTML = "<span>Valores de c:</span>" + f.crit.map((p, i) => '<button class="preset" data-i="' + i + '">' + p[1] + "</button>").join("");
  }

  function apply(o) {
    if (o.fn) setFn(o.fn);
    if (o.view) state.view = o.view;
    if (o.c !== undefined) state.c = parseFloat(o.c);
    if (o.a !== undefined) state.a = parseFloat(o.a);
    if (o.b !== undefined) state.b = parseFloat(o.b);
    render();
  }

  // ------------------------------------------------------------------
  // Eventos
  // ------------------------------------------------------------------
  $$("#q1-fn button").forEach((b) => b.addEventListener("click", () => { clearSel(); apply({ fn: b.dataset.fn }); }));
  $$("#q1-view button").forEach((b) => b.addEventListener("click", () => { clearSel(); apply({ view: b.dataset.view }); }));
  $("#q1-a").addEventListener("input", (e) => { const v = parseFloat(e.target.value); if (isFinite(v)) { state.a = clamp(v, -V, V); renderKeepInputs(); } });
  $("#q1-b").addEventListener("input", (e) => { const v = parseFloat(e.target.value); if (isFinite(v)) { state.b = clamp(v, -V, V); renderKeepInputs(); } });
  $("#q1-c").addEventListener("input", (e) => { state.c = parseFloat(e.target.value); render(); });
  $("#q1-pt-presets").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const p = FN[state.fn].pts[+b.dataset.i]; state.a = p[0]; state.b = p[1]; render();
  });
  $("#q1-c-presets").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    state.c = FN[state.fn].crit[+b.dataset.i][0]; render();
  });
  // Evita sobrescrever o campo que o usuário está digitando.
  function renderKeepInputs() {
    const ae = document.activeElement;
    const keepA = ae && ae.id === "q1-a" ? ae.value : null, keepB = ae && ae.id === "q1-b" ? ae.value : null;
    render();
    if (keepA !== null) $("#q1-a").value = keepA;
    if (keepB !== null) $("#q1-b").value = keepB;
  }
  function pick(x, y) {
    if (state.view === "surface") return;
    state.a = clamp(round2(x), -V, V); state.b = clamp(round2(y), -V, V); renderKeepInputs();
  }
  L.bindPick($("#q1-p-domain"), pick);
  L.bindPick($("#q1-p-level"), pick);
  L.observeResize($(".stage-plot"), [$("#q1-p-domain"), $("#q1-p-surface"), $("#q1-p-level")]);

  const clearSel = L.linkSelect($(".narr"), apply);

  // Início
  L.tex($("#q1-formula"), FN.f1.tex);
  (function init() {
    const f = FN.f1, cr = $("#q1-c");
    cr.min = f.cmin; cr.max = f.cmax;
    $("#q1-pt-presets").innerHTML = "<span>Pontos:</span>" + f.pts.map((p, i) => '<button class="preset" data-i="' + i + '">' + p[2] + "</button>").join("");
    $("#q1-c-presets").innerHTML = "<span>Valores de c:</span>" + f.crit.map((p, i) => '<button class="preset" data-i="' + i + '">' + p[1] + "</button>").join("");
    render();
  })();
})();
