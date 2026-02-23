let highlightedTabIds = new Set();

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    // u.hash = '';
    return u.href;
  } catch {
    return url;
  }
}

async function highlightTabsByUrl(url) {
  const targetUrl = normalizeUrl(url);
  const tabs = await browser.tabs.query({});
  
  await clearHighlight();
  
  for (const tab of tabs) {
    if (!tab.url) continue;
    
    if (normalizeUrl(tab.url) === targetUrl) {
      await browser.tabs.update(tab.id, { active: false, highlighted: true });
      highlightedTabIds.add(tab.id);
    }
  }
}

async function clearHighlight() {
  for (const tabId of highlightedTabIds) {
    try {
      await browser.tabs.update(tabId, { highlighted: false });
    } catch { }
  }
  highlightedTabIds.clear();
}

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'highlightTab') {
    highlightTabsByUrl(message.url);
  }

  if (message.action === 'removeHighlight') {
    clearHighlight();
  }
});
