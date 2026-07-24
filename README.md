# 🛡️ KYC AML Lite Brasil

**Ferramenta educacional gratuita para análise preliminar de risco AML/KYC**, construída sob o conceito **Privacy by Design** e pensada para rodar 100% no navegador, ideal para publicação em **GitHub Pages**.

> ⚠️ **Aviso jurídico:** Esta ferramenta possui finalidade exclusivamente educacional e **não substitui análise jurídica, regulatória, contábil ou de compliance**.

---

## 🎯 Objetivo

Ajudar **pequenas empresas, contadores, fintechs, VASPs e profissionais de compliance** a realizarem uma **análise preliminar de risco** AML/KYC, de forma simples, transparente e sem coleta de dados.

A aplicação aplica uma **matriz de risco com pesos** e uma **abordagem baseada em risco (ABR)** para gerar um score, classificar o cliente/operação e sugerir recomendações de diligência.

---

## 🔒 Privacy by Design

A ferramenta **não coleta, não transmite e não armazena** nenhum dos seguintes dados:

CPF · Nome · RG · CNH · Endereço · Telefone · E-mail · Selfie · Biometria · Documento de identificação · Carteiras de criptomoedas.

**Garantias técnicas:**

- ✅ Sem backend
- ✅ Sem banco de dados
- ✅ Sem login
- ✅ Sem cookies
- ✅ Sem API externa / CDN
- ✅ Funciona offline (após o primeiro carregamento)

> O único item gravado no navegador é uma **preferência de tema** (claro/escuro) via `localStorage` — uma flag de UI que **não contém qualquer dado pessoal**. Os contadores do painel existem **apenas em memória** e são zerados ao recarregar a página.

---

## 🧩 Funcionalidades

| # | Recurso | Descrição |
|---|---------|-----------|
| 1 | **Painel AML** | Total de análises na sessão e contagem por risco (baixo/médio/alto). |
| 2 | **Matriz de risco** | 9 fatores ponderados (PEP, ativos virtuais, internacional, espécie, terceiros, origem dos recursos, jurisdição, empresa nova, estrutura societária). |
| 3 | **Score automático** | Cálculo em tempo real conforme as respostas. |
| 4 | **Classificação** | `0–30` Baixo · `31–60` Médio · `61+` Alto. |
| 5 | **Relatório** | Data, score, classificação, fatores encontrados e recomendações — com botão **Copiar Relatório**. |
| 6 | **Exportação** | Download local em **TXT** e **JSON** (nenhum envio externo). |
| 7 | **Página educacional** | KYC, AML, PLD/FT, Due Diligence e Abordagem Baseada em Risco. |
| 8 | **Base regulatória** | Lei 9.613/1998, Lei 14.478/2022, Resoluções BCB 96/397/520 e GAFI/FATF. |

### ⭐ Bônus

- 📊 **Gráfico de risco** (medidor + rosca) desenhado em **Canvas puro**, sem dependências externas.
- 🌗 **Modo escuro** com detecção da preferência do sistema.
- 🟢 **Indicador de risco em tempo real**.
- 📶 **Barra de progresso do score**.

> **Nota sobre o Chart.js:** o requisito exige funcionamento **sem API/CDN externa**. Para honrar isso integralmente, os gráficos foram implementados em **Canvas nativo (Vanilla JS)**, eliminando qualquer dependência de rede. Caso prefira usar o **Chart.js de forma local**, baixe o arquivo `chart.umd.min.js` para a pasta do projeto e referencie-o no `index.html` com `<script src="chart.umd.min.js"></script>` — assim ele permanece offline, sem CDN.

---

## 🛠️ Tecnologias

- **HTML5**
- **CSS3** (variáveis CSS, tema claro/escuro)
- **JavaScript Vanilla** (sem frameworks, sem build)

Arquivos do projeto:

```
kyc-aml-lite-brasil/
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 💻 Instalação / Uso local

Não há etapa de build. Basta abrir o arquivo:

```bash
# 1. Clone ou baixe o repositório
git clone https://github.com/SEU-USUARIO/kyc-aml-lite-brasil.git
cd kyc-aml-lite-brasil

# 2. Abra o index.html no navegador
#    (duplo clique) ou sirva localmente:
python3 -m http.server 8080
# acesse http://localhost:8080
```

---

## 🚀 Publicação no GitHub Pages

1. Crie um repositório no GitHub e envie os arquivos:

   ```bash
   git init
   git add .
   git commit -m "feat: KYC AML Lite Brasil"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/kyc-aml-lite-brasil.git
   git push -u origin main
   ```

2. No GitHub, vá em **Settings → Pages**.
3. Em **Build and deployment → Source**, selecione **Deploy from a branch**.
4. Escolha a branch **`main`** e a pasta **`/ (root)`** e clique em **Save**.
5. Aguarde alguns instantes. O site ficará disponível em:

   ```
   https://SEU-USUARIO.github.io/kyc-aml-lite-brasil/
   ```

> Como tudo é estático e roda no cliente, **nenhuma configuração adicional** é necessária.

---

## 🗺️ Roadmap futuro

- [ ] Perguntas com múltiplos níveis (baixo/médio/alto) por fator
- [ ] Conjuntos de pesos configuráveis por segmento (banco, fintech, VASP, contabilidade)
- [ ] Exportação adicional em PDF (gerado localmente)
- [ ] Modelos de relatório por tipo de cliente (PF / PJ)
- [ ] Internacionalização (PT / EN / ES)
- [ ] Listas de referência GAFI editáveis localmente
- [ ] Modo "checklist de onboarding" passo a passo
- [ ] Acessibilidade ampliada (ARIA, navegação por teclado, alto contraste)

---

## 📚 Base regulatória de referência

Lista educacional e **não exaustiva**. Sempre consulte as fontes oficiais.

- **Lei nº 9.613/1998** — Lei de Lavagem de Dinheiro (cria o COAF).
- **Lei nº 14.478/2022** — Marco legal dos ativos virtuais (VASPs).
- **Resolução BCB nº 96** — Política, procedimentos e controles de PLD/FT/FPADM.
- **Resolução BCB nº 397** — Prevenção e abordagem baseada em risco.
- **Resolução BCB nº 520** — Atualização de requisitos de PLD/FT e governança.
- **Recomendações GAFI/FATF** — Padrão internacional (40 Recomendações).

---

## 📄 Licença

Distribuído sob a **Licença MIT**.

```
MIT License

Copyright (c) 2025 KYC AML Lite Brasil

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

---

<p align="center">Feito com foco em <b>educação</b> e <b>privacidade</b> · Processamento 100% local no navegador.</p>
