/* Questão 3 — Derivadas parciais, diferenciabilidade e continuidade na origem. */
(function () {
  "use strict";
  const L = window.Lab, C = L.C;
  const root = document.getElementById("q3");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => Array.from(root.querySelectorAll(s));
  const RM = 1.4, DEG = Math.PI / 180;

  const FN = {
    f: { tex: "f(x,y)=\\dfrac{xy}{\\sqrt{x^2+y^2}}", val: (x, y) => x * y / Math.hypot(x, y), cont: true, zr: [-0.8, 0.8],
         contWhy: "|f| = r|sen 2θ|/2 ≤ r/2, que tende a 0 = f(0,0).",
         diffWhy: "O quociente de erro é ½ sen 2θ, que não depende de r: na diagonal (θ = 45°) vale ½ e não tende a 0." },
    g: { tex: "g(x,y)=\\dfrac{xy}{x^2+y^2}", val: (x, y) => x * y / (x * x + y * y), cont: false, zr: [-0.7, 0.7],
         contWhy: "g = ½ sen 2θ não depende de r: vale ½ na diagonal e 0 nos eixos. O limite não existe (Questão 2).",
         diffWhy: "Se g fosse diferenciável seria contínua. Não é. Ao medir o quociente de erro, ele vale ½ sen 2θ / r e explode." },
  };
  const state = { fn: "f", view: "surface", th: 45, u: 1 };
  const rNow = () => Math.pow(10, -state.u);
  const cache = {};

  // Quociente de erro da definição, com L ≡ 0 e f(0,0) = 0: [f(h,k) − f(0,0) − L(h,k)] / √(h²+k²).
  const E = (id, r, thDeg) => FN[id].val(r * Math.cos(thDeg * DEG), r * Math.sin(thDeg * DEG)) / r;

  function mesh(id) {
    if (cache[id]) return cache[id];
    const x = [], y = [], z = [], th = L.linspace(0, 2 * Math.PI, 145);
    for (let k = 0; k < 60; k++) {
      const r = 1e-4 + (RM - 1e-4) * Math.pow(k / 59, 1.3);
      x.push(th.map((t) => r * Math.cos(t))); y.push(th.map((t) => r * Math.sin(t))); z.push(th.map((t) => FN[id].val(r * Math.cos(t), r * Math.sin(t))));
    }
    return (cache[id] = { x, y, z });
  }

  const VIOLET = "#7a4cc2", AMBER = "#d17a00", BLUE = "#2b59c3";

  function drawSurface() {
    const f = FN[state.fn], m = mesh(state.fn), r = rNow(), t = state.th * DEG;
    const traces = [{ type: "surface", x: m.x, y: m.y, z: m.z, surfacecolor: m.z, colorscale: L.CS, cmin: f.zr[0], cmax: f.zr[1], showscale: false, opacity: 0.92,
      lighting: { ambient: 0.78, diffuse: 0.55, specular: 0.1, roughness: 0.7 }, hoverinfo: "skip" }];
    // plano z = L(h,k) = 0 (candidata)
    traces.push({ type: "surface", x: [-RM, RM], y: [-RM, RM], z: [[0, 0], [0, 0]], showscale: false, opacity: 0.16, colorscale: [[0, C.fail], [1, C.fail]], hoverinfo: "skip" });
    // cortes y = 0 e x = 0
    const ts = L.linspace(-RM, RM, 120);
    traces.push({ type: "scatter3d", mode: "lines", x: ts, y: ts.map(() => 0), z: ts.map((s) => (s === 0 ? 0 : f.val(s, 0)) + 0.01), line: { color: AMBER, width: 6 }, hoverinfo: "skip" });
    traces.push({ type: "scatter3d", mode: "lines", x: ts.map(() => 0), y: ts, z: ts.map((s) => (s === 0 ? 0 : f.val(0, s)) + 0.01), line: { color: VIOLET, width: 6 }, hoverinfo: "skip" });
    // direção θ
    const ss = L.linspace(1e-4, RM, 120).concat();
    traces.push({ type: "scatter3d", mode: "lines", x: ss.map((s) => s * Math.cos(t)), y: ss.map((s) => s * Math.sin(t)), z: ss.map((s) => f.val(s * Math.cos(t), s * Math.sin(t)) + 0.01), line: { color: BLUE, width: 6 }, hoverinfo: "skip" });
    traces.push({ type: "scatter3d", mode: "markers", x: [r * Math.cos(t)], y: [r * Math.sin(t)], z: [f.val(r * Math.cos(t), r * Math.sin(t)) + 0.01], marker: { size: 5, color: BLUE, line: { color: "#fff", width: 2 } }, hoverinfo: "skip" });
    traces.push({ type: "scatter3d", mode: "markers", x: [0], y: [0], z: [0], marker: { size: 7, color: C.fail, symbol: "diamond", line: { color: "#fff", width: 2 } }, hoverinfo: "skip" });
    Plotly.react($("#q3-p-surface"), traces, {
      margin: { l: 0, r: 0, t: 0, b: 0 }, paper_bgcolor: "rgba(0,0,0,0)", font: L.font, showlegend: false, uirevision: state.fn,
      scene: { xaxis: L.ax3("x", [-1.5, 1.5]), yaxis: L.ax3("y", [-1.5, 1.5]), zaxis: L.ax3("z", [-1, 1]), aspectmode: "manual", aspectratio: { x: 1, y: 1, z: 0.7 }, camera: { eye: L.EYE } },
    }, L.cfg3D);
  }

  function drawCuts() {
    const f = FN[state.fn], ts = L.linspace(-1, 1, 801).filter((v) => v !== 0), t = state.th * DEG;
    const cut = (c, s) => f.val(s * c[0], s * c[1]);
    const traces = [
      { type: "scatter", mode: "lines", x: ts, y: ts.map((s) => cut([1, 0], s)), line: { color: AMBER, width: 6 }, hoverinfo: "skip" },
      { type: "scatter", mode: "lines", x: ts, y: ts.map((s) => cut([0, 1], s)), line: { color: VIOLET, width: 3, dash: "dash" }, hoverinfo: "skip" },
      { type: "scatter", mode: "lines", x: [-1, 1], y: [0, 0], line: { color: C.fail, width: 1.5, dash: "dot" }, hoverinfo: "skip" },
      { type: "scatter", mode: "lines", x: ts.filter((s) => s < 0), y: ts.filter((s) => s < 0).map((s) => cut([Math.cos(t), Math.sin(t)], s)), line: { color: BLUE, width: 3.5 }, hoverinfo: "skip" },
      { type: "scatter", mode: "lines", x: ts.filter((s) => s > 0), y: ts.filter((s) => s > 0).map((s) => cut([Math.cos(t), Math.sin(t)], s)), line: { color: BLUE, width: 3.5 }, hoverinfo: "skip" },
      { type: "scatter", mode: "markers", x: [0], y: [0], marker: { size: 11, color: C.fail, symbol: "diamond", line: { color: "#fff", width: 2 } }, hoverinfo: "skip" },
    ];
    Plotly.react($("#q3-p-cuts"), traces, L.base2D({
      xaxis: { range: [-1, 1], title: { text: "t (posição ao longo do corte)" }, gridcolor: "rgba(20,35,59,.08)", zerolinecolor: C.ink2, fixedrange: true },
      yaxis: { range: [-0.75, 0.75], title: { text: "z" }, gridcolor: "rgba(20,35,59,.08)", zerolinecolor: C.ink2, fixedrange: true },
    }), L.cfg2D);
  }

  function drawAngle() {
    const th = L.linspace(0, 360, 721), traces = [];
    [1, 0.1, 0.01, 0.001].forEach((r) => traces.push({ type: "scatter", mode: "lines", x: th, y: th.map((a) => E(state.fn, r, a)), line: { color: L.hexA(C.ink2, 0.45), width: 1.5 }, hoverinfo: "skip" }));
    traces.push({ type: "scatter", mode: "lines", x: th, y: th.map((a) => E(state.fn, rNow(), a)), line: { color: C.ink, width: 4 }, hoverinfo: "skip" });
    traces.push({ type: "scatter", mode: "lines", x: [0, 360], y: [0, 0], line: { color: C.ok, width: 2.5, dash: "dash" }, hoverinfo: "skip" });
    traces.push({ type: "scatter", mode: "markers", x: [state.th], y: [E(state.fn, rNow(), state.th)], marker: { size: 11, color: BLUE, line: { color: "#fff", width: 2 } }, hoverinfo: "skip" });
    Plotly.react($("#q3-p-angle"), traces, L.base2D({
      xaxis: { range: [0, 360], tickvals: [0, 45, 90, 135, 180, 225, 270, 315, 360], title: { text: "direção de aproximação θ (graus)" }, gridcolor: "rgba(20,35,59,.08)", fixedrange: true },
      yaxis: { range: [-2, 2], title: { text: "quociente de erro E" }, gridcolor: "rgba(20,35,59,.08)", zerolinecolor: C.ink2, fixedrange: true },
      annotations: [{ x: 357, y: 1.9, xref: "x", yref: "y", text: "linha tracejada: o que a diferenciabilidade exige (E → 0)", showarrow: false, xanchor: "right", yanchor: "top", font: { size: 12, color: C.ok } }],
    }), L.cfg2D);
  }

  function drawApproach() {
    const rs = Array.from({ length: 200 }, (_, i) => Math.pow(10, 0.3 - (3.3 * i) / 199)), angs = L.linspace(0, 180, 181);
    const sup = rs.map((r) => Math.max.apply(null, angs.map((a) => Math.abs(E(state.fn, r, a)))));
    const traces = [
      { type: "scatter", mode: "lines", x: rs, y: sup, line: { color: C.ink, width: 4 }, hoverinfo: "skip" },
      { type: "scatter", mode: "lines", x: rs, y: rs.map((r) => Math.max(Math.abs(E(state.fn, r, state.th)), 1e-9)), line: { color: BLUE, width: 3 }, hoverinfo: "skip" },
      { type: "scatter", mode: "markers", x: [rNow()], y: [Math.max(Math.abs(E(state.fn, rNow(), state.th)), 1e-9)], marker: { size: 11, color: BLUE, line: { color: "#fff", width: 2 } }, hoverinfo: "skip" },
      { type: "scatter", mode: "lines", x: [2, 1e-3], y: [1e-3, 1e-3], line: { color: C.ok, width: 2.5, dash: "dash" }, hoverinfo: "skip" },
    ];
    Plotly.react($("#q3-p-approach"), traces, L.base2D({
      xaxis: { type: "log", dtick: 1, exponentformat: "power", range: [Math.log10(2), -3], title: { text: "distância r à origem (aproximar é ir para a direita)" }, gridcolor: "rgba(20,35,59,.08)", fixedrange: true },
      yaxis: { type: "log", dtick: 1, exponentformat: "power", range: [-3, 3], title: { text: "|E|" }, gridcolor: "rgba(20,35,59,.08)", fixedrange: true },
      annotations: [{ x: -3, xref: "x", y: -3, yref: "y", text: "E → 0 ficaria aqui", showarrow: false, xanchor: "right", yanchor: "bottom", font: { size: 12, color: C.ok } }],
    }), L.cfg2D);
  }

  const chip = (ok, t) => '<span class="chip ' + (ok ? "chip-ok" : "chip-fail") + '">' + t + "</span>";
  function reads() {
    const f = FN[state.fn], r = rNow(), e = E(state.fn, r, state.th);
    const q = [f.val(r, 0) / r, f.val(-r, 0) / -r, f.val(0, r) / r, f.val(0, -r) / -r].map((v) => L.fmt(v, 4));
    $("#q3-read-part").innerHTML = chip(true, "As duas derivadas parciais existem e valem 0 em (0, 0)") +
      " <span>Quocientes com h = ±" + L.fmt(r, 4) + " nos dois eixos: " + q.join("; ") + ".</span>";
    $("#q3-read-err").innerHTML = "Direção θ = " + state.th + "°, r = " + L.fmt(r, 4) + ": <b>E = " + L.fmt(e, 4) + "</b>" +
      ' <span style="color:var(--ink-2)">(para ser diferenciável, E teria de tender a 0 ao diminuir r)</span>';
    $("#q3-read-ver").innerHTML = chip(f.cont, f.cont ? "Contínua em (0,0)" : "Não é contínua em (0,0)") + " <span>" + f.contWhy + "</span><br>" +
      chip(false, "Não é diferenciável em (0,0)") + " <span>" + f.diffWhy + "</span>";
  }

  const VIEWS = ["surface", "cuts", "angle", "approach"];
  function render() {
    VIEWS.forEach((k) => { $("#q3-p-" + k).hidden = k !== state.view; });
    $$("#q3-view button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.view === state.view)));
    $$("#q3-fn button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.fn === state.fn)));
    L.tex($("#q3-formula"), FN[state.fn].tex);
    $("#q3-legend").hidden = !(state.view === "surface" || state.view === "cuts");
    reads();
    ({ surface: drawSurface, cuts: drawCuts, angle: drawAngle, approach: drawApproach })[state.view]();
    L.resizeSoon($("#q3-p-" + state.view));
    $("#q3-th").value = state.th; $("#q3-th-out").textContent = state.th + "°";
    $("#q3-u").value = state.u; $("#q3-u-out").textContent = "r = " + L.fmt(rNow(), 4);
  }
  function apply(o) {
    if (o.fn && FN[o.fn]) state.fn = o.fn;
    if (o.view) state.view = o.view;
    if (o.th !== undefined) state.th = parseFloat(o.th);
    if (o.u !== undefined) state.u = parseFloat(o.u);
    render();
  }
  const clear = L.linkSelect($("#q3 .narr"), apply);
  $$("#q3-fn button").forEach((b) => b.addEventListener("click", () => { clear(); apply({ fn: b.dataset.fn }); }));
  $$("#q3-view button").forEach((b) => b.addEventListener("click", () => { clear(); apply({ view: b.dataset.view }); }));
  $("#q3-th").addEventListener("input", (e) => { state.th = parseInt(e.target.value, 10); render(); });
  $("#q3-u").addEventListener("input", (e) => { state.u = parseFloat(e.target.value); render(); });
  $("#q3-th-presets").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { state.th = parseInt(b.dataset.v, 10); render(); } });
  L.observeResize($("#q3 .stage-plot"), VIEWS.map((k) => $("#q3-p-" + k)));
  render();
})();
