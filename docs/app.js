const exerciseSets = [
  {
    id: "set1",
    title: "Aufgabenset 1",
    description: "Finanzmathematik",
    file: "./qti/set1.xml",
    solutionHref: "./exercises/loesung_ab1a11.pdf",
    solutionLabel: "Musterlösung AB1A11",
    resources: [
      { label: "Übungs-PDF", href: "./exercises/uebungsaufgaben.pdf" },
      { label: "Excel AB1A11", href: "./assets/AB1A11_Naeherung.xlsx" },
    ],
  },
  {
    id: "set1-extra",
    title: "Zusatz zu Set 1",
    description: "Ergänzende Aufgaben zu Finanzmathematik",
    file: "./qti/set1_extra.xml",
    resources: [
      { label: "Excel Zusatz AB1A11", href: "./assets/zusAB1A11_Naeherung.xlsx" },
    ],
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
    solutionHref: "./exercises/probeklausur_musterloesung.pdf",
    solutionLabel: "Musterlösung Probeklausur",
    resources: [
      { label: "Klausur-PDF", href: "./exercises/probeklausur.pdf" },
      { label: "Musterlösung", href: "./exercises/probeklausur_musterloesung.pdf" },
    ],
  },
];

function decodeHtmlEntities(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value || "";
  return textarea.value;
}

function cleanHtml(html) {
  const decoded = decodeHtmlEntities(html || "");
  const template = document.createElement("template");
  template.innerHTML = decoded;

  template.content
    .querySelectorAll("script, style, xml, meta, link, applet, object")
    .forEach((node) => node.remove());

  template.content.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name === "style" || name.startsWith("on") || name === "class" || name === "id") {
        node.removeAttribute(attr.name);
      }
    });
  });

  return template.innerHTML.trim();
}

function textOrHtml(node, selector) {
  const target = node.querySelector(selector);
  return cleanHtml(target ? target.textContent : "");
}

function parseQuestion(item) {
  const type = item.querySelector("bbmd_questiontype")?.textContent?.trim() || "";
  if (type !== "Numeric") {
    return null;
  }

  const prompt = textOrHtml(item, "presentation mat_formattedtext");
  const correctFeedback = textOrHtml(item, 'itemfeedback[ident="correct"] mat_formattedtext');
  const incorrectFeedback = textOrHtml(item, 'itemfeedback[ident="incorrect"] mat_formattedtext');
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

  return {
    title: item.getAttribute("title") || "Aufgabe",
    prompt,
    correctFeedback,
    incorrectFeedback,
    min,
    max,
    exact,
  };
}

function parseExerciseXml(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "application/xml");
  const title = xml.querySelector("assessment")?.getAttribute("title") || "Aufgabenset";
  const intro = textOrHtml(xml, "presentation_material mat_formattedtext");
  const items = [...xml.querySelectorAll("section > item")]
    .map(parseQuestion)
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

  if (!text) {
    return false;
  }

  return (
    text.length > 120 ||
    text.includes("hinweis") ||
    text.includes("minute") ||
    text.includes("excel") ||
    text.includes("muster") ||
    html.includes("Wirisformula")
  );
}

function buildFallbackFeedback(question, meta) {
  const solution = formatSolution(question);
  const solutionHtml = solution
    ? `<p><strong>Richtige Lösung:</strong> ${solution}</p>`
    : "";
  const solutionLink =
    meta.solutionHref && meta.solutionLabel
      ? `<p><a href="${meta.solutionHref}" target="_blank">${meta.solutionLabel}</a></p>`
      : "";
  const note = meta.solutionHref
    ? "<p>Den vollständigen Lösungsweg finden Sie in der verlinkten Musterlösung.</p>"
    : "<p>Für diese Aufgabe enthält der Blackboard-Export keinen ausführlichen Rechenweg. Der korrekte Zielwert steht oben.</p>";

  return `<p>Ihre Antwort ist leider falsch.</p>${solutionHtml}${note}${solutionLink}`;
}

function evaluateAnswer(question, rawValue, meta) {
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
      html: question.correctFeedback || "<p>Ihre Antwort ist korrekt.</p>",
      kind: "success",
    };
  }

  const fallback = buildFallbackFeedback(question, meta);
  const incorrectHtml = hasDetailedFeedback(question.incorrectFeedback)
    ? question.incorrectFeedback
    : fallback;

  return {
    ok: false,
    html: incorrectHtml,
    kind: "error",
  };
}

function renderQuestion(question, index, meta) {
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
  `;

  const input = article.querySelector("input");
  const button = article.querySelector("button");
  const feedback = article.querySelector(".feedback");

  function check() {
    const result = evaluateAnswer(question, input.value, meta);
    feedback.className = `feedback is-visible ${
      result.kind === "success" ? "feedback-success" : "feedback-error"
    }`;
    feedback.innerHTML = result.html;
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
  data.items.forEach((question, index) =>
    list.appendChild(renderQuestion(question, index, meta))
  );
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
    const response = await fetch(meta.file);
    if (!response.ok) {
      throw new Error("fetch failed");
    }
    const xmlText = await response.text();
    const data = parseExerciseXml(xmlText);
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
