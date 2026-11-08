# Cálculo II — Modelagem computacional

Trabalho de Cálculo II (UFAM, Engenharia de Software): domínio e curvas de nível, limites e continuidade,
derivadas parciais e diferenciabilidade, plano tangente e reta normal. O site mostra os modelos
interativos e as respostas escritas; `verify.py` confere a matemática com SymPy.

## Dados da equipe

Integrantes: Rafael Emanuel, Luiz Nery, Antonio Lucas,
Breno Augusto, Caio Martins, Victor Kossmann e Vitor Hugo. Estão na abertura de `index.html` e no topo de
`relatorio/relatorio.html` (`id="meta-integrantes"`). Se mudar algo, altere os dois e gere o PDF de novo.

## Como executar

**Site.** Abra `index.html` no navegador (clique duplo). Funciona offline: Plotly, KaTeX e as fontes
estão em `vendor/`. Os scripts são clássicos (sem módulos ES), então não precisa de servidor.
Se o seu navegador bloquear arquivos locais, use `python3 -m http.server` na pasta e abra
`http://localhost:8000`.

**Verificação matemática.**

```bash
python3 -m venv .venv
.venv/bin/pip install sympy
.venv/bin/python verify.py
```

Cada linha PASS corresponde a uma afirmação do relatório. O script termina com código 0 quando tudo passa.

## Como usar o site

- Cada questão tem uma bancada (gráfico e controles) e as respostas ao lado.
- **Clique em um trecho de resposta** (ou em "Ver no gráfico") para mostrá-lo na bancada. Rolar a página não muda o gráfico.
- Cor tem sentido fixo: **verde-azulado** = a propriedade vale; **magenta** = a propriedade falha.

| Questão | Controles principais |
|---|---|
| 1 | função, vista (domínio, superfície 3D, curvas de nível), ponto (a, b) clicável, nível c |
| 2 | trajetórias (eixos, retas, parábolas, espiral), aproximação s, **valor de f(0,0)** |
| 3 | direção θ, aproximação r; vistas de superfície, cortes e erro |
| 4 | ponto (a, b) (também por clique no Mapa), janela ρ; plano, vetores, normal e erro |

## Estrutura

```
index.html        página única (texto das respostas + bancadas)
css/style.css     visual
js/core.js        utilidades (cores, KaTeX, seleção de trechos, câmera)
js/hero.js        abertura
js/q1.js … q4.js  um modelo por questão
verify.py         conferência simbólica (SymPy)
relatorio/        relatório em PDF, sua página-fonte e as figuras
vendor/           Plotly, KaTeX e fontes locais
```

## Relatório (PDF)

`relatorio/Relatorio_Calculo_II.pdf` é o relatório curto (5 páginas): resultados, justificativas e imagens dos
modelos de cada questão. Ele é gerado a partir de `relatorio/relatorio.html`, que usa as figuras de `relatorio/img/`
(capturas dos modelos do site em estados escolhidos: ponto fora do domínio, plano que não toca a superfície,
trajetórias, erro por direção, plano tangente e zoom).

Para atualizar: edite o topo de `relatorio/relatorio.html`, abra o
arquivo no navegador e use Imprimir → Salvar como PDF (papel A4, margens padrão, "Gráficos de segundo plano"
ligado para manter as cores).
