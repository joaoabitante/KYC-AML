/* =====================================================================
   KYC AML Lite Brasil — script.js
   100% local · sem backend · sem armazenamento de dados pessoais
   Sem localStorage para dados de cliente. Contadores apenas em memória.
   ===================================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------------
     1) DEFINIÇÃO DA MATRIZ DE RISCO
     - peso: pontos somados quando a resposta é a "de risco"
     - inverted: se true, a resposta de risco é "NÃO" (ex.: origem NÃO comprovada)
     - rec: recomendação de diligência associada ao fator
  ---------------------------------------------------------------- */
  var QUESTIONS = [
    { id: "pep",     text: "O cliente é Pessoa Exposta Politicamente (PEP)?",
      weight: 20, inverted: false,
      rec: "Aplicar Due Diligence Reforçada (EDD), aprovação por instância superior e monitoramento contínuo das operações." },
    { id: "va",      text: "Opera com ativos virtuais (criptoativos)?",
      weight: 12, inverted: false,
      rec: "Verificar conformidade do prestador (VASP), rastrear origem/destino dos ativos e observar a Lei 14.478/2022." },
    { id: "intl",    text: "Possui movimentação financeira internacional?",
      weight: 10, inverted: false,
      rec: "Avaliar países envolvidos, finalidade das remessas e compatibilidade com a atividade declarada." },
    { id: "cash",    text: "Utiliza dinheiro em espécie de forma relevante?",
      weight: 10, inverted: false,
      rec: "Reforçar registro e justificativa econômica das operações em espécie; atenção a fracionamento (smurfing)." },
    { id: "third",   text: "Utiliza terceiros / interpostas pessoas nas operações?",
      weight: 8,  inverted: false,
      rec: "Identificar o beneficiário final e a relação entre as partes; investigar possível uso de laranjas." },
    { id: "origin",  text: "A origem dos recursos está comprovada?",
      weight: 15, inverted: true,
      rec: "Exigir documentação comprobatória da origem dos recursos antes de prosseguir com a relação." },
    { id: "juris",   text: "Opera com jurisdição de maior risco / país monitorado pelo GAFI?",
      weight: 15, inverted: false,
      rec: "Aplicar EDD, consultar listas de países de alto risco do GAFI/FATF e intensificar o monitoramento." },
    { id: "new",     text: "Empresa recém-criada (menos de 12 meses)?",
      weight: 8,  inverted: false,
      rec: "Verificar atos constitutivos, capacidade econômica e coerência entre faturamento e movimentação." },
    { id: "complex", text: "Possui estrutura societária complexa / opaca?",
      weight: 12, inverted: false,
      rec: "Mapear cadeia societária até o beneficiário final efetivo; investigar offshores e camadas societárias." }
  ];

  var MAX_SCORE = QUESTIONS.reduce(function (s, q) { return s + q.weight; }, 0); // 110

  /* Estado das respostas: true = "Sim", false = "Não" */
  var answers = {};
  QUESTIONS.forEach(function (q) {
    // estado inicial sem risco: origem comprovada (Sim), demais Não
    answers[q.id] = q.inverted ? true : false;
  });

  /* Contadores da sessão (somente memória) */
  var session = { total: 0, low: 0, med: 0, high: 0 };

  /* Último relatório gerado */
  var lastReport = null;

  /* ----------------------------------------------------------------
     2) HELPERS
  ---------------------------------------------------------------- */
  function $(sel) { return document.querySelector(sel); }

  function classify(score) {
    if (score <= 30) return { key: "low",  label: "Risco Baixo",  cls: "risk-low",  color: getColor("--low") };
    if (score <= 60) return { key: "med",  label: "Risco Médio",  cls: "risk-med",  color: getColor("--med") };
    return            { key: "high", label: "Risco Alto",   cls: "risk-high", color: getColor("--high") };
  }

  function getColor(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || "#888";
  }

  function computeScore() {
    var score = 0;
    var factors = [];
    QUESTIONS.forEach(function (q) {
      var isRisk = q.inverted ? (answers[q.id] === false) : (answers[q.id] === true);
      if (isRisk) {
        score += q.weight;
        factors.push(q);
      }
    });
    return { score: score, factors: factors };
  }

  function nowStamp() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear() +
           " às " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  /* ----------------------------------------------------------------
     3) RENDER DA MATRIZ
  ---------------------------------------------------------------- */
  function renderMatrix() {
    var form = $("#riskForm");
    form.innerHTML = "";
    QUESTIONS.forEach(function (q) {
      var item = document.createElement("div");
      item.className = "q-item";
      item.dataset.id = q.id;

      var main = document.createElement("div");
      main.className = "q-main";
      main.innerHTML =
        '<div class="q-text">' + q.text + '</div>' +
        '<div class="q-meta">Peso de risco: <span class="q-weight">+' + q.weight + '</span>' +
        (q.inverted ? ' · resposta de risco: NÃO' : '') + '</div>';

      var seg = document.createElement("div");
      seg.className = "segmented" + (q.inverted ? " inverted" : "");
      seg.setAttribute("role", "group");

      var btnNo = document.createElement("button");
      btnNo.type = "button"; btnNo.textContent = "Não"; btnNo.dataset.val = "no";
      var btnYes = document.createElement("button");
      btnYes.type = "button"; btnYes.textContent = "Sim"; btnYes.dataset.val = "yes";

      seg.appendChild(btnNo); seg.appendChild(btnYes);

      btnNo.addEventListener("click", function () { setAnswer(q.id, false); });
      btnYes.addEventListener("click", function () { setAnswer(q.id, true); });

      item.appendChild(main);
      item.appendChild(seg);
      form.appendChild(item);
    });
    refreshSegments();
  }

  function setAnswer(id, value) {
    answers[id] = value;
    refreshSegments();
    updateLive();
  }

  function refreshSegments() {
    QUESTIONS.forEach(function (q) {
      var item = document.querySelector('.q-item[data-id="' + q.id + '"]');
      if (!item) return;
      var seg = item.querySelector(".segmented");
      var btnNo = seg.querySelector('[data-val="no"]');
      var btnYes = seg.querySelector('[data-val="yes"]');
      btnNo.className = ""; btnYes.className = "";
      if (answers[q.id] === true) { btnYes.className = "active-yes"; }
      else { btnNo.className = "active-no"; }

      var isRisk = q.inverted ? (answers[q.id] === false) : (answers[q.id] === true);
      item.classList.toggle("is-risk", isRisk);
    });
  }

  /* ----------------------------------------------------------------
     4) ATUALIZAÇÃO EM TEMPO REAL (score, badges, barras, medidor)
  ---------------------------------------------------------------- */
  function updateLive() {
    var r = computeScore();
    var c = classify(r.score);
    var pct = Math.min(100, Math.round((r.score / MAX_SCORE) * 100));

    // Hero
    $("#gaugeScore").textContent = r.score;
    setBadge($("#gaugeBadge"), c);
    setProgress($("#scoreProgress"), pct, c.color);

    // Painel lateral matriz
    $("#sideScore").textContent = r.score;
    setBadge($("#sideBadge"), c);
    setProgress($("#sideProgress"), pct, c.color);

    drawGauge(r.score);
  }

  function setBadge(el, c) {
    el.textContent = c.label;
    el.className = "risk-badge " + c.cls;
  }
  function setProgress(el, pct, color) {
    el.style.width = pct + "%";
    el.style.background = color;
  }

  /* ----------------------------------------------------------------
     5) GERAÇÃO DE RELATÓRIO
  ---------------------------------------------------------------- */
  function buildReport() {
    var r = computeScore();
    var c = classify(r.score);
    var stamp = nowStamp();

    var factorLines = r.factors.length
      ? r.factors.map(function (q) {
          var label = q.inverted ? (q.text.replace("?", "") + " → NÃO") : q.text.replace("?", "");
          return "  • " + label + "  (+" + q.weight + ")";
        }).join("\n")
      : "  • Nenhum fator de risco relevante identificado.";

    var recLines = r.factors.length
      ? r.factors.map(function (q, i) { return "  " + (i + 1) + ". " + q.rec; }).join("\n")
      : "  • Diligência simplificada compatível com baixo risco, mantendo monitoramento de rotina.";

    var text =
"============================================================\n" +
"   RELATÓRIO DE ANÁLISE PRELIMINAR DE RISCO AML / KYC\n" +
"   KYC AML Lite Brasil — ferramenta educacional\n" +
"============================================================\n\n" +
"Data da análise..: " + stamp + "\n" +
"Score de risco...: " + r.score + " / " + MAX_SCORE + " pontos\n" +
"Classificação....: " + c.label.toUpperCase() + "\n\n" +
"------------------------------------------------------------\n" +
"FATORES DE RISCO IDENTIFICADOS\n" +
"------------------------------------------------------------\n" +
factorLines + "\n\n" +
"------------------------------------------------------------\n" +
"RECOMENDAÇÕES DE DILIGÊNCIA\n" +
"------------------------------------------------------------\n" +
recLines + "\n\n" +
"------------------------------------------------------------\n" +
"FAIXAS DE CLASSIFICAÇÃO\n" +
"------------------------------------------------------------\n" +
"  0 – 30  : Risco baixo\n" +
"  31 – 60 : Risco médio\n" +
"  61 +    : Risco alto\n\n" +
"------------------------------------------------------------\n" +
"AVISO JURÍDICO\n" +
"------------------------------------------------------------\n" +
"Esta ferramenta possui finalidade exclusivamente educacional e\n" +
"não substitui análise jurídica, regulatória, contábil ou de\n" +
"compliance. Nenhum dado pessoal foi coletado ou armazenado.\n" +
"============================================================\n";

    lastReport = {
      gerado_em: stamp,
      score: r.score,
      score_maximo: MAX_SCORE,
      classificacao: c.label,
      faixa: c.key,
      fatores_de_risco: r.factors.map(function (q) {
        return { id: q.id, fator: q.text, peso: q.weight, resposta_de_risco: q.inverted ? "NÃO" : "SIM" };
      }),
      recomendacoes: r.factors.length ? r.factors.map(function (q) { return q.rec; })
                                      : ["Diligência simplificada compatível com baixo risco."],
      aviso: "Ferramenta educacional. Não substitui análise jurídica, regulatória, contábil ou de compliance.",
      privacidade: "Nenhum dado pessoal coletado ou armazenado. Processamento 100% local."
    };

    $("#reportOutput").textContent = text;
    return text;
  }

  /* ----------------------------------------------------------------
     6) DASHBOARD / SESSÃO
  ---------------------------------------------------------------- */
  function registerAnalysis() {
    if (!lastReport) { buildReport(); }
    session.total += 1;
    if (lastReport.faixa === "low") session.low += 1;
    else if (lastReport.faixa === "med") session.med += 1;
    else session.high += 1;
    renderDashboard();
    flash("Análise registrada no painel da sessão ✓");
  }

  function renderDashboard() {
    $("#statTotal").textContent = session.total;
    $("#statLow").textContent = session.low;
    $("#statMed").textContent = session.med;
    $("#statHigh").textContent = session.high;
    $("#legLow").textContent = session.low;
    $("#legMed").textContent = session.med;
    $("#legHigh").textContent = session.high;
    drawDonut();
  }

  function resetSession() {
    session = { total: 0, low: 0, med: 0, high: 0 };
    renderDashboard();
    flash("Painel da sessão zerado.");
  }

  /* ----------------------------------------------------------------
     7) EXPORTAÇÃO / CÓPIA (somente download local)
  ---------------------------------------------------------------- */
  function download(filename, content, mime) {
    var blob = new Blob([content], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  function fileStamp() {
    var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes());
  }

  function copyReport() {
    var text = $("#reportOutput").textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { flash("Relatório copiado ✓"); },
        function () { fallbackCopy(text); }
      );
    } else { fallbackCopy(text); }
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); flash("Relatório copiado ✓"); }
    catch (e) { flash("Não foi possível copiar."); }
    document.body.removeChild(ta);
  }

  function flash(msg) {
    var el = $("#toolbarMsg");
    el.textContent = msg;
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.textContent = ""; }, 2600);
  }

  /* ----------------------------------------------------------------
     8) GRÁFICOS EM CANVAS (vanilla, sem dependências externas)
  ---------------------------------------------------------------- */
  function drawGauge(score) {
    var cv = $("#gaugeCanvas"); if (!cv) return;
    var ctx = cv.getContext("2d");
    var W = cv.width, H = cv.height;
    var cx = W / 2, cy = H - 20, R = 120;
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round";

    // trilho de fundo (semicírculo)
    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = getColor("--surface-2");
    ctx.arc(cx, cy, R, Math.PI, 2 * Math.PI);
    ctx.stroke();

    // faixas coloridas
    var bands = [
      { from: 0,  to: 30,  color: getColor("--low") },
      { from: 31, to: 60,  color: getColor("--med") },
      { from: 61, to: MAX_SCORE, color: getColor("--high") }
    ];
    bands.forEach(function (b) {
      var a0 = Math.PI + (b.from / MAX_SCORE) * Math.PI;
      var a1 = Math.PI + (Math.min(b.to, MAX_SCORE) / MAX_SCORE) * Math.PI;
      ctx.beginPath(); ctx.lineWidth = 8; ctx.globalAlpha = .35;
      ctx.strokeStyle = b.color; ctx.arc(cx, cy, R + 16, a0, a1); ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // arco do score atual
    var frac = Math.min(1, score / MAX_SCORE);
    var c = classify(score);
    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = c.color;
    ctx.arc(cx, cy, R, Math.PI, Math.PI + frac * Math.PI);
    ctx.stroke();

    // ponteiro
    var ang = Math.PI + frac * Math.PI;
    ctx.beginPath();
    ctx.strokeStyle = getColor("--text");
    ctx.lineWidth = 3;
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ang) * (R - 6), cy + Math.sin(ang) * (R - 6));
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = getColor("--text");
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI); ctx.fill();
  }

  function drawDonut() {
    var cv = $("#donutCanvas"); if (!cv) return;
    var ctx = cv.getContext("2d");
    var W = cv.width, H = cv.height, cx = W / 2, cy = H / 2, R = 90, r = 56;
    ctx.clearRect(0, 0, W, H);

    var data = [
      { v: session.low,  color: getColor("--low") },
      { v: session.med,  color: getColor("--med") },
      { v: session.high, color: getColor("--high") }
    ];
    var total = data.reduce(function (s, d) { return s + d.v; }, 0);

    if (total === 0) {
      ctx.beginPath(); ctx.lineWidth = R - r;
      ctx.strokeStyle = getColor("--surface-2");
      ctx.arc(cx, cy, (R + r) / 2, 0, 2 * Math.PI); ctx.stroke();
      ctx.fillStyle = getColor("--text-mute");
      ctx.font = "600 13px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("Sem dados", cx, cy);
      return;
    }

    var start = -Math.PI / 2;
    data.forEach(function (d) {
      if (d.v === 0) return;
      var slice = (d.v / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.fillStyle = d.color;
      ctx.arc(cx, cy, R, start, start + slice);
      ctx.closePath(); ctx.fill();
      start += slice;
    });

    // furo central
    ctx.beginPath();
    ctx.fillStyle = getColor("--surface");
    ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.fill();

    ctx.fillStyle = getColor("--text");
    ctx.font = "800 26px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(String(total), cx, cy - 6);
    ctx.fillStyle = getColor("--text-mute");
    ctx.font = "600 11px sans-serif";
    ctx.fillText("análises", cx, cy + 14);
  }

  /* ----------------------------------------------------------------
     9) TEMA (modo escuro) — preferência salva apenas como flag de UI
  ---------------------------------------------------------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("kyc_theme", theme); } catch (e) {}
    // Redesenhar gráficos para refletir novas cores do tema
    updateLive();
    drawDonut();
  }
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("kyc_theme"); } catch (e) {}
    if (!saved) {
      saved = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", saved);
  }

  /* ----------------------------------------------------------------
     10) BIND DE EVENTOS + INICIALIZAÇÃO
  ---------------------------------------------------------------- */
  function bind() {
    $("#themeToggle").addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      applyTheme(cur === "dark" ? "light" : "dark");
    });

    $("#genReport").addEventListener("click", function () {
      buildReport();
      document.getElementById("relatorio").scrollIntoView({ behavior: "smooth" });
    });
    $("#clearForm").addEventListener("click", function () {
      QUESTIONS.forEach(function (q) { answers[q.id] = q.inverted ? true : false; });
      refreshSegments(); updateLive();
      flash("Respostas limpas.");
    });

    $("#registerBtn").addEventListener("click", registerAnalysis);
    $("#copyBtn").addEventListener("click", function () { buildReport(); copyReport(); });
    $("#exportTxt").addEventListener("click", function () {
      var text = buildReport();
      download("relatorio-aml-" + fileStamp() + ".txt", text, "text/plain;charset=utf-8");
      flash("Arquivo TXT gerado ✓");
    });
    $("#exportJson").addEventListener("click", function () {
      buildReport();
      download("relatorio-aml-" + fileStamp() + ".json",
               JSON.stringify(lastReport, null, 2), "application/json;charset=utf-8");
      flash("Arquivo JSON gerado ✓");
    });
    $("#resetSession").addEventListener("click", resetSession);

    // Redesenhar gráficos ao redimensionar (densidade de pixels estável)
    window.addEventListener("resize", function () { drawGauge(computeScore().score); drawDonut(); });
  }

  function init() {
    initTheme();
    renderMatrix();
    renderDashboard();
    updateLive();
    bind();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
