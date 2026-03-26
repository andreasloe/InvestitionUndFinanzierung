const exerciseSets = [
  {
    id: "set1",
    title: "Aufgabenset 1",
    description: "Finanzmathematik",
    file: "./qti/set1.xml",
    resources: [{ label: "Übungs-PDF", href: "./exercises/uebungsaufgaben.pdf" }],
  },
  {
    id: "set1-extra",
    title: "Zusatz zu Set 1",
    description: "Ergänzende Aufgaben zu Finanzmathematik",
    file: "./qti/set1_extra.xml",
    resources: [{ label: "Übungs-PDF", href: "./exercises/uebungsaufgaben.pdf" }],
  },
  {
    id: "set2",
    title: "Aufgabenset 2",
    description: "Investitionsrechnung unter Sicherheit",
    file: "./qti/set2.xml",
    resources: [{ label: "Übungs-PDF", href: "./exercises/uebungsaufgaben.pdf" }],
  },
  {
    id: "set2-extra",
    title: "Zusatz zu Set 2",
    description: "Ergänzungen zu Sicherheit und Steuern",
    file: "./qti/set2_extra.xml",
    resources: [{ label: "Übungs-PDF", href: "./exercises/uebungsaufgaben.pdf" }],
  },
  {
    id: "set3",
    title: "Aufgabenset 3",
    description: "Fisher-Modell",
    file: "./qti/set3.xml",
    resources: [{ label: "Übungs-PDF", href: "./exercises/uebungsaufgaben.pdf" }],
  },
  {
    id: "set3-extra",
    title: "Zusatz zu Set 3",
    description: "Weitere Aufgaben zum Fisher-Modell",
    file: "./qti/set3_extra.xml",
    resources: [{ label: "Übungs-PDF", href: "./exercises/uebungsaufgaben.pdf" }],
  },
  {
    id: "set4",
    title: "Aufgabenset 4",
    description: "Investitionsrechnung unter Unsicherheit",
    file: "./qti/set4.xml",
    resources: [{ label: "Übungs-PDF", href: "./exercises/uebungsaufgaben.pdf" }],
  },
  {
    id: "set4-extra",
    title: "Zusatz zu Set 4",
    description: "Vertiefung und zusätzliche Rechenaufgaben",
    file: "./qti/set4_extra.xml",
    resources: [{ label: "Übungs-PDF", href: "./exercises/uebungsaufgaben.pdf" }],
  },
  {
    id: "mock",
    title: "Probeklausur",
    description: "Interaktive Fassung der numerischen Klausuraufgaben",
    file: "./qti/probeklausur.xml",
    resources: [{ label: "Klausur-PDF", href: "./exercises/probeklausur.pdf" }],
  },
];

const solutionDataPromise = fetch("./data/exercise_solutions.json")
  .then((response) => (response.ok ? response.json() : {}))
  .catch(() => ({}));

function decodeHtmlEntities(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value || "";
  return textarea.value;
}

function escapeHtml(value) {
  return (value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderMath(container) {
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise([container]).catch(() => {});
  }
}

const embeddedImageReplacements = {
  "xid-19619306_2": "$U(C_0,C_1)= C_0^{\\frac{3}{5}} \\cdot C_1^{\\frac{2}{5}}$",
  "xid-19619307_2": "$\\bar{C_0}=C_0+X_0$",
  "xid-19619308_2": "$C_1=(1+i)\\cdot X_0$",
  "xid-19619314_2": "$\\bar{C_0}$",
};

const embeddedAssetReplacements = {
  "xid-19619316_2": "./lectures/03_fisher.pdf",
  "xid-19619317_2": "./assets/thumb-fisher.png",
};

function preprocessEmbeddedReferences(html) {
  let output = decodeHtmlEntities(html || "");

  Object.entries(embeddedImageReplacements).forEach(([xid, formula]) => {
    const replacement = `<span class="inline-formula">${formula}</span>`;
    output = output.replace(
      new RegExp(`<img[^>]*${xid}[^>]*>`, "gi"),
      replacement
    );
  });

  Object.entries(embeddedAssetReplacements).forEach(([xid, target]) => {
    output = output.replace(
      new RegExp(`href="[^"]*${xid}[^"]*"`, "gi"),
      `href="${target}"`
    );
    output = output.replace(
      new RegExp(`<img([^>]*)src="[^"]*${xid}[^"]*"([^>]*)>`, "gi"),
      `<img$1src="${target}" class="embedded-figure"$2>`
    );
  });

  output = output.replace(
    /<img[^>]*@X@EmbeddedFile\.requestUrlStub@X@[^>]*>/gi,
    ""
  );

  return output;
}

function normalizeMinusSigns(value) {
  return (value || "")
    .replace(/([A-Za-zÄÖÜäöü])--([A-Za-zÄÖÜäöü])/g, "$1-$2")
    .replace(/(^|[|(=\s])--(?=\d)/g, "$1-")
    .replace(/(^|[|(=\s])-\s+(?=\d)/g, "$1-");
}

function normalizeMathSyntax(value) {
  return (value || "")
    .replace(/\\bar([A-Za-z])_([0-9])/g, "\\\\bar{$1}_$2")
    .replace(/\\bar([A-Za-z])/g, "\\\\bar{$1}")
    .replace(/\\frac\\partial\s*L\\partial\s*C_0/g, "\\\\frac{\\\\partial L}{\\\\partial C_0}")
    .replace(/\\frac\\partial\s*L\\partial\s*C_1/g, "\\\\frac{\\\\partial L}{\\\\partial C_1}")
    .replace(/\\frac\\partial\s*L\\partial\s*\\lambda/g, "\\\\frac{\\\\partial L}{\\\\partial \\\\lambda}")
    .replace(/\\fracC_1\(1\+i\)/g, "\\\\frac{C_1}{(1+i)}")
    .replace(/\\frac(-?\d)(-?\d)(?![\d{])/g, "\\\\frac{$1}{$2}")
    .replace(/\^\s*\\frac(-?\d)(-?\d)(?![\d{])/g, "^\\\\frac{$1}{$2}")
    .replace(/\\lambda/g, "\\\\lambda");
}

function prepareCellMath(value) {
  return normalizeMathSyntax(normalizeMinusSigns(value))
    .replace(/\$\s*/g, "$")
    .replace(/\s*\$/g, "$")
    .trim();
}

function renderCellContent(value) {
  const prepared = prepareCellMath(value);
  return escapeHtml(prepared);
}

function rewriteEmbeddedImage(node) {
  const src = node.getAttribute("src") || "";
  const match = src.match(/xid-\d+_\d+/);
  const replacement = match ? embeddedImageReplacements[match[0]] : "";
  if (!replacement && match && embeddedAssetReplacements[match[0]]) {
    node.setAttribute("src", embeddedAssetReplacements[match[0]]);
    node.classList.add("embedded-figure");
    node.setAttribute("alt", "Abbildung aus den Folien");
    return;
  }

  if (!replacement) {
    if (src.includes("@X@EmbeddedFile.requestUrlStub@X@")) {
      node.remove();
    }
    return;
  }

  const span = document.createElement("span");
  span.className = "inline-formula";
  span.textContent = replacement;
  node.replaceWith(span);
}

function cleanHtml(html, options = {}) {
  const template = document.createElement("template");
  template.innerHTML = preprocessEmbeddedReferences(html || "");

  const selectors = ["script", "style", "xml", "meta", "link", "applet", "object"];
  if (options.removeImages) {
    selectors.push("img");
  }

  template.content.querySelectorAll(selectors.join(", ")).forEach((node) => node.remove());

  if (!options.removeImages) {
    template.content.querySelectorAll("img").forEach((node) => rewriteEmbeddedImage(node));
    template.content.querySelectorAll("a").forEach((node) => {
      const href = node.getAttribute("href") || "";
      const match = href.match(/xid-\d+_\d+/);
      if (match && embeddedAssetReplacements[match[0]]) {
        node.setAttribute("href", embeddedAssetReplacements[match[0]]);
      } else if (href.includes("@X@EmbeddedFile.requestUrlStub@X@")) {
        node.removeAttribute("href");
      }
    });
  }

  template.content.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const preserveEmbeddedFigureClass =
        name === "class" && node.classList.contains("embedded-figure");
      if (
        name === "style" ||
        name.startsWith("on") ||
        ((name === "class" || name === "id") && !preserveEmbeddedFigureClass)
      ) {
        node.removeAttribute(attr.name);
      }
    });
  });

  return template.innerHTML.trim();
}

function textOrHtml(node, selector, options = {}) {
  const target = node.querySelector(selector);
  return cleanHtml(target ? target.textContent : "", options);
}

function normalizeQuestionKey(title) {
  const match = (title || "").match(/Aufgabe\s+\d+/);
  return match ? match[0].trim() : (title || "Aufgabe").trim();
}

function extractSubtaskSolution(solutionText, letter) {
  if (!solutionText || !letter) {
    return solutionText || "";
  }

  const normalizedLetter = letter.toLowerCase();
  const lines = solutionText.split("\n");
  const chunks = [];
  let currentLetter = "";
  let buffer = [];

  function flush() {
    if (currentLetter) {
      chunks.push({ letter: currentLetter, text: buffer.join("\n").trim() });
    }
    currentLetter = "";
    buffer = [];
  }

  lines.forEach((line) => {
    const match = line.trim().match(/^([a-z])\)\s*(.*)$/i);
    if (match) {
      flush();
      currentLetter = match[1].toLowerCase();
      if (match[2]) {
        buffer.push(match[2]);
      }
      return;
    }

    if (currentLetter) {
      buffer.push(line);
    }
  });

  flush();
  const found = chunks.find((chunk) => chunk.letter === normalizedLetter);
  return found ? found.text : solutionText;
}

function parseQuestion(item, solutionLookup) {
  const type = item.querySelector("bbmd_questiontype")?.textContent?.trim() || "";
  if (type !== "Numeric") {
    return null;
  }

  const title = item.getAttribute("title") || "Aufgabe";
  const prompt = textOrHtml(item, "presentation mat_formattedtext");
  const incorrectFeedback = textOrHtml(
    item,
    'itemfeedback[ident="incorrect"] mat_formattedtext',
    { removeImages: true }
  );
  const conditions = item.querySelectorAll("resprocessing respcondition conditionvar");

  let min = null;
  let max = null;
  let exact = null;

  conditions.forEach((condition) => {
    const gte = condition.querySelector("vargte");
    const lte = condition.querySelector("varlte");
    const equal = condition.querySelector("varequal");

    if (gte && lte) {
      min = Number.parseFloat(gte.textContent.trim().replace(",", "."));
      max = Number.parseFloat(lte.textContent.trim().replace(",", "."));
    }

    if (equal) {
      exact = Number.parseFloat(equal.textContent.trim().replace(",", "."));
    }
  });

  if (min === null && max === null && exact === null) {
    return null;
  }

  const questionKey = normalizeQuestionKey(title);
  const subtaskMatch = title.match(/Aufgabe\s+\d+([a-z])$/i);
  let solutionText = solutionLookup[questionKey] || "";
  if (subtaskMatch && solutionText) {
    solutionText = extractSubtaskSolution(solutionText, subtaskMatch[1]);
  }

  return {
    title,
    prompt,
    incorrectFeedback,
    min,
    max,
    exact,
    solutionText,
  };
}

function parseExerciseXml(xmlText, solutionLookup) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "application/xml");
  const title = xml.querySelector("assessment")?.getAttribute("title") || "Aufgabenset";
  const intro = textOrHtml(xml, "presentation_material mat_formattedtext");
  const items = [...xml.querySelectorAll("section > item")]
    .map((item) => parseQuestion(item, solutionLookup))
    .filter(Boolean);

  return { title, intro, items };
}

function formatSolution(question) {
  if (Number.isFinite(question.exact)) {
    return String(question.exact).replace(".", ",");
  }

  if (Number.isFinite(question.min) && Number.isFinite(question.max)) {
    const midpoint = ((question.min + question.max) / 2).toFixed(4);
    return midpoint.replace(".", ",");
  }

  return "";
}

function hasDetailedFeedback(html) {
  const text = (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  return text.length > 40;
}

function isFormulaLine(line) {
  const value = line.trim();
  if (!value) {
    return false;
  }

  if (/^\[[^\]]+\]$/.test(value)) {
    return false;
  }

  const proseRemainder = value.replace(/\$[^$]*\$/g, "").trim();
  if (proseRemainder && /[A-Za-zÄÖÜäöü]/.test(proseRemainder)) {
    return false;
  }

  return (
    /\\frac|\\cdot|\\sqrt|\\ln|\\Longrightarrow|\\rightarrow|\\mathrm|\\text|\\sum|\\approx/.test(
      value
    ) ||
    /[=_^]/.test(value) ||
    value.startsWith("$") ||
    value.endsWith("$")
  );
}

function isTableLine(line) {
  const value = line.trim();
  return value.includes("|") && !value.startsWith("[");
}

function isStandaloneHeaderRow(cells, headerLength) {
  if (!cells.length || cells.length >= headerLength) {
    return false;
  }

  return cells.every((cell) => /^\$?\s*t\s*=/.test(prepareCellMath(cell)));
}

function renderSolutionTable(lines) {
  const rows = [];

  lines.forEach((line) => {
    const cells = line
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean)
      .map((cell) => prepareCellMath(cell));

    if (line.trim().startsWith("|") && cells.length === 1 && rows.length) {
      rows[rows.length - 1].push(cells[0]);
      return;
    }

    if (cells.length <= 1) {
      return;
    }

    rows.push(cells);
  });

  if (!rows.length) {
    return "";
  }

  let header = [...rows[0]];
  let startIndex = 1;

  if (rows[1] && isStandaloneHeaderRow(rows[1], header.length)) {
    header = header.concat(rows[1]);
    startIndex = 2;
  }

  const body = rows.slice(startIndex).map((row) => {
    if (row.length < header.length) {
      return row.concat(Array.from({ length: header.length - row.length }, () => ""));
    }
    return row;
  });

  return `
    <div class="solution-table-wrap">
      <table class="solution-table">
        <thead>
          <tr>${header.map((cell) => `<th>${renderCellContent(cell)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${body
            .map(
              (row) => `<tr>${row.map((cell) => `<td>${renderCellContent(cell)}</td>`).join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderTextWithInlineMath(line) {
  const prepared = normalizeMinusSigns(line);
  const parts = prepared.split(/(\$[^$]+\$)/g).filter(Boolean);
  return parts
    .map((part) => {
      if (part.startsWith("$") && part.endsWith("$")) {
        return escapeHtml(part);
      }
      return escapeHtml(part);
    })
    .join("");
}

function formatSolutionMarkup(text) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const chunks = [];

  for (let index = 0; index < lines.length; ) {
    const line = lines[index];

    if (isTableLine(line)) {
      const tableLines = [];
      while (index < lines.length && isTableLine(lines[index])) {
        tableLines.push(lines[index]);
        index += 1;
      }
      chunks.push(renderSolutionTable(tableLines));
      continue;
    }

    const subtaskMatch = line.match(/^([a-z]\))\s*(.+)$/i);
    if (subtaskMatch && isFormulaLine(subtaskMatch[2])) {
      const mathBody = prepareCellMath(subtaskMatch[2]);
      const math =
        mathBody.startsWith("$") || mathBody.startsWith("\\[")
          ? escapeHtml(mathBody)
          : `\\(${escapeHtml(mathBody)}\\)`;
      chunks.push(
        `<p class="solution-line"><strong>${escapeHtml(subtaskMatch[1])}</strong> <span class="solution-line-math">${math}</span></p>`
      );
      index += 1;
      continue;
    }

    if (isFormulaLine(line)) {
      const prepared = prepareCellMath(line);
      const math =
        prepared.startsWith("$") || prepared.startsWith("\\[")
          ? escapeHtml(prepared)
          : `\\[${escapeHtml(prepared)}\\]`;
      chunks.push(`<div class="solution-line solution-line-math">${math}</div>`);
    } else {
      chunks.push(`<p class="solution-line">${renderTextWithInlineMath(line)}</p>`);
    }
    index += 1;
  }

  return chunks.join("");
}

function renderSolutionDetails(text) {
  if (!text) {
    return "";
  }

  return `
    <details class="solution-details">
      <summary>Musterlösung anzeigen</summary>
      <div class="solution-content">${formatSolutionMarkup(text)}</div>
    </details>
  `;
}

function buildFallbackFeedback(question) {
  const solution = formatSolution(question);
  return solution ? `<p><strong>Richtiger Wert:</strong> ${solution}</p>` : "";
}

function evaluateAnswer(question, rawValue) {
  const normalized = rawValue.trim().replace(/\s+/g, "").replace(",", ".");
  const numeric = Number.parseFloat(normalized);
  if (!Number.isFinite(numeric)) {
    return {
      ok: false,
      html: "<p>Bitte eine numerische Antwort eingeben.</p>",
      kind: "error",
    };
  }

  const hasRange = question.min !== null || question.max !== null;
  const withinRange =
    hasRange &&
    (question.min === null || numeric >= question.min) &&
    (question.max === null || numeric <= question.max);
  const matchesExact =
    question.exact !== null && Math.abs(numeric - question.exact) < 1e-9;
  const ok = withinRange || matchesExact;

  if (ok) {
    return {
      ok: true,
      html: "<p>Richtig.</p>",
      kind: "success",
    };
  }

  const detailHtml = renderSolutionDetails(question.solutionText);
  const hintHtml =
    !question.solutionText && hasDetailedFeedback(question.incorrectFeedback)
      ? question.incorrectFeedback
      : buildFallbackFeedback(question);

  return {
    ok: false,
    html: `<p>Falsch.</p>${hintHtml}${detailHtml}`,
    kind: "error",
  };
}

function renderQuestion(question, index) {
  const article = document.createElement("article");
  article.className = "question-card";

  const promptHtml = question.prompt || "<p>Keine Aufgabenstellung verfügbar.</p>";
  article.innerHTML = `
    <span class="question-number">Aufgabe ${index + 1}</span>
    <h4>${question.title}</h4>
    <div class="question-body">${promptHtml}</div>
    <div class="answer-row">
      <input type="text" inputmode="decimal" aria-label="${question.title}" placeholder="Antwort eingeben" />
      <button type="button">Prüfen</button>
    </div>
    <div class="feedback"></div>
    <div class="question-footer">
      <a class="question-backlink" href="#uebungen">nach oben</a>
    </div>
  `;

  const input = article.querySelector("input");
  const button = article.querySelector("button");
  const feedback = article.querySelector(".feedback");

  function check() {
    const result = evaluateAnswer(question, input.value);
    feedback.className = `feedback is-visible ${
      result.kind === "success" ? "feedback-success" : "feedback-error"
    }`;
    feedback.innerHTML = result.html;
    renderMath(feedback);
  }

  button.addEventListener("click", check);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      check();
    }
  });

  return article;
}

function renderExerciseSet(meta, data) {
  const panel = document.getElementById("exercise-panel");
  const links = meta.resources
    .map((resource) => `<a href="${resource.href}" target="_blank">${resource.label}</a>`)
    .join("");

  panel.innerHTML = `
    <div class="exercise-header">
      <h3>${data.title}</h3>
      <p class="exercise-set-description">${meta.description}</p>
      ${data.intro ? `<div class="exercise-set-description">${data.intro}</div>` : ""}
      <div class="exercise-links link-row">${links}</div>
    </div>
    <div class="question-list"></div>
  `;

  const list = panel.querySelector(".question-list");
  data.items.forEach((question, index) => list.appendChild(renderQuestion(question, index)));
  renderMath(panel);
}

async function loadExerciseSet(meta, button) {
  const panel = document.getElementById("exercise-panel");
  panel.innerHTML = `
    <div class="exercise-empty">
      <h3>${meta.title}</h3>
      <p>Aufgabenset wird geladen.</p>
    </div>
  `;

  document.querySelectorAll(".exercise-list button").forEach((element) => {
    element.classList.toggle("active", element === button);
  });

  try {
    const [response, solutionData] = await Promise.all([
      fetch(meta.file),
      solutionDataPromise,
    ]);
    if (!response.ok) {
      throw new Error("fetch failed");
    }

    const xmlText = await response.text();
    const solutionLookup = solutionData[meta.id] || {};
    const data = parseExerciseXml(xmlText, solutionLookup);
    renderExerciseSet(meta, data);
  } catch (error) {
    panel.innerHTML = `
      <div class="exercise-empty">
        <h3>${meta.title}</h3>
        <p>Das Aufgabenset konnte nicht geladen werden.</p>
      </div>
    `;
  }
}

function renderExerciseList() {
  const container = document.getElementById("exercise-list");

  exerciseSets.forEach((meta, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<strong>${meta.title}</strong><span>${meta.description}</span>`;
    button.addEventListener("click", () => loadExerciseSet(meta, button));
    container.appendChild(button);

    if (index === 0) {
      loadExerciseSet(meta, button);
    }
  });
}

document.addEventListener("DOMContentLoaded", renderExerciseList);
