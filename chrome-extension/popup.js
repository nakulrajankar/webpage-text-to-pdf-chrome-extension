document.getElementById("convert").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    const [{ result: text }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText
    });

    const response = await fetch("http://localhost:5000/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error("Backend not reachable");
    }

    const data = await response.json();

    chrome.tabs.create({
      url: data.downloadUrl
    });

  } catch (err) {
    alert("Failed to connect to backend. Is server running?");
    console.error(err);
  }
});
