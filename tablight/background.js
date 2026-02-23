let highlightedTabId = null;

async function highlightTabByUrl(url) {
  const tabs = await browser.tabs.query({});
  const linkUrl = new URL(url).href;

  for (const tab of tabs) {
    if (tab.url === linkUrl) {
      if (highlightedTabId && highlightedTabId !== tab.id) {
        await browser.tabs.update(highlightedTabId, { highlighted: false });
      }

      await browser.tabs.update(tab.id, { active: false, highlighted: true });
      highlightedTabId = tab.id;
      return;
    }
  }
}

async function clearHighlight() {
  if (highlightedTabId) {
    await browser.tabs.update(highlightedTabId, { highlighted: false });
    highlightedTabId = null;
  }
}

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'highlightTab') {
    highlightTabByUrl(message.url);
  }

  if (message.action === 'removeHighlight') {
    clearHighlight();
  }
});
