/* Questão 4 — Plano tangente e reta normal. */
(function () {
  "use strict";
  const L = window.Lab, C = L.C;
  const root = document.getElementById("q4");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => Array.from(root.querySelectorAll(s));
  const VM = 2.2, RHO = 2 * Math.PI / 180;
  const isO = (a, b) => a * a + b * b < 1e-12;
  const AMBER = "#d17a00", BLUE = "#2b59c3";

  const FN = {
    f1: {
      tex: "f_1(x,y)=x^2+y^2", val: (x, y) => x * x + y * y,
      info: (a, b) => ({ part: [2 * a, 2 * b], diff: true,
        why: "f₁ é polinomial: as parciais 2x e 2y são contínuas em todo o plano (classe C¹), o que garante diferenciabilidade em todo ponto." }),
    },
    f2: {
      tex: "f_2(x,y)=\\sqrt{x^2+y^2}", val: (x, y) => Math.hypot(x, y),
      info: (a, b) => {
        if (isO(a, b)) return { part: null, diff: false,
          why: "Na origem f₂ₓ não existe: f₂(h,0)/h = |h|/h vale +1 para h > 0 e −1 para h < 0. Sem derivadas parciais não há candidata L, nem plano tangente. É a ponta do cone." };
        const r = Math.hypot(a, b);
        return { part: [a / r, b / r], diff: true,
          why: "Fora da origem, as parciais x/r e y/r são contínuas (classe C¹), logo f₂ é diferenciável." };
      },
    },
    f3: {
      tex: "f_3(x,y)=\\dfrac{xy}{\\sqrt{x^2+y^2}}", val: (x, y) => (x === 0 && y === 0 ? 0 : x * y / Math.hypot(x, y)),
      info: (a, b) => {
        if (isO(a, b)) return { part: [0, 0], diff: false,
          why: "Na origem as duas parciais existem e valem 0, então o plano candidato é z = 0. Mas f₃ não é diferenciável ali (Questão 3): na diagonal o quociente de erro vale ½. O plano candidato não é tangente." };
        const r3 = Math.pow(a * a + b * b, 1.5);
        return { part: [b * b * b / r3, a * a * a / r3], diff: true,
          why: "Fora da origem, as parciais y³/r³ e x³/r³ são contínuas (classe C¹), logo f₃ é diferenciável." };
      },
    },
  };
  const state = { fn: "f1", view: "tangent", a: 1, b: 0.5, u: 0 };
  const rho = () => Math.pow(10, -state.u);

  // Erro de aproximação linear: |f(a+h,b+k) − f(a,b) − fx h − fy k| / √(h²+k²), h = ρcosφ, k = ρsinφ.
  function errQ(r, phiDeg) {
    const f = FN[state.fn], inf = f.info(state.a, state.b), p = inf.part || [0, 0], ph = phiDeg * Math.PI / 180;
    const h = r * Math.cos(ph), k = r * Math.sin(ph);
    return Math.abs(f.val(state.a + h, state.b + k) - f.val(state.a, state.b) - p[0] * h - p[1] * k) / r;
  }
  const supErr = (r) => { let m = 0; for (let a = 0; a < 360; a += 5) m = Math.max(m, errQ(r, a)); return m; };

  // Seta 3D: haste + duas farpas, em uma só trace (gaps com null).
  function arrow(P, v, len, color, width) {
    const n = Math.hypot(v[0], v[1], v[2]), d = v.map((c) => c / n);
    const ref = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    let p1 = [d[1] * ref[2] - d[2] * ref[1], d[2] * ref[0] - d[0] * ref[2], d[0] * ref[1] - d[1] * ref[0]];
    const pn = Math.hypot(p1[0], p1[1], p1[2]); p1 = p1.map((c) => c / pn);
    const T = P.map((c, i) => c + d[i] * len), back = 0.2 * len, wing = 0.09 * len;
    const at = (s) => T.map((c, i) => c - d[i] * back + s * wing * p1[i]);
    const A = at(1), B = at(-1), pts = [P, T, null, T, A, null, T, B];
    return { type: "scatter3d", mode: "lines", x: pts.map((q) => (q ? q[0] : null)), y: pts.map((q) => (q ? q[1] : null)), z: pts.map((q) => (q ? q[2] : null)), line: { color: color, width: width || 6 }, hoverinfo: "skip" };
  }

  // ---------------- Vistas ----------------
  function drawTangent() {
    const f = FN[state.fn], a = state.a, b = state.b, r = rho(), inf = f.info(a, b), z0 = f.val(a, b);
    const n = 61, xs = L.linspace(a - r, a + r, n), ys = L.linspace(b - r, b + r, n);
    const z = ys.map((yy) => xs.map((xx) => f.val(xx, yy)));
    let lo = z0, hi = z0;
    z.forEach((row) => row.forEach((v) => { if (v < lo) lo = v; if (v > hi) hi = v; }));
    const p = inf.part;
    if (p) [[-r, -r], [-r, r], [r, -r], [r, r]].forEach((c) => { const v = z0 + p[0] * c[0] + p[1] * c[1]; lo = Math.min(lo, v); hi = Math.max(hi, v); });
    const mid = (lo + hi) / 2, half = Math.max((hi - lo) / 2, r / 2) * 1.08;
    const zr = [mid - half, mid + half];
    const traces = [{ type: "surface", x: xs, y: ys, z, surfacecolor: z, colorscale: L.CS, cmin: lo, cmax: hi === lo ? lo + 1 : hi, showscale: false, opacity: 0.94,
      lighting: { ambient: 0.78, diffuse: 0.55, specular: 0.1, roughness: 0.7 }, hoverinfo: "skip" }];
    const col = inf.diff ? C.ok : C.fail;
    if (p) {
      const pz = (x, y) => z0 + p[0] * (x - a) + p[1] * (y - b);
      traces.push({ type: "surface", x: [a - r, a + r], y: [b - r, b + r], z: [[pz(a - r, b - r), pz(a + r, b - r)], [pz(a - r, b + r), pz(a + r, b + r)]], showscale: false,
        opacity: 0.3, colorscale: [[0, col], [1, col]], hoverinfo: "skip" });
      const P = [a, b, z0], len = 1.0 * r, N = [-p[0], -p[1], 1], nn = Math.hypot(N[0], N[1], N[2]);
      traces.push(arrow(P, [1, 0, p[0]], len, AMBER), arrow(P, [0, 1, p[1]], len, BLUE), arrow(P, N, len, C.ink, 7));
      const tt = L.linspace(-0.9 * r / nn, 0.9 * r / nn, 2);
      traces.push({ type: "scatter3d", mode: "lines", x: tt.map((t) => a + t * N[0]), y: tt.map((t) => b + t * N[1]), z: tt.map((t) => z0 + t * N[2]), line: { color: C.ink, width: 3, dash: "dash" }, hoverinfo: "skip" });
    }
    traces.push({ type: "scatter3d", mode: "markers", x: [a], y: [b], z: [z0], marker: { size: 6, color: col, symbol: inf.diff ? "circle" : "diamond", line: { color: "#fff", width: 2 } }, hoverinfo: "skip" });
    const ax = (t, rg) => Object.assign(L.ax3(t, rg), { tickformat: ".3~g" });
    Plotly.react($("#q4-p-tangent"), traces, {
      margin: { l: 0, r: 0, t: 0, b: 0 }, paper_bgcolor: "rgba(0,0,0,0)", font: L.font, showlegend: false, uirevision: state.fn,
      scene: { xaxis: ax("x", [a - r, a + r]), yaxis: ax("y", [b - r, b + r]), zaxis: ax("z", zr), aspectmode: "cube", camera: { eye: L.EYE } },
    }, L.cfg3D);
  }

  function drawError() {
    const inf = FN[state.fn].info(state.a, state.b), rs = Array.from({ length: 120 }, (_, i) => Math.pow(10, 0.3 - (3.3 * i) / 119)), traces = [];
    for (let ph = 0; ph < 360; ph += 30) traces.push({ type: "scatter", mode: "lines", x: rs, y: rs.map((r) => Math.max(errQ(r, ph), 1e-12)), line: { color: L.hexA(C.ink2, 0.4), width: 1.2 }, hoverinfo: "skip" });
    const col = inf.diff ? C.ok : C.fail, sup = rs.map((r) => Math.max(supErr(r), 1e-12));
    traces.push({ type: "scatter", mode: "lines", x: rs, y: sup, line: { color: col, width: 4.5 }, hoverinfo: "skip" });
    const r0 = rho();
    traces.push({ type: "scatter", mode: "lines", x: [r0, r0], y: [1e-6, 10], line: { color: C.ink, width: 2, dash: "dot" }, hoverinfo: "skip" });
    Plotly.react($("#q4-p-error"), traces, L.base2D({
      xaxis: { type: "log", dtick: 1, exponentformat: "power", range: [Math.log10(2), -3], title: { text: "distância ρ ao ponto (aproximar é ir para a direita)" }, gridcolor: "rgba(20,35,59,.08)", fixedrange: true },
      yaxis: { type: "log", dtick: 1, exponentformat: "power", range: [-6, 1], title: { text: "erro E (quociente de erro)" }, gridcolor: "rgba(20,35,59,.08)", fixedrange: true },
      annotations: [{ x: -3, xref: "x", y: 0.5, yref: "y", xanchor: "right", yanchor: "top", showarrow: false, font: { size: 12, color: col },
        text: inf.diff ? "máx. sobre as direções: cai junto com ρ" : "máx. sobre as direções: não cai" }],
    }), L.cfg2D);
  }

  function drawMap() {
    const f = FN[state.fn], g = L.linspace(-VM, VM, 111), z = g.map((yy) => g.map((xx) => f.val(xx, yy)));
    const traces = [{ type: "contour", x: g, y: g, z, ncontours: 14, contours: { coloring: "lines" }, colorscale: L.CS, line: { width: 2 }, showscale: false, hoverinfo: "skip" }];
    if (state.fn !== "f1") traces.push({ type: "scatter", mode: "markers", x: [0], y: [0], marker: { size: 12, color: C.fail, symbol: "diamond", line: { color: "#fff", width: 2 } }, hoverinfo: "skip" });
    const inf = f.info(state.a, state.b);
    traces.push({ type: "scatter", mode: "markers", x: [state.a], y: [state.b], marker: { size: 13, color: inf.diff ? C.ok : C.fail, symbol: inf.diff ? "circle" : "diamond", line: { color: "#fff", width: 2 } }, hoverinfo: "skip" });
    const r0 = rho(), cc = L.circle(r0);
    traces.push({ type: "scatter", mode: "lines", x: cc.x.map((v) => state.a + v), y: cc.y.map((v) => state.b + v), line: { color: C.ink, width: 1.5, dash: "dot" }, hoverinfo: "skip" });
    Plotly.react($("#q4-p-map"), traces, L.base2D({
      xaxis: { range: [-VM, VM], constrain: "domain", title: { text: "x" }, gridcolor: "rgba(20,35,59,.08)", zerolinecolor: C.ink2, fixedrange: true },
      yaxis: { range: [-VM, VM], constrain: "domain", title: { text: "y" }, scaleanchor: "x", scaleratio: 1, gridcolor: "rgba(20,35,59,.08)", zerolinecolor: C.ink2, fixedrange: true },
    }), L.cfg2D);
  }

  // ---------------- Leituras ----------------
  const chip = (ok, t) => '<span class="chip ' + (ok ? "chip-ok" : "chip-fail") + '">' + t + "</span>";
  const vec = (v) => "\\begin{pmatrix}" + v.map((c) => L.texNum(c, 3)).join("\\\\") + "\\end{pmatrix}";

  function reads() {
    const f = FN[state.fn], a = state.a, b = state.b, inf = f.info(a, b), z0 = f.val(a, b), el = $("#q4-read-pt");
    let h = "Ponto na superfície: <b>(" + L.fmt(a, 2) + "; " + L.fmt(b, 2) + "; " + L.fmt(z0, 3) + ")</b>";
    if (inf.part) {
      const p = inf.part;
      h += '<div class="math" id="q4-m1"></div>';
    } else h += " " + chip(false, "Sem derivadas parciais: não há vetores tangentes nem normal por este caminho");
    el.innerHTML = h;
    if (inf.part) {
      const p = inf.part;
      L.tex($("#q4-m1"), "f_x=" + L.texNum(p[0], 3) + ",\\ f_y=" + L.texNum(p[1], 3) +
        "\\quad \\sigma_x=" + vec([1, 0, p[0]]) + ",\\ \\sigma_y=" + vec([0, 1, p[1]]) + ",\\ \\sigma_x\\times\\sigma_y=" + vec([-p[0], -p[1], 1]), false);
    }
    $("#q4-read-diff").innerHTML = chip(inf.diff, inf.diff ? "Diferenciável: o plano tangente existe" : (inf.part ? "Não diferenciável: o plano candidato não é tangente" : "Não diferenciável: não há plano tangente")) + " <span>" + inf.why + "</span>";
    const r = rho(), e1 = supErr(r), e2 = supErr(r / 10);
    $("#q4-read-err").innerHTML = "Erro máximo com ρ = " + L.fmt(r, 4) + ": <b>" + L.fmt(e1, 5) + "</b>; com ρ/10: <b>" + L.fmt(e2, 5) + "</b>" +
      (e1 > 1e-12 ? ' <span style="color:var(--ink-2)">(razão ' + L.fmt(e2 / e1, 3) + (inf.diff ? ": o erro encolhe junto com ρ)" : ": o erro não encolhe)") + "</span>" : "");
  }

  const VIEWS = ["tangent", "error", "map"];
  function render() {
    VIEWS.forEach((k) => { $("#q4-p-" + k).hidden = k !== state.view; });
    $$("#q4-view button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.view === state.view)));
    $$("#q4-fn button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.fn === state.fn)));
    L.tex($("#q4-formula"), FN[state.fn].tex);
    reads();
    ({ tangent: drawTangent, error: drawError, map: drawMap })[state.view]();
    L.resizeSoon($("#q4-p-" + state.view));
    const ae = document.activeElement;
    if (!ae || ae.id !== "q4-a") $("#q4-a").value = Math.round(state.a * 100) / 100;
    if (!ae || ae.id !== "q4-b") $("#q4-b").value = Math.round(state.b * 100) / 100;
    $("#q4-u").value = state.u; $("#q4-u-out").textContent = "ρ = " + L.fmt(rho(), 3);
    $("#q4-legend-vec").hidden = state.view !== "tangent";
  }
  const clamp = (v) => Math.min(VM, Math.max(-VM, v));
  function apply(o) {
    if (o.fn && FN[o.fn]) state.fn = o.fn;
    if (o.view) state.view = o.view;
    if (o.a !== undefined) state.a = parseFloat(o.a);
    if (o.b !== undefined) state.b = parseFloat(o.b);
    if (o.u !== undefined) state.u = parseFloat(o.u);
    render();
  }
  const clear = L.linkSelect($("#q4 .narr"), apply);
  $$("#q4-fn button").forEach((b) => b.addEventListener("click", () => { clear(); apply({ fn: b.dataset.fn }); }));
  $$("#q4-view button").forEach((b) => b.addEventListener("click", () => { clear(); apply({ view: b.dataset.view }); }));
  $("#q4-a").addEventListener("input", (e) => { const v = parseFloat(e.target.value); if (isFinite(v)) { state.a = clamp(v); render(); } });
  $("#q4-b").addEventListener("input", (e) => { const v = parseFloat(e.target.value); if (isFinite(v)) { state.b = clamp(v); render(); } });
  $("#q4-u").addEventListener("input", (e) => { state.u = parseFloat(e.target.value); render(); });
  $("#q4-pt-presets").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { state.a = parseFloat(b.dataset.a); state.b = parseFloat(b.dataset.b); render(); } });
  L.bindPick($("#q4-p-map"), (x, y) => { state.a = clamp(Math.round(x * 20) / 20); state.b = clamp(Math.round(y * 20) / 20); render(); });
  L.observeResize($("#q4 .stage-plot"), VIEWS.map((k) => $("#q4-p-" + k)));
  render();
})();
