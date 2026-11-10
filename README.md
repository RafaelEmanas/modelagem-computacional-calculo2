# Cálculo II — Modelagem computacional

Trabalho de Cálculo II (UFAM, Engenharia de Software): domínio e curvas de nível, limites e continuidade,
derivadas parciais e diferenciabilidade, plano tangente e reta normal. O site mostra os modelos
interativos e as respostas escritas; `verify.py` confere a matemática com SymPy.

## Dados da equipe

Integrantes: Rafael Emanuel, Luiz Nery, Antonio Lucas,
Breno Augusto, Caio Martins, Victor Kossmann e Vitor Hugo. Estão na abertura de `index.html` e no topo de
`relatorio/relatorio.html` (`id="meta-integrantes"`). Se mudar algo, altere os dois e gere o PDF de novo.

## Como abrir o trabalho (passo a passo, sem precisar saber programar)

Você só precisa de um computador com internet para **baixar** os arquivos e de um navegador (Chrome, Edge
ou Firefox). Depois de baixado, o trabalho funciona **sem internet** e não exige instalar nada.

> **Importante:** o trabalho é formado por várias pastas e arquivos que dependem uns dos outros.
> É preciso baixar **o repositório inteiro** e só depois abrir o `index.html`. Se você abrir só o
> `index.html` solto, ou de dentro do arquivo ZIP, a página aparece sem cores, sem formatação e sem gráficos.

**1. Baixar tudo.**
Na página do repositório no GitHub, clique no botão verde **Code** e depois em **Download ZIP**.
Um arquivo chamado algo como `trabalho-modelagem-computacional-main.zip` será salvo, normalmente na pasta *Downloads*.

**2. Extrair o ZIP.**
- **Windows:** clique com o botão direito no arquivo ZIP e escolha **Extrair tudo…** e depois **Extrair**.
  (Não basta dar dois cliques no ZIP: isso apenas "espia" o conteúdo e a página não funcionará.)
- **Mac:** dê dois cliques no ZIP. Uma pasta com o mesmo nome aparece ao lado dele.
- **Linux:** clique com o botão direito e escolha **Extrair aqui**.

**3. Abrir a pasta extraída.**
Entre na pasta nova. Dentro dela você verá `index.html`, `README.md` e as pastas `css`, `js`, `vendor` e `relatorio`.
**Não mova nem apague nada.** Todos esses itens precisam ficar juntos.

**4. Abrir o trabalho.**
Dê dois cliques em **`index.html`**. O trabalho abre no navegador, na primeira tela ("Quando uma propriedade falha").
Se abrir em outro programa, clique com o botão direito em `index.html`, escolha **Abrir com** e depois **Chrome**,
**Edge** ou **Firefox**.

**5. Navegar.**
- Use o menu no topo (**Questão 1, 2, 3, 4** e **Resumo**) ou role a página.
- Cada questão tem, à esquerda ou acima, uma **bancada** com o gráfico e os controles (botões, campos de número
  e barras deslizantes) e, ao lado, as respostas escritas.
- Os gráficos 3D podem ser girados arrastando com o mouse.
- Clicar em um trecho destacado do texto, ou em **Ver no gráfico**, mostra aquele caso na bancada.

**6. Ler o relatório em PDF (opcional).**
Dentro da pasta extraída, abra a pasta `relatorio` e dê dois cliques em `Relatorio_Calculo_II.pdf`.

### Se algo não funcionar

| O que você vê | O que fazer |
|---|---|
| A página abre sem cores, com texto simples e sem gráficos | Os arquivos não foram extraídos, ou o `index.html` foi tirado da pasta. Refaça os passos 2 a 4 e abra o `index.html` que está **dentro da pasta extraída**. |
| Os gráficos não aparecem ou a página fica em branco | Abra o mesmo `index.html` em outro navegador (Chrome ou Edge) e confirme que o JavaScript não está bloqueado. |
| O botão **Download ZIP** não aparece | Confirme que está na página inicial do repositório (não em um arquivo dentro dele) e clique no botão verde **Code**. |

## Para quem é da área (opcional)

**Servidor local.** Se algum navegador bloquear arquivos locais, rode `python3 -m http.server` na pasta do
projeto e abra `http://localhost:8000`. Os scripts são clássicos (sem módulos ES) e Plotly, KaTeX e as fontes
estão em `vendor/`, então normalmente isso não é necessário.

**Verificação matemática.** Confere, com SymPy, as conclusões escritas no site (não é preciso para ver o trabalho):

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
