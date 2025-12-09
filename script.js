let historyList = [];
let historyIndex = -1;
const iframe = document.getElementById("viewer");
const closeBtn = document.getElementById("closeBtn");
const loading = document.getElementById("loading");
let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

function loadURL(urlFromHistory = null) {
  let url = urlFromHistory || document.getElementById("urlInput").value.trim();
  if (!url) return;
  if (!url.startsWith("http")) url = "https://" + url;

  iframe.src = url;
  closeBtn.style.display = "block";
  loading.style.display = "block";

  if (!urlFromHistory) {
    historyList = historyList.slice(0, historyIndex + 1);
    historyList.push(url);
    historyIndex++;
    saveURLHistory(url);
  }
}

iframe.onload = () => (loading.style.display = "none");

function addBookmark() {
  const url = iframe.src;
  if (!url) return;
  bookmarks.push(url);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  renderBookmarks();
}

function renderBookmarks() {
  const area = document.getElementById("bookmarkList");
  area.innerHTML = "";
  bookmarks.forEach((url, index) => {
    const div = document.createElement("div");
    div.style.display = "flex";

    const btn = document.createElement("button");
    btn.textContent = url;
    btn.style.flexGrow = "1";
    btn.onclick = () => loadURL(url);

    const del = document.createElement("button");
    del.textContent = "削除";
    del.style.marginLeft = "4px";
    del.style.background = "#e74c3c";
    del.onclick = () => {
      bookmarks.splice(index, 1);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      renderBookmarks();
    };

    div.appendChild(btn);
    div.appendChild(del);
    area.appendChild(div);
  });
}
renderBookmarks();

function goBack() {
  if (historyIndex > 0) {
    historyIndex--;
    loadURL(historyList[historyIndex]);
  }
}

function goForward() {
  if (historyIndex < historyList.length - 1) {
    historyIndex++;
    loadURL(historyList[historyIndex]);
  }
}

function search() {
  const q = document.getElementById("searchInput").value.trim();
  if (!q) return;
  loadURL("https://www.bing.com/search?q=" + encodeURIComponent(q));
}

function toggleMode() {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
}
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

function fullscreen() {
  iframe.requestFullscreen();
}

function saveURLHistory(url) {
  let list = JSON.parse(localStorage.getItem("urlHistory") || "[]");
  if (!list.includes(url)) {
    list.push(url);
    localStorage.setItem("urlHistory", JSON.stringify(list));
  }
}

document.getElementById("urlInput").addEventListener("input", () => {
  const text = document.getElementById("urlInput").value.trim();
  const list = JSON.parse(localStorage.getItem("urlHistory") || "[]");
  const sug = document.getElementById("suggestions");
  const filtered = list.filter((u) => u.includes(text));

  if (text && filtered.length > 0) {
    sug.innerHTML = "";
    filtered.forEach((u) => {
      const d = document.createElement("div");
      d.textContent = u;
      d.onclick = () => {
        document.getElementById("urlInput").value = u;
        sug.style.display = "none";
      };
      sug.appendChild(d);
    });
    sug.style.display = "block";
  } else {
    sug.style.display = "none";
  }
});

function screenshot() {
  html2canvas(document.body).then((canvas) => {
    const a = document.createElement("a");
    a.href = canvas.toDataURL();
    a.download = "screenshot.png";
    a.click();
  });
}

const panel = document.getElementById("leftPanel");
const handle = document.getElementById("resizeHandle");
let dragging = false;

handle.addEventListener("mousedown", () => (dragging = true));
document.addEventListener("mouseup", () => (dragging = false));
document.addEventListener("mousemove", (e) => {
  if (dragging) {
    const newWidth = e.clientX;
    if (newWidth > 200 && newWidth < 600) {
      panel.style.width = newWidth + "px";
    }
  }
});

function closeIframe() {
  iframe.src = "";
  closeBtn.style.display = "none";
}

function toggleSection(id, header) {
  const el = document.getElementById(id);
  const isHidden = el.style.display === "none";
  el.style.display = isHidden ? "block" : "none";
  header.textContent = header.textContent.replace(
    isHidden ? "▼" : "▲",
    isHidden ? "▲" : "▼"
  );
}

/* ▼ ここが最重要（完全動作） */
function hidePanel() {
  document.getElementById("leftPanel").style.display = "none";
  document.getElementById("showPanelBtn").style.display = "block";
}

function showPanel() {
  document.getElementById("leftPanel").style.display = "block";
  document.getElementById("showPanelBtn").style.display = "none";
}
