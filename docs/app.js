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
  if (!window.MathJax?.typesetPromise) {
    return;
  }

  if (window.MathJax.typesetClear) {
    try {
      window.MathJax.typesetClear([container]);
    } catch (_error) {
      // no-op
    }
  }

  window.MathJax.typesetPromise([container]).catch(() => {});
}

const embeddedImageReplacements = {
  "xid-19619306_2": "\\(U(C_0,C_1)= C_0^{\\frac{3}{5}} \\cdot C_1^{\\frac{2}{5}}\\)",
  "xid-19619307_2": "\\(\\bar{C_0}=C_0+X_0\\)",
  "xid-19619308_2": "\\(C_1=(1+i)\\cdot X_0\\)",
  "xid-19619314_2": "\\(\\bar{C_0}\\)",
};

const solutionOverrides = {
  set3: {
    "Aufgabe 5a":
      "L=C_0^{\\frac{3}{5}} \\cdot C_1^{\\frac{2}{5}}- \\lambda \\big(C_1-(1+i)\\cdot( \\bar{C}_0-C_0) \\big).",
    "Aufgabe 5b":
      "\\frac{\\partial L}{\\partial \\lambda} =C_1 -(1+i) \\cdot( \\bar{C}_0- C_0)=0.",
    "Aufgabe 5c":
      "-(1+i) = - \\frac{ \\frac{3}{5} C_0 ^ {\\frac{-2}{5}}\\cdot C_1 ^{\\frac{2}{5}} }{ \\frac{2}{5} C_0 ^ {\\frac{3}{5}}\\cdot C_1^{\\frac{-3}{5}} } .",
    "Aufgabe 5d": "\\bar{C}_0=\\frac{C_1}{1+i}+C_0",
    "Aufgabe 6a": "(1+i) \\cdot C_0 = 250.\nPunkt A auf der Grafik.",
    "Aufgabe 6b": "C_0=166,67.\nPunkt D auf der Grafik.",
  },
};

const promptOverrides = {
  set3: {
    "Aufgabe 5a": {
      replace:
        '<p><em>Anmerkung</em>: github erlaubt es nicht, dass Sie hier Formeln eingeben. Wir haben daher Zahlen als Lösung (100) hinterlegt, damit man wenigstens die Musterlösung (die dann natürlich eine Formel und keine Zahl sein wird) sehen kann. Sie können irgendeine Zahl eingeben, damit Sie die richtigen Gleichungen sehen.</p>',
    },
  },
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

  output = output.replace(
    /<p>\s*<a[^>]*href="[^"]*xid-19619316_2[^"]*"[^>]*>\s*<img[^>]*xid-19619317_2[^>]*>\s*<\/a>\s*<\/p>/gi,
    '<p><a href="./assets/fisher-aufgabe-6.png" target="_blank" rel="noopener"><img src="./assets/fisher-aufgabe-6.png" alt="Fisher-Modell Grafik" width="520"></a></p>'
  );

  output = output.replace(
    /<img[^>]*@X@EmbeddedFile\.requestUrlStub@X@[^>]*>/gi,
    ""
  );

  return output;
}

function applyPromptOverride(setId, title, prompt) {
  const override = promptOverrides[setId]?.[title];
  if (!override) {
    return prompt;
  }

  return (prompt || "")
    .replace(
      /<p><em>Anmerkung<\/em>:[\s\S]*?sehen\.<\/p>/i,
      override.replace
    )
    .replace(
      /<p>Außerdem zählt Blackboard anders als wir\.[\s\S]*?nummeriert\.<\/p>/i,
      ""
    );
}

function getSolutionOverride(setId, title) {
  return solutionOverrides[setId]?.[title] || "";
}

function normalizeMinusSigns(value) {
  return (value || "")
    .replace(/([A-Za-zÄÖÜäöü])--([A-Za-zÄÖÜäöü])/g, "$1-$2")
    .replace(/(^|[|(=\s])--(?=\d)/g, "$1-")
    .replace(/(^|[|(=\s])-\s+(?=\d)/g, "$1-");
}

function normalizeMathSyntax(value) {
  return (value || "")
    .replace(/\\text([A-Za-zÄÖÜäöüß]+)/g, "\\\\text{$1}")
    .replace(/\\bar([A-Za-z])_([0-9])/g, "\\\\bar{$1}_$2")
    .replace(/\\bar([A-Za-z])/g, "\\\\bar{$1}")
    .replace(/\\frac\\partial\s*L\\partial\s*C_0/g, "\\\\frac{\\\\partial L}{\\\\partial C_0}")
    .replace(/\\frac\\partial\s*L\\partial\s*C_1/g, "\\\\frac{\\\\partial L}{\\\\partial C_1}")
    .replace(/\\frac\\partial\s*L\\partial\s*\\lambda/g, "\\\\frac{\\\\partial L}{\\\\partial \\\\lambda}")
    .replace(/\\fracC_1\(1\+i\)/g, "\\\\frac{C_1}{(1+i)}")
    .replace(/\\frac([0-9][0-9.,]*)\(([^)]+)\)(\^[0-9]+)?/g, (_m, num, inner, exp = "") => {
      return `\\\\frac{${num}}{(${inner})${exp}}`;
    })
    .replace(/\\frac(-?\d)(-?\d)(?![\d{])/g, "\\\\frac{$1}{$2}")
    .replace(/\^\s*\\frac(-?\d)(-?\d)(?![\d{])/g, "^\\\\frac{$1}{$2}")
    .replace(/\\sqrt\[([^\]]+)\]([A-Za-z0-9.,]+)/g, "\\\\sqrt[$1]{$2}")
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
  if (!replacement) {
    if (src.includes("@X@EmbeddedFile.requestUrlStub@X@")) {
      node.remove();
    }
    return;
  }

  const span = document.createElement("span");
  span.className = "inline-formula";
  span.innerHTML = replacement;
  node.replaceWith(span);
}

function normalizeDomFormulas(container) {
  container.querySelectorAll("img").forEach((img) => rewriteEmbeddedImage(img));

  container.querySelectorAll("math, .math, .formula").forEach((node) => {
    if (node.dataset.normalizedMath === "true") {
      return;
    }

    const html = node.innerHTML || node.textContent || "";
    const normalized = prepareCellMath(decodeHtmlEntities(html));
    if (normalized) {
      node.innerHTML = `\\(${normalized}\\)`;
      node.dataset.normalizedMath = "true";
    }
  });
}

function convertInlineDollarMathInTextNodes(container) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.includes("$")) {
        return NodeFilter.FILTER_REJECT;
      }
      const parent = node.parentElement;
      if (!parent) {
        return NodeFilter.FILTER_REJECT;
      }
      if (parent.closest("script, style, textarea, code, pre")) {
        return NodeFilter.FILTER_REJECT;
      }
      if (parent.classList.contains("math-processed")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((textNode) => {
    const text = textNode.nodeValue;
    if (!text || !text.includes("$")) {
      return;
    }

    const parts = [];
    let lastIndex = 0;
    const regex = /\$(.+?)\$/g;
    let match;
    let found = false;

    while ((match = regex.exec(text)) !== null) {
      found = true;
      if (match.index > lastIndex) {
        parts.push(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      const span = document.createElement("span");
      span.className = "inline-formula math-processed";
      span.innerHTML = `\\(${prepareCellMath(match[1])}\\)`;
      parts.push(span);
      lastIndex = regex.lastIndex;
    }

    if (!found) {
      return;
    }

    if (lastIndex < text.length) {
      parts.push(document.createTextNode(text.slice(lastIndex)));
    }

    const fragment = document.createDocumentFragment();
    parts.forEach((part) => fragment.appendChild(part));
    textNode.parentNode.replaceChild(fragment, textNode);
  });
}

function preparePromptHtml(prompt) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = preprocessEmbeddedReferences(prompt || "");
  normalizeDomFormulas(wrapper);
  convertInlineDollarMathInTextNodes(wrapper);
  return wrapper.innerHTML;
}

function formatSolutionText(solutionText) {
  if (!solutionText) {
    return "";
  }

  const normalized = prepareCellMath(solutionText)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^[A-Za-zÄÖÜäöü].*[.:]$/.test(line) || /Punkt\s+[A-Z]/.test(line)) {
        return `<p>${escapeHtml(line)}</p>`;
      }
      return `<p><span class="inline-formula">\\(${escapeHtml(line)}\\)</span></p>`;
    })
    .join("");

  return normalized;
}

function stripNamespace(tagName) {
  return tagName.includes(":") ? tagName.split(":").pop() : tagName;
}

function findChild(element, localName) {
  return Array.from(element.children).find(
    (child) => stripNamespace(child.tagName).toLowerCase() === localName.toLowerCase()
  );
}

function findDescendants(element, localName) {
  return Array.from(element.getElementsByTagName("*")).filter(
    (child) => stripNamespace(child.tagName).toLowerCase() === localName.toLowerCase()
  );
}

function getNodeInnerXml(node) {
  return Array.from(node.childNodes)
    .map((child) => new XMLSerializer().serializeToString(child))
    .join("");
}

function getPromptFromItemBody(itemBody) {
  if (!itemBody) {
    return "";
  }

  const cloned = itemBody.cloneNode(true);
  findDescendants(cloned, "rubricBlock").forEach((node) => node.remove());
  return getNodeInnerXml(cloned);
}

function extractChoiceInteractions(itemBody) {
  return findDescendants(itemBody, "choiceInteraction").map((interaction) => {
    const responseIdentifier = interaction.getAttribute("responseIdentifier") || "";
    const promptNode = findChild(interaction, "prompt");
    const choices = findDescendants(interaction, "simpleChoice").map((choice) => ({
      identifier: choice.getAttribute("identifier") || "",
      text: decodeHtmlEntities(choice.textContent || "").trim(),
    }));
    return {
      responseIdentifier,
      prompt: decodeHtmlEntities(promptNode?.textContent || "").trim(),
      choices,
    };
  });
}

function extractTextEntries(itemBody) {
  return findDescendants(itemBody, "textEntryInteraction").map((interaction) => ({
    responseIdentifier: interaction.getAttribute("responseIdentifier") || "",
    expectedLength: interaction.getAttribute("expectedLength") || "",
  }));
}

function extractExpectedResponses(itemElement) {
  const map = {};
  findDescendants(itemElement, "responseDeclaration").forEach((decl) => {
    const identifier = decl.getAttribute("identifier");
    const correctResponse = findChild(decl, "correctResponse");
    if (!identifier || !correctResponse) {
      return;
    }

    const values = findDescendants(correctResponse, "value")
      .map((node) => decodeHtmlEntities(node.textContent || "").trim())
      .filter(Boolean);
    map[identifier] = values;
  });
  return map;
}

function extractRubricBlocks(itemBody) {
  return findDescendants(itemBody, "rubricBlock")
    .filter((node) => (node.getAttribute("view") || "").toLowerCase() === "scorer")
    .map((node) => preprocessEmbeddedReferences(getNodeInnerXml(node)));
}

function parseAssessmentItems(xmlDoc, setId) {
  const assessmentItems = findDescendants(xmlDoc, "assessmentItem");
  return assessmentItems.map((item, index) => {
    const itemBody = findChild(item, "itemBody");
    const title = item.getAttribute("title") || `Aufgabe ${index + 1}`;
    const promptRaw = getPromptFromItemBody(itemBody);
    const prompt = preparePromptHtml(applyPromptOverride(setId, title, promptRaw));
    const choiceInteractions = extractChoiceInteractions(itemBody);
    const textEntries = extractTextEntries(itemBody);
    const expectedResponses = extractExpectedResponses(item);
    const rubricBlocks = extractRubricBlocks(itemBody);
    const solutionOverride = getSolutionOverride(setId, title);
    const solutionHtml = solutionOverride
      ? formatSolutionText(solutionOverride)
      : rubricBlocks.join("");

    return {
      id: item.getAttribute("identifier") || `item-${index + 1}`,
      title,
      prompt,
      choiceInteractions,
      textEntries,
      expectedResponses,
      solutionHtml,
    };
  });
}

function renderResources(resources = []) {
  if (!resources.length) {
    return "";
  }

  return `
    <div class="set-resources">
      ${resources
        .map(
          (resource) => `
            <a class="resource-link" href="${resource.href}" target="_blank" rel="noopener">
              ${resource.label}
            </a>
          `
        )
        .join("")}
    </div>
  `;
}

function renderExerciseCards(sets) {
  return sets
    .map(
      (set) => `
        <article class="exercise-card" data-set-id="${set.id}">
          <div class="exercise-card__content">
            <h2>${set.title}</h2>
            <p>${set.description}</p>
            ${renderResources(set.resources)}
          </div>
          <button class="button button--primary" data-open-set="${set.id}">Aufgaben öffnen</button>
        </article>
      `
    )
    .join("");
}

function renderChoiceInteraction(interaction, index, taskIndex, submittedAnswers = []) {
  const selected = new Set(submittedAnswers || []);
  const inputType = interaction.choices.length > 1 ? "checkbox" : "radio";

  return `
    <fieldset class="choice-interaction">
      <legend>${interaction.prompt || `Teilaufgabe ${taskIndex + 1}.${index + 1}`}</legend>
      ${interaction.choices
        .map(
          (choice) => `
            <label class="choice-option">
              <input
                type="${inputType}"
                name="${interaction.responseIdentifier}"
                value="${choice.identifier}"
                ${selected.has(choice.identifier) ? "checked" : ""}
              >
              <span>${escapeHtml(choice.text)}</span>
            </label>
          `
        )
        .join("")}
    </fieldset>
  `;
}

function renderTextEntry(entry, index, taskIndex, submittedValue = "") {
  const label = `Teilaufgabe ${taskIndex + 1}.${index + 1}`;
  return `
    <label class="text-entry">
      <span>${label}</span>
      <input type="text" name="${entry.responseIdentifier}" value="${escapeHtml(submittedValue)}">
    </label>
  `;
}

function renderTask(task, taskIndex, userAnswers = {}) {
  const choiceHtml = task.choiceInteractions
    .map((interaction, index) =>
      renderChoiceInteraction(
        interaction,
        index,
        taskIndex,
        userAnswers[interaction.responseIdentifier] || []
      )
    )
    .join("");

  const textHtml = task.textEntries
    .map((entry, index) =>
      renderTextEntry(entry, index, taskIndex, userAnswers[entry.responseIdentifier] || "")
    )
    .join("");

  return `
    <section class="task" data-task-id="${task.id}">
      <header class="task__header">
        <h3>${task.title}</h3>
      </header>
      <div class="task__prompt">${task.prompt}</div>
      <div class="task__interactions">
        ${choiceHtml}
        ${textHtml}
      </div>
      <div class="task__solution is-hidden">${task.solutionHtml}</div>
    </section>
  `;
}

function renderTaskList(tasks, solutionData, setId) {
  const answers = solutionData?.[setId]?.answers || {};
  return tasks.map((task, index) => renderTask(task, index, answers[task.id] || {})).join("");
}

async function loadAssessmentItems(set) {
  const response = await fetch(set.file);
  if (!response.ok) {
    throw new Error(`Datei konnte nicht geladen werden: ${set.file}`);
  }

  const xmlText = await response.text();
  const xmlDoc = new DOMParser().parseFromString(xmlText, "application/xml");
  return parseAssessmentItems(xmlDoc, set.id);
}

function collectAnswers(formElement) {
  const formData = new FormData(formElement);
  const answers = {};

  for (const [key, value] of formData.entries()) {
    if (answers[key]) {
      if (Array.isArray(answers[key])) {
        answers[key].push(value);
      } else {
        answers[key] = [answers[key], value];
      }
    } else {
      answers[key] = value;
    }
  }

  return answers;
}

function evaluateTask(task, answers) {
  const result = {
    isCorrect: true,
    feedback: [],
  };

  task.choiceInteractions.forEach((interaction) => {
    const expected = task.expectedResponses[interaction.responseIdentifier] || [];
    const actual = answers[interaction.responseIdentifier];
    const actualValues = Array.isArray(actual)
      ? actual
      : actual
      ? [actual]
      : [];

    const expectedSorted = [...expected].sort();
    const actualSorted = [...actualValues].sort();

    const matches =
      expectedSorted.length === actualSorted.length &&
      expectedSorted.every((value, index) => value === actualSorted[index]);

    if (!matches) {
      result.isCorrect = false;
      result.feedback.push(`Auswahl bei ${interaction.prompt || interaction.responseIdentifier} ist nicht korrekt.`);
    }
  });

  task.textEntries.forEach((entry) => {
    const expected = (task.expectedResponses[entry.responseIdentifier] || [""])[0];
    const actual = (answers[entry.responseIdentifier] || "").trim();
    if (expected && actual !== expected) {
      result.isCorrect = false;
      result.feedback.push(`Eingabe bei ${entry.responseIdentifier} ist nicht korrekt.`);
    }
  });

  return result;
}

function revealSolutions(container) {
  container.querySelectorAll(".task__solution").forEach((node) => {
    node.classList.remove("is-hidden");
  });
  renderMath(container);
}

function attachSetHandlers(container, tasks) {
  const form = container.querySelector("form");
  const evaluateButton = container.querySelector("[data-action='evaluate']");
  const solutionButton = container.querySelector("[data-action='show-solutions']");
  const feedbackBox = container.querySelector(".set-feedback");

  evaluateButton?.addEventListener("click", (event) => {
    event.preventDefault();
    const answers = collectAnswers(form);
    const taskResults = tasks.map((task) => {
      const relevantAnswers = {};
      [...task.choiceInteractions, ...task.textEntries].forEach((interaction) => {
        relevantAnswers[interaction.responseIdentifier] = answers[interaction.responseIdentifier];
      });
      return evaluateTask(task, relevantAnswers);
    });

    const incorrect = taskResults.filter((result) => !result.isCorrect);
    if (!incorrect.length) {
      feedbackBox.innerHTML = '<p class="feedback feedback--success">Alle Antworten sind korrekt.</p>';
      return;
    }

    feedbackBox.innerHTML = `
      <div class="feedback feedback--error">
        <p>Es gibt noch Fehler.</p>
        <ul>
          ${incorrect.flatMap((result) => result.feedback).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
        </ul>
      </div>
    `;
  });

  solutionButton?.addEventListener("click", (event) => {
    event.preventDefault();
    revealSolutions(container);
  });
}

async function openExerciseSet(setId) {
  const set = exerciseSets.find((entry) => entry.id === setId);
  const root = document.querySelector("#app");
  if (!set || !root) {
    return;
  }

  root.innerHTML = '<p class="loading">Lade Aufgaben…</p>';

  try {
    const [tasks, solutionData] = await Promise.all([
      loadAssessmentItems(set),
      solutionDataPromise,
    ]);

    root.innerHTML = `
      <section class="set-view">
        <header class="set-view__header">
          <button class="button button--secondary" data-action="back">← Zurück</button>
          <div>
            <h1>${set.title}</h1>
            <p>${set.description}</p>
          </div>
        </header>
        <form class="set-form">
          ${renderTaskList(tasks, solutionData, set.id)}
          <div class="set-actions">
            <button class="button button--primary" data-action="evaluate">Antworten prüfen</button>
            <button class="button button--secondary" data-action="show-solutions">Lösungen anzeigen</button>
          </div>
          <div class="set-feedback"></div>
        </form>
      </section>
    `;

    root.querySelector("[data-action='back']")?.addEventListener("click", (event) => {
      event.preventDefault();
      renderOverview();
    });

    attachSetHandlers(root, tasks);
    renderMath(root);
  } catch (error) {
    root.innerHTML = `
      <div class="feedback feedback--error">
        <p>Die Aufgaben konnten nicht geladen werden.</p>
        <pre>${escapeHtml(error.message)}</pre>
      </div>
    `;
  }
}

function renderOverview() {
  const root = document.querySelector("#app");
  if (!root) {
    return;
  }

  root.innerHTML = `
    <section class="overview">
      <header class="overview__header">
        <h1>Übungsaufgaben</h1>
        <p>Wählen Sie ein Aufgabenset aus.</p>
      </header>
      <div class="exercise-grid">
        ${renderExerciseCards(exerciseSets)}
      </div>
    </section>
  `;

  root.querySelectorAll("[data-open-set]").forEach((button) => {
    button.addEventListener("click", () => openExerciseSet(button.dataset.openSet));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderOverview();
});
