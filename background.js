// Service Worker for Chrome Extension Manifest V3

// Initialize storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('arabicEnabled', (result) => {
    if (result.arabicEnabled === undefined) {
      chrome.storage.local.set({ arabicEnabled: false });
    }
  });
});

// Handle keyboard shortcut (Alt+A to toggle)
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-arabic') {
    chrome.storage.local.get('arabicEnabled', (result) => {
      const newState = !result.arabicEnabled;
      chrome.storage.local.set({ arabicEnabled: newState });
      
      // Notify all tabs
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            type: 'TOGGLE_ARABIC',
            enabled: newState
          }).catch(() => {});
        });
      });
    });
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_STATUS') {
    chrome.storage.local.get('arabicEnabled', (result) => {
      sendResponse({ enabled: result.arabicEnabled });
    });
    return true;
  }
});
