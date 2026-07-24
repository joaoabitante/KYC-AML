# Changelog

Todas as mudanças relevantes deste projeto são registradas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).
Histórico anterior a este arquivo: ver commits do repositório e o README.

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
