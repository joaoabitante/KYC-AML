# AGENTS.md — KYC AML Lite Brasil

> Contexto para qualquer assistente de IA (Claude Code, Codex, Cursor, Gemini CLI…).
> Autor: João Carlos Bueno Abitante (Contador CRC-SP 320961/O-4).

## Identidade
- **Projeto:** ferramenta educacional gratuita de análise preliminar de risco PLD/FT e KYC. Roda inteira no navegador, sem cadastro e sem envio de dados.
- **Repo:** github.com/joaoabitante/KYC-AML · **Domínio:** kyc.contbit.tax · **Hospedagem:** Vercel (deploy automático no push).
- **Stack:** um único `index.html` com CSS e JS embutidos. **Não existem `script.js` nem `style.css`** — eram cópias mortas e foram removidos em 24/07/2026. Editar arquivo separado não surte efeito: tudo vive no `index.html`.
- **Aviso obrigatório:** finalidade exclusivamente educacional; não substitui análise jurídica, regulatória, contábil ou de compliance; **não gera nem dispensa a comunicação ao Coaf**. Manter esses avisos em qualquer mudança — há teste de CI que falha se sumirem.

## Regras específicas deste projeto (aprendidas na auditoria de 24/07/2026)
- **Norma citada só entra com número, ano e ementa conferidos na fonte oficial**, e de preferência em duas fontes. O site já publicou três ementas erradas (Res. BCB 96 e 397 como se fossem PLD/FT) e uma data de vigência errada. Se não confirmar, não publique.
- **Normas hoje citadas e conferidas:** Lei 9.613/1998 (alterada pela Lei 12.683/2012), Lei 14.478/2022, Resolução CFC nº 1.721/2024 (vigente desde 02/09/2024, prorrogada pela Res. CFC 1.728/2024; revogou a Res. CFC 1.530/2017), Circular BCB nº 3.978/2020, Resolução BCB nº 520/2025 (vigência 02/02/2026), Recomendações GAFI/FATF. **Não reintroduza as Resoluções BCB 96 ou 397 como normas de PLD/FT.**
- **Modelo de risco:** 9 fatores ponderados (máx. 110) + **regras de sobreposição** que impõem piso à classificação. PEP nunca pode cair em "Risco Baixo". Ao mexer em peso ou faixa, revise as regras de sobreposição e a seção de metodologia juntas.
- **Listas do GAFI** ficam embarcadas entre `<!-- GAFI:START -->` e `<!-- GAFI:END -->` no `index.html`. Mudam três vezes por ano; `.github/workflows/gafi.yml` abre issue a cada plenária. Nunca buscar por rede em runtime.
- **Entrada de texto do usuário** (cliente/analista) vai ao relatório com `textContent`. **Nunca use `innerHTML` com dado digitado** — é o ponto que quebra a segurança do app.
- `.github/workflows/privacidade.yml` falha o PR se entrar `fetch`, CDN, tracker, armazenamento de dado pessoal ou se o aviso jurídico sumir. Não contorne: conserte a causa.

## Como trabalhar
- Leia o `README.md` e o `CHANGELOG.md` deste projeto (se existirem) antes de qualquer mudança.
- O **GitHub é a única fonte da verdade**; a Vercel é espelho (deploy automático no push).
- Nunca faça deploy manual (`vercel --prod`) nem publique com árvore suja; nunca edite no painel da Vercel.
- Trabalhe em branch (`fix/descricao-curta`); commits atômicos (`fix:`, `chore:`, `seo:`).
- Mantenha o `CHANGELOG.md` atualizado a cada entrega (padrão de todos os projetos do autor).
- Nunca commite segredo; env vars vivem só na Vercel e o nome (sem valor) vai em `.env.example`.

## Princípios não-negociáveis
- **Privacidade/LGPD:** zero coleta de dado pessoal; ferramentas client-side não fazem requisição de rede em runtime; zero tracker/analytics de terceiros; `referrer: no-referrer`.
- **Dependências:** preferir solução estática e autocontida (single-file quando possível), sem CDN e sem framework desnecessário.
- **Linguagem:** pt-BR direto e concreto, sem buzzword; nunca prometer função que não existe.
- **SEO e segurança:** meta tags + OpenGraph + canonical + JSON-LD nas páginas públicas; headers no `vercel.json` (CSP restritiva, HSTS, nosniff, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`).
- **Acessibilidade:** `lang="pt-BR"`, contraste AA, foco visível, `alt`/`aria`.

## Regras completas
As regras operacionais completas de todos os projetos estão em `../AGENTS.md`
(raiz da pasta mãe Projetos) e o catálogo em `../projetos.json`. Se este repo
foi clonado fora da pasta mãe, este arquivo já cobre o essencial.
