# KYC AML Lite Brasil

Ferramenta educacional que calcula uma classificação preliminar de risco de PLD/FT a partir de nove perguntas
sobre um cliente ou uma operação. Roda inteira no navegador, sem cadastro e sem envio de dados.

Site: **https://kyc.contbit.tax**

> **Aviso jurídico.** Finalidade exclusivamente educacional. Não substitui análise jurídica, regulatória, contábil
> ou de compliance, e **não gera, não substitui e não dispensa a comunicação obrigatória ao Coaf**, que deve ser
> feita pelos canais oficiais sempre que houver operação suspeita — independentemente da faixa de risco indicada aqui.

---

## O diferencial: nada sai do navegador

A página é um arquivo HTML estático com CSS e JavaScript embutidos. Depois que ela carrega, **não há nenhuma
requisição de rede em runtime**: sem API, sem CDN, sem fonte externa, sem banco de dados, sem cookie, sem
analytics, sem login. Todo o cálculo acontece na máquina de quem usa.

Isso é verificável de três formas:

1. **Aba Network do navegador** — depois do carregamento inicial, nenhuma requisição aparece.
2. **Código-fonte** — `index.html` é um arquivo único; não há `fetch`, `XMLHttpRequest` nem tag apontando para host externo.
3. **CSP no `vercel.json`** — o header inclui `connect-src 'none'`, `object-src 'none'`, `form-action 'none'`,
   `frame-ancestors 'none'` e `img-src 'self' data:`. Se algum código tentasse chamar a rede, o próprio navegador bloquearia.

O único item gravado no navegador é a chave `kyc_theme` no `localStorage`, com o valor `light` ou `dark` — preferência
de tema, sem qualquer dado pessoal. Os contadores do painel existem só em memória e zeram ao recarregar a página.

## O que a ferramenta não faz

- **Não consulta listas de sanções** (OFAC, ONU, União Europeia, Coaf) nem faz screening de nomes. As listas do GAFI
  que aparecem no site são apenas as de jurisdições, embarcadas no arquivo — não há consulta em tempo real a lista nenhuma.
- **Não verifica CPF, CNPJ, documento, biometria ou carteira de criptoativos.** Não pede nem valida esse tipo de dado.
- **Não substitui a política de PLD/FT** da sua organização, nem a avaliação interna de risco, nem parecer ou laudo.
- **Não gera comunicação ao Coaf** e não a dispensa.
- **Não guarda histórico.** Fechou a aba, acabou.

O resultado é um ponto de partida para a diligência — não a diligência.

## Como usar

Abrir https://kyc.contbit.tax e preencher a matriz. É só isso.

Para rodar local, sem servidor:

```bash
git clone https://github.com/joaoabitante/KYC-AML.git
cd KYC-AML
# abra index.html no navegador (duplo clique já funciona)
```

Se preferir servir por HTTP para testar com os mesmos caminhos do site:

```bash
python3 -m http.server 8080
# http://localhost:8080
```

Não há build, dependência, `npm install` nem etapa de compilação.

## Como funciona a matriz

Nove fatores, cada um com um peso. A soma vai de 0 a 110 pontos.

| Fator | Peso | Observação |
|---|---:|---|
| Cliente é Pessoa Exposta Politicamente (PEP) | 20 | |
| Origem dos recursos comprovada | 15 | **invertido**: pontua quando a origem **não** está comprovada |
| Jurisdição de maior risco / país monitorado pelo GAFI | 15 | |
| Opera com ativos virtuais | 12 | |
| Estrutura societária complexa ou opaca | 12 | |
| Movimentação financeira internacional | 10 | |
| Uso relevante de dinheiro em espécie | 10 | |
| Uso de terceiros / interpostas pessoas | 8 | |
| Empresa com menos de 12 meses | 8 | |

Faixas: **0–30** risco baixo · **31–60** risco médio · **61+** risco alto. A classificação só é emitida com as nove
perguntas respondidas.

Além da soma, existem **regras de sobreposição**, que impõem um piso à classificação final qualquer que seja o escore.
A soma de pesos não captura interação entre fatores nem obrigação normativa; essas regras cobrem essa lacuna:

| Condição | Piso |
|---|---|
| Cliente é PEP | Médio (EDD e aprovação por instância superior são exigidas por norma) |
| PEP **e** origem dos recursos não comprovada | Alto |
| Jurisdição de maior risco **e** origem dos recursos não comprovada | Alto |
| Estrutura societária opaca **e** uso de interpostas pessoas | Alto |

Quando uma regra eleva a classificação, o relatório diz qual regra foi aplicada e por quê.

Os pesos e as faixas são um recorte didático, calibrado pela gravidade relativa que esses fatores costumam ter na
literatura de PLD/FT. Não são parâmetro normativo: cada organização deve calibrar os próprios critérios conforme
porte, produtos e clientela. A explicação está no site, na pergunta *"Como os pesos e as faixas da matriz foram
definidos?"* — https://kyc.contbit.tax/#faq — e a matriz em si fica em https://kyc.contbit.tax/#matriz.

## Base normativa de referência

Lista educacional e não exaustiva, conferida em 24/07/2026. Consulte sempre a fonte oficial: norma é atualizada e revogada.

| Norma | O que é | Fonte oficial |
|---|---|---|
| **Lei nº 9.613/1998** | Lei de Lavagem de Dinheiro. Tipifica o crime, cria o Coaf e estabelece os deveres de identificação de clientes, manutenção de registros e comunicação de operações. Alterada pela Lei nº 12.683/2012, que ampliou o rol de crimes antecedentes. | [Planalto](https://www.planalto.gov.br/ccivil_03/leis/l9613.htm) |
| **Lei nº 14.478/2022** | Marco legal dos ativos virtuais. Define prestadora de serviços de ativos virtuais (PSAV/VASP), inclui-a entre as pessoas obrigadas da Lei nº 9.613/1998 e cria o tipo penal de fraude com ativos virtuais. | [Planalto](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14478.htm) |
| **Resolução CFC nº 1.721/2024** | A norma dos profissionais e organizações contábeis. Dispõe sobre os procedimentos para cumprimento das obrigações da Lei nº 9.613/1998: política com abordagem baseada em risco, cadastro atualizado de clientes, guarda de registros e comunicação ao Coaf. De 18/04/2024, em vigor desde 02/09/2024 (art. 15, na redação da Resolução CFC nº 1.728/2024). Revogou a Resolução CFC nº 1.530/2017 — que, por sua vez, já havia revogado a 1.445/2013. | [CFC (PDF)](https://www1.cfc.org.br/sisweb/SRE/docs/RES_1721.pdf) |
| **Circular BCB nº 3.978/2020** | Norma central de PLD/FT do Banco Central: política, procedimentos e controles internos das instituições autorizadas a funcionar pelo BCB, incluindo avaliação interna de risco, devida diligência e diligência reforçada para PEPs. Em vigor, já com alterações posteriores — use sempre a versão consolidada no site do BCB. | [BCB](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Circular&numero=3978) |
| **Resolução BCB nº 520/2025** | Marco regulatório das prestadoras de serviços de ativos virtuais: disciplina a constituição e o funcionamento dessas sociedades, com supervisão proporcional ao risco. Publicada em 10/11/2025, vigência a partir de 02/02/2026. | [Buscador de normas do BCB](https://www.bcb.gov.br/estabilidadefinanceira/buscanormas) |
| **Recomendações GAFI/FATF** | As 40 Recomendações do Grupo de Ação Financeira: padrão internacional de PLD/FT, base da abordagem baseada em risco. | [FATF](https://www.fatf-gafi.org/en/publications/High-risk-and-other-monitored-jurisdictions.html) |

Nenhuma outra norma é citada no site. Se você encontrar uma citação sem número, ano e ementa conferidos, é bug — abra uma issue.

## Estrutura do projeto

```
KYC-AML/
├── index.html                   arquivo único: HTML + CSS + JS embutidos
├── vercel.json                  headers de segurança (CSP com connect-src 'none', HSTS, nosniff,
│                                Referrer-Policy: no-referrer, X-Frame-Options: DENY, Permissions-Policy)
├── robots.txt                   liberado, aponta o sitemap
├── sitemap.xml                  uma URL
├── favicon.ico / favicon.png / favicon-64.png / apple-touch-icon.png / og.png
├── .github/workflows/gafi.yml   lembrete de conferência das listas do GAFI
├── CHANGELOG.md                 histórico de mudanças
├── AGENTS.md / CLAUDE.md        contexto para assistentes de IA
└── README.md
```

Hospedagem na **Vercel**, com deploy automático a partir do GitHub. O GitHub é a fonte da verdade; a Vercel é espelho.
Não há deploy manual nem edição pelo painel.

## Como o dado do GAFI é mantido

As listas de jurisdições do GAFI (chamado para ação e monitoramento reforçado) ficam **embarcadas no `index.html`**,
num bloco JSON entre os marcadores `<!-- GAFI:START -->` e `<!-- GAFI:END -->`, junto com a plenária de origem e a
data da última conferência. O navegador não busca esses dados: eles já vêm na página.

O GAFI republica as listas três vezes por ano (plenárias de fevereiro, junho e outubro). O workflow
`.github/workflows/gafi.yml` roda em março, julho e novembro e **abre uma issue** lembrando de comparar o bloco
embarcado com a fonte oficial. Ele não altera o site sozinho, de propósito: lista regulatória não entra no ar sem
revisão humana e conferência em segunda fonte.

Lista embarcada atualmente: plenária de 19/06/2026, conferida em 24/07/2026.

## Privacidade e LGPD

A ferramenta não coleta, não transmite e não armazena dado pessoal. Não há tratamento de dados por parte do autor
nem por parte da Vercel além do log de acesso ao arquivo estático — nenhum conteúdo que você digita chega ao servidor.

Os campos "identificação do cliente" e "analista responsável" são opcionais e existem para o relatório servir de papel
de trabalho. O que você digita neles fica no navegador e some ao fechar a aba.

**Se você exportar (TXT/JSON) ou imprimir o relatório, o arquivo gerado passa a conter o que você digitou.** A partir
daí, a guarda desse arquivo é responsabilidade sua, como controlador, nos termos da LGPD. A recomendação é usar código
interno em vez de nome completo.

## Licença

MIT.

```
MIT License

Copyright (c) 2026 João Carlos Bueno Abitante

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

A licença cobre o código. O conteúdo normativo é referência educacional: confira sempre a fonte oficial.

## Autoria

**João Carlos Bueno Abitante** — Contador, CRC-SP 320961/O-4.
