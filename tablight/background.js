function highlightTab(tabId) {
  browser.tabs.update(tabId, { active: false, highlighted: true });
}

function removeHighlight(tabId) {
  browser.tabs.update(tabId, { active: false, highlighted: false });
}

browser.runtime.onMessage.addListener(async (message, sender) => {
  if (message.action === 'highlightTab') {
    let tabs = await browser.tabs.query({});
    let activeTab = await browser.tabs.query({ active: true, currentWindow: true });
    let activeTabId = activeTab[0].id;
    
    for (let tab of tabs) {
      let tabUrl = new URL(tab.url);
      let linkUrl = new URL(message.url);
      if (tabUrl.href === linkUrl.href) {
        highlightTab(tab.id);
      }
    }
    
    browser.tabs.update(activeTabId, { active: true });
  } else if (message.action === 'removeHighlight') {
    let tabs = await browser.tabs.query({ active: false, highlighted: true });
    var tabIds = tabs.map((tab) => tab.id);
    
    for (let id of tabIds) {
      removeHighlight(id);
    }
  }
});
