# Changelog

Todas as mudanças relevantes deste projeto são registradas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).
Histórico anterior a este arquivo: ver commits do repositório e o README.

## [3.0.0] - 2026-07-24
### Adicionado
- **Três páginas de conteúdo**, cada uma com título, descrição, canonical e dados
  estruturados próprios — o site deixa de tentar ranquear tudo numa única URL:
  - `obrigacoes-coaf.html` — quem é pessoa obrigada, tabela de setores com regulador e
    norma, declaração de não ocorrência e cadastro no Siscoaf. Sete perguntas em FAQPage,
    idênticas ao texto visível.
  - `glossario.html` — 31 termos de PLD/FT, cada um com âncora estável e a norma aplicável,
    marcados como DefinedTermSet.
  - `metodologia.html` — a fundamentação pública do modelo: os nove pesos com justificativa,
    as três faixas com a diligência esperada e as quatro regras de sobreposição. Conferido
    fator por fator contra o código em produção.
- Navegação, links contextuais e `sitemap.xml` cobrindo as quatro URLs.

## [2.5.0] - 2026-07-24
### Adicionado
- **Cinco normas na base regulatória**, cada uma conferida em fonte oficial e passada por
  checagem factual independente: Resolução Coaf nº 36/2021, Resolução Coaf nº 40/2021 (a que
  define PEP — o fator de maior peso da matriz), Resolução CVM nº 50/2021 (com a alteração da
  Resolução CVM nº 245/2026, vigente desde 15/07/2026), Circular Susep nº 612/2020 e
  Lei nº 13.810/2019 (sanções do CSNU). A base passou de 6 para 11 normas.
- Card **"Sanção não é risco: obrigação de resultado × obrigação de meio"**, explicando por que
  a triagem em listas restritivas não é substituível por pontuação de risco — e dizendo com
  todas as letras que esta ferramenta **não consulta listas de sanções**.
- `og:image:alt` e `twitter:image:alt` para leitores de tela e prévias de compartilhamento.

## [2.4.0] - 2026-07-24
### Adicionado
- Seção **Sobre o autor**, com a credencial CRC-SP, o motivo de a ferramenta existir e
  links do ecossistema (joao.abitante.net, contbit.tax, GitHub, LinkedIn).
- **Apoio via LiveTip** (livetip.gg/libertcontador): doação voluntária, sem nenhuma
  função da ferramenta condicionada a pagamento, com aviso de que o link leva a um
  serviço de terceiro.
- **Log de atualizações visível na própria página**, incluindo as correções de erro —
  padrão dos projetos do autor. O histórico completo continua no CHANGELOG.

## [2.3.0] - 2026-07-24
### Corrigido
- **Resolução CFC nº 1.721/2024 com vigência e revogação erradas** (publicadas na onda 1):
  a entrada em vigor não foi 03/06/2024 — essa data foi adiada para **02/09/2024** pela
  Resolução CFC nº 1.728/2024; e a norma revogada foi a Resolução CFC nº 1.530/2017,
  não diretamente a 1.445/2013. Erro encontrado na checagem cruzada da onda 4.

## [2.2.0] - 2026-07-24
### Adicionado
- **Listas do GAFI embarcadas na página.** A matriz perguntava "opera com jurisdição de
  maior risco / país monitorado pelo GAFI?" e mandava o usuário sair do app para
  descobrir a resposta. Agora a pergunta traz as 25 jurisdições — 3 sob chamado para
  ação (Coreia do Norte, Irã, Mianmar) e 22 sob monitoramento reforçado — conforme a
  plenária de 19/06/2026, com a data de conferência à vista e link para a fonte oficial.
  O dado vem embarcado no HTML: **nenhuma requisição de rede no navegador**, `connect-src
  'none'` intacto. Quando a jurisdição é marcada, o relatório registra qual plenária foi
  usada como referência.
- **Workflow `.github/workflows/gafi.yml`**: roda após cada plenária (março, julho e
  novembro) e abre issue lembrando de conferir a lista contra a fonte oficial. Não
  atualiza sozinho de propósito — lista regulatória não entra no ar sem revisão humana.
- **Importar análise anterior (JSON)**, fechando o ciclo da revisão periódica exigida
  pela abordagem baseada em risco. O export passou a incluir as respostas cruas e um
  schema versionado (`kyc-aml-lite/1`); a importação usa `FileReader`, que lê o arquivo
  local sem nenhuma requisição de rede. Ao importar, o app mostra a variação: "o risco
  subiu 15 pontos: de 47 (Risco Médio) para 62 (Risco Alto)". Arquivo de outra origem
  ou corrompido é recusado com mensagem clara.
- **Checklist de cadastro e diligência** com 7 blocos (pessoa física, pessoa jurídica,
  PEP, ativos virtuais/PSAV, jurisdição de maior risco, origem não comprovada,
  beneficiário final e interpostas pessoas). Os blocos aplicáveis ao caso são destacados
  automaticamente conforme as respostas da matriz.

### Alterado
- Título e descrição reposicionados para o termo que o público realmente busca:
  "Matriz de Risco PLD/FT — análise KYC gratuita e sem cadastro". A descrição troca
  jargão ("Privacy by Design", "sem backend") pelo benefício concreto.

## [2.1.0] - 2026-07-24
### Corrigido
- **Contraste abaixo de AA em todos os rótulos de risco**, inclusive no aviso jurídico
  (que estava em 2,30:1 — o pior do app). Separada a cor de preenchimento da cor de
  tinta: `--low/--med/--high` continuam pintando gráficos e barras, e novos tokens
  `--*-ink` / `--*-solid` cuidam do texto. Medido no navegador: 5,81 a 6,53:1 no tema
  claro e 6,5 a 9,62:1 no escuro; botões ativos em 6,53:1 e 7,46:1.
- **Matriz inutilizável em leitor de tela**: os botões Sim/Não não expunham o estado
  escolhido. Agora têm `aria-pressed`, nome acessível com o texto da pergunta e o grupo
  é rotulado. O medidor em canvas passou a ter descrição textual que acompanha o score,
  e o resultado é anunciado em região `aria-live`.
- **Nenhuma regra de foco visível** em todo o CSS. Adicionado `:focus-visible` com
  contorno de 3px, ajustado para o tema escuro e para as faixas escuras (hero, cabeçalho
  e rodapé).
- **Menu sumia abaixo de 720px** sem substituto: virou faixa rolável horizontal.
- Alvos de toque no celular passaram de 35px para 45px de altura.
- **"Funciona offline" era promessa não cumprida** (não há service worker): trocado por
  "Roda inteiro no seu navegador", que é verificável.

### Adicionado
- `@media print`: o relatório saía cortado em 560px ao imprimir. Agora sai inteiro, sem
  cabeçalho, hero, painéis nem rodapé, com procedência no pé da página. Botão
  "Imprimir / salvar PDF" na barra do relatório.
- Campos opcionais de **identificação do cliente e do analista**, para o relatório servir
  de papel de trabalho. Texto puro, nunca interpretado como HTML, sem persistência de
  nenhum tipo, com aviso sobre a responsabilidade do usuário como controlador na LGPD.
- Seção **Dúvidas frequentes** com 8 perguntas reais do público (obrigação do contador,
  PEP, beneficiário final, relação entre faixa de risco e comunicação ao Coaf) e
  dados estruturados `FAQPage`.
- `Person` no JSON-LD com `hasCredential` do CRC-SP e `@id` estável compartilhado com os
  demais projetos do autor; `datePublished`/`dateModified`.
- Link "pular para a matriz" para navegação por teclado, `<noscript>` explicando por que
  a matriz depende de JavaScript, e suporte a `prefers-reduced-motion`.

## [2.0.0] - 2026-07-24
### Corrigido
- **Base regulatória com três ementas erradas.** A Resolução BCB nº 96/2021 trata de
  contas de pagamento e a Resolução BCB nº 397/2024 trata de critérios contábeis de
  instrumentos financeiros — nenhuma das duas é norma de PLD/FT, mas eram citadas como
  tal. Substituídas pela **Circular BCB nº 3.978/2020** (a norma de PLD/FT do BCB) e pela
  **Resolução CFC nº 1.721/2024** (obrigações de PLD/FT dos profissionais e organizações
  contábeis, em vigor desde 03/06/2024). A Resolução BCB nº 520/2025 foi redescrita como
  o marco das PSAVs, com a vigência correta (02/02/2026). Cada norma agora traz ano e
  link para a fonte oficial.
- **A matriz classificava um cliente PEP como "Risco Baixo"** (20 pontos, faixa ≤30),
  contradizendo a diligência reforçada que a própria página educacional ensina.
  Introduzidas **regras de sobreposição** que impõem piso à classificação,
  independentemente do escore: PEP → mínimo Médio com EDD; PEP com origem não
  comprovada, jurisdição de maior risco com origem não comprovada, e estrutura opaca
  com interpostas pessoas → mínimo Alto. O motivo aparece na tela e no relatório.
- **A matriz já vinha respondida**, permitindo exportar um relatório de "RISCO BAIXO"
  sem responder nada. Agora as perguntas começam sem resposta, há indicador de progresso
  e as ações de gerar/registrar/copiar/exportar ficam bloqueadas até a matriz completar.

### Adicionado
- Aviso, na página e no relatório exportado, de que a ferramenta não gera nem substitui
  a comunicação obrigatória ao Coaf, que independe da faixa de risco.
- Relatório passa a registrar a versão da matriz, a classificação por escore e as regras
  de sobreposição aplicadas — tanto no TXT quanto no JSON.
- Autoria visível no rodapé (Contador CRC-SP 320961/O-4) e data de conferência normativa.

### Removido
- `script.js` e `style.css`: eram cópias mortas do código que já roda inline no
  `index.html` — editá-los não surtia efeito no site.
- Favicon emoji em `data:` URI que sobrescrevia os ícones da marca.

## [1.1.0] - 2026-07-23
### Adicionado
- SEO completo: canonical, Open Graph + Twitter Card, JSON-LD (WebApplication),
  robots.txt, sitemap.xml, favicons e og.png no domínio kyc.contbit.tax.
- Domínio próprio: https://kyc.contbit.tax (CNAME Cloudflare → Vercel).

## [1.0.0] - 2026-07-23
### Publicado
- Site no ar: https://kyc-aml.vercel.app (Vercel, deploy automático via GitHub).
- `vercel.json` com headers de segurança (CSP, HSTS, nosniff, no-referrer, X-Frame-Options).

### Adicionado
- `AGENTS.md` e `CLAUDE.md` com contexto do projeto para assistentes de IA.
- Este `CHANGELOG.md`.
