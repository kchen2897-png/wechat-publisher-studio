/* ═══════════════════════════════════════════
   公众号富文本转换器 — WeChat Rich Text Converter
   ═══════════════════════════════════════════ */

const $ = (id) => document.getElementById(id);

const els = {
  mode: $("modeSelect"), width: $("widthSelect"),
  sanitize: $("sanitizeToggle"), inline: $("inlineToggle"), frame: $("frameToggle"),
  source: $("sourceInput"), articleTitle: $("articleTitleInput"),
  articleTitlePreview: $("articleTitlePreview"), showTitle: $("showTitleToggle"),
  output: $("wechatOutput"), hidden: $("hiddenRender"), notice: $("notice"),
  state: $("stateText"), toast: $("toast"),
  paste: $("pasteBtn"), sampleHtml: $("sampleHtmlBtn"),
  sampleMd: $("sampleMdBtn"), sampleMixed: $("sampleMixedBtn"),
  copyTitle: $("copyTitleBtn"), convert: $("convertBtn"),
  copyRich: $("copyRichBtn"), copyRich2: $("copyRichBtn2"),
  copyHtml: $("copyHtmlBtn"), exportBtn: $("exportBtn"), clear: $("clearBtn"),
  selectPreview: $("selectPreviewBtn"),
  /* workbench */
  workbenchToggle: $("workbenchToggle"), workbenchContainer: $("workbenchContainer"),
  normalPreview: $("normalPreview"), blockList: $("blockList"),
  workbenchLiveOutput: $("workbenchLiveOutput"),
  blockControlsBody: $("blockControlsBody"), selectedBlockLabel: $("selectedBlockLabel"),
  resetBlocksBtn: $("resetBlocksBtn"),
};

const draftKey = "wechat-rich-converter:draft:v2";
const wbStateKey = "wechat-rich-converter:workbench:v1";

const sampleHtml = `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; color: #273638; }
  .card { padding: 18px; border-radius: 14px; background: #f4faf8; border: 1px solid #d8e9e5; }
  .quote { padding: 20px; border-radius: 16px; background: linear-gradient(135deg, #12665f, #143a44); color: white; font-weight: 800; }
  h2 { color: #12665f; font-size: 22px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #12665f; color: white; }
  th, td { padding: 10px; border: 1px solid #dfecea; }
</style></head>
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
</body></html>`;

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

**提醒：** 公众号后台请粘贴"复制到公众号"得到的富文本，不要直接粘贴代码。`;

const sampleMixed = `<style>
  .note { padding: 16px; border-radius: 14px; background: #f4faf8; border: 1px solid #d8e9e5; }
  .note strong { color: #12665f; }
</style>

## 今天先看懂一个概念

这段是 Markdown，下面穿插一块 HTML 卡片。

<div class="note">
  <p><strong>人话解释：</strong>利率可以理解成"钱的租金"。</p>
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
      <p style="margin:0 0 16px;">把左侧代码粘进来，点击"转换预览"，再点击"复制到公众号"。</p>
      <div style="margin:20px 0;padding:18px;border-radius:14px;background:#f8fbfa;border:1px solid #dfecea;">
        <p style="margin:0;color:#12665f;font-weight:900;">适合：</p>
        <p style="margin:8px 0 0;">HTML/CSS 模板、AI 生成的文章代码、Markdown 正文、普通文本。</p>
      </div>
    </div>
  </section>`;

const dangerousTags = new Set([
  "SCRIPT", "IFRAME", "OBJECT", "EMBED", "LINK", "META", "FORM", "INPUT",
  "BUTTON", "TEXTAREA", "SELECT", "OPTION", "CANVAS", "VIDEO", "AUDIO"
]);

const computedProps = [
  "color", "background-color", "font-family", "font-size", "font-weight",
  "font-style", "line-height", "letter-spacing", "text-align",
  "text-decoration-line", "vertical-align", "display",
  "margin-top", "margin-right", "margin-bottom", "margin-left",
  "padding-top", "padding-right", "padding-bottom", "padding-left",
  "border-top-width", "border-right-width", "border-bottom-width", "border-left-width",
  "border-top-style", "border-right-style", "border-bottom-style", "border-left-style",
  "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
  "border-radius", "box-shadow", "border-collapse", "list-style-type", "white-space"
];

/* ── Toast, State, Helpers ── */
let _toastTimer;
function showToast(msg) {
  clearTimeout(_toastTimer);
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  _toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}
function setState(msg) { els.state.textContent = msg; }
function escapeHtml(v) { return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
function unwrapFencedCode(input) {
  const t = input.trim();
  const m = t.match(/^```(?:html|xml|markdown|md|text)?\s*([\s\S]*?)\s*```$/i);
  return m ? m[1].trim() : input;
}

/* ── Sanitize / Extract ── */
function removeDangerousAttributes(el) {
  [...el.attributes].forEach((a) => {
    const n = a.name.toLowerCase(), v = (a.value||"").trim().toLowerCase();
    if (n.startsWith("on")) { el.removeAttribute(a.name); return; }
    if ((n==="href"||n==="src") && v.startsWith("javascript:")) { el.removeAttribute(a.name); return; }
    if (n==="srcdoc") el.removeAttribute(a.name);
  });
}
function sanitizeTree(root) {
  root.querySelectorAll("*").forEach((el) => {
    if (dangerousTags.has(el.tagName)) { el.remove(); return; }
    removeDangerousAttributes(el);
  });
}
function extractHtmlParts(input) {
  const cleaned = unwrapFencedCode(input);
  const doc = new DOMParser().parseFromString(cleaned, "text/html");
  const styles = [...doc.querySelectorAll("style")].map((s) => s.textContent||"").join("\n");
  doc.querySelectorAll("style").forEach((s) => s.remove());
  const bodyHtml = doc.body && doc.body.innerHTML.trim() ? doc.body.innerHTML : cleaned;
  return { html: bodyHtml, css: styles };
}
function extractStyleBlocks(input) {
  let css = "";
  const content = input.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_, styleText) => { css += `${styleText}\n`; return "\n"; });
  return { css, content };
}
function countTag(buf, tag) {
  const o = new RegExp(`<${tag}(\\s|>|/)`,"gi"), c = new RegExp(`</${tag}>`,"gi");
  return (buf.match(o)||[]).length - (buf.match(c)||[]).length;
}

/* ── Mixed Mode ── */
function splitMixedSegments(input) {
  const blockTags = new Set(["article","aside","blockquote","div","figure","footer","header","h1","h2","h3","h4","h5","h6","hr","img","li","main","ol","p","pre","section","table","tbody","td","tfoot","th","thead","tr","ul"]);
  const voidTags = new Set(["br","hr","img","input","meta","link"]);
  const lines = input.replace(/\r\n/g,"\n").split("\n");
  const segs = []; let mdLines = [], htmlLines = [], htmlTag = "";
  const flushMd = () => { const t = mdLines.join("\n").trim(); if (t) segs.push({type:"markdown",content:t}); mdLines = []; };
  const flushHtml = () => { const t = htmlLines.join("\n").trim(); if (t) segs.push({type:"html",content:t}); htmlLines = []; htmlTag = ""; };
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (htmlLines.length) { htmlLines.push(line); if (!htmlTag||countTag(htmlLines.join("\n"),htmlTag)<=0) flushHtml(); return; }
    const start = trimmed.match(/^<([a-z][\w:-]*)(\s|>|\/)/i);
    if (start && blockTags.has(start[1].toLowerCase())) {
      flushMd(); htmlTag = start[1].toLowerCase(); htmlLines.push(line);
      if (voidTags.has(htmlTag)||trimmed.endsWith("/>")||countTag(htmlLines.join("\n"),htmlTag)<=0) flushHtml();
      return;
    }
    mdLines.push(line);
  });
  flushHtml(); flushMd();
  return segs;
}
function convertMixed(input) {
  const cleaned = unwrapFencedCode(input);
  const { css, content } = extractStyleBlocks(cleaned);
  const segs = splitMixedSegments(content);
  const html = segs.map((s) => s.type==="html"?s.content:renderMarkdown(s.content)).join("\n");
  return convertHtml(`${css?`<style>${css}</style>`:""}${html}`);
}

/* ── Style Inlining ── */
function shouldSkipStyle(prop, value, tagName) {
  if (!value) return true;
  if (value==="normal"&&!["font-weight","font-style","line-height"].includes(prop)) return true;
  if (value==="none"&&!["display","border-top-style","border-right-style","border-bottom-style","border-left-style"].includes(prop)) return true;
  if (value==="0px"&&!prop.startsWith("border")) return true;
  if ((prop==="background-color"||prop.endsWith("-color"))&&value==="rgba(0, 0, 0, 0)") return true;
  if (prop==="font-family"&&value.toLowerCase().includes("times new roman")) return true;
  if (prop==="display"&&!["block","inline-block","table","table-row","table-cell","flex"].includes(value)) return true;
  if (prop==="white-space"&&value==="normal") return true;
  if (prop==="border-collapse"&&tagName!=="TABLE") return true;
  if (prop==="box-shadow"&&value==="none") return true;
  return false;
}
function inlineComputedStyles(container) {
  [container, ...container.querySelectorAll("*")].forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    const computed = getComputedStyle(el), pairs = [];
    computedProps.forEach((prop) => {
      const value = computed.getPropertyValue(prop);
      if (!shouldSkipStyle(prop, value, el.tagName)) pairs.push(`${prop}:${value}`);
    });
    if (el.tagName==="IMG") { pairs.push("max-width:100%","height:auto"); }
    if (el.tagName==="TABLE") { pairs.push("width:100%","border-collapse:collapse"); }
    if (pairs.length) el.setAttribute("style", pairs.join(";"));
    el.removeAttribute("class"); el.removeAttribute("id");
  });
}
function convertHtml(input) {
  const { html, css } = extractHtmlParts(input);
  const shell = document.createElement("div"); shell.innerHTML = html;
  if (els.sanitize.checked) sanitizeTree(shell);
  if (!els.inline.checked) return shell.innerHTML;
  els.hidden.innerHTML = "";
  const style = document.createElement("style"); style.textContent = css;
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

/* ── Markdown Rendering ── */
function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong style=\"font-weight:900;color:#132f33;\">$1</strong>")
    .replace(/`([^`]+)`/g, "<code style=\"padding:2px 6px;border-radius:6px;background:#edf5f3;color:#12665f;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;\">$1</code>");
}
function splitBlocks(text) {
  const lines = text.replace(/\r\n/g,"\n").split("\n");
  const blocks = []; let current = [];
  const flush = () => { if (current.length) { blocks.push(current.join("\n").trim()); current = []; } };
  lines.forEach((line) => { if (!line.trim()) { flush(); return; } if (/^\s*\|.+\|\s*$/.test(line)) { flush(); blocks.push(line); return; } current.push(line); });
  flush();
  const merged = [];
  for (let i=0; i<blocks.length; i++) {
    if (/^\s*\|.+\|\s*$/.test(blocks[i])) { const rows=[blocks[i]]; while(i+1<blocks.length&&/^\s*\|.+\|\s*$/.test(blocks[i+1])){rows.push(blocks[i+1]);i++;} merged.push(rows.join("\n")); }
    else merged.push(blocks[i]);
  }
  return merged;
}
function parseTable(block) {
  const rows = block.split("\n").map((r)=>r.trim()).filter(Boolean).map((r)=>r.replace(/^\|/,"").replace(/\|$/,"").split("|").map((c)=>c.trim()));
  if (rows.length<2 || !rows[1].every((c)=>/^:?-{3,}:?$/.test(c))) return null;
  return { headers: rows[0], body: rows.slice(2) };
}
function renderMdTable(table) {
  const heads = table.headers.map((c)=>`<th style="padding:12px 10px;text-align:left;font-weight:900;">${inlineMarkdown(c)}</th>`).join("");
  const rows = table.body.map((row,idx)=>{
    const bg = idx%2===0?"#ffffff":"#f8fbfa";
    const cells = row.map((c,ci)=>{ const lead=ci===0?"font-weight:800;color:#132f33;":""; return `<td style="padding:12px 10px;border-top:1px solid #dfecea;${lead}">${inlineMarkdown(c)}</td>`; }).join("");
    return `<tr style="background:${bg};">${cells}</tr>`;
  }).join("");
  return `<div style="margin:22px 0;border-radius:14px;overflow:hidden;border:1px solid #dfecea;"><table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.7;"><thead><tr style="background:#12665f;color:#ffffff;">${heads}</tr></thead><tbody>${rows}</tbody></table></div>`;
}
function renderMdList(block) {
  const items = block.split("\n").map((l)=>l.replace(/^\s*[-*]\s+/,"").trim()).filter(Boolean)
    .map((l)=>`<div style="display:flex;gap:10px;margin:0 0 10px;align-items:flex-start;"><span style="flex:0 0 auto;width:7px;height:7px;margin-top:12px;border-radius:50%;background:#f2b84b;"></span><p style="margin:0;flex:1;">${inlineMarkdown(l)}</p></div>`).join("");
  return `<div style="margin:20px 0;padding:18px 18px;border-left:5px solid #f2b84b;background:#fff8e8;border-radius:12px;">${items}</div>`;
}
function renderMdQuote(block) {
  const text = block.replace(/^>\s?/gm,"").trim();
  return `<div style="margin:24px 0;padding:22px 20px;border-radius:16px;background:linear-gradient(135deg,#12665f 0%,#143a44 100%);color:#ffffff;"><p style="margin:0;font-size:21px;line-height:1.6;font-weight:900;">${inlineMarkdown(text)}</p></div>`;
}
function renderMarkdown(input) {
  const blocks = splitBlocks(unwrapFencedCode(input));
  let sectionNumber = 0, html = "";
  blocks.forEach((block) => {
    if (/^#\s+/.test(block)) { html += `<h1 style="margin:0 0 16px;color:#132f33;font-size:28px;line-height:1.35;font-weight:900;letter-spacing:0;">${inlineMarkdown(block.replace(/^#\s+/,""))}</h1>`; return; }
    if (/^##\s+/.test(block)) { sectionNumber++; html += `<h2 style="margin:28px 0 18px;font-size:22px;line-height:1.4;color:#132f33;font-weight:900;letter-spacing:0;"><span style="display:inline-block;margin-right:10px;padding:3px 10px;border-radius:999px;background:#12665f;color:#ffffff;font-size:14px;vertical-align:3px;">${String(sectionNumber).padStart(2,"0")}</span>${inlineMarkdown(block.replace(/^##\s+/,""))}</h2>`; return; }
    if (/^###\s+/.test(block)) { html += `<h3 style="margin:22px 0 12px;color:#12665f;font-size:18px;line-height:1.45;font-weight:900;">${inlineMarkdown(block.replace(/^###\s+/,""))}</h3>`; return; }
    if (/^>\s?/m.test(block)) { html += renderMdQuote(block); return; }
    const table = parseTable(block); if (table) { html += renderMdTable(table); return; }
    const lines = block.split("\n");
    if (lines.every((l)=>/^\s*[-*]\s+/.test(l))) { html += renderMdList(block); return; }
    html += `<p style="margin:0 0 16px;">${inlineMarkdown(block).replace(/\n/g,"<br>")}</p>`;
  });
  return html;
}
function renderPlainText(input) {
  return unwrapFencedCode(input).split(/\n\s*\n/).map((p)=>p.trim()).filter(Boolean)
    .map((p)=>`<p style="margin:0 0 16px;">${escapeHtml(p).replace(/\n/g,"<br>")}</p>`).join("");
}
function wrapForWechat(html) {
  if (!els.frame.checked) return html;
  return `<section style="margin:0 auto;padding:24px 18px;max-width:${els.width.value}px;background:#ffffff;"><section style="margin:0 auto;max-width:640px;color:#314346;font-size:16px;line-height:1.9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',Arial,sans-serif;">${html}</section></section>`;
}
function renderArticleTitle(title) {
  if (!title) return "";
  return `<section style="margin:0 0 22px;padding:0 0 18px;border-bottom:1px solid #dfecea;"><h1 style="margin:0;color:#132f33;font-size:28px;line-height:1.35;font-weight:900;letter-spacing:0;">${inlineMarkdown(title)}</h1></section>`;
}

/* ── Core Convert ── */
function convert() {
  const source = els.source.value.trim(), mode = els.mode.value, articleTitle = els.articleTitle.value.trim();
  els.articleTitlePreview.textContent = articleTitle || "未填写标题";
  if (!source) {
    const titleHtml = els.showTitle.checked ? renderArticleTitle(articleTitle) : "";
    els.output.innerHTML = titleHtml ? wrapForWechat(titleHtml) : defaultHtml;
    els.output.style.width = `${els.width.value}px`;
    setState("等待输入"); resetWorkbenchBlocks(); return;
  }
  let html = "";
  if (mode==="mixed") html = convertMixed(source);
  else if (mode==="html") html = convertHtml(source);
  else if (mode==="markdown") html = renderMarkdown(source);
  else html = renderPlainText(source);
  if (els.showTitle.checked && articleTitle) html = `${renderArticleTitle(articleTitle)}${html}`;
  els.output.style.width = `${els.width.value}px`;
  els.output.innerHTML = wrapForWechat(html);
  setState("已转换");
  els.notice.textContent = '转换完成。点击“复制到公众号”，然后到微信公众平台正文编辑区粘贴。';
  if (els.workbenchToggle.checked) extractAndShowBlocks();
}

/* ── Copy / Export ── */
function getOutputHtml() {
  if (els.workbenchToggle.checked && _wbBlocks.length > 0) return renderBlocksToHtml(_wbBlocks, false);
  return els.output.innerHTML;
}
async function copyRichText() {
  const html = `<meta charset="utf-8">${getOutputHtml()}`;
  const text = els.output.innerText.replace(/\n{3,}/g, "\n\n").trim();
  if (navigator.clipboard && window.ClipboardItem) {
    const item = new ClipboardItem({ "text/html": new Blob([html],{type:"text/html"}), "text/plain": new Blob([text],{type:"text/plain"}) });
    await navigator.clipboard.write([item]);
  } else { selectPreview(); document.execCommand("copy"); window.getSelection().removeAllRanges(); }
  showToast("已复制富文本（含排版调整），可粘贴到公众号后台");
}
function selectPreview() {
  const target = els.workbenchToggle.checked ? els.workbenchLiveOutput : els.output;
  const range = document.createRange(); range.selectNodeContents(target);
  const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
  showToast("已选中预览区");
}
async function copyHtml() { await navigator.clipboard.writeText(getOutputHtml()); showToast("HTML 已复制"); }
function exportHtml() {
  const bodyHtml = getOutputHtml();
  const html = `<!doctype html>\n<html lang="zh-CN">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>公众号富文本导出</title></head>\n<body style="margin:0;background:#ffffff;">${bodyHtml}</body>\n</html>`;
  const blob = new Blob([html],{type:"text/html;charset=utf-8"});
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = `wechat-rich-text-${Date.now()}.html`;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  showToast("HTML 文件已导出");
}

/* ── Draft ── */
function saveDraft() {
  localStorage.setItem(draftKey, JSON.stringify({
    mode:els.mode.value, width:els.width.value,
    sanitize:els.sanitize.checked, inline:els.inline.checked, frame:els.frame.checked,
    articleTitle:els.articleTitle.value, showTitle:els.showTitle.checked,
    source:els.source.value, workbench:els.workbenchToggle.checked
  }));
}
function loadDraft() {
  const raw = localStorage.getItem(draftKey); if (!raw) return false;
  try {
    const d = JSON.parse(raw);
    els.mode.value = d.mode||"mixed"; els.width.value = d.width||"640";
    els.sanitize.checked = d.sanitize!==false; els.inline.checked = d.inline!==false; els.frame.checked = d.frame!==false;
    els.articleTitle.value = d.articleTitle||""; els.showTitle.checked = d.showTitle===true;
    els.source.value = d.source||"";
    if (d.workbench) els.workbenchToggle.checked = true;
    return true;
  } catch { localStorage.removeItem(draftKey); return false; }
}
function clearAll() {
  els.source.value = ""; els.articleTitle.value = ""; els.showTitle.checked = false;
  els.workbenchToggle.checked = false; toggleWorkbenchUI(false); resetWorkbenchBlocks();
  localStorage.removeItem(draftKey); localStorage.removeItem(wbStateKey);
  convert(); setState("已清空"); showToast("已清空");
}
async function pasteFromClipboard() {
  try { const t = await navigator.clipboard.readText(); els.source.value = t; saveDraft(); convert(); showToast("已从剪贴板粘贴并转换"); }
  catch { showToast("浏览器拒绝读取剪贴板，请手动粘贴"); }
}
function loadHtmlSample() { els.mode.value="html"; els.articleTitle.value="普通人如何读懂财经新闻？"; els.source.value=sampleHtml; convert(); saveDraft(); showToast("HTML 示例已载入"); }
function loadMarkdownSample() { els.mode.value="markdown"; els.articleTitle.value="普通人如何读懂财经新闻？"; els.source.value=sampleMarkdown; convert(); saveDraft(); showToast("Markdown 示例已载入"); }
function loadMixedSample() { els.mode.value="mixed"; els.articleTitle.value="HTML 和 Markdown 混合内容怎么发公众号？"; els.source.value=sampleMixed; convert(); saveDraft(); showToast("混合示例已载入"); }

/* ═══════════════════════════════════════════
   WORKBENCH
   ═══════════════════════════════════════════ */

let _wbBlocks = [], _wbSelectedId = null, _wbDragIdx = null;

const blockTemplates = {
  'heading': '<h2 style="font-size:22px;color:#132f33;font-weight:900;line-height:1.35;">新标题</h2>',
  'subheading': '<h3 style="font-size:18px;color:#12665f;font-weight:900;line-height:1.45;">副标题</h3>',
  'paragraph': '<p style="margin:0 0 8px;font-size:16px;color:#314346;line-height:1.9;">在这里输入段落文本</p>',
  'quote': '<div style="margin:24px 0;padding:22px 20px;border-radius:16px;background:linear-gradient(135deg,#12665f 0%,#143a44 100%);color:#fff;font-size:18px;line-height:1.6;font-weight:700;">引用文本</div>',
  'card': '<div style="padding:18px;border-radius:14px;background:#f8fbfa;border:1px solid #dfecea;"><p style="margin:0;font-size:16px;color:#314346;line-height:1.9;">卡片内容</p></div>',
  'divider': '<hr style="margin:20px 0;border:0;border-top:1px solid #dfecea;">',
  'image': '<div style="text-align:center;margin:16px 0;"><img src="" alt="图片" style="max-width:100%;height:auto;border-radius:12px;"><p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">图片说明</p></div>',
};

function detectBlockType(el) {
  const tag = el.tagName, style = (el.getAttribute("style")||"").replace(/\s/g,"");
  if (tag==="H1") return "heading-1";
  if (tag==="H2") return "heading-2";
  if (tag==="H3") return "heading-3";
  if (tag==="TABLE" || el.querySelector("table")) return "table";
  if (tag==="DIV" && el.querySelector("table")) return "table";
  if (tag==="DIV" && style.includes("linear-gradient") && (style.includes("12665f")||style.includes("0d9488"))) return "quote";
  if (tag==="DIV" && (style.includes("border-left:5px")||style.includes("border-left:5px"))) return "list";
  if (tag==="DIV" && style.includes("border-radius:50%") && style.includes("background:#f2b84b")) return "list";
  if (tag==="DIV" && style.includes("border-radius") && style.includes("border:") && style.includes("background")) return "card";
  if (tag==="DIV" && (style.includes("padding")||style.includes("margin"))) return "card";
  if (tag==="SECTION") { const inner = el.querySelector("section"); return inner ? "container" : "card"; }
  if (tag==="IMG" || el.querySelector("img")) return "image";
  if (tag==="HR") return "divider";
  if (tag==="P") return "paragraph";
  if (tag==="DIV") return "card";
  return "paragraph";
}

function getBlockLabel(type) {
  const labels = { "heading-1":"H1","heading-2":"H2","heading-3":"H3","paragraph":"段落","quote":"引用","table":"表格","list":"列表","card":"卡片","image":"图片","divider":"分割线","container":"容器" };
  return labels[type]||"块";
}

function getBlockPreviewText(el, type) {
  const text = (el.textContent||"").trim().replace(/\s+/g," ");
  if (text.length > 30) return text.slice(0,30)+"…";
  if (!text) return `[${getBlockLabel(type)}]`;
  return text;
}

function parseBlocks(html) {
  const container = document.createElement("div"); container.innerHTML = html;
  let nodes = [...container.children];
  if (nodes.length===1 && nodes[0].tagName==="SECTION") {
    const inner = [...nodes[0].children];
    if (inner.length===1 && inner[0].tagName==="SECTION") nodes = [...inner[0].children];
    else if (inner.length>0) nodes = inner;
  }
  let id = 0;
  return nodes.map((el) => ({
    id: `wb-${++id}`, type: detectBlockType(el),
    html: el.outerHTML || el.innerHTML,
    marginTop: 0, marginBottom: 16, align: "left",
  }));
}

function renderBlocksToHtml(blocks, forPreview) {
  return blocks.map((b) => {
    const wrapper = document.createElement("div"); wrapper.innerHTML = b.html;
    const inner = wrapper.firstChild;
    let style = (inner && inner.getAttribute("style")) || "";
    if (b.align==="center") style = `text-align:center;${style}`;
    else if (b.align==="right") style = `text-align:right;${style}`;
    style = style.replace(/margin-top:[^;]+;?/g,"").replace(/margin-bottom:[^;]+;?/g,"");
    if (b.marginTop) style = `margin-top:${b.marginTop}px;${style}`;
    if (b.marginBottom) style = `margin-bottom:${b.marginBottom}px;${style}`;
    if (inner) inner.setAttribute("style", style);
    const innerHtml = wrapper.innerHTML;
    return forPreview
      ? `<div class="wb-preview-block" data-wb-id="${b.id}" data-wb-type="${b.type}">${innerHtml}</div>`
      : innerHtml;
  }).join("");
}

function _tempEl(html) { const d = document.createElement("div"); d.innerHTML = html; return d; }

function renderBlockList(blocks) {
  els.blockList.innerHTML = "";
  if (!blocks.length) { els.blockList.innerHTML = '<div class="block-list-empty">转换后内容块将显示在这里<br>拖拽即可排序</div>'; return; }
  blocks.forEach((b, index) => {
    const el = document.createElement("div");
    el.className = "block-item" + (b.id===_wbSelectedId?" active":"");
    el.draggable = true; el.dataset.blockId = b.id; el.dataset.index = index;
    el.innerHTML = `<div class="block-drag-handle"><span></span><span></span><span></span></div><span class="block-index">${index+1}</span><span class="block-type-badge">${getBlockLabel(b.type)}</span><span class="block-preview-text">${getBlockPreviewText(_tempEl(b.html), b.type)}</span>`;
    el.addEventListener("click", () => selectBlock(b.id));
    el.addEventListener("dragstart", (e) => { _wbDragIdx = index; el.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", b.id); });
    el.addEventListener("dragend", () => { el.classList.remove("dragging"); document.querySelectorAll(".block-item").forEach((it) => it.classList.remove("drag-over")); _wbDragIdx = null; });
    el.addEventListener("dragover", (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (_wbDragIdx!==null && _wbDragIdx!==index) el.classList.add("drag-over"); });
    el.addEventListener("dragleave", () => el.classList.remove("drag-over"));
    el.addEventListener("drop", (e) => {
      e.preventDefault(); el.classList.remove("drag-over");
      if (_wbDragIdx!==null && _wbDragIdx!==index) { const moved = _wbBlocks.splice(_wbDragIdx,1)[0]; _wbBlocks.splice(index,0,moved); _wbDragIdx=null; refreshWorkbench(); saveWorkbenchState(); }
    });
    els.blockList.appendChild(el);
  });
}

function selectBlock(id, scrollTo) {
  _wbSelectedId = id;
  const block = _wbBlocks.find((b) => b.id===id);
  if (!block) return;
  els.selectedBlockLabel.textContent = `— ${getBlockLabel(block.type)} #${_wbBlocks.indexOf(block)+1}`;
  renderBlockControls(block);
  renderBlockList(_wbBlocks);
  highlightPreviewBlock(id, scrollTo);
}

function addBlock(type) {
  const template = blockTemplates[type] || blockTemplates.paragraph;
  const id = `wb-${Date.now()}`;
  _wbBlocks.push({ id, type, html: template, marginTop: 0, marginBottom: 16, align: "left" });
  selectBlock(id, true); updateWorkbenchLivePreview(_wbBlocks); saveWorkbenchState();
  showToast(`已添加${getBlockLabel(type)}`);
}

function duplicateBlock(id) {
  const idx = _wbBlocks.findIndex((b) => b.id===id);
  if (idx===-1) return;
  const src = _wbBlocks[idx];
  const newId = `wb-${Date.now()}`;
  _wbBlocks.splice(idx+1, 0, { ...src, id: newId });
  selectBlock(newId, true); updateWorkbenchLivePreview(_wbBlocks); saveWorkbenchState();
  showToast("块已复制");
}

function editBlockContent(id, newHtml) {
  const block = _wbBlocks.find((b) => b.id===id);
  if (!block) return;
  block.html = newHtml;
  block.type = detectBlockType(_tempEl(newHtml));
  updateWorkbenchLivePreview(_wbBlocks);
  renderBlockList(_wbBlocks);
  if (_wbSelectedId===id) {
    els.selectedBlockLabel.textContent = `— ${getBlockLabel(block.type)} #${_wbBlocks.indexOf(block)+1}`;
    renderBlockControls(block);
  }
  saveWorkbenchState();
}

function highlightPreviewBlock(id, scrollTo) {
  const output = els.workbenchLiveOutput;
  output.querySelectorAll(".wb-preview-block").forEach((el) => el.classList.remove("selected"));
  const target = output.querySelector(`[data-wb-id="${id}"]`);
  if (target) {
    target.classList.add("selected");
    if (scrollTo) target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function attachPreviewBlockEvents() {
  els.workbenchLiveOutput.querySelectorAll(".wb-preview-block").forEach((el) => {
    el.addEventListener("click", (e) => { e.stopPropagation(); selectBlock(el.dataset.wbId); });
  });
  els.workbenchLiveOutput.addEventListener("click", () => {
    _wbSelectedId = null;
    els.selectedBlockLabel.textContent = "— 请先选择一个块";
    els.blockControlsBody.innerHTML = '<div class="no-block-selected">点击预览区或左侧列表中的内容块来调整排版</div>';
    renderBlockList(_wbBlocks);
    els.workbenchLiveOutput.querySelectorAll(".wb-preview-block.selected").forEach((el) => el.classList.remove("selected"));
  });
}

function extractPadding(style) {
  const pt = (style.match(/padding-top:\s*(\d+)px/)||[])[1];
  const pr = (style.match(/padding-right:\s*(\d+)px/)||[])[1];
  const pb = (style.match(/padding-bottom:\s*(\d+)px/)||[])[1];
  const pl = (style.match(/padding-left:\s*(\d+)px/)||[])[1];
  return { pt: pt?parseInt(pt):null, pr: pr?parseInt(pr):null, pb: pb?parseInt(pb):null, pl: pl?parseInt(pl):null };
}
function extractFontSize(style) {
  const m = style.match(/font-size:\s*(\d+)px/);
  return m ? parseInt(m[1]) : null;
}
function extractColor(style, prop) {
  const re = new RegExp(`${prop}:\\s*([^;]+)`);
  const m = style.match(re);
  return m ? m[1].trim() : "";
}
function getBlockInnerStyle(block) {
  const wrapper = document.createElement("div"); wrapper.innerHTML = block.html;
  const inner = wrapper.firstChild;
  return (inner && inner.getAttribute("style")) || "";
}

function renderBlockControls(block) {
  if (!block) { els.blockControlsBody.innerHTML = '<div class="no-block-selected">点击左侧内容块或预览区来调整排版</div>'; return; }
  const innerStyle = getBlockInnerStyle(block);
  const padding = extractPadding(innerStyle);
  const pt = padding.pt||0; const pb = padding.pb||0;
  const fontSize = extractFontSize(innerStyle) || 0;
  const textColor = extractColor(innerStyle, "color") || "#314346";
  const bgColor = extractColor(innerStyle, "background(?:-color)?") || "";
  const isBgGradient = /(linear-gradient|radial-gradient)/.test(bgColor);

  els.blockControlsBody.innerHTML = `
    <div class="controls-grid">
      <div class="controls-left">
        <div class="control-group">
          <div class="control-group-label">内容编辑</div>
          <textarea class="block-html-editor" data-block="${block.id}" rows="5" spellcheck="false">${escapeHtml(block.html)}</textarea>
          <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">支持 HTML，修改后自动更新</div>
        </div>
      </div>
      <div class="controls-right">
        <div class="control-group">
          <div class="control-group-label">外边距</div>
          <div class="spacing-control"><label>上 <span class="spacing-value">${block.marginTop}px</span></label><input type="range" min="0" max="80" value="${block.marginTop}" data-prop="marginTop" data-block="${block.id}"></div>
          <div class="spacing-control"><label>下 <span class="spacing-value">${block.marginBottom}px</span></label><input type="range" min="0" max="80" value="${block.marginBottom}" data-prop="marginBottom" data-block="${block.id}"></div>
        </div>
        <div class="control-group">
          <div class="control-group-label">内边距</div>
          <div class="spacing-control"><label>上 <span class="spacing-value">${pt}px</span></label><input type="range" min="0" max="60" value="${pt}" data-prop="padTop" data-block="${block.id}"></div>
          <div class="spacing-control"><label>下 <span class="spacing-value">${pb}px</span></label><input type="range" min="0" max="60" value="${pb}" data-prop="padBottom" data-block="${block.id}"></div>
        </div>
        ${fontSize?`
        <div class="control-group">
          <div class="control-group-label">字号 <span class="spacing-value">${fontSize}px</span></div>
          <input type="range" min="12" max="48" value="${fontSize}" data-prop="fontSize" data-block="${block.id}" style="width:100%;">
        </div>`:''}
        <div class="control-group">
          <div class="control-group-label">文字颜色</div>
          <input type="color" class="color-input" data-prop="textColor" data-block="${block.id}" value="${textColor.startsWith('#')?textColor:'#314346'}" title="文字颜色">
        </div>
        <div class="control-group">
          <div class="control-group-label">背景色 ${isBgGradient?'<span style="font-size:10px;font-weight:400;">(渐变)</span>':''}</div>
          <input type="color" class="color-input" data-prop="bgColor" data-block="${block.id}" value="${bgColor&&bgColor.startsWith('#')?bgColor:'#ffffff'}" title="背景颜色" ${isBgGradient?'disabled':''}>
        </div>
        <div class="control-group">
          <div class="control-group-label">对齐方式</div>
          <div class="align-btns">
            <button class="align-btn${block.align==='left'?' active':''}" data-align="left" data-block="${block.id}">左</button>
            <button class="align-btn${block.align==='center'?' active':''}" data-align="center" data-block="${block.id}">中</button>
            <button class="align-btn${block.align==='right'?' active':''}" data-align="right" data-block="${block.id}">右</button>
          </div>
        </div>
      </div>
    </div>
    <div class="block-action-btns">
      <button class="btn btn-ghost btn-xs move-up-btn" data-block="${block.id}">上移</button>
      <button class="btn btn-ghost btn-xs move-down-btn" data-block="${block.id}">下移</button>
      <button class="btn btn-ghost btn-xs duplicate-block-btn" data-block="${block.id}" style="background:var(--brand-ghost);border-color:rgba(13,148,136,.2);color:var(--brand);">复制</button>
      <button class="btn btn-danger btn-xs remove-block-btn" data-block="${block.id}">删除</button>
    </div>`;

  /* range sliders */
  els.blockControlsBody.querySelectorAll("input[type=range]").forEach((input) => {
    input.addEventListener("input", () => {
      const b = _wbBlocks.find((bl) => bl.id===input.dataset.block);
      if (!b) return;
      const prop = input.dataset.prop;
      if (prop==="marginTop"||prop==="marginBottom") {
        b[prop] = parseInt(input.value);
      } else if (prop==="padTop"||prop==="padBottom") {
        applyPadding(b, prop==="padTop"?"padding-top":"padding-bottom", parseInt(input.value));
      } else if (prop==="fontSize") {
        applyInlineStyle(b, "font-size", `${input.value}px`);
      }
      const valSpan = input.parentElement ? input.parentElement.querySelector(".spacing-value") : null;
      if (valSpan) valSpan.textContent = `${input.value}px`;
      else { const s = els.blockControlsBody.querySelector(`.spacing-value[data-for="${prop}"]`); if (s) s.textContent = `${input.value}px`; }
      updateWorkbenchLivePreview(_wbBlocks); saveWorkbenchState();
    });
  });

  /* align buttons */
  els.blockControlsBody.querySelectorAll(".align-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const b = _wbBlocks.find((bl) => bl.id===btn.dataset.block);
      if (b) { b.align = btn.dataset.align; renderBlockControls(b); updateWorkbenchLivePreview(_wbBlocks); saveWorkbenchState(); }
    });
  });

  /* color inputs */
  els.blockControlsBody.querySelectorAll("input[type=color]").forEach((colorInput) => {
    colorInput.addEventListener("input", () => {
      const b = _wbBlocks.find((bl) => bl.id===colorInput.dataset.block);
      if (!b) return;
      const prop = colorInput.dataset.prop;
      if (prop==="textColor") applyInlineStyle(b, "color", colorInput.value);
      else if (prop==="bgColor") applyInlineStyle(b, "background-color", colorInput.value);
      updateWorkbenchLivePreview(_wbBlocks); saveWorkbenchState();
    });
  });

  /* content editor */
  const editor = els.blockControlsBody.querySelector(".block-html-editor");
  if (editor) {
    let editTimer;
    editor.addEventListener("input", () => {
      clearTimeout(editTimer);
      editTimer = setTimeout(() => {
        const b = _wbBlocks.find((bl) => bl.id===editor.dataset.block);
        if (b) { b.html = editor.value; b.type = detectBlockType(_tempEl(b.html)); updateWorkbenchLivePreview(_wbBlocks); renderBlockList(_wbBlocks); saveWorkbenchState(); }
      }, 400);
    });
  }

  /* action buttons */
  els.blockControlsBody.querySelector(".move-up-btn")?.addEventListener("click", () => {
    const idx = _wbBlocks.findIndex((b)=>b.id===block.id);
    if (idx>0) { [_wbBlocks[idx-1],_wbBlocks[idx]] = [_wbBlocks[idx],_wbBlocks[idx-1]]; selectBlock(block.id, true); refreshWorkbench(); saveWorkbenchState(); }
  });
  els.blockControlsBody.querySelector(".move-down-btn")?.addEventListener("click", () => {
    const idx = _wbBlocks.findIndex((b)=>b.id===block.id);
    if (idx<_wbBlocks.length-1) { [_wbBlocks[idx],_wbBlocks[idx+1]] = [_wbBlocks[idx+1],_wbBlocks[idx]]; selectBlock(block.id, true); refreshWorkbench(); saveWorkbenchState(); }
  });
  els.blockControlsBody.querySelector(".duplicate-block-btn")?.addEventListener("click", () => {
    duplicateBlock(block.id);
  });
  els.blockControlsBody.querySelector(".remove-block-btn")?.addEventListener("click", () => {
    _wbBlocks = _wbBlocks.filter((b)=>b.id!==block.id);
    if (_wbSelectedId===block.id) _wbSelectedId = null;
    refreshWorkbench(); saveWorkbenchState(); showToast("块已删除");
  });
}

function applyInlineStyle(block, prop, value) {
  const wrapper = document.createElement("div"); wrapper.innerHTML = block.html;
  const inner = wrapper.firstChild;
  if (!inner) return;
  let style = (inner.getAttribute("style")||"").replace(new RegExp(`${prop}:\\s*[^;]+;?`,"g"),"");
  style = `${style}${prop}:${value};`.replace(/;+/g,";");
  inner.setAttribute("style", style);
  block.html = wrapper.innerHTML;
}

function applyPadding(block, prop, value) {
  const wrapper = document.createElement("div"); wrapper.innerHTML = block.html;
  const inner = wrapper.firstChild;
  if (!inner) return;
  let style = (inner.getAttribute("style")||"").replace(new RegExp(`${prop}:\\s*\\d+px;?`,"g"),"");
  style = `${style}${prop}:${value}px;`.replace(/;+/g,";");
  inner.setAttribute("style", style);
  block.html = wrapper.innerHTML;
}

function updateWorkbenchLivePreview(blocks) {
  els.workbenchLiveOutput.innerHTML = renderBlocksToHtml(blocks, true);
  attachPreviewBlockEvents();
  if (_wbSelectedId) highlightPreviewBlock(_wbSelectedId, false);
}

function refreshWorkbench() {
  renderBlockList(_wbBlocks); updateWorkbenchLivePreview(_wbBlocks);
  if (_wbSelectedId) {
    const b = _wbBlocks.find((bl)=>bl.id===_wbSelectedId);
    if (b) renderBlockControls(b);
    else { _wbSelectedId=null; els.selectedBlockLabel.textContent="— 请先选择一个块"; els.blockControlsBody.innerHTML='<div class="no-block-selected">点击左侧内容块来调整它的间距和对齐方式</div>'; }
  }
}

function extractAndShowBlocks() { _wbBlocks = parseBlocks(els.output.innerHTML); _wbSelectedId = null; els.selectedBlockLabel.textContent="— 请先选择一个块"; els.blockControlsBody.innerHTML='<div class="no-block-selected">点击左侧内容块来调整它的间距和对齐方式</div>'; refreshWorkbench(); saveWorkbenchState(); }

function resetWorkbenchBlocks() { _wbBlocks = []; _wbSelectedId = null; renderBlockList([]); els.workbenchLiveOutput.innerHTML = ""; els.selectedBlockLabel.textContent="— 请先选择一个块"; els.blockControlsBody.innerHTML='<div class="no-block-selected">点击左侧内容块来调整它的间距和对齐方式</div>'; }

function toggleWorkbenchUI(show) {
  if (show) { els.normalPreview.style.display="none"; els.workbenchContainer.style.display="flex"; extractAndShowBlocks(); }
  else { els.normalPreview.style.display=""; els.workbenchContainer.style.display="none"; }
}

function saveWorkbenchState() {
  localStorage.setItem(wbStateKey, JSON.stringify(_wbBlocks.map((b)=>({ id:b.id, type:b.type, html:b.html, marginTop:b.marginTop, marginBottom:b.marginBottom, align:b.align }))));
}

/* ── Events ── */
["input","change"].forEach((evt) => {
  [els.mode, els.width, els.sanitize, els.inline, els.frame, els.articleTitle, els.showTitle, els.source].forEach((el) => {
    el.addEventListener(evt, () => { saveDraft(); convert(); });
  });
});
els.convert.addEventListener("click", () => { convert(); saveDraft(); showToast("已转换预览"); });
els.copyRich.addEventListener("click", () => copyRichText().catch(() => showToast("复制被浏览器拦截，请手动选中预览区复制")));
els.copyRich2.addEventListener("click", () => copyRichText().catch(() => showToast("复制被浏览器拦截，请手动选中预览区复制")));
els.copyHtml.addEventListener("click", () => copyHtml().catch(() => showToast("复制 HTML 失败")));
els.copyTitle.addEventListener("click", () => { const t=els.articleTitle.value.trim(); if(!t){showToast("请先填写文章标题");return;} navigator.clipboard.writeText(t).then(()=>showToast("文章标题已复制")).catch(()=>showToast("复制标题失败，请手动复制")); });
els.exportBtn.addEventListener("click", exportHtml);
els.clear.addEventListener("click", clearAll);
els.selectPreview.addEventListener("click", selectPreview);
els.paste.addEventListener("click", pasteFromClipboard);
els.sampleHtml.addEventListener("click", loadHtmlSample);
els.sampleMd.addEventListener("click", loadMarkdownSample);
els.sampleMixed.addEventListener("click", loadMixedSample);
els.workbenchToggle.addEventListener("change", () => { const on = els.workbenchToggle.checked; toggleWorkbenchUI(on); saveDraft(); if (!on) resetWorkbenchBlocks(); });
els.resetBlocksBtn.addEventListener("click", () => { if(_wbBlocks.length===0){showToast("没有可恢复的块");return;} _wbBlocks.forEach((b)=>{b.marginTop=0;b.marginBottom=16;b.align="left";}); refreshWorkbench(); saveWorkbenchState(); showToast("已恢复默认排版"); });
els.workbenchContainer.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".add-block-btn");
  if (addBtn && addBtn.dataset.type) { addBlock(addBtn.dataset.type); }
});
window.addEventListener("beforeunload", saveDraft);

/* ── Init ── */
if (!loadDraft()) els.source.value = "";
convert();
if (els.workbenchToggle.checked) {
  toggleWorkbenchUI(true);
  try {
    const saved = JSON.parse(localStorage.getItem(wbStateKey));
    if (saved && saved.length>0 && _wbBlocks.length>0) {
      saved.forEach((sb) => { const m = _wbBlocks.find((b)=>b.id===sb.id); if(m){ m.marginTop=sb.marginTop; m.marginBottom=sb.marginBottom; m.align=sb.align; } });
      refreshWorkbench();
    }
  } catch {/* ignore */}
}
