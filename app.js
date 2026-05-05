const $ = (id) => document.getElementById(id);

const els = {
  mode: $("modeSelect"),
  width: $("widthSelect"),
  sanitize: $("sanitizeToggle"),
  inline: $("inlineToggle"),
  frame: $("frameToggle"),
  source: $("sourceInput"),
  articleTitle: $("articleTitleInput"),
  articleTitlePreview: $("articleTitlePreview"),
  showTitle: $("showTitleToggle"),
  output: $("wechatOutput"),
  hidden: $("hiddenRender"),
  notice: $("notice"),
  state: $("stateText"),
  toast: $("toast"),
  paste: $("pasteBtn"),
  sampleHtml: $("sampleHtmlBtn"),
  sampleMd: $("sampleMdBtn"),
  sampleMixed: $("sampleMixedBtn"),
  copyTitle: $("copyTitleBtn"),
  convert: $("convertBtn"),
  copyRich: $("copyRichBtn"),
  copyRich2: $("copyRichBtn2"),
  copyHtml: $("copyHtmlBtn"),
  exportBtn: $("exportBtn"),
  clear: $("clearBtn"),
  selectPreview: $("selectPreviewBtn")
};

const draftKey = "wechat-rich-converter:draft:v1";

const sampleHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; color: #273638; }
    .card { padding: 18px; border-radius: 14px; background: #f4faf8; border: 1px solid #d8e9e5; }
    .quote { padding: 20px; border-radius: 16px; background: linear-gradient(135deg, #12665f, #143a44); color: white; font-weight: 800; }
    h2 { color: #12665f; font-size: 22px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #12665f; color: white; }
    th, td { padding: 10px; border: 1px solid #dfecea; }
  </style>
</head>
<body>
  <h1>普通人如何读懂财经新闻？</h1>
  <p>很多财经新闻看起来很复杂，其实第一步不是预测涨跌，而是先把它翻译成人话。</p>
  <div class="quote">看懂一条财经新闻，先问三件事：发生了什么、影响谁、风险在哪里。</div>
  <h2>一个简单框架</h2>
  <div class="card">
    <p><strong>第一步：</strong>找事实，不急着看观点。</p>
    <p><strong>第二步：</strong>看数据，但要核验最新公开来源。</p>
    <p><strong>第三步：</strong>区分知识、情绪和营销。</p>
  </div>
  <table>
    <tr><th>问题</th><th>作用</th></tr>
    <tr><td>发生了什么</td><td>确认事实</td></tr>
    <tr><td>为什么重要</td><td>理解影响链条</td></tr>
    <tr><td>风险在哪里</td><td>避免只看好处</td></tr>
  </table>
</body>
</html>`;

const sampleMarkdown = `# 普通人如何读懂财经新闻？

很多财经新闻看起来很复杂，其实第一步不是预测涨跌，而是先把它翻译成人话。

> 看懂一条财经新闻，先问三件事：发生了什么、影响谁、风险在哪里。

## 一个简单框架

- 第一步：找事实，不急着看观点。
- 第二步：看数据，但要核验最新公开来源。
- 第三步：区分知识、情绪和营销。

| 问题 | 作用 |
|---|---|
| 发生了什么 | 确认事实 |
| 为什么重要 | 理解影响链条 |
| 风险在哪里 | 避免只看好处 |

**提醒：** 公众号后台请粘贴“复制到公众号”得到的富文本，不要直接粘贴代码。`;

const sampleMixed = `<style>
  .note { padding: 16px; border-radius: 14px; background: #f4faf8; border: 1px solid #d8e9e5; }
  .note strong { color: #12665f; }
</style>

## 今天先看懂一个概念

这段是 Markdown，下面穿插一块 HTML 卡片。

<div class="note">
  <p><strong>人话解释：</strong>利率可以理解成“钱的租金”。</p>
  <p>借钱要付租金，存钱相当于把钱租给别人。</p>
</div>

> 混合模式适合 AI 生成的一半是 Markdown、一半是 HTML/CSS 的内容。

| 内容类型 | 会怎么处理 |
|---|---|
| Markdown 小标题 | 自动变成公众号小标题 |
| HTML 卡片 | 保留结构并尽量内联样式 |
| CSS 样式 | 尽量转成可复制的内联样式 |`;

const defaultHtml = `
  <section style="padding:30px 24px;">
    <div style="max-width:640px;margin:0 auto;color:#314346;font-size:16px;line-height:1.9;">
      <h1 style="margin:0 0 12px;color:#132f33;font-size:28px;line-height:1.35;font-weight:900;">公众号富文本转换器</h1>
      <p style="margin:0 0 16px;">把左侧代码粘进来，点击“转换预览”，再点击“复制到公众号”。</p>
      <div style="margin:20px 0;padding:18px;border-radius:14px;background:#f8fbfa;border:1px solid #dfecea;">
        <p style="margin:0;color:#12665f;font-weight:900;">适合：</p>
        <p style="margin:8px 0 0;">HTML/CSS 模板、AI 生成的文章代码、Markdown 正文、普通文本。</p>
      </div>
    </div>
  </section>
`;

const dangerousTags = new Set([
  "SCRIPT", "IFRAME", "OBJECT", "EMBED", "LINK", "META", "FORM", "INPUT",
  "BUTTON", "TEXTAREA", "SELECT", "OPTION", "CANVAS", "VIDEO", "AUDIO"
]);

const computedProps = [
  "color",
  "background-color",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "line-height",
  "letter-spacing",
  "text-align",
  "text-decoration-line",
  "vertical-align",
  "display",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-top-style",
  "border-right-style",
  "border-bottom-style",
  "border-left-style",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "border-radius",
  "box-shadow",
  "border-collapse",
  "list-style-type",
  "white-space"
];

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function setState(message) {
  els.state.textContent = message;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function unwrapFencedCode(input) {
  const trimmed = input.trim();
  const match = trimmed.match(/^```(?:html|xml|markdown|md|text)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : input;
}

function removeDangerousAttributes(el) {
  [...el.attributes].forEach((attr) => {
    const name = attr.name.toLowerCase();
    const value = attr.value.trim().toLowerCase();
    if (name.startsWith("on")) {
      el.removeAttribute(attr.name);
      return;
    }
    if ((name === "href" || name === "src") && value.startsWith("javascript:")) {
      el.removeAttribute(attr.name);
      return;
    }
    if (name === "srcdoc") {
      el.removeAttribute(attr.name);
    }
  });
}

function sanitizeTree(root) {
  root.querySelectorAll("*").forEach((el) => {
    if (dangerousTags.has(el.tagName)) {
      el.remove();
      return;
    }
    removeDangerousAttributes(el);
  });
}

function extractHtmlParts(input) {
  const cleaned = unwrapFencedCode(input);
  const doc = new DOMParser().parseFromString(cleaned, "text/html");
  const styles = [...doc.querySelectorAll("style")]
    .map((style) => style.textContent || "")
    .join("\n");
  doc.querySelectorAll("style").forEach((style) => style.remove());

  const bodyHtml = doc.body && doc.body.innerHTML.trim()
    ? doc.body.innerHTML
    : cleaned;

  return { html: bodyHtml, css: styles };
}

function extractStyleBlocks(input) {
  let css = "";
  const content = input.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_match, styleText) => {
    css += `${styleText}\n`;
    return "\n";
  });
  return { css, content };
}

function countTag(buffer, tagName) {
  const open = new RegExp(`<${tagName}(\\s|>|/)`, "gi");
  const close = new RegExp(`</${tagName}>`, "gi");
  return (buffer.match(open) || []).length - (buffer.match(close) || []).length;
}

function splitMixedSegments(input) {
  const blockTags = new Set([
    "article", "aside", "blockquote", "div", "figure", "footer", "header",
    "h1", "h2", "h3", "h4", "h5", "h6", "hr", "img", "li", "main", "ol",
    "p", "pre", "section", "table", "tbody", "td", "tfoot", "th", "thead",
    "tr", "ul"
  ]);
  const voidTags = new Set(["br", "hr", "img", "input", "meta", "link"]);
  const lines = input.replace(/\r\n/g, "\n").split("\n");
  const segments = [];
  let mdLines = [];
  let htmlLines = [];
  let htmlTag = "";

  const flushMd = () => {
    const text = mdLines.join("\n").trim();
    if (text) segments.push({ type: "markdown", content: text });
    mdLines = [];
  };

  const flushHtml = () => {
    const text = htmlLines.join("\n").trim();
    if (text) segments.push({ type: "html", content: text });
    htmlLines = [];
    htmlTag = "";
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (htmlLines.length) {
      htmlLines.push(line);
      if (!htmlTag || countTag(htmlLines.join("\n"), htmlTag) <= 0) {
        flushHtml();
      }
      return;
    }

    const start = trimmed.match(/^<([a-z][\w:-]*)(\s|>|\/)/i);
    if (start && blockTags.has(start[1].toLowerCase())) {
      flushMd();
      htmlTag = start[1].toLowerCase();
      htmlLines.push(line);
      if (voidTags.has(htmlTag) || trimmed.endsWith("/>") || countTag(htmlLines.join("\n"), htmlTag) <= 0) {
        flushHtml();
      }
      return;
    }

    mdLines.push(line);
  });

  flushHtml();
  flushMd();
  return segments;
}

function convertMixed(input) {
  const cleaned = unwrapFencedCode(input);
  const { css, content } = extractStyleBlocks(cleaned);
  const segments = splitMixedSegments(content);
  const html = segments.map((segment) => {
    if (segment.type === "html") return segment.content;
    return renderMarkdown(segment.content);
  }).join("\n");

  return convertHtml(`${css ? `<style>${css}</style>` : ""}${html}`);
}

function shouldSkipStyle(prop, value, tagName) {
  if (!value) return true;
  if (value === "normal" && !["font-weight", "font-style", "line-height"].includes(prop)) return true;
  if (value === "none" && !["display", "border-top-style", "border-right-style", "border-bottom-style", "border-left-style"].includes(prop)) return true;
  if (value === "0px" && !prop.startsWith("border")) return true;
  if ((prop === "background-color" || prop.endsWith("-color")) && value === "rgba(0, 0, 0, 0)") return true;
  if (prop === "font-family" && value.toLowerCase().includes("times new roman")) return true;
  if (prop === "display" && !["block", "inline-block", "table", "table-row", "table-cell", "flex"].includes(value)) return true;
  if (prop === "white-space" && value === "normal") return true;
  if (prop === "border-collapse" && tagName !== "TABLE") return true;
  if (prop === "box-shadow" && value === "none") return true;
  return false;
}

function inlineComputedStyles(container) {
  const elements = [container, ...container.querySelectorAll("*")];

  elements.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    const computed = getComputedStyle(el);
    const stylePairs = [];

    computedProps.forEach((prop) => {
      const value = computed.getPropertyValue(prop);
      if (!shouldSkipStyle(prop, value, el.tagName)) {
        stylePairs.push(`${prop}:${value}`);
      }
    });

    if (el.tagName === "IMG") {
      stylePairs.push("max-width:100%");
      stylePairs.push("height:auto");
    }

    if (el.tagName === "TABLE") {
      stylePairs.push("width:100%");
      stylePairs.push("border-collapse:collapse");
    }

    if (stylePairs.length) {
      el.setAttribute("style", stylePairs.join(";"));
    }

    el.removeAttribute("class");
    el.removeAttribute("id");
  });
}

function convertHtml(input) {
  const { html, css } = extractHtmlParts(input);
  const shell = document.createElement("div");
  shell.innerHTML = html;

  if (els.sanitize.checked) {
    sanitizeTree(shell);
  }

  if (!els.inline.checked) {
    return shell.innerHTML;
  }

  els.hidden.innerHTML = "";
  const style = document.createElement("style");
  style.textContent = css;
  const renderRoot = document.createElement("div");
  renderRoot.style.width = `${els.width.value}px`;
  renderRoot.style.background = "#ffffff";
  renderRoot.innerHTML = shell.innerHTML;

  els.hidden.append(style, renderRoot);
  inlineComputedStyles(renderRoot);

  const result = renderRoot.innerHTML;
  els.hidden.innerHTML = "";
  return result;
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong style=\"font-weight:900;color:#132f33;\">$1</strong>")
    .replace(/`([^`]+)`/g, "<code style=\"padding:2px 6px;border-radius:6px;background:#edf5f3;color:#12665f;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;\">$1</code>");
}

function splitBlocks(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let current = [];

  const flush = () => {
    if (current.length) {
      blocks.push(current.join("\n").trim());
      current = [];
    }
  };

  lines.forEach((line) => {
    if (!line.trim()) {
      flush();
      return;
    }
    if (/^\s*\|.+\|\s*$/.test(line)) {
      flush();
      blocks.push(line);
      return;
    }
    current.push(line);
  });

  flush();

  const merged = [];
  for (let i = 0; i < blocks.length; i += 1) {
    if (/^\s*\|.+\|\s*$/.test(blocks[i])) {
      const rows = [blocks[i]];
      while (i + 1 < blocks.length && /^\s*\|.+\|\s*$/.test(blocks[i + 1])) {
        rows.push(blocks[i + 1]);
        i += 1;
      }
      merged.push(rows.join("\n"));
    } else {
      merged.push(blocks[i]);
    }
  }
  return merged;
}

function parseTable(block) {
  const rows = block
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim()));

  if (rows.length < 2) return null;
  if (!rows[1].every((cell) => /^:?-{3,}:?$/.test(cell))) return null;
  return { headers: rows[0], body: rows.slice(2) };
}

function renderMdTable(table) {
  const heads = table.headers.map((cell) => `<th style="padding:12px 10px;text-align:left;font-weight:900;">${inlineMarkdown(cell)}</th>`).join("");
  const rows = table.body.map((row, index) => {
    const bg = index % 2 === 0 ? "#ffffff" : "#f8fbfa";
    const cells = row.map((cell, cellIndex) => {
      const lead = cellIndex === 0 ? "font-weight:800;color:#132f33;" : "";
      return `<td style="padding:12px 10px;border-top:1px solid #dfecea;${lead}">${inlineMarkdown(cell)}</td>`;
    }).join("");
    return `<tr style="background:${bg};">${cells}</tr>`;
  }).join("");

  return `
    <div style="margin:22px 0;border-radius:14px;overflow:hidden;border:1px solid #dfecea;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.7;">
        <thead><tr style="background:#12665f;color:#ffffff;">${heads}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderMdList(block) {
  const items = block.split("\n")
    .map((line) => line.replace(/^\s*[-*]\s+/, "").trim())
    .filter(Boolean)
    .map((line) => `
      <div style="display:flex;gap:10px;margin:0 0 10px;align-items:flex-start;">
        <span style="flex:0 0 auto;width:7px;height:7px;margin-top:12px;border-radius:50%;background:#f2b84b;"></span>
        <p style="margin:0;flex:1;">${inlineMarkdown(line)}</p>
      </div>
    `).join("");

  return `<div style="margin:20px 0;padding:18px 18px;border-left:5px solid #f2b84b;background:#fff8e8;border-radius:12px;">${items}</div>`;
}

function renderMdQuote(block) {
  const text = block.replace(/^>\s?/gm, "").trim();
  return `
    <div style="margin:24px 0;padding:22px 20px;border-radius:16px;background:linear-gradient(135deg,#12665f 0%,#143a44 100%);color:#ffffff;">
      <p style="margin:0;font-size:21px;line-height:1.6;font-weight:900;">${inlineMarkdown(text)}</p>
    </div>
  `;
}

function renderMarkdown(input) {
  const blocks = splitBlocks(unwrapFencedCode(input));
  let sectionNumber = 0;
  let html = "";

  blocks.forEach((block) => {
    if (/^#\s+/.test(block)) {
      html += `<h1 style="margin:0 0 16px;color:#132f33;font-size:28px;line-height:1.35;font-weight:900;letter-spacing:0;">${inlineMarkdown(block.replace(/^#\s+/, ""))}</h1>`;
      return;
    }

    if (/^##\s+/.test(block)) {
      sectionNumber += 1;
      html += `<h2 style="margin:28px 0 18px;font-size:22px;line-height:1.4;color:#132f33;font-weight:900;letter-spacing:0;"><span style="display:inline-block;margin-right:10px;padding:3px 10px;border-radius:999px;background:#12665f;color:#ffffff;font-size:14px;vertical-align:3px;">${String(sectionNumber).padStart(2, "0")}</span>${inlineMarkdown(block.replace(/^##\s+/, ""))}</h2>`;
      return;
    }

    if (/^###\s+/.test(block)) {
      html += `<h3 style="margin:22px 0 12px;color:#12665f;font-size:18px;line-height:1.45;font-weight:900;">${inlineMarkdown(block.replace(/^###\s+/, ""))}</h3>`;
      return;
    }

    if (/^>\s?/m.test(block)) {
      html += renderMdQuote(block);
      return;
    }

    const table = parseTable(block);
    if (table) {
      html += renderMdTable(table);
      return;
    }

    const lines = block.split("\n");
    if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
      html += renderMdList(block);
      return;
    }

    html += `<p style="margin:0 0 16px;">${inlineMarkdown(block).replace(/\n/g, "<br>")}</p>`;
  });

  return html;
}

function renderPlainText(input) {
  return unwrapFencedCode(input)
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => `<p style="margin:0 0 16px;">${escapeHtml(para).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function wrapForWechat(html) {
  if (!els.frame.checked) {
    return html;
  }

  return `
    <section style="margin:0 auto;padding:24px 18px;max-width:${els.width.value}px;background:#ffffff;">
      <section style="margin:0 auto;max-width:640px;color:#314346;font-size:16px;line-height:1.9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',Arial,sans-serif;">
        ${html}
      </section>
    </section>
  `;
}

function renderArticleTitle(title) {
  if (!title) return "";
  return `
    <section style="margin:0 0 22px;padding:0 0 18px;border-bottom:1px solid #dfecea;">
      <h1 style="margin:0;color:#132f33;font-size:28px;line-height:1.35;font-weight:900;letter-spacing:0;">${inlineMarkdown(title)}</h1>
    </section>
  `;
}

function convert() {
  const source = els.source.value.trim();
  const mode = els.mode.value;
  const articleTitle = els.articleTitle.value.trim();

  els.articleTitlePreview.textContent = articleTitle || "未填写标题";

  if (!source) {
    const titleHtml = els.showTitle.checked ? renderArticleTitle(articleTitle) : "";
    els.output.innerHTML = titleHtml ? wrapForWechat(titleHtml) : defaultHtml;
    els.output.style.width = `${els.width.value}px`;
    setState("等待输入");
    return;
  }

  let html = "";
  if (mode === "mixed") {
    html = convertMixed(source);
  } else if (mode === "html") {
    html = convertHtml(source);
  } else if (mode === "markdown") {
    html = renderMarkdown(source);
  } else {
    html = renderPlainText(source);
  }

  if (els.showTitle.checked && articleTitle) {
    html = `${renderArticleTitle(articleTitle)}${html}`;
  }

  els.output.style.width = `${els.width.value}px`;
  els.output.innerHTML = wrapForWechat(html);
  setState("已转换");
  els.notice.textContent = "转换完成。点击“复制到公众号”，然后到微信公众平台正文编辑区粘贴。";
}

function getCopyHtml() {
  return `<meta charset="utf-8">${els.output.innerHTML}`;
}

async function copyRichText() {
  const html = getCopyHtml();
  const text = els.output.innerText.replace(/\n{3,}/g, "\n\n").trim();

  if (navigator.clipboard && window.ClipboardItem) {
    const item = new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([text], { type: "text/plain" })
    });
    await navigator.clipboard.write([item]);
  } else {
    selectPreview();
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }
  showToast("已复制富文本，可以粘贴到公众号后台");
}

function selectPreview() {
  const range = document.createRange();
  range.selectNodeContents(els.output);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  showToast("已选中预览区");
}

async function copyHtml() {
  await navigator.clipboard.writeText(els.output.innerHTML);
  showToast("HTML 已复制");
}

function exportHtml() {
  const html = `<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>公众号富文本导出</title></head>
<body style="margin:0;background:#ffffff;">${els.output.innerHTML}</body>
</html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wechat-rich-text-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("HTML 文件已导出");
}

function saveDraft() {
  const draft = {
    mode: els.mode.value,
    width: els.width.value,
    sanitize: els.sanitize.checked,
    inline: els.inline.checked,
    frame: els.frame.checked,
    articleTitle: els.articleTitle.value,
    showTitle: els.showTitle.checked,
    source: els.source.value
  };
  localStorage.setItem(draftKey, JSON.stringify(draft));
}

function loadDraft() {
  const raw = localStorage.getItem(draftKey);
  if (!raw) return false;
  try {
    const draft = JSON.parse(raw);
    els.mode.value = draft.mode || "mixed";
    els.width.value = draft.width || "640";
    els.sanitize.checked = draft.sanitize !== false;
    els.inline.checked = draft.inline !== false;
    els.frame.checked = draft.frame !== false;
    els.articleTitle.value = draft.articleTitle || "";
    els.showTitle.checked = draft.showTitle === true;
    els.source.value = draft.source || "";
    return true;
  } catch {
    localStorage.removeItem(draftKey);
    return false;
  }
}

function clearAll() {
  els.source.value = "";
  els.articleTitle.value = "";
  els.showTitle.checked = false;
  localStorage.removeItem(draftKey);
  convert();
  setState("已清空");
  showToast("已清空");
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    els.source.value = text;
    saveDraft();
    convert();
    showToast("已从剪贴板粘贴并转换");
  } catch {
    showToast("浏览器拒绝读取剪贴板，请手动粘贴");
  }
}

function loadHtmlSample() {
  els.mode.value = "html";
  els.articleTitle.value = "普通人如何读懂财经新闻？";
  els.source.value = sampleHtml;
  convert();
  saveDraft();
  showToast("HTML 示例已载入");
}

function loadMarkdownSample() {
  els.mode.value = "markdown";
  els.articleTitle.value = "普通人如何读懂财经新闻？";
  els.source.value = sampleMarkdown;
  convert();
  saveDraft();
  showToast("Markdown 示例已载入");
}

function loadMixedSample() {
  els.mode.value = "mixed";
  els.articleTitle.value = "HTML 和 Markdown 混合内容怎么发公众号？";
  els.source.value = sampleMixed;
  convert();
  saveDraft();
  showToast("混合示例已载入");
}

["input", "change"].forEach((eventName) => {
  [els.mode, els.width, els.sanitize, els.inline, els.frame, els.articleTitle, els.showTitle, els.source].forEach((el) => {
    el.addEventListener(eventName, () => {
      saveDraft();
      convert();
    });
  });
});

els.convert.addEventListener("click", () => {
  convert();
  saveDraft();
  showToast("已转换预览");
});
els.copyRich.addEventListener("click", () => copyRichText().catch(() => showToast("复制被浏览器拦截，请手动选中预览区复制")));
els.copyRich2.addEventListener("click", () => copyRichText().catch(() => showToast("复制被浏览器拦截，请手动选中预览区复制")));
els.copyHtml.addEventListener("click", () => copyHtml().catch(() => showToast("复制 HTML 失败")));
els.copyTitle.addEventListener("click", () => {
  const title = els.articleTitle.value.trim();
  if (!title) {
    showToast("请先填写文章标题");
    return;
  }
  navigator.clipboard.writeText(title)
    .then(() => showToast("文章标题已复制"))
    .catch(() => showToast("复制标题失败，请手动复制"));
});
els.exportBtn.addEventListener("click", exportHtml);
els.clear.addEventListener("click", clearAll);
els.selectPreview.addEventListener("click", selectPreview);
els.paste.addEventListener("click", pasteFromClipboard);
els.sampleHtml.addEventListener("click", loadHtmlSample);
els.sampleMd.addEventListener("click", loadMarkdownSample);
els.sampleMixed.addEventListener("click", loadMixedSample);

window.addEventListener("beforeunload", saveDraft);

if (!loadDraft()) {
  els.source.value = "";
}
convert();
