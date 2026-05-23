const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
  files: {
    wasm: "/scram/scramjet.wasm.wasm",
    all: "/scram/scramjet.all.js",
    sync: "/scram/scramjet.sync.js",
  }
});

async function init() {
  await scramjet.init();
  
  // Register service worker under the /scram/ scope
  await navigator.serviceWorker.register("/sw.js", { scope: "/scram/" });

  // Connect BareMux
  const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
  
  // Replace this with your actual Wisp WebSocket server URL
  const wispUrl = "wss://wisp.example.com/"; 
  await connection.setTransport("/baremux/epoxy.js", [{ wispUrl }]);
  
  console.log("System ready!");
}

document.getElementById("proxy-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let url = document.getElementById("url-input").value.trim();
  if (!url) return;
  
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  
  window.location.href = `/scram/${scramjet.encodeUrl(url)}`;
});

init().catch(console.error);
