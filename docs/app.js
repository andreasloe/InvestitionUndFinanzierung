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
function textOrHtml(node, selector, options = {}) {
  const target = node.querySelector(selector);
  if (!target) {
    return "";
  }

  const raw = target.innerHTML && target.innerHTML.trim() ? target.innerHTML : target.textContent;
  return cleanHtml(raw || "", options);
}
