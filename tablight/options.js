const select = document.getElementById('mode');
const action_select = document.getElementById('action');

browser.storage.local.get('settings').then(({ settings }) => {
  select.value = settings?.matchMode || 'exact';
  action_select = settings?.matchAction || 'highlight';
});

select.addEventListener('change', () => {
  browser.storage.local.set({
    settings: { matchMode: select.value }
  });
});

action_select.addEventListener('change', () => {
  browser.storage.local.set({
    settings: { matchAction: action_select.value }
  });
});
