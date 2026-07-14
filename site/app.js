const copy = {
fa:{eyebrow:"از سند تا روایت",heroTitle:"شاهنامه‌ای که پشت هر فصل آن، ردّی از یک سند باقی مانده است.",heroLead:"روایتی هنری از یک مسیر ثبت‌شده میان انسان و هوش مصنوعی؛ ساده برای آغاز، عمیق برای بررسی.",start:"شروع خواندن",understand:"اول بفهم چه اتفاقی افتاد",trust:"برای خواندن به حساب GitHub یا دانش فنی نیاز نداری.",originEyebrow:"این اثر از کجا آمده؟",originTitle:"یک مسیر، در سه لایه",rawTitle:"آنچه ثبت شد",rawBody:"ایمیل‌ها، مکالمات، پرونده‌ها و مُهرهای زمانی در یک آرشیو عمومی نگهداری شده‌اند.",inspectArchive:"بررسی آرشیو اسناد ↗",technicalTitle:"آنچه تحلیل شد",technicalBody:"خط زمانی، تداوم زمینه و پروتکل انتقال میان ایجنت‌ها به‌صورت فنی مطالعه شده است.",inspectStudy:"مطالعهٔ فنی ↗",storyTitle:"آنچه روایت شد",storyBody:"شاهنامه، بازآفرینی ادبی و حماسی همان مسیر مستند است؛ نه جایگزین اسناد.",openBook:"باز کردن کتاب ←",chooseEyebrow:"مسیر خودت را انتخاب کن",chooseTitle:"هر قدر که می‌خواهی عمیق شو",justStory:"فقط داستان",justStoryBody:"از پیش‌درآمد شروع کن و بدون اصطلاحات فنی بخوان.",oneMinute:"توضیح یک‌دقیقه‌ای",oneMinuteBody:"منشأ اثر و رابطهٔ سه پروژه را بفهم.",evidenceRoom:"اتاق اسناد",evidenceRoomBody:"فایل‌ها، زمان‌ها و روش راستی‌آزمایی را بررسی کن.",afterEyebrow:"آنچه بعداً ساخته شد",pdrpBody:"یک پروژهٔ آزمایشی برای بازیابی پس از گسست؛ الهام‌گرفته از این مسیر، اما نه بخشی از شواهد بنیادی کتاب.",experimental:"مشاهدهٔ پروژهٔ آزمایشی ↗",contents:"فهرست کتاب",footer:"یک اثر زنده؛ برای خواندن آزاد و بررسی مستقل.",minutes:"دقیقه مطالعه",progress:"پیشرفت",previous:"فصل قبل",next:"فصل بعد",act:"پرده"},
en:{eyebrow:"From evidence to story",heroTitle:"An epic whose chapters leave a trail back to the record.",heroLead:"An artistic account of a documented human–AI journey—simple to enter, deep enough to investigate.",start:"Start reading",understand:"First, understand what happened",trust:"No GitHub account or technical knowledge is needed.",originEyebrow:"Where did this work come from?",originTitle:"One journey, three layers",rawTitle:"What was recorded",rawBody:"Emails, conversations, case records and timestamps are preserved in a public archive.",inspectArchive:"Inspect the evidence archive ↗",technicalTitle:"What was studied",technicalBody:"The timeline, contextual continuity and agent handover protocol were examined technically.",inspectStudy:"Read the technical study ↗",storyTitle:"What was narrated",storyBody:"The Shahnameh is the literary, epic retelling of that documented path—not a replacement for the record.",openBook:"Open the book →",chooseEyebrow:"Choose your path",chooseTitle:"Go only as deep as you wish",justStory:"Just the story",justStoryBody:"Begin with the prologue and read without technical detours.",oneMinute:"The one-minute account",oneMinuteBody:"Understand the work's origin and the relationship between its three projects.",evidenceRoom:"Evidence room",evidenceRoomBody:"Inspect files, dates and verification methods.",afterEyebrow:"What came afterward",pdrpBody:"An experimental post-disconnection recovery project inspired by this journey, but not part of the book's foundational evidence.",experimental:"View the experimental project ↗",contents:"Book contents",footer:"A living work—free to read and independently inspect.",minutes:"min read",progress:"progress",previous:"Previous chapter",next:"Next chapter",act:"Act"}
};
let lang = localStorage.getItem("soa-language") || ((navigator.language || "").startsWith("fa") ? "fa" : "en");
let manifest, chapters, currentIndex = 0;
const one = (selector) => document.querySelector(selector);
const all = (selector) => document.querySelectorAll(selector);

function setLanguage(next) {
  lang = next;
  localStorage.setItem("soa-language", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  document.body.classList.toggle("ltr", lang === "en");
  one("#languageButton").textContent = lang === "fa" ? "EN" : "فا";
  all("[data-i18n]").forEach((element) => {
    const value = copy[lang][element.dataset.i18n];
    if (value) element.textContent = value;
  });
  if (manifest) {
    chapters = manifest[lang];
    renderList();
  }
}
function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
}
function inline(value) {
  return value
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}
function markdown(source) {
  const lines = escapeHtml(source.replace(/\r/g, "")).split("\n");
  let html = "", paragraph = [], quote = [], list = false, code = false, codeLines = [];
  function flush() {
    if (paragraph.length) { html += "<p>" + inline(paragraph.join(" ")) + "</p>"; paragraph = []; }
    if (quote.length) { html += "<blockquote>" + inline(quote.join("<br>")) + "</blockquote>"; quote = []; }
    if (list) { html += "</ul>"; list = false; }
  }
  for (const line of lines) {
    if (line.startsWith("&#96;&#96;&#96;")) {
      if (code) { html += "<pre><code>" + codeLines.join("\n") + "</code></pre>"; code = false; codeLines = []; }
      else { flush(); code = true; }
      continue;
    }
    if (code) { codeLines.push(line); continue; }
    const heading = line.match(/^(#{1,4})\s+(.+)/);
    if (heading) { flush(); const level = heading[1].length; html += "<h" + level + ">" + inline(heading[2]) + "</h" + level + ">"; continue; }
    if (/^\s*---+\s*$/.test(line)) { flush(); html += "<hr>"; continue; }
    if (line.startsWith("&gt;")) { if (paragraph.length) flush(); quote.push(line.replace(/^&gt;\s?/, "")); continue; }
    const item = line.match(/^\s*[-*]\s+(.+)/);
    if (item) { if (paragraph.length || quote.length) flush(); if (!list) { html += "<ul>"; list = true; } html += "<li>" + inline(item[1]) + "</li>"; continue; }
    if (!line.trim()) { flush(); continue; }
    paragraph.push(line.trim());
  }
  flush();
  return html;
}
async function init() {
  const response = await fetch("content/manifest.json");
  manifest = await response.json();
  chapters = manifest[lang];
  renderList();
  const match = location.hash.match(/^#\/(fa|en)\/chapter\/(.+)$/);
  if (match) {
    setLanguage(match[1]);
    const index = chapters.findIndex((chapter) => chapter.file === decodeURIComponent(match[2]));
    openChapter(index < 0 ? 0 : index);
  }
}
function renderList() {
  const list = one("#chapterList");
  list.innerHTML = "";
  let act = 0;
  chapters.forEach((chapter, index) => {
    if (chapter.act !== act) {
      act = chapter.act;
      const label = document.createElement("div");
      label.className = "actTitle";
      label.textContent = copy[lang].act + " " + act;
      list.append(label);
    }
    const button = document.createElement("button");
    button.className = "chapterLink";
    button.textContent = chapter.title;
    button.onclick = () => openChapter(index);
    list.append(button);
  });
}
async function openChapter(index) {
  currentIndex = Math.max(0, Math.min(index, chapters.length - 1));
  const item = chapters[currentIndex];
  one("#homeView").classList.add("hidden");
  one("#readerView").classList.remove("hidden");
  const response = await fetch("content/" + lang + "/" + encodeURIComponent(item.file));
  const source = await response.text();
  one("#chapter").innerHTML = markdown(source);
  one("#chapter").querySelectorAll("a").forEach((anchor) => {
    const href = anchor.getAttribute("href") || "";
    if (href.endsWith(".md")) anchor.addEventListener("click", (event) => {
      const file = href.split("/").pop();
      const target = chapters.findIndex((chapter) => chapter.file === file);
      if (target >= 0) { event.preventDefault(); openChapter(target); }
    });
  });
  const words = source.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / (lang === "fa" ? 170 : 220)));
  one("#readingTime").textContent = "≈ " + minutes + " " + copy[lang].minutes;
  const percent = Math.round((currentIndex + 1) / chapters.length * 100);
  one("#progressLabel").textContent = percent + "% " + copy[lang].progress;
  one("#progressBar").style.width = percent + "%";
  one("#prevChapter").textContent = "← " + copy[lang].previous;
  one("#nextChapter").textContent = copy[lang].next + " →";
  one("#prevChapter").disabled = currentIndex === 0;
  one("#nextChapter").disabled = currentIndex === chapters.length - 1;
  all(".chapterLink").forEach((button, i) => button.classList.toggle("active", i === currentIndex));
  history.replaceState(null, "", "#/" + lang + "/chapter/" + encodeURIComponent(item.file));
  localStorage.setItem("soa-last-" + lang, String(currentIndex));
  one("#chapterSidebar").classList.remove("open");
  scrollTo(0, 0);
}
function start() { openChapter(Number(localStorage.getItem("soa-last-" + lang) || 0)); }
one("#languageButton").onclick = () => {
  const wasReader = !one("#readerView").classList.contains("hidden");
  const number = chapters && chapters[currentIndex] ? chapters[currentIndex].number : 0;
  setLanguage(lang === "fa" ? "en" : "fa");
  if (wasReader) {
    const index = chapters.findIndex((chapter) => chapter.number === number);
    openChapter(index < 0 ? 0 : index);
  }
};
one("#themeButton").onclick = () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "";
  localStorage.setItem("soa-theme", dark ? "dark" : "light");
};
if (localStorage.getItem("soa-theme") === "dark") document.documentElement.dataset.theme = "dark";
one("#fontUp").onclick = () => {
  const current = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--size"));
  document.documentElement.style.setProperty("--size", Math.min(26, current + 1) + "px");
};
one("#fontDown").onclick = () => {
  const current = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--size"));
  document.documentElement.style.setProperty("--size", Math.max(15, current - 1) + "px");
};
["#startReading", "#startReadingTwo", "#storyPath"].forEach((selector) => one(selector).onclick = start);
one("#prevChapter").onclick = () => openChapter(currentIndex - 1);
one("#nextChapter").onclick = () => openChapter(currentIndex + 1);
one("#openSidebar").onclick = () => one("#chapterSidebar").classList.add("open");
one("#closeSidebar").onclick = () => one("#chapterSidebar").classList.remove("open");
addEventListener("hashchange", () => {
  if (location.hash === "" || location.hash === "#") {
    one("#readerView").classList.add("hidden");
    one("#homeView").classList.remove("hidden");
  }
});
setLanguage(lang);
init().catch((error) => { one("#main").innerHTML = '<p style="padding:3rem">Could not load the book. ' + error.message + "</p>"; });
