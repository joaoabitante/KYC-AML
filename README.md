# KYC AML Lite Brasil

Ferramenta educacional que calcula uma classificação preliminar de risco de PLD/FT a partir de nove perguntas
sobre um cliente ou uma operação. Roda inteira no navegador, sem cadastro e sem envio de dados.

Site: **https://kyc.contbit.tax**

> **Aviso jurídico.** Finalidade exclusivamente educacional. Não substitui análise jurídica, regulatória, contábil
> ou de compliance, e **não gera, não substitui e não dispensa a comunicação obrigatória ao Coaf**, que deve ser
> feita pelos canais oficiais sempre que houver operação suspeita — independentemente da faixa de risco indicada aqui.

---

## O diferencial: nada sai do navegador

Cada página é um arquivo HTML estático com CSS e JavaScript embutidos. Depois que ela carrega, **não há nenhuma
requisição de rede em runtime**: sem API, sem CDN, sem fonte externa, sem banco de dados, sem cookie, sem
analytics, sem login. Todo o cálculo acontece na máquina de quem usa.

Isso é verificável de três formas:

1. **Aba Network do navegador** — depois do carregamento inicial, nenhuma requisição aparece.
2. **Código-fonte** — cada página é um arquivo único; não há `fetch`, `XMLHttpRequest` nem tag apontando para host externo.
3. **CSP no `vercel.json`** — o header inclui `connect-src 'none'`, `object-src 'none'`, `base-uri 'none'`,
   `form-action 'none'`, `frame-ancestors 'none'`, `worker-src 'none'` e `img-src 'self' data:`. Se algum código
   tentasse chamar a rede, o próprio navegador bloquearia.

O único item gravado no navegador é a chave `kyc_theme` no `localStorage`, com o valor `light` ou `dark` — preferência
de tema, sem qualquer dado pessoal. Os contadores do painel existem só em memória e zeram ao recarregar a página.

## O que a ferramenta não faz

- **Não consulta listas de sanções** (OFAC, ONU, União Europeia, Coaf) nem faz screening de nomes. As listas do GAFI
  que aparecem no site são apenas as de jurisdições, embarcadas no próprio arquivo — não há consulta em tempo real a
  lista nenhuma.
- **Não verifica CPF, CNPJ, documento, biometria ou carteira de criptoativos.** Não pede nem valida esse tipo de dado.
- **Não substitui a política de PLD/FT** da sua organização, nem a avaliação interna de risco, nem parecer ou laudo.
- **Não gera comunicação ao Coaf** e não a dispensa.
- **Não guarda histórico.** Fechou a aba, acabou. Se quiser guardar uma análise, é você que exporta o arquivo.

O resultado é um ponto de partida para a diligência — não a diligência.

## Como usar

Abrir https://kyc.contbit.tax e preencher a matriz. É só isso.

A matriz **começa sem respostas**: nenhum fator vem marcado como "não" por padrão, para que ninguém receba uma
classificação de risco baixo sem ter respondido nada. A classificação só é emitida com as nove perguntas respondidas.

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

Faixas: **0–30** risco baixo · **31–60** risco médio · **61+** risco alto.

Além da soma, existem **regras de sobreposição**, que impõem um piso à classificação final qualquer que seja o escore.
A soma de pesos não captura interação entre fatores nem obrigação normativa; essas regras cobrem essa lacuna:

| Condição | Piso |
|---|---|
| Cliente é PEP | Médio — PEP **nunca** cai em risco baixo (diligência reforçada e aprovação por instância superior são exigidas por norma) |
| PEP **e** origem dos recursos não comprovada | Alto |
| Jurisdição de maior risco **e** origem dos recursos não comprovada | Alto |
| Estrutura societária opaca **e** uso de interpostas pessoas | Alto |

Quando uma regra eleva a classificação, o relatório diz qual regra foi aplicada e por quê.

Os pesos e as faixas são um recorte didático, calibrado pela gravidade relativa que esses fatores costumam ter na
literatura de PLD/FT. Não são parâmetro normativo: cada organização deve calibrar os próprios critérios conforme
porte, produtos e clientela. A explicação está na página de metodologia — https://kyc.contbit.tax/metodologia.html —
e também no site, na pergunta *"Como os pesos e as faixas da matriz foram definidos?"* (https://kyc.contbit.tax/#faq).
A matriz em si fica em https://kyc.contbit.tax/#matriz.

## O que mais está na ferramenta

- **Checklist de cadastro por perfil** — a lista do que pedir e guardar muda conforme o cliente é pessoa física,
  pessoa jurídica, PEP ou ligado a ativos virtuais.
- **Relatório da análise** com escore, faixa, fatores marcados e as regras de sobreposição aplicadas.
- **Impressão em PDF** pelo próprio navegador, para anexar ao papel de trabalho.
- **Exportar e importar a análise em JSON**, com schema identificado como `kyc-aml-lite/1`. O arquivo sai do
  navegador para o seu disco por download; a importação lê o arquivo que você escolhe. Em nenhum dos dois casos
  há upload.
- **Campos opcionais de identificação do cliente e do analista responsável**, para o relatório servir de papel de
  trabalho. São opcionais de verdade: a ferramenta funciona sem eles.
- **Glossário** de PLD/FT (https://kyc.contbit.tax/glossario.html) e página sobre as **obrigações perante o Coaf**
  (https://kyc.contbit.tax/obrigacoes-coaf.html).
- **Log de atualizações na própria página**, para quem usa saber o que mudou e quando — o mesmo histórico do
  `CHANGELOG.md`.
- **Seção "Sobre o autor"** e um link de apoio via LiveTip (https://livetip.gg/libertcontador). O apoio é
  voluntário: nada na ferramenta é pago, bloqueado ou limitado.

## Base normativa de referência

Lista educacional e não exaustiva, conferida em 24/07/2026. Consulte sempre a fonte oficial: norma é atualizada e revogada.

| Norma | O que é | Fonte oficial |
|---|---|---|
| **Lei nº 9.613/1998** | Lei de Lavagem de Dinheiro. Tipifica o crime, cria o Coaf (art. 14) e estabelece os deveres de identificação de clientes, manutenção de registros e comunicação de operações. Alterada pela Lei nº 12.683/2012, que **eliminou o rol taxativo de crimes antecedentes**: passou a admitir como antecedente qualquer infração penal. O Coaf foi depois **reestruturado** — não criado — pela Lei nº 13.974/2020. | [Planalto](https://www.planalto.gov.br/ccivil_03/leis/l9613.htm) |
| **Lei nº 14.478/2022** | Marco legal dos ativos virtuais. Define prestadora de serviços de ativos virtuais (PSAV/VASP), inclui-a no rol de disposições da Lei nº 9.613/1998 e cria o tipo penal de fraude com ativos virtuais (art. 171-A do Código Penal). | [Planalto](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14478.htm) |
| **Resolução CFC nº 1.721/2024** | A norma dos profissionais e organizações contábeis. Dispõe sobre os procedimentos para cumprimento das obrigações da Lei nº 9.613/1998: política com abordagem baseada em risco, cadastro atualizado de clientes, guarda de registros e comunicação ao Coaf. De 18/04/2024, **em vigor desde 02/09/2024** — a data original do art. 15 foi prorrogada pela Resolução CFC nº 1.728/2024. O art. 16 **revogou a Resolução CFC nº 1.530/2017**, que por sua vez já havia revogado a Resolução CFC nº 1.445/2013. O art. 10 manda manter o cadastro de pessoas físicas ou jurídicas e o registro das transações comunicadas ao Coaf por no mínimo 5 anos contados da conclusão da transação. | [CFC (PDF)](https://www1.cfc.org.br/sisweb/SRE/docs/RES_1721.pdf) |
| **Circular BCB nº 3.978/2020** | Norma central de PLD/FT do Banco Central: política, procedimentos e controles internos das instituições autorizadas a funcionar pelo BCB, incluindo avaliação interna de risco, devida diligência e diligência reforçada para PEPs. Em vigor, já com alterações posteriores — o texto consolidado está disponível no repositório de normativos do BCB e é sempre a versão a consultar. | [BCB](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Circular&numero=3978) |
| **Resolução BCB nº 520/2025** | Marco regulatório das prestadoras de serviços de ativos virtuais. O art. 1º disciplina a constituição e o funcionamento das sociedades prestadoras de serviços de ativos virtuais (SPSAV) e a prestação desses serviços por outras instituições autorizadas a funcionar pelo BCB; o art. 4º classifica as SPSAV em intermediárias, custodiantes e corretoras de ativos virtuais. De 10/11/2025; entra em vigor em 02/02/2026 (art. 92). | [BCB](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?tipo=Resolu%C3%A7%C3%A3o%20BCB&numero=520) |
| **Recomendações GAFI/FATF** | As 40 Recomendações do Grupo de Ação Financeira: padrão internacional de PLD/FT e origem da abordagem baseada em risco. O link ao lado é o das jurisdições de maior risco e sob monitoramento, que é a lista usada pela matriz. | [Jurisdições monitoradas · FATF](https://www.fatf-gafi.org/en/publications/High-risk-and-other-monitored-jurisdictions.html) |

Nenhuma outra norma é citada no site. Se você encontrar uma citação sem número, ano e ementa conferidos, é bug — abra uma issue.

## Estrutura do projeto

```
KYC-AML/
├── index.html                          matriz de risco, relatório, checklist e FAQ
├── glossario.html                      glossário de PLD/FT
├── obrigacoes-coaf.html                obrigações perante o Coaf
├── metodologia.html                    como os pesos, as faixas e as regras de sobreposição foram definidos
│                                       (cada página é autocontida: HTML + CSS + JS embutidos)
├── vercel.json                         headers de segurança (CSP com connect-src 'none', HSTS, nosniff,
│                                       Referrer-Policy: no-referrer, X-Frame-Options: DENY, Permissions-Policy,
│                                       COOP/CORP/COEP)
├── robots.txt                          liberado, aponta o sitemap
├── sitemap.xml                         as páginas públicas
├── favicon.ico / favicon.png / favicon-64.png / apple-touch-icon.png / og.png
├── .github/workflows/gafi.yml          abre issue de conferência das listas do GAFI
├── .github/workflows/privacidade.yml   barreira de privacidade: falha o PR se a página quebrar a promessa
├── CHANGELOG.md                        histórico de mudanças
├── AGENTS.md / CLAUDE.md               contexto para assistentes de IA
└── README.md
```

Hospedagem na **Vercel**, com deploy automático a partir do GitHub. O GitHub é a fonte da verdade; a Vercel é espelho.
Não há deploy manual nem edição pelo painel.

## As duas garantias automatizadas

**`.github/workflows/privacidade.yml`** roda em todo push e em todo pull request e **falha** se a promessa da
ferramenta for quebrada. Ele reprova a mudança quando encontra: `fetch(`, `XMLHttpRequest`, `WebSocket`,
`sendBeacon`, `EventSource` ou `importScripts`; recurso externo (script, folha de estilo ou imagem de CDN, fonte
de terceiro); qualquer tracker conhecido (Google Analytics, GTM, Hotjar, Clarity, Plausible, Matomo, Segment,
Mixpanel e afins); uso de `localStorage`/`sessionStorage`/`indexedDB` fora da preferência de tema `kyc_theme`, ou
`document.cookie`; ausência dos cabeçalhos de segurança no `vercel.json`; e desaparecimento do aviso jurídico ou
da menção ao Coaf. É a diferença entre dizer que a ferramenta é privada e ter isso verificado a cada commit.

**`.github/workflows/gafi.yml`** cuida do dado regulatório que envelhece — veja abaixo.

## Como o dado do GAFI é mantido

As listas de jurisdições do GAFI (chamado para ação e monitoramento reforçado) ficam **embarcadas no `index.html`**,
num bloco JSON entre os marcadores `<!-- GAFI:START -->` e `<!-- GAFI:END -->`, junto com a plenária de origem e a
data da última conferência. O navegador não busca esses dados: eles já vêm na página.

O GAFI republica as listas três vezes por ano (plenárias de fevereiro, junho e outubro). O workflow
`.github/workflows/gafi.yml` roda em março, julho e novembro e **abre uma issue** lembrando de comparar o bloco
embarcado com a fonte oficial. Ele não altera o site sozinho, de propósito: lista regulatória não entra no ar sem
revisão humana e conferência em segunda fonte.

Lista embarcada atualmente: plenária de 17 a 19/06/2026 (declarações datadas de 19/06/2026), conferida em 24/07/2026.

## Privacidade e LGPD

A ferramenta não coleta, não transmite e não armazena dado pessoal. Não há tratamento de dados por parte do autor
nem por parte da Vercel além do log de acesso ao arquivo estático — nenhum conteúdo que você digita chega ao servidor.

Os campos "identificação do cliente" e "analista responsável" são opcionais e existem para o relatório servir de papel
de trabalho. O que você digita neles fica no navegador e some ao fechar a aba.

**Se você exportar a análise em JSON ou imprimir o relatório em PDF, o arquivo gerado passa a conter o que você
digitou.** A partir daí, a guarda desse arquivo é responsabilidade sua, como controlador, nos termos da LGPD. A
recomendação é usar código interno em vez de nome completo.

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

Apoio voluntário ao projeto: https://livetip.gg/libertcontador
