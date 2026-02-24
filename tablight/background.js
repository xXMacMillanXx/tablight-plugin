const DEFAULT_SETTINGS = {
  matchMode: 'exact',
  matchAction: 'highlight'
};

let highlightedTabIds = new Set();

function buildUrlPatterns(linkUrl, mode) {
  const url = new URL(linkUrl);
  
  switch (mode) {
    case 'exact':
      return url.href;
    
    case 'hashless':
      url.hash = '';
      return url.href;
    
    case 'path':
      // return `${url.origin}${url.pathname.replace(/\/$/, '')}/*`;
      return `${url.origin}${url.pathname}*`;
    
    default:
      return null;
  }
}

async function getSettings() {
  const stored = await browser.storage.local.get('settings');
  return { ...DEFAULT_SETTINGS, ...stored.settings };
}

async function highlightTabsByUrl(url) {
  const { matchMode, matchAction } = await getSettings();
  const pattern = buildUrlPatterns(url, matchMode);
  if (!pattern) return;
  
  const [ activeTab ] = await browser.tabs.query({ active: true, currentWindow: true });
  const tabs = await browser.tabs.query({ url: pattern });
  const highlight = matchAction === 'highlight' ? true : false;
  
  await clearHighlight();
  
  for (const tab of tabs) {
    if (!tab.url) continue;
    if (tab.id === activeTab.id) continue;
    
    await browser.tabs.update(tab.id, { active: !highlight, highlighted: highlight });
    highlightedTabIds.add(tab.id);
    
    if (!highlight) return;
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
