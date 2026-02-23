const DEFAULT_SETTINGS = {
  matchMode: 'exact'
};

let highlightedTabIds = new Set();

function urlsMatch(tabUrl, linkUrl, mode) {
  const tab = new URL(tabUrl);
  const link = new URL(linkUrl);
  if (!tab || !link) return false;
  
  switch (mode) {
    case 'exact':
      return tab.href === link.href;
    
    case 'hashless':
      tab.hash = '';
      link.hash = '';
      return tab.href === link.href;
    
    case 'path':
      return (tab.origin + tab.pathname) === (link.origin + link.pathname);
    
    default:
      return false;
  }
}

async function getSettings() {
  const stored = await browser.storage.local.get('settings');
  return { ...DEFAULT_SETTINGS, ...stored.settings };
}

async function highlightTabsByUrl(url) {
  const { matchMode } = await getSettings();
  const [ activeTab ] = await browser.tabs.query({ active: true, currentWindow: true });
  const tabs = await browser.tabs.query({});
  
  await clearHighlight();
  
  for (const tab of tabs) {
    if (!tab.url) continue;
    if (tab.id === activeTab.id) continue;
    
    if (urlsMatch(tab.url, url, matchMode)) {
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
  console.log("onMessage: ", message)
  if (message.action === 'highlightTab') {
    highlightTabsByUrl(message.url);
  }

  if (message.action === 'removeHighlight') {
    clearHighlight();
  }
});
