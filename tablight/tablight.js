// console.log("Tablight loaded");

document.addEventListener('mouseover', function(event) {
  let link = event.target.closest('a');
  if (link && link.href) {
    // console.log("Sending highlightTab message for URL:", link.href);
    browser.runtime.sendMessage({ action: 'highlightTab', url: link.href });
  }
});

document.addEventListener('mouseout', function(event) {
  let link = event.target.closest('a');
  if (link && link.href) {
    // console.log("Sending removeHighlight message for URL:", link.href);
    browser.runtime.sendMessage({ action: 'removeHighlight', url: link.href });
  }
});
