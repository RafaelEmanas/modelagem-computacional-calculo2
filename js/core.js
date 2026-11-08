/* Utilidades compartilhadas pelas quatro questões (script clássico: funciona via file://). */
window.Lab = (function () {
  "use strict";

  // Paleta: teal = vale, magenta = falha.
  const C = {
    ink: "#14233b",
    ink2: "#4a5a70",
    line: "#c5cfd6",
    ok: "#0f8b8d",
    okTint: "#d3ebeb",
    fail: "#c2185b",
    failTint: "#f6d6e2",
    outBg: "#f9ecf1",
    panel: "#fbfcfc",
  };

  // Escala sequencial (cividis): segura para daltonismo e não compete com teal/magenta.
  const CS = [
    [0, "#00204d"], [0.125, "#00336f"], [0.25, "#39486b"], [0.375, "#575c6e"],
    [0.5, "#707173"], [0.625, "#8a8779"], [0.75, "#a69d75"], [0.875, "#c4b56c"], [1, "#ffea46"],
  ];
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  function colorAt(t) {
    t = Math.min(1, Math.max(0, t));
    for (let i = 1; i < CS.length; i++) {
      if (t <= CS[i][0]) {
        const [t0, c0] = CS[i - 1], [t1, c1] = CS[i];
        const u = (t - t0) / (t1 - t0), a = rgb(c0), b = rgb(c1);
        return "rgb(" + a.map((v, k) => Math.round(v + (b[k] - v) * u)).join(",") + ")";
      }
    }
    return CS[CS.length - 1][1];
  }

  // Números no formato brasileiro.
  const nfs = {};
  function fmt(x, d) {
    d = d === undefined ? 3 : d;
    if (!isFinite(x)) return x > 0 ? "+∞" : "−∞";
    if (Math.abs(x) < 1e-12) x = 0;
    nfs[d] = nfs[d] || new Intl.NumberFormat("pt-BR", { maximumFractionDigits: d, useGrouping: false });
    return nfs[d].format(x).replace("-", "−");
  }
  function texNum(x, d) {
    return fmt(x, d).replace("−", "-").replace(",", "{,}");
  }
  // Número entre parênteses se negativo: útil para substituir valores em fórmulas.
  function texArg(x, d) {
    const s = texNum(x, d);
    return x < 0 ? "(" + s + ")" : s;
  }

  function tex(el, s, display) {
    if (window.katex) window.katex.render(s, el, { throwOnError: false, displayMode: !!display });
    else el.textContent = s;
  }
  function texHTML(s) {
    return window.katex ? window.katex.renderToString(s, { throwOnError: false }) : s;
  }
  function renderMath(root) {
    if (!window.renderMathInElement) return;
    window.renderMathInElement(root, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      throwOnError: false,
    });
  }

  function linspace(a, b, n) {
    const out = new Array(n);
    for (let i = 0; i < n; i++) out[i] = a + ((b - a) * i) / (n - 1);
    return out;
  }
  function circle(r, n) {
    n = n || 181;
    const t = linspace(0, 2 * Math.PI, n);
    return { x: t.map((v) => r * Math.cos(v)), y: t.map((v) => r * Math.sin(v)) };
  }

  const cfg2D = { displaylogo: false, displayModeBar: false, responsive: true, scrollZoom: false };
  const cfg3D = {
    displaylogo: false, responsive: true, scrollZoom: false,
    modeBarButtonsToRemove: ["toImage", "resetCameraLastSave3d", "hoverClosest3d", "orbitRotation", "tableRotation"],
  };
  const font = { family: '"Source Serif 4", Georgia, serif', color: C.ink, size: 12 };

  // "fn=f1;view=level;c=4" -> { fn: "f1", view: "level", c: "4" }
  function parseStage(s) {
    const o = {};
    (s || "").split(";").forEach((p) => {
      const i = p.indexOf("=");
      if (i > 0) o[p.slice(0, i).trim()] = p.slice(i + 1).trim();
    });
    return o;
  }

  // Liga o texto estático ao gráfico por seleção: clicar num trecho (ou no botão "Ver no gráfico",
  // que também serve ao teclado) mostra aquele caso no gráfico. Rolar a página não muda nada.
  // Devolve clear(), que apaga a marca de "trecho em exibição" quando o usuário muda o gráfico à mão.
  // Em telas estreitas a bancada fica acima do texto; depois de escolher um trecho, leva o usuário a ela.
  function showStage(root) {
    if (!window.matchMedia || !window.matchMedia("(max-width: 960px)").matches) return;
    const st = root.closest(".lab") && root.closest(".lab").querySelector(".stage");
    if (st) st.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  function linkSelect(root, apply) {
    const blocks = Array.from(root.querySelectorAll("[data-stage]:not(button)"));
    function select(block) {
      blocks.forEach((x) => {
        const on = x === block;
        x.classList.toggle("is-active", on);
        const b = x.querySelector(":scope > .show");
        if (b) { b.setAttribute("aria-pressed", String(on)); b.textContent = on ? "Em exibição no gráfico" : "Ver no gráfico"; }
      });
      apply(parseStage(block.dataset.stage));
      showStage(root);
    }
    blocks.forEach((block) => {
      block.classList.add("sel");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "show";
      btn.setAttribute("aria-pressed", "false");
      btn.textContent = "Ver no gráfico";
      block.appendChild(btn);
      btn.addEventListener("click", () => select(block));
      block.addEventListener("click", (ev) => {
        if (ev.target.closest("button")) return;                    // botões têm o próprio comportamento
        if (String(window.getSelection && window.getSelection()).length) return; // não atrapalha quem seleciona texto
        select(block);
      });
    });
    root.querySelectorAll("button[data-stage]").forEach((b) =>
      b.addEventListener("click", () => {
        blocks.forEach((x) => { x.classList.remove("is-active"); const s = x.querySelector(":scope > .show"); if (s) { s.setAttribute("aria-pressed", "false"); s.textContent = "Ver no gráfico"; } });
        apply(parseStage(b.dataset.stage));
        showStage(root);
      })
    );
    return function clear() {
      blocks.forEach((x) => {
        x.classList.remove("is-active");
        const s = x.querySelector(":scope > .show");
        if (s) { s.setAttribute("aria-pressed", "false"); s.textContent = "Ver no gráfico"; }
      });
    };
  }

  // Clique/arrasto sobre um gráfico 2D do Plotly devolve coordenadas (x, y) do plano.
  function bindPick(div, cb) {
    let down = false;
    function at(ev) {
      const fl = div._fullLayout, drag = div.querySelector(".nsewdrag");
      if (!fl || !drag) return;
      const r = drag.getBoundingClientRect();
      cb(fl.xaxis.p2d(ev.clientX - r.left), fl.yaxis.p2d(ev.clientY - r.top));
    }
    div.addEventListener("pointerdown", (ev) => { down = true; at(ev); }, true);
    window.addEventListener("pointermove", (ev) => { if (down) at(ev); });
    window.addEventListener("pointerup", () => { down = false; });
  }

  // Redimensiona só se a vista ainda estiver visível quando o quadro for desenhado.
  function resizeSoon(div) {
    requestAnimationFrame(() => { if (div && !div.hidden && div.data) window.Plotly.Plots.resize(div); });
  }

  function observeResize(box, divs) {
    if (!("ResizeObserver" in window)) return;
    new ResizeObserver(() => {
      divs.forEach((d) => { if (!d.hidden && d.data) window.Plotly.Plots.resize(d); });
    }).observe(box);
  }

  const EYE = { x: 1.15, y: -1.25, z: 0.72 }; // câmera mais próxima: o objeto ocupa melhor a bancada
  function ax3(title, rng) {
    return { range: rng, title: { text: title }, gridcolor: "rgba(20,35,59,.12)", zerolinecolor: "rgba(20,35,59,.35)",
             showbackground: false, tickfont: { size: 10 } };
  }
  function base2D(extra) {
    const axis = (t) => ({ title: { text: t }, gridcolor: "rgba(20,35,59,.08)", zerolinecolor: C.ink2, tickfont: { size: 11 }, fixedrange: true });
    return Object.assign({
      margin: { l: 46, r: 14, t: 10, b: 40 }, paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "#fff",
      font, showlegend: false, dragmode: false, hovermode: false, xaxis: axis("x"), yaxis: axis("y"),
    }, extra);
  }
  const hexA = (h, a) => { const c = rgb(h); return "rgba(" + c.join(",") + "," + a + ")"; };

  return { EYE, ax3, base2D, hexA, C, CS, colorAt, fmt, texNum, texArg, tex, texHTML, renderMath, linspace, circle,
           resizeSoon, cfg2D, cfg3D, font, parseStage, linkSelect, bindPick, observeResize };
})();
