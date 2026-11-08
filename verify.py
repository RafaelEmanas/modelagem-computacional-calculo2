#!/usr/bin/env python3
"""
Confere, com SymPy, as conclusões matemáticas escritas no site (index.html).

Cada linha PASS/FAIL corresponde a uma afirmação do relatório. Este script não gera
gráficos: ele existe para que as respostas não dependam só de "ver que parece certo".

Uso:
    python3 -m venv .venv && .venv/bin/pip install sympy
    .venv/bin/python verify.py
"""
import math
import sys

import sympy as sp

x, y, t, h, k, m, c, q = sp.symbols("x y t h k m c q", real=True)
tp = sp.symbols("t", positive=True)
r = sp.symbols("r", positive=True)
th = sp.symbols("theta", real=True)

results = []


def check(label, ok):
    results.append(bool(ok))
    print(("PASS  " if ok else "FAIL  ") + label)


def section(title):
    print("\n" + title + "\n" + "-" * len(title))


def real_value(expr, a, b):
    """Valor de expr em (a,b) se for número real finito; senão None."""
    v = sp.simplify(expr.subs({x: a, y: b}))
    return v if v.is_real is True and v.is_finite is True else None


# ======================================================================
section("Questão 1 — domínio, imagem e curvas de nível")
# ======================================================================
F1 = sp.sqrt(9 - x**2 - y**2)
F2 = sp.log(4 - x**2 - y**2)
F3 = 1 / (x**2 + y**2 - 1)

# Tabela do requisito 4: (ponto, f1, f2, f3); None = fora do domínio.
table = [
    ((0, 0), sp.Integer(3), sp.log(4), sp.Integer(-1)),
    ((1, 0), 2 * sp.sqrt(2), sp.log(3), None),
    ((2, 0), sp.sqrt(5), None, sp.Rational(1, 3)),
    ((3, 0), sp.Integer(0), None, sp.Rational(1, 8)),
    ((3, 3), None, None, sp.Rational(1, 17)),
]
for (a, b), e1, e2, e3 in table:
    for name, f, expected in (("f1", F1, e1), ("f2", F2, e2), ("f3", F3, e3)):
        v = real_value(f, a, b)
        ok = (v is None and expected is None) or (v is not None and expected is not None and sp.simplify(v - expected) == 0)
        check(f"{name}({a},{b}) {'não definido' if expected is None else '= ' + str(expected)}", ok)

# Imagens, pela substituição t = x²+y² e resolução de f = c.
reals = sp.S.Reals
im1 = sp.Intersection(sp.solveset(9 - c**2 >= 0, c, reals), sp.Interval(0, sp.oo))
check("Im(f1) = [0, 3]", im1 == sp.Interval(0, 3))
im2 = sp.solveset(sp.Le(sp.exp(c), 4), c, reals)
check("Im(f2) = (-oo, ln 4]", im2 == sp.Interval(-sp.oo, sp.log(4)))
inside = sp.Intersection(sp.solveset(sp.Ge(1 / c, -1), c, reals), sp.solveset(sp.Lt(1 / c, 0), c, reals))
outside = sp.solveset(sp.Gt(1 / c, 0), c, reals)
check("Im(f3) = (-oo, -1] U (0, oo)", sp.Union(inside, outside) == sp.Union(sp.Interval(-sp.oo, -1), sp.Interval.open(0, sp.oo)))

# Raios das curvas de nível: f(r²) = c com r² = fórmula.
check("f1 = c  <=>  x²+y² = 9 - c²", sp.simplify(sp.sqrt(9 - (9 - c**2)) - sp.Abs(c)) == 0)
check("f2 = c  <=>  x²+y² = 4 - e^c", sp.simplify(sp.log(4 - (4 - sp.exp(c))) - c) == 0)
check("f3 = c  <=>  x²+y² = 1 + 1/c", sp.simplify(1 / ((1 + 1 / c) - 1) - c) == 0)
check("f1 atinge c em (sqrt(9-c²), 0)", sp.simplify(F1.subs({x: sp.sqrt(9 - c**2), y: 0}) - sp.sqrt(c**2)) == 0)
check("hemisfério: x²+y²+z² = 9 para z = f1", sp.simplify((x**2 + y**2 + F1**2) - 9) == 0)

# Varredura numérica independente (radial) para as imagens.
vals1 = [math.sqrt(9 - s * s) for s in [3 * i / 3000 for i in range(3001)]]
check("varredura: f1 em [0, 3]", min(vals1) == 0 and abs(max(vals1) - 3) < 1e-12)
vals3_in = [1 / (s * s - 1) for s in [i / 100000 for i in range(99990)]]
check("varredura: dentro do disco unitário f3 <= -1", max(vals3_in) <= -1 + 1e-12)
vals3_out = [1 / (s * s - 1) for s in [1.00001 + i / 1000 for i in range(5000)]]
check("varredura: fora do disco unitário f3 > 0", min(vals3_out) > 0)

# ======================================================================
section("Questão 2 — limites e continuidade")
# ======================================================================
G1 = x**2 * y / (x**2 + y**2)
G2 = x * y / (x**2 + y**2)
G3 = (x**2 + y**2) / (sp.sqrt(x**2 + y**2 + 1) + 1)
G4 = x**2 * y / (x**4 + y**2)

check("f1: x²/(x²+y²) <= 1  (logo |f1| <= |y|)", sp.simplify(1 - x**2 / (x**2 + y**2)) == y**2 / (x**2 + y**2))
check("f1 em polares = r sen(t) cos²(t)", sp.simplify(G1.subs({x: r * sp.cos(th), y: r * sp.sin(th)}) - r * sp.sin(th) * sp.cos(th) ** 2) == 0)
check("f1: limite ao longo de y = mx é 0", sp.limit(G1.subs({x: t, y: m * t}), t, 0) == 0)

check("f2 ao longo de y = mx vale m/(1+m²)", sp.simplify(G2.subs({x: t, y: m * t}) - m / (1 + m**2)) == 0)
check("f2: m=0 -> 0, m=1 -> 1/2, m=-1 -> -1/2", [(m / (1 + m**2)).subs(m, v) for v in (0, 1, -1)] == [0, sp.Rational(1, 2), -sp.Rational(1, 2)])
check("f2 pelos eixos = 0", G2.subs(y, 0) == 0 and G2.subs(x, 0) == 0)
check("f2 pela parábola y = x²: limite 0", sp.limit(G2.subs({x: t, y: t**2}), t, 0) == 0)
check("f2 pela parábola x = y²: limite 0", sp.limit(G2.subs({x: t**2, y: t}), t, 0) == 0)

sq = sp.sqrt(x**2 + y**2 + 1)
check("f3 = sqrt(x²+y²+1) - 1 fora da origem", sp.simplify(G3 - (sq - 1)) == 0)
check("f3: limite na origem é 0 (≠ f3(0,0) = 2)", sp.limit(sp.sqrt(r**2 + 1) - 1, r, 0) == 0)

check("f4 ao longo de y = mx: limite 0", sp.limit(G4.subs({x: t, y: m * t}), t, 0) == 0)
check("f4 pelos eixos = 0", G4.subs(y, 0) == 0 and G4.subs(x, 0) == 0)
check("f4 ao longo de y = x² vale 1/2", sp.simplify(G4.subs({x: t, y: t**2}) - sp.Rational(1, 2)) == 0)

# ======================================================================
section("Questão 3 — derivadas parciais, diferenciabilidade e continuidade")
# ======================================================================
f = x * y / sp.sqrt(x**2 + y**2)
g = x * y / (x**2 + y**2)
for name, fn in (("f", f), ("g", g)):
    check(f"{name}(h,0) = 0 e {name}(0,k) = 0 (h,k ≠ 0)", sp.simplify(fn.subs({x: h, y: 0})) == 0 and sp.simplify(fn.subs({x: 0, y: k})) == 0)
    check(f"{name}_x(0,0) = 0 e {name}_y(0,0) = 0 pela definição", sp.limit(fn.subs({x: h, y: 0}) / h, h, 0) == 0 and sp.limit(fn.subs({x: 0, y: k}) / k, k, 0) == 0)

check("f em polares = (r/2) sen(2t)", sp.simplify(f.subs({x: r * sp.cos(th), y: r * sp.sin(th)}) - r * sp.sin(2 * th) / 2) == 0)
check("f: corte na direção t vale (1/2)|t| sen(2t)", sp.simplify(f.subs({x: tp * sp.cos(th), y: tp * sp.sin(th)}) - tp * sp.sin(2 * th) / 2) == 0)
check("f: E ao longo de y = mx é m/(1+m²)  (m=1: 1/2, não tende a 0)", sp.simplify((f / sp.sqrt(x**2 + y**2)).subs({x: tp, y: m * tp}) - m / (1 + m**2)) == 0)
check("f: |xy| <= (x²+y²)/2  (logo |f| <= r/2, contínua)", sp.expand((x**2 + y**2) - 2 * x * y - (x - y) ** 2) == 0)
Eg = (g / sp.sqrt(x**2 + y**2)).subs({x: tp, y: tp})
check("g: E ao longo de (t,t) é 1/(2√2 t) -> +oo", sp.simplify(Eg - 1 / (2 * sp.sqrt(2) * tp)) == 0 and sp.limit(Eg, tp, 0, "+") == sp.oo)
check("g = 1/2 na diagonal e 0 nos eixos (sem limite)", sp.simplify(g.subs({x: tp, y: tp})) == sp.Rational(1, 2) and g.subs(y, 0) == 0)

# ======================================================================
section("Questão 4 — plano tangente e reta normal")
# ======================================================================
A, B = sp.symbols("a b", real=True)
F1q = x**2 + y**2
cone = sp.sqrt(x**2 + y**2)
f3 = f

check("f1: plano em (a,b) é 2a x + 2b y - a² - b²",
      sp.simplify(F1q.subs({x: A, y: B}) + sp.diff(F1q, x).subs({x: A, y: B}) * (x - A) + sp.diff(F1q, y).subs({x: A, y: B}) * (y - B) - (2 * A * x + 2 * B * y - A**2 - B**2)) == 0)
plane = lambda fn, a, b: sp.simplify(fn.subs({x: a, y: b}) + sp.diff(fn, x).subs({x: a, y: b}) * (x - a) + sp.diff(fn, y).subs({x: a, y: b}) * (y - b))
check("f1 em (1,2): z = 2x + 4y - 5; normal (-2,-4,1)", sp.expand(plane(F1q, 1, 2) - (2 * x + 4 * y - 5)) == 0 and (-sp.diff(F1q, x).subs({x: 1, y: 2}), -sp.diff(F1q, y).subs({x: 1, y: 2})) == (-2, -4))
check("cone: gradiente = (x/r, y/r)", sp.simplify(sp.diff(cone, x) - x / cone) == 0 and sp.simplify(sp.diff(cone, y) - y / cone) == 0)
check("cone em (3/2, 2): z = 0,6x + 0,8y", sp.expand(plane(cone, sp.Rational(3, 2), 2) - (sp.Rational(3, 5) * x + sp.Rational(4, 5) * y)) == 0)
check("cone: plano em (a,b) passa pela origem", sp.simplify(plane(cone, A, B).subs({x: 0, y: 0})) == 0)
check("f3: f_x = y³/r³ e f_y = x³/r³", sp.simplify(sp.diff(f3, x) - y**3 / (x**2 + y**2) ** sp.Rational(3, 2)) == 0 and sp.simplify(sp.diff(f3, y) - x**3 / (x**2 + y**2) ** sp.Rational(3, 2)) == 0)
check("f3 em (1,1): z = (x+y)/(2√2)", sp.simplify(plane(f3, 1, 1) - (x + y) / (2 * sp.sqrt(2))) == 0)
lam = sp.symbols("lambda", positive=True)
check("f3 é homogênea de grau 1 (Euler: a f_x + b f_y = f)", sp.simplify(f3.subs({x: lam * x, y: lam * y}) - lam * f3) == 0 and sp.simplify(x * sp.diff(f3, x) + y * sp.diff(f3, y) - f3) == 0)

fx_s, fy_s = sp.symbols("f_x f_y")
cross = sp.Matrix([1, 0, fx_s]).cross(sp.Matrix([0, 1, fy_s]))
check("σx × σy = (-f_x, -f_y, 1)", list(cross) == [-fx_s, -fy_s, 1])

check("cone na origem: f(h,0)/h tem limites laterais +1 e -1",
      sp.limit(sp.sqrt(h**2) / h, h, 0, "+") == 1 and sp.limit(sp.sqrt(h**2) / h, h, 0, "-") == -1)
check("f3 na origem: parciais 0 e erro 1/2 na diagonal (plano z = 0 não é tangente)",
      sp.limit(f3.subs({x: h, y: 0}) / h, h, 0) == 0 and sp.simplify((f3 / sp.sqrt(x**2 + y**2)).subs({x: tp, y: tp}) - sp.Rational(1, 2)) == 0)
check("f1 em (a,b): erro = ρ  (f(a+h,b+k) - plano = h²+k²)",
      sp.expand(F1q.subs({x: A + h, y: B + k}) - F1q.subs({x: A, y: B}) - 2 * A * h - 2 * B * k - (h**2 + k**2)) == 0)
# E(φ) + E(φ+π) >= 2 para qualquer L linear no cone: |1 - s| + |1 + s| >= 2
s_ = sp.symbols("s", real=True)
check("cone: para qualquer L, |1-L(e)| + |1+L(e)| >= 2 (nenhuma L aproxima)",
      all((abs(1 - v) + abs(1 + v)) >= 2 for v in [sp.Rational(n, 4) for n in range(-12, 13)]))

# ----------------------------------------------------------------------
print("\n" + "=" * 40)
print(f"{sum(results)} de {len(results)} verificações passaram")
sys.exit(0 if all(results) else 1)
