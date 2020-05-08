'use strict';

const toast = document.getElementById('toast');

chrome.storage.local.get({
  'notify': true,
  'saveAs': false
}, prefs => {
  document.getElementById('notify').checked = prefs.notify;
  document.getElementById('saveAs').checked = prefs.saveAs;
});

document.getElementById('save').addEventListener('click', () => chrome.storage.local.set({
  'notify': document.getElementById('notify').checked,
  'saveAs': document.getElementById('saveAs').checked
}, () => {
  toast.textContent = 'Options Saved.';
  window.setTimeout(() => toast.textContent = '', 750);
}));
// reset
document.getElementById('reset').addEventListener('click', e => {
  if (e.detail === 1) {
    toast.textContent = 'Double-click to reset!';
    window.setTimeout(() => toast.textContent = '', 750);
  }
  else {
    localStorage.clear();
    chrome.storage.local.clear(() => {
      chrome.runtime.reload();
      window.close();
    });
  }
});
// support
document.getElementById('support').addEventListener('click', () => chrome.tabs.create({
  url: chrome.runtime.getManifest().homepage_url + '?rd=donate'
}));
