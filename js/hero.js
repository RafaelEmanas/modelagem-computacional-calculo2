/* Abertura: a superfície z = xy/√(x²+y²), com a origem destacada.
   Uma única órbita lenta da câmera ao carregar; para ao primeiro toque do usuário. */
(function () {
  "use strict";
  const L = window.Lab, C = L.C;
  const div = document.getElementById("hero-plot");
  if (!div || !window.Plotly) return;

  const rs = [], th = L.linspace(0, 2 * Math.PI, 129);
  for (let k = 0; k <= 48; k++) rs.push(2.3 * k / 48);
  const x = [], y = [], z = [];
  rs.forEach((r) => {
    x.push(th.map((t) => r * Math.cos(t)));
    y.push(th.map((t) => r * Math.sin(t)));
    z.push(th.map((t) => (r / 2) * Math.sin(2 * t))); // xy/r em polares
  });

  const ax = (t) => ({ title: { text: t }, showbackground: false, gridcolor: "rgba(20,35,59,.12)", zerolinecolor: "rgba(20,35,59,.35)", tickfont: { size: 10 }, range: t === "z" ? [-1.4, 1.4] : [-2.4, 2.4] });
  const eyeAt = (a) => ({ x: 1.9 * Math.cos(a), y: 1.9 * Math.sin(a), z: 0.95 });
  const a0 = -0.9;

  Plotly.newPlot(div, [
    { type: "surface", x, y, z, surfacecolor: z, colorscale: L.CS, cmin: -1.15, cmax: 1.15, showscale: false,
      lighting: { ambient: 0.78, diffuse: 0.55, specular: 0.12, roughness: 0.7 }, hoverinfo: "skip" },
    { type: "scatter3d", mode: "markers", x: [0], y: [0], z: [0], hoverinfo: "skip",
      marker: { size: 7, color: C.fail, symbol: "diamond", line: { color: "#fff", width: 2 } } },
  ], {
    margin: { l: 0, r: 0, t: 0, b: 0 }, paper_bgcolor: "rgba(0,0,0,0)", font: L.font, showlegend: false,
    scene: { xaxis: ax("x"), yaxis: ax("y"), zaxis: ax("z"), aspectmode: "manual", aspectratio: { x: 1, y: 1, z: 0.7 }, camera: { eye: eyeAt(a0) } },
  }, L.cfg3D);

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let stop = false, t0 = null;
  const halt = () => { stop = true; };
  ["pointerdown", "wheel", "touchstart", "keydown"].forEach((e) => div.addEventListener(e, halt, { passive: true }));
  const DURATION = 9000, SWEEP = 1.6; // rad
  function frame(ts) {
    if (stop) return;
    if (t0 === null) t0 = ts;
    const p = Math.min(1, (ts - t0) / DURATION), ease = 1 - Math.pow(1 - p, 3);
    Plotly.relayout(div, { "scene.camera.eye": eyeAt(a0 + SWEEP * ease) });
    if (p < 1) requestAnimationFrame(frame);
  }
  setTimeout(() => requestAnimationFrame(frame), 600);
})();
