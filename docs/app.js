const assetVersion = "20260326-3";

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
    title: "Zusatzaufgaben Set 1",
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
    title: "Zusatzaufgaben Set 2",
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
    title: "Zusatzaufgaben Set 3",
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
    title: "Zusatzaufgaben Set 4",
    description: "Vertiefung und zusätzliche Rechenaufgaben",
    file: "./qti/set4_extra.xml",
    resources: [{ label: "Übungs-PDF", href: "./exercises/uebungsaufgaben.pdf" }],
  },
];

const solutionDataPromise = fetch(`./data/exercise_solutions.json?v=${assetVersion}`)
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
    } catch (_error) {}
  }
  window.MathJax.typesetPromise([container]).catch(() => {});
}

const embeddedImageReplacements = {
  "xid-19619306_2": "$U(C_0,C_1)= C_0^{\\frac{3}{5}} \\cdot C_1^{\\frac{2}{5}}$",
  "xid-19619307_2": "$\\bar{C}_0=C_0+X_0$",
  "xid-19619308_2": "$C_1=(1+i)\\cdot X_0$",
  "xid-19619314_2": "$\\bar{C}_0$",
};

const solutionOverrides = {
  set1: {
    "Aufgabe 2":
      "$\\text{Geldbetrag}=x$ setzen.\n\n$x\\cdot (1+i)^{20}=3x$\n\n$(1+i)^{20}=3$\n\n$i=\\sqrt[20]{3}-1=5,6467\\%$",
    "Aufgabe 4":
      "$15.000\\times (1+0,065)^n=2\\times 15.000$\n\n$(1+0,065)^n=2$\n\n$n\\ln(1+0,065)=\\ln(2)$\n\n$n=\\frac{\\ln(2)}{\\ln(1+0,065)}=11,007\\ \\text{Jahre}$",
    "Aufgabe 5":
      "$15.500\\times (1+i)^{13}=35.146,06$\n\n$i=\\sqrt[13]{\\frac{35.146,06}{15.500}}=6,5\\%$",
    "Aufgabe 6":
      "$K_0=\\frac{20.000}{(1+0,055)^{18}}=7.629,32$",
    "Aufgabe 7":
      "r=18.770,15\\frac{0,04\\cdot (1+0,04)^{12}}{(1+0,04)^{12}-1}=2.000",
    "Aufgabe 8":
      "R_0=700\\cdot \\frac{(1+0,05)^{10}-1}{0,05\\cdot (1+0,05)^{10}}=5.405,21",
    "Aufgabe 9":
      "$R_0=1.000\\cdot \\frac{(1+0,04)^{25}-1}{0,04\\cdot (1+0,04)^{25}}=15.622,08$",
    "Aufgabe 10":
      "R_0=55.000\\cdot\\frac{1,06^{20}-1}{0,06\\cdot 1,06^{20}}=630.845,67",
  },
  set2: {
    "Aufgabe 4":
      "zuerst\n\n$K_8=200.000\\cdot 1,04^8=273.713,81$\n\ndann Rente\n\n$r=R_0\\frac{iq^n}{q^n-1}=273.713,81\\cdot\\frac{0,04\\cdot 1,04^{12}}{1,04^{12}-1}=29.164,80$",
    "Aufgabe 6":
      "Projekt B ist besser.\n\nProjekt A\nZeitpunkt | $t=0$ | $t=1$ | $t=2$\nBasiszahlungen $M_t$ | 1.000 |  | \nEntnahmen $C_t$ | 0 | 50 | 50\nCashflows $CF_t$ | -900 | 0 | 1.700\nZinsen $Z_t$ | 0 | $100\\cdot 15\\%=15$ | $65\\cdot 15\\%=9,75$\nKontostand $K_t$ | 100 | $100-50+15=65$ | 1.724,75\n\nProjekt B\nZeitpunkt | $t=0$ | $t=1$ | $t=2$\nBasiszahlungen $M_t$ | 1.000 |  | \nEntnahmen $C_t$ | 0 | 50 | 50\nCashflows $CF_t$ | -1.300 | 2.000 | \nZinsen $Z_t$ | 0 | $-300\\cdot 25\\%=-75$ | $1.575\\cdot 15\\%=236,25$\nKontostand $K_t$ | -300 | 1.575 | 1.761,25",
    "Aufgabe 7":
      "Wir verwenden die NPV-Gleichung mit Steuern\n\n$NPV^s=-I_0+\\sum_{t=1}^T \\frac{CF_t-s(CF_t-AfA)}{(1+i(1-s))^t}.$\n\nWir erhalten zuerst für die Abschreibungen des ersten Projektes $AfA(A)=450$ sowie $AfA(B)=650$. Damit ergibt sich\n\n$NPV^s(A)=-900+\\frac{33\\%\\cdot 450}{(1+20\\%(1-33\\%))}+ \\frac{1700-33\\%\\cdot (1700-450)}{(1+20\\%(1-33\\%))^2}$\n\n$\\approx 232,15$\n\nsowie\n\n$NPV^s(B)=-1300+\\frac{2000-33\\%\\cdot (2000-650)}{(1+20\\%(1-33\\%))}+ \\frac{33\\%\\cdot 650}{(1+20\\%(1-33\\%))^2}$\n\n$\\approx 237,61$",
  },
  "set1-extra": {
    "Aufgabe 6":
      "$K_0=\\frac{50.000}{(1+0,065)^{35}}=5.517,39$",
    "Aufgabe 7":
      "r=1.000.000\\frac{0,05\\cdot (1+0,05)^{30}}{(1+0,05)^{30}-1}=65.051,44",
    "Aufgabe 9":
      "R_0=500\\,\\frac{(1+0,05)^{20}-1}{0,05\\cdot (1+0,05)^{20}}=6.231,105",
    "Aufgabe 10":
      "R_0=100.000\\cdot\\frac{1,08^{30}-1}{0,08\\cdot 1,08^{30}}=1.125.778,3",
    "Aufgabe 11":
      "Der Zinssatz ist 13,7698\\%.\n\nDie Funktion $f(i)$ ist durch die Bedingung gekennzeichnet, dass der Endwert gleich 16.450 ist. Dann gilt\n\n$f(i)=2.500+2.500(1+i)+2.500\\cdot(1+i)^2+2.500\\cdot(1+i)^3+2.500\\cdot(1+i)^4-16.450$\n\nwobei wir als nächsten Zinssatz immer denjenigen nehmen, der neben dem letzten Zinssatz ein anderes Vorzeichen besitzt:\n\nk | $i_k$ | $f(i)$\n0 | 10\\% | -1187,25000\n1 | 15\\% | 405,95310\n2 | 13,7259844\\% | -14,28474205\n3 | 13,7692908\\% | -0,163159932\n4 | 13,7697852\\% | -0,001862482",
  },
  "set2-extra": {
    "Aufgabe 1":
      "github erlaubt keine Tabelleneingabe. um die Musterlösung zu sehen, geben Sie einen falschen Wert (also gerade nicht die Annuität) ein.\n\nJahr | Schuld Jahresbeginn | Zins | Tilgung | Annuität\n1 | 300.000 | 18.000 | 50.000 | 68.000\n2 | 250.000 | 15.000 | 50.000 | 65.000\n3 | 200.000 | 12.000 | 50.000 | 62.000\n4 | 150.000 | 9.000 | 50.000 | 59.000\n5 | 100.000 | 6.000 | 50.000 | 56.000\n6 | 50.000 | 3.000 | 50.000 | 53.000",
    "Aufgabe 4":
      "zuerst\n\n$K_4=50.000\\cdot 1,08^4=68.024,45$\n\ndann Rente\n\n$r=R_0\\frac{iq^n}{q^n-1}=68.024,45\\cdot\\frac{0,08\\cdot 1,08^{5}}{1,08^{5}-1}=17.037,16$",
    "Aufgabe 6":
      "Anlage 2 ist besser.\n\nAnlage 1\nZeitpunkt | $t=0$ | $t=1$ | $t=2$ | $t=3$\nBasiszahlung | 6 |  |  | \nAnlage 1 | -5 | 2 | 10 | 5\nErgänzungsinv. 0 | -1 | 1,12 | 3,4048 | 14,923776\nErgänzungsinv. 1 |  | -3,04 | -13,3248 | \nEntnahme | 0 | 0,08 | 0,08 | 0,08\n\n |  |  | $\\mathbf{Endvermögen}$ | $\\mathbf{19,843776}$\n\nAnlage 2\nZeitpunkt | $t=0$ | $t=1$ | $t=2$ | $t=3$\nBasiszahlung | 6 |  |  | \nAnlage 2 | -7 | 10 | 5 | 6\nErgänzungsfin. 0 | 1 | -1,2 | 9,7664 | 16,448768\nErgänzungsinv. 1 |  | -8,72 | -14,6864 | \nEntnahme | 0 | 0,08 | 0,08 | 0,08\n\n |  |  | $\\mathbf{Endvermögen}$ | $\\mathbf{22,368768}$",
    "Aufgabe 7":
      "Der Rentenendwert ist um Steuern und Ausgaben anzupassen.\n\n$R_n=(r\\cdot (1-s)-K)\\cdot\\frac{(1+i)^n-1}{i}$\n\n$\\Longrightarrow r=\\left(R_n\\frac{i}{(1+i)^n-1}+K\\right)\\cdot\\frac{1}{1-s}$\n\n$=\\left(3.000.000\\cdot\\frac{0,015}{(1+0,015)^4-1}+60.000\\right)\\cdot\\frac{1}{1-0,47}$\n\n$=1.496.857$",
  },
  set3: {
    "Aufgabe 1":
      "$\\text{Kredit}\\times \\text{Annuitätenfaktor}=\\text{Annuität}\\rightarrow \\text{Kredit}=\\frac{100.000}{\\frac{1,05^{5}\\cdot 0,05}{1,05^{5}-1}}=432.947,67$",
    "Aufgabe 5a":
      "L=C_0^{\\frac{3}{5}} \\cdot C_1^{\\frac{2}{5}}- \\lambda \\bigl(C_1-(1+i)\\cdot(\\bar{C}_0-C_0)\\bigr).",
    "Aufgabe 5b":
      "\\frac{\\partial L}{\\partial \\lambda}=C_1-(1+i)\\cdot(\\bar{C}_0-C_0)=0.",
    "Aufgabe 5c":
      "-(1+i)=-\\frac{\\frac{3}{5}C_0^{\\frac{-2}{5}}\\cdot C_1^{\\frac{2}{5}}}{\\frac{2}{5}C_0^{\\frac{3}{5}}\\cdot C_1^{\\frac{-3}{5}}}.",
    "Aufgabe 5d": "\\bar{C}_0=\\frac{C_1}{1+i}+C_0",
    "Aufgabe 6a": "(1+i) \\cdot C_0 = 250.\nPunkt A auf der Grafik.",
    "Aufgabe 6b": "$C_0=166,67$\nPunkt D auf der Grafik.",
  },
  set4: {
    "Aufgabe 1a":
      "$V^\\text{fair}=\\frac{\\frac{1}{2}150+\\frac{1}{2}90}{1+10\\%}=109,09$",
    "Aufgabe 1c":
      "$105,63=\\frac{\\frac{1}{2}150+\\frac{1}{2}90}{1+k}\\quad\\Longrightarrow\\quad k=13,608\\%$",
    "Aufgabe 1d":
      "$105,63=\\frac{q(\\text{auf})\\cdot 150+(1-q(\\text{auf}))\\cdot 90}{1+10\\%}\\quad\\Longrightarrow\\quad q(\\text{auf})=43,649\\%$",
    "Aufgabe 2b":
      "$107,36=\\frac{\\frac{1}{2}150+\\frac{1}{2}90}{1+k}\\quad\\Longrightarrow\\quad k=11,775\\%$",
    "Aufgabe 2c":
      "$107,36=\\frac{q(\\text{auf})\\cdot 150+(1-q(\\text{auf}))\\cdot 90}{1+10\\%}\\quad\\Longrightarrow\\quad q(\\text{auf})=46,825\\%$",
    "Aufgabe 3":
      "Es gilt\n\n$f(i)= -1500 +\\frac{800}{(1+i)^1}+\\frac{600}{(1+i)^2}+\\frac{100}{(1+i)^3}+\\frac{200}{(1+i)^4}$\n\nMit einem Näherungsverfahren erhält man die Lösung, siehe Abbildung [4.3].\n\nSchritt | Zinssatz | NPV\n0 | 0,000000\\% | 200\n1 | 10\\% | -65,12533\n2 | 7,5436\\% | -7,421405\n3 | 7,2737\\% | -0,81722\n4 | 7,2441\\% | -0,0896363\n5 | 7,2409\\% | -0,010939\n6 | 7,2405\\% | -0,0011",
    "Aufgabe 4":
      "Bei der Berechnung des internen Zinses werden nur Zahlungen, die direkt mit der Investition zusammenhängen, berücksichtigt. Das heißt Basiszahlungen sowie Entnahmen werden hier nicht in Betracht gezogen. Die von den Investitionsprojekten A und B (und auch von der Unterlassung, trivialerweise gleich Null) generierten Zahlungen sind in der folgenden Tabelle gegeben:\n\nZeitpunkte | $t=0$ | $t=1$ | $t=2$ | $t=3$ | $t=4$\nProjekt A Cashflows | $CF_t$ | -3.000 | 1.000 | 1.100 | 800 | 700\nProjekt B Cashflows | $CF_t$ | -4.000 | 2.000 | -800 | 1.500 | 2.100\nUnterlassung Cashflows | $CF_t$ | 0 | 0 | 0 | 0 | 0\n\n$\\text{NPV}=f(i)= -3000 +\\frac{1000}{(1+i)^1}+\\frac{1100}{(1+i)^2}+\\frac{800}{(1+i)^3}+\\frac{700}{(1+i)^4}=0$\n\nMithilfe eines Näherungsverfahrens bekommt man den internen Zinssatz der Investition A von $8,30\\%$.\n\nk | $i_k$ | $f(i_k)=\\text{NPV}$\n0 | 0 | 600\n1 | 0,1 | -102,65692\n2 | 0,085390 | -14,914748\n3 | 0,083319 | -2,11691\n4 | 0,083026 | -0,2988986\n5 | 0,082985 | -0,044353\n6 | 0,082997 | -0,11886\n\nAnalog beträgt der interne Zinssatz der Investition B $6,96\\%$:\n\nk | $i_k$ | $f(i_k)=\\text{NPV}$\n0 | 0 | 800\n1 | 0,1 | -281,67475\n2 | 0,073959 | -41,798008\n3 | 0,070287 | -5,8943356\n4 | 0,69773 | -0,8254203\n5 | 0,69701 | -0,1145245\n6 | 0,069691 | -0,0157724\n\nDie Unterlassungsalternative hat einen internen Zinssatz von Null.",
  },
  "set4-extra": {
    "Aufgabe 1a":
      "$V^\\text{fair}=\\frac{0,3\\cdot 250+0,7\\cdot 100}{1+10\\%}=131,82$",
    "Aufgabe 1c":
      "$119,67=\\frac{0,3\\cdot 250+0,7\\cdot 100}{1+k}\\quad\\Longrightarrow\\quad k=21,165\\%$",
    "Aufgabe 1d":
      "$119,67=\\frac{q(\\text{auf})\\cdot 250+(1-q(\\text{auf}))\\cdot 100}{1+10\\%}\\quad\\Longrightarrow\\quad q(\\text{auf})=21,092\\%$",
    "Aufgabe 2b":
      "$125,371=\\frac{0,3\\cdot 250+0,7\\cdot 100}{1+k}\\quad\\Longrightarrow\\quad k=15,657\\%$",
    "Aufgabe 2c":
      "$125,371=\\frac{q(\\text{auf})\\cdot 250+(1-q(\\text{auf}))\\cdot 100}{1+10\\%}\\quad\\Longrightarrow\\quad q(\\text{auf})=25,272\\%$",
    "Aufgabe 3":
      "$NPV=f(i)=-I_0+\\sum_{t=1}^4\\frac{CF_t}{(1+i)^t}$\n\n$=-1.000+\\frac{600}{1+i}+\\frac{600}{(1+i)^2}+\\frac{0}{(1+i)^3}+\\frac{100}{(1+i)^4}$",
    "Aufgabe 4":
      "$\\text{NPV}=-I_0+\\sum_{t=1}^T \\frac{CF_t}{(1+i)^t}=0$\n\n$\\text{NPV}=f(i)= -6000 +\\frac{100}{(1+i)^1}+\\frac{200}{(1+i)^2}+\\frac{6.000}{(1+i)^3}+\\frac{2.800}{(1+i)^4}=0$",
  },
};

const promptOverrides = {
  set3: {
    "Aufgabe 5a": {
      replace:
        '<p><em>Anmerkung</em>: github erlaubt es nicht, dass Sie hier Formeln eingeben. Wir haben daher Zahlen als Lösung (100) hinterlegt, damit man wenigstens die Musterlösung (die dann natürlich eine Formel und keine Zahl sein wird) sehen kann. Sie können irgendeine Zahl eingeben, damit Sie die richtigen Gleichungen sehen.</p>',
    },
  },
  "set4-extra": {
    "Aufgabe 1c": { removeHint: true, removeLeadingLabel: true },
    "Aufgabe 1d": { removeLeadingLabel: true },
    "Aufgabe 2b": { removeLeadingLabel: true },
    "Aufgabe 2c": { removeHint: true },
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
      override.replace || (override.removeHint ? "" : "$&")
    )
    .replace(
      /<p>Außerdem zählt Blackboard anders als wir\.[\s\S]*?nummeriert\.<\/p>/i,
      ""
    )
    .replace(
      /<p>\s*[a-d][\.\)]\s*/i,
      override.removeLeadingLabel ? "<p>" : "$&"
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

function isFormattedNumberToken(value) {
  return /^(?:0|[1-9]\d{0,2}(?:\.\d{3})*|[1-9]\d*)(?:,\d+)?$/.test((value || "").trim());
}

function splitLooseNumberPair(value) {
  const raw = (value || "").trim();
  for (let index = 1; index < raw.length; index += 1) {
    const left = raw.slice(0, index).trim();
    const right = raw.slice(index).trim();
    if (isFormattedNumberToken(left) && isFormattedNumberToken(right)) {
      return [left, right];
    }
  }
  return null;
}

function normalizeLooseFractions(value) {
  let output = value || "";

  output = output.replace(/\\frac\\ln\(([^)]+)\)\\ln\(([^)]+)\)/g, "\\frac{\\ln($1)}{\\ln($2)}");

  output = output.replace(/\\frac(?!\{)([0-9][0-9.,]*)/g, (match, rawPair) => {
    const split = splitLooseNumberPair(rawPair);
    return split ? `\\frac{${split[0]}}{${split[1]}}` : match;
  });

  output = output.replace(
    /\\frac(?!\{)([0-9]+(?:\.[0-9]{3})*(?:,[0-9]+)?)(1\+\d+\\%)/g,
    "\\frac{$1}{$2}"
  );

  output = output.replace(
    /\\frac(?!\{)\(([^)]+)\)\^(\d+)-1([0-9]+(?:[.,][0-9]+)?)\\cdot\s*\(([^)]+)\)\^(\d+)/g,
    "\\frac{($1)^$2-1}{$3\\cdot ($4)^$5}"
  );

  output = output.replace(
    /\\frac(?!\{)([0-9]+(?:[.,][0-9]+)?)\^\d+-1([0-9]+(?:[.,][0-9]+)?)\\cdot\s*[0-9]+(?:[.,][0-9]+)?\^\d+/g,
    (match) => match
  );

  output = output.replace(
    /\\frac(?!\{)(i)(q\^n)(q\^n-1)/g,
    "\\frac{$1\\cdot $2}{$3}"
  );

  output = output.replace(
    /\\frac(?!\{)([0-9]+(?:[.,][0-9]+)?)\\cdot\s*([0-9]+(?:[.,][0-9]+)?\^\d+)([0-9]+(?:[.,][0-9]+)?\^\d+-1)/g,
    "\\frac{$1\\cdot $2}{$3}"
  );

  output = output.replace(
    /\\frac(?!\{)\((1\+[0-9.,]+)\)\^(\d+)-1([0-9.,]+)\\cdot\s*\((1\+[0-9.,]+)\)\^(\d+)/g,
    "\\frac{($1)^$2-1}{$3\\cdot ($4)^$5}"
  );

  output = output.replace(
    /\\frac(?!\{)([0-9.,]+)(\([^)]+\)\^\d+)\s*(\([^)]+\)\^\d+-1)/g,
    "\\frac{$1$2}{$3}"
  );

  return output;
}

function normalizeMathSyntax(value) {
  return normalizeLooseFractions(value || "")
    .replace(/\\text([A-Za-zÄÖÜäöüß]+)/g, "\\text{$1}")
    .replace(/\^\\text\{([^}]+)\}/g, "^{\\text{$1}}")
    .replace(/\\bar\{([A-Za-z])_([0-9])\}/g, "\\bar{$1}_$2")
    .replace(/\\bar([A-Za-z])_([0-9])/g, "\\bar{$1}_$2")
    .replace(/\\bar([A-Za-z])/g, "\\bar{$1}")
    .replace(/\\frac\\partial\s*L\\partial\s*C_0/g, "\\frac{\\partial L}{\\partial C_0}")
    .replace(/\\frac\\partial\s*L\\partial\s*C_1/g, "\\frac{\\partial L}{\\partial C_1}")
    .replace(/\\frac\\partial\s*L\\partial\s*\\lambda/g, "\\frac{\\partial L}{\\partial \\lambda}")
    .replace(/\\fracC_1\(1\+i\)/g, "\\frac{C_1}{(1+i)}")
    .replace(/\\frac([0-9][0-9.,]*)\(([^)]+)\)(\^[0-9]+)?/g, (_m, num, inner, exp = "") => {
      return `\\frac{${num}}{(${inner})${exp}}`;
    })
    .replace(/\\frac(-?\d)(-?\d)(?![\d{])/g, "\\frac{$1}{$2}")
    .replace(/\^\s*\\frac(-?\d)(-?\d)(?![\d{])/g, "^\\frac{$1}{$2}")
    .replace(/\\sqrt\[([^\]]+)\]\\frac\{([^}]+)\}\{([^}]+)\}/g, "\\sqrt[$1]{\\frac{$2}{$3}}")
    .replace(/\\sqrt\[([^\]]+)\](\\frac\{[^}]+\}\{[^}]+\})/g, "\\sqrt[$1]{$2}")
    .replace(/\\sqrt\[([^\]]+)\]([A-Za-z0-9.,]+)/g, "\\sqrt[$1]{$2}")
    .replace(/\\sqrt([A-Za-z0-9.,]+)/g, "\\sqrt{$1}")
    .replace(/\\lambda/g, "\\lambda");
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
      if (href.includes("@X@EmbeddedFile.requestUrlStub@X@")) {
        node.removeAttribute("href");
      }
    });
  }

  template.content.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (
        name === "style" ||
        name.startsWith("on") ||
        (name === "class" || name === "id")
      ) {
        node.removeAttribute(attr.name);
      }
    });
  });

  return template.innerHTML.trim();
}

function textOrHtml(node, selector, options = {}) {
  const target = node.querySelector(selector);
  if (!target) {
    return "";
  }

  const raw = target.innerHTML && target.innerHTML.trim() ? target.innerHTML : target.textContent;
  return cleanHtml(raw || "", options);
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

function questionOverride(setId, title) {
  if (setId === "set3") {
    if (title === "Aufgabe 6b" || title === "Aufgabe 6c") {
      return { skip: true };
    }

    if (title === "Aufgabe 6d") {
      return {
        title: "Aufgabe 6b",
        solutionLetter: "b",
      };
    }
  }

  return {
    title,
    solutionLetter: null,
  };
}

function parseQuestion(item, solutionLookup, setId) {
  const type = item.querySelector("bbmd_questiontype")?.textContent?.trim() || "";
  if (type !== "Numeric") {
    return null;
  }

  const sourceTitle = item.getAttribute("title") || "Aufgabe";
  const override = questionOverride(setId, sourceTitle);
  if (override.skip) {
    return null;
  }

  const title = override.title || sourceTitle;
  const prompt = applyPromptOverride(
    setId,
    sourceTitle,
    textOrHtml(item, "presentation mat_formattedtext")
  );
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

  const questionKey = normalizeQuestionKey(sourceTitle);
  const subtaskMatch =
    override.solutionLetter
      ? [null, override.solutionLetter]
      : sourceTitle.match(/Aufgabe\s+\d+([a-z])$/i);
  let solutionText = solutionLookup[questionKey] || "";
  if (subtaskMatch && solutionText) {
    solutionText = extractSubtaskSolution(solutionText, subtaskMatch[1]);
  }
  const explicitSolution = getSolutionOverride(setId, title);
  if (explicitSolution) {
    solutionText = explicitSolution;
  }
  if (normalizeQuestionKey(title) === "Aufgabe 6" && solutionText) {
    solutionText = solutionText.replace(/\\bar\{?C\}?_0/g, "C_0");
  }

  return {
    title,
    prompt,
    incorrectFeedback,
    min,
    max,
    exact,
    solutionText,
    forceSolutionOnly: setId === "set3" && /^Aufgabe 5[a-d]$/i.test(title),
  };
}

function parseExerciseXml(xmlText, solutionLookup, setId) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "application/xml");
  const title = xml.querySelector("assessment")?.getAttribute("title") || "Aufgabenset";
  const intro = textOrHtml(xml, "presentation_material mat_formattedtext");
  const items = [...xml.querySelectorAll("section > item")]
    .map((item) => parseQuestion(item, solutionLookup, setId))
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

  if (
    /\\frac|\\cdot|\\sqrt|\\ln|\\Longrightarrow|\\rightarrow|\\mathrm|\\text|\\sum|\\approx/.test(
      value
    )
  ) {
    return true;
  }

  const proseRemainder = value.replace(/\$[^$]*\$/g, "").trim();
  if (proseRemainder && /[A-Za-zÄÖÜäöü]/.test(proseRemainder)) {
    return false;
  }

  return (
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
        const inner = part.slice(1, -1);
        return `$${escapeHtml(prepareCellMath(inner))}$`;
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

  if (question.forceSolutionOnly) {
    return {
      ok: false,
      html: `<p>Die Eingabe dient hier nur dazu, die Musterlösung anzuzeigen.</p>${renderSolutionDetails(
        question.solutionText
      )}`,
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

function renderQuestion(question) {
  const article = document.createElement("article");
  article.className = "question-card";

  const promptHtml = question.prompt || "<p>Keine Aufgabenstellung verfügbar.</p>";
  article.innerHTML = `
    <span class="question-number">${question.title}</span>
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
  data.items.forEach((question) => list.appendChild(renderQuestion(question)));
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
      fetch(`${meta.file}?v=${assetVersion}`),
      solutionDataPromise,
    ]);
    if (!response.ok) {
      throw new Error("fetch failed");
    }

    const xmlText = await response.text();
    const solutionLookup = solutionData[meta.id] || {};
    const data = parseExerciseXml(xmlText, solutionLookup, meta.id);
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
  if (!container || container.children.length) {
    return;
  }

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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderExerciseList, { once: true });
} else {
  renderExerciseList();
}
