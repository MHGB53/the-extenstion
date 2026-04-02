// Toggle switch functionality
const toggleSwitch = document.getElementById('toggleSwitch');
const statusText = document.getElementById('statusText');

// Load saved state
chrome.storage.local.get('arabicEnabled', (result) => {
  const isEnabled = result.arabicEnabled || false;
  toggleSwitch.checked = isEnabled;
  updateStatusText(isEnabled);
});

// Toggle switch change event
toggleSwitch.addEventListener('change', (e) => {
  const isEnabled = e.target.checked;
  
  // Save to storage
  chrome.storage.local.set({ arabicEnabled: isEnabled });
  
  // Update status text
  updateStatusText(isEnabled);
  
  // Notify content scripts
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'TOGGLE_ARABIC',
        enabled: isEnabled
      }).catch(() => {
        // Ignore errors from tabs that don't have content script
      });
    });
  });
});

function updateStatusText(isEnabled) {
  if (isEnabled) {
    statusText.textContent = 'ON';
    statusText.classList.add('status-on');
    statusText.classList.remove('status-off');
  } else {
    statusText.textContent = 'OFF';
    statusText.classList.add('status-off');
    statusText.classList.remove('status-on');
  }
}

// Settings link
document.getElementById('settingsLink').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});
