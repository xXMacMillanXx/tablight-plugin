let currentLink = null;

document.addEventListener('mouseenter', (event) => {
  const link = event.target.closest('a');
  if (!link || !link.href || link === currentLink) return;

  currentLink = link;
  browser.runtime.sendMessage({
    action: 'highlightTab',
    url: link.href
  });
}, true);

document.addEventListener('mouseleave', (event) => {
  const link = event.target.closest('a');
  if (!link || link !== currentLink) return;

  currentLink = null;
  browser.runtime.sendMessage({
    action: 'removeHighlight'
  });
}, true);

window.addEventListener('blur', () => {
  currentLink = null;
  browser.runtime.sendMessage({ action: 'removeHighlight' });
});
