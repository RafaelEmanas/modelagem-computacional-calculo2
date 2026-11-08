/* Questão 2 — Limites e continuidade na origem. */
(function () {
  "use strict";
  const L = window.Lab, C = L.C;
  const root = document.getElementById("q2");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => Array.from(root.querySelectorAll(s));
  const RM = 1.45;

  // L = valor do limite em (0,0), ou null se não existir. v0 = valor dado no enunciado para f(0,0).
  const FN = {
    f1: { tex: "f_1(x,y)=\\dfrac{x^2y}{x^2+y^2}", f: (x, y) => x * x * y / (x * x + y * y), L: 0, v0: 0, zr: [-0.6, 0.6],
          why: "Vale |f₁| ≤ |y|, porque x²/(x²+y²) ≤ 1. Como |y| → 0, o teorema do confronto dá lim f₁ = 0." },
    f2: { tex: "f_2(x,y)=\\dfrac{xy}{x^2+y^2}", f: (x, y) => x * y / (x * x + y * y), L: null, v0: 0, zr: [-0.6, 0.6],
          why: "Ao longo de y = mx, com x ≠ 0, f₂ = m/(1+m²): vale 0 para m = 0 e ½ para m = 1. Dois valores diferentes: não há limite." },
    f3: { tex: "f_3(x,y)=\\dfrac{x^2+y^2}{\\sqrt{x^2+y^2+1}+1}", f: (x, y) => { const q = x * x + y * y; return q / (Math.sqrt(q + 1) + 1); }, L: 0, v0: 2, zr: [-0.1, 0.9],
          why: "Multiplicando por √(x²+y²+1) − 1 se vê que f₃ = √(x²+y²+1) − 1 fora da origem. Essa expressão é contínua e vale 0 na origem, então lim f₃ = 0." },
    f4: { tex: "f_4(x,y)=\\dfrac{x^2y}{x^4+y^2}\\;\\text{(extra)}", f: (x, y) => x * x * y / (x ** 4 + y * y), L: null, v0: 0, zr: [-0.6, 0.6],
          why: "Em toda reta y = mx o valor tende a 0, mas ao longo da parábola y = x² vale ½ constante. Retas não bastam." },
  };

  const mLabel = (m) => "y = " + (m === 1 ? "" : m === -1 ? "−" : L.fmt(m, 2)) + "x";
  const PATHS = [
    { id: "ax", color: "#2b59c3", label: () => "eixo x", pt: (s) => [s, 0] },
    { id: "ay", color: "#d17a00", label: () => "eixo y", pt: (s) => [0, s] },
    { id: "ln", color: "#7a4cc2", label: () => mLabel(state.m), pt: (s) => { const p = Math.atan(state.m); return [s * Math.cos(p), s * Math.sin(p)]; } },
    { id: "p1", color: "#6b7a1f", label: () => "y = x²", pt: (s) => [s, s * s] },
    { id: "p2", color: "#9a5b3c", label: () => "x = y²", pt: (s) => [s * s, s] },
    { id: "cu", color: "#3a3f4b", label: () => "y = x³", pt: (s) => [s, s * s * s] },
    { id: "sp", color: "#b8860b", label: () => "espiral", pt: (s) => { const t = 5 * Math.log(1 / s); return [s * Math.cos(t), s * Math.sin(t)]; } },
  ];
  const P = Object.fromEntries(PATHS.map((p) => [p.id, p]));

  const state = { fn: "f1", view: "surface", paths: new Set(["ax", "ay", "ln", "p1"]), m: 1, u: 1, v0: 0 };
  const N = 400;
  const SG = Array.from({ length: N }, (_, i) => Math.pow(10, (-3 * i) / (N - 1))); // s de 1 até 0,001
  const cache = {};

  const sNow = () => Math.pow(10, -state.u);
  const act = () => PATHS.filter((p) => state.paths.has(p.id));
  const dist = (xy) => Math.hypot(xy[0], xy[1]);

  function mesh(id) {
    if (cache[id]) return cache[id];
    const f = FN[id].f;
    const x = [], y = [], z = [];
    if (id === "f4") {
      const u = L.linspace(-1, 1, 201), g = u.map((t) => Math.sign(t) * t * t * RM);
      g.forEach((yy) => { x.push(g.slice()); y.push(g.map(() => yy)); z.push(g.map((xx) => (xx === 0 && yy === 0 ? NaN : f(xx, yy)))); });
    } else {
      const th = L.linspace(0, 2 * Math.PI, 145);
      for (let k = 0; k < 64; k++) {
        const r = 1e-4 + (RM - 1e-4) * Math.pow(k / 63, 1.4);
        x.push(th.map((t) => r * Math.cos(t))); y.push(th.map((t) => r * Math.sin(t))); z.push(th.map((t) => f(r * Math.cos(t), r * Math.sin(t))));
      }
    }
    return (cache[id] = { x, y, z });
  }

  function contInfo() {
    const f = FN[state.fn];
    if (f.L !== null) {
      if (Math.abs(state.v0 - f.L) < 1e-9) return { ok: true, title: "Contínua em (0, 0)", msg: "O limite (" + L.fmt(f.L) + ") existe, f(0,0) = " + L.fmt(state.v0) + " existe e os dois coincidem." };
      return { ok: false, title: "Descontínua em (0, 0)", msg: "O limite vale " + L.fmt(f.L) + ", mas f(0,0) = " + L.fmt(state.v0) + ". É uma descontinuidade <b>removível</b>: redefinir f(0,0) = " + L.fmt(f.L) + " a conserta." };
    }
    return { ok: false, title: "Descontínua em (0, 0)", msg: "O limite <b>não existe</b>, então nenhum valor de f(0,0) pode igualá-lo. Mudar f(0,0) não conserta." };
  }

  // ---------------- Vistas ----------------
  function zRange() {
    const f = FN[state.fn];
    return [Math.min(f.zr[0], state.v0 - 0.15), Math.max(f.zr[1], state.v0 + 0.15)];
  }

  function originMarkers3D(traces, zr) {
    const f = FN[state.fn], c = contInfo();
    if (f.L !== null && Math.abs(f.L - state.v0) > 1e-9) {
      traces.push({ type: "scatter3d", mode: "lines", x: [0, 0], y: [0, 0], z: [f.L, state.v0], line: { color: C.fail, width: 4, dash: "dash" }, hoverinfo: "skip" });
    }
    if (f.L !== null) traces.push({ type: "scatter3d", mode: "markers", x: [0], y: [0], z: [f.L], marker: { size: 7, color: "#fff", symbol: "circle", line: { color: C.ink, width: 3 } }, hoverinfo: "skip" });
    traces.push({ type: "scatter3d", mode: "markers", x: [0], y: [0], z: [state.v0], marker: { size: 7, color: c.ok ? C.ok : C.fail, symbol: c.ok ? "circle" : "diamond", line: { color: "#fff", width: 2 } }, hoverinfo: "skip" });
  }

  function drawSurface() {
    const f = FN[state.fn], m = mesh(state.fn), zr = zRange(), off = (zr[1] - zr[0]) * 0.006;
    const traces = [{ type: "surface", x: m.x, y: m.y, z: m.z, surfacecolor: m.z, colorscale: L.CS, cmin: f.zr[0], cmax: f.zr[1], showscale: false, opacity: 0.93,
      lighting: { ambient: 0.78, diffuse: 0.55, specular: 0.1, roughness: 0.7 }, hoverinfo: "skip" }];
    act().forEach((p) => {
      const pts = SG.map(p.pt), zs = pts.map((q) => f.f(q[0], q[1]) + off);
      traces.push({ type: "scatter3d", mode: "lines", x: pts.map((q) => q[0]), y: pts.map((q) => q[1]), z: zs, line: { color: p.color, width: 5 }, hoverinfo: "skip" });
      const q = p.pt(sNow());
      traces.push({ type: "scatter3d", mode: "markers", x: [q[0]], y: [q[1]], z: [f.f(q[0], q[1]) + off], marker: { size: 5, color: p.color, line: { color: "#fff", width: 2 } }, hoverinfo: "skip" });
    });
    originMarkers3D(traces, zr);
    Plotly.react($("#q2-p-surface"), traces, {
      margin: { l: 0, r: 0, t: 0, b: 0 }, paper_bgcolor: "rgba(0,0,0,0)", font: L.font, showlegend: false, uirevision: state.fn,
      scene: { xaxis: L.ax3("x", [-1.5, 1.5]), yaxis: L.ax3("y", [-1.5, 1.5]), zaxis: L.ax3("z", zr), aspectmode: "manual", aspectratio: { x: 1, y: 1, z: 0.75 }, camera: { eye: L.EYE } },
    }, L.cfg3D);
  }

  function drawPlane() {
    const traces = [];
    act().forEach((p) => {
      const pts = SG.map(p.pt);
      traces.push({ type: "scatter", mode: "lines", x: pts.map((q) => q[0]), y: pts.map((q) => q[1]), line: { color: p.color, width: 3 }, hoverinfo: "skip" });
      const q = p.pt(sNow());
      traces.push({ type: "scatter", mode: "markers", x: [q[0]], y: [q[1]], marker: { size: 10, color: p.color, line: { color: "#fff", width: 2 } }, hoverinfo: "skip" });
    });
    const c = contInfo();
    traces.push({ type: "scatter", mode: "markers", x: [0], y: [0], marker: { size: 12, color: c.ok ? C.ok : C.fail, symbol: c.ok ? "circle" : "diamond", line: { color: "#fff", width: 2 } }, hoverinfo: "skip" });
    const lay = L.base2D({
      xaxis: { range: [-RM, RM], constrain: "domain", title: { text: "x" }, gridcolor: "rgba(20,35,59,.08)", zerolinecolor: C.ink2, fixedrange: true },
      yaxis: { range: [-RM, RM], constrain: "domain", title: { text: "y" }, scaleanchor: "x", scaleratio: 1, gridcolor: "rgba(20,35,59,.08)", zerolinecolor: C.ink2, fixedrange: true },
    });
    Plotly.react($("#q2-p-plane"), traces, lay, L.cfg2D);
  }

  function drawValues() {
    const f = FN[state.fn], zr = zRange(), traces = [];
    const XR = [1.7, 1e-3];
    act().forEach((p) => {
      const pts = SG.map(p.pt);
      traces.push({ type: "scatter", mode: "lines", x: pts.map(dist), y: pts.map((q) => f.f(q[0], q[1])), line: { color: p.color, width: 2.5 }, hoverinfo: "skip" });
      const q = p.pt(sNow());
      traces.push({ type: "scatter", mode: "markers", x: [dist(q)], y: [f.f(q[0], q[1])], marker: { size: 10, color: p.color, line: { color: "#fff", width: 2 } }, hoverinfo: "skip" });
    });
    if (f.L !== null) traces.push({ type: "scatter", mode: "lines", x: XR, y: [f.L, f.L], line: { color: C.ok, width: 2, dash: "dot" }, hoverinfo: "skip" });
    const c = contInfo();
    traces.push({ type: "scatter", mode: "lines", x: XR, y: [state.v0, state.v0], line: { color: c.ok ? C.ok : C.fail, width: 2.5, dash: "dash" }, hoverinfo: "skip" });
    const ann = [{ x: Math.log10(XR[1]), xref: "x", y: state.v0, yref: "y", text: "f(0,0)", showarrow: false, xanchor: "right", yanchor: "bottom", font: { size: 12, color: c.ok ? C.ok : C.fail } }];
    if (f.L !== null && Math.abs(f.L - state.v0) > 1e-9) ann.push({ x: Math.log10(XR[1]), xref: "x", y: f.L, yref: "y", text: "limite", showarrow: false, xanchor: "right", yanchor: "top", font: { size: 12, color: C.ok } });
    Plotly.react($("#q2-p-values"), traces, L.base2D({
      xaxis: { type: "log", dtick: 1, exponentformat: "power", range: [Math.log10(XR[0]), Math.log10(XR[1])], title: { text: "distância à origem (escala log; aproximar é ir para a direita)" }, gridcolor: "rgba(20,35,59,.08)", fixedrange: true },
      yaxis: { range: zr, title: { text: "valor de f" }, gridcolor: "rgba(20,35,59,.08)", zerolinecolor: C.ink2, fixedrange: true },
      annotations: ann,
    }), L.cfg2D);
  }

  // ---------------- Leituras ----------------
  const chip = (ok, t) => '<span class="chip ' + (ok ? "chip-ok" : "chip-fail") + '">' + t + "</span>";

  function reads() {
    const f = FN[state.fn], c = contInfo();
    $("#q2-read-limit").innerHTML = chip(f.L !== null, f.L !== null ? "O limite existe e vale " + L.fmt(f.L) : "O limite não existe") + " <span>" + f.why + "</span>";
    $("#q2-read-cont").innerHTML = chip(c.ok, c.title) + " <span>" + c.msg + "</span>";
    const s = sNow(), a = act();
    let html = "";
    const vals = a.map((p) => { const q = p.pt(s); return f.f(q[0], q[1]); });
    a.forEach((p, i) => { html += '<span><i style="background:' + p.color + '"></i>' + p.label() + ": <b>" + L.fmt(vals[i], 4) + "</b></span>"; });
    const spread = vals.length > 1 ? Math.max.apply(null, vals) - Math.min.apply(null, vals) : 0;
    $("#q2-read-vals").innerHTML = (a.length ? '<div>Valores com s = ' + L.fmt(s, 4) + ' <em style="color:var(--ink-2)">(evidência numérica, não prova)</em>' + (a.length > 1 ? "; maior diferença entre trajetórias: <b>" + L.fmt(spread, 4) + "</b>" : "") + '</div><div class="vals">' + html + "</div>"
      : "Marque ao menos uma trajetória.");
  }

  function show() {
    ["surface", "plane", "values"].forEach((k) => { $("#q2-p-" + k).hidden = k !== state.view; });
    $$("#q2-view button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.view === state.view)));
    $$("#q2-fn button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.fn === state.fn)));
    $$("#q2-paths input").forEach((i) => { i.checked = state.paths.has(i.dataset.p); });
    $("#q2-row-m").hidden = !state.paths.has("ln");
    $("#q2-row-v0").hidden = state.view === "plane";
    const mm = PATHS[2]; $("#q2-paths [data-p=ln]").parentElement.querySelector("b").textContent = mm.label();
  }

  function render() {
    $("#q2-stage").dataset.view = state.view;
    show(); reads();
    const v = state.view;
    if (v === "surface") drawSurface(); else if (v === "plane") drawPlane(); else drawValues();
    L.resizeSoon($("#q2-p-" + v));
    $("#q2-u").value = state.u; $("#q2-u-out").textContent = "s = " + L.fmt(sNow(), 4);
    $("#q2-m").value = state.m; $("#q2-m-out").textContent = L.fmt(state.m, 2);
    $("#q2-v0").value = state.v0; $("#q2-v0-out").textContent = L.fmt(state.v0, 2);
  }

  function setFn(id) {
    if (!FN[id] || id === state.fn) return;
    state.fn = id; state.v0 = FN[id].v0;
    L.tex($("#q2-formula"), FN[id].tex);
    $("#q2-v0-presets").innerHTML = "<span>Valores:</span>" +
      '<button class="preset" data-v="' + FN[id].v0 + '">dado (' + L.fmt(FN[id].v0, 0) + ")</button>" +
      (FN[id].L !== null ? '<button class="preset" data-v="' + FN[id].L + '">igual ao limite (' + L.fmt(FN[id].L, 0) + ")</button>" : "") +
      '<button class="preset" data-v="1">1</button><button class="preset" data-v="-0.5">−0,5</button>';
  }

  function apply(o) {
    if (o.fn) setFn(o.fn);
    if (o.view) state.view = o.view;
    if (o.paths) state.paths = new Set(o.paths === "all" ? PATHS.map((p) => p.id) : o.paths.split(",").filter((x) => P[x]));
    if (o.m !== undefined) state.m = parseFloat(o.m);
    if (o.u !== undefined) state.u = parseFloat(o.u);
    if (o.v0 !== undefined) state.v0 = parseFloat(o.v0);
    render();
  }

  // ---------------- Controles ----------------
  $("#q2-paths").innerHTML = PATHS.map((p) => '<label class="pchip" style="--sw:' + p.color + '"><input type="checkbox" data-p="' + p.id + '"><i></i><b style="font-weight:500">' + p.label() + "</b></label>").join("");
  $("#q2-paths").addEventListener("change", (e) => {
    const id = e.target.dataset.p; if (!id) return;
    e.target.checked ? state.paths.add(id) : state.paths.delete(id); clear(); render();
  });
  $$("#q2-fn button").forEach((b) => b.addEventListener("click", () => { clear(); apply({ fn: b.dataset.fn }); }));
  $$("#q2-view button").forEach((b) => b.addEventListener("click", () => { clear(); apply({ view: b.dataset.view }); }));
  $("#q2-u").addEventListener("input", (e) => { state.u = parseFloat(e.target.value); render(); });
  $("#q2-m").addEventListener("input", (e) => { state.m = parseFloat(e.target.value); render(); });
  $("#q2-v0").addEventListener("input", (e) => { state.v0 = parseFloat(e.target.value); render(); });
  $("#q2-v0-presets").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { state.v0 = parseFloat(b.dataset.v); render(); } });
  L.observeResize($("#q2 .stage-plot"), [$("#q2-p-surface"), $("#q2-p-plane"), $("#q2-p-values")]);
  const clear = L.linkSelect($("#q2 .narr"), apply);

  state.fn = "f2"; setFn("f1"); // força a montagem do estado inicial de f1
  L.tex($("#q2-formula"), FN.f1.tex);
  render();
})();
