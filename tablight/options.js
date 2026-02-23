console.log("Extention Options Script")
const select = document.getElementById('mode');

browser.storage.local.get('settings').then(({ settings }) => {
  select.value = settings?.matchMode || 'exact';
});

select.addEventListener('change', () => {
  browser.storage.local.set({
    settings: { matchMode: select.value }
  });
});
