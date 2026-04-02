// Arabic Keyboard Mapping
const arabicKeyboardMap = {
  '1': '١', '2': '٢', '3': '٣', '4': '٤', '5': '٥',
  '6': '٦', '7': '٧', '8': '٨', '9': '٩', '0': '٠',
  'q': 'ض', 'w': 'ص', 'e': 'ث', 'r': 'ق', 't': 'ف',
  'y': 'غ', 'u': 'ع', 'i': 'ه', 'o': 'خ', 'p': 'ح',
  'a': 'ش', 's': 'س', 'd': 'ي', 'f': 'ب', 'g': 'ل',
  'h': 'ا', 'j': 'ت', 'k': 'ن', 'l': 'م', 'z': 'ئ',
  'x': 'ء', 'c': 'ؤ', 'v': 'ر', 'b': 'ى', 'n': 'ة', 'm': 'و',
  ',': '،', '.': '.', '/': 'ز', ';': 'ك', "'": 'ط',
  '[': 'ج', ']': 'د', '-': '-', '=': '='
};

let isArabicEnabled = false;

// Initialize state from storage
chrome.storage.local.get('arabicEnabled', (result) => {
  isArabicEnabled = result.arabicEnabled || false;
  console.log('Arabic enabled:', isArabicEnabled);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TOGGLE_ARABIC') {
    isArabicEnabled = request.enabled;
    console.log('Toggle received, Arabic enabled:', isArabicEnabled);
  }
});

// Listen for keyboard input on keydown (more reliable)
document.addEventListener('keydown', (e) => {
  if (!isArabicEnabled) return;
  
  const target = e.target;
  const key = e.key;
  
  // Check if we're in a text input
  if (!isTextInput(target)) return;
  
  // ALLOW system shortcuts - don't intercept these
  if (e.ctrlKey || e.metaKey || e.altKey) {
    // Allow all Ctrl/Cmd/Alt combinations to work normally
    return;
  }
  
  // Only process single character keys (not special keys)
  if (key.length !== 1) return;
  
  // Don't map numbers when Shift is pressed (for normal number input)
  if (e.shiftKey && /^[0-9]$/.test(key)) return;
  
  // Check if we have a mapping for this key
  const mappedChar = arabicKeyboardMap[key];
  if (!mappedChar || mappedChar === key) return;
  
  // Prevent the original character from being typed
  e.preventDefault();
  
  // Insert the mapped character
  insertMappedCharacter(target, mappedChar);
  
}, true);

function isTextInput(el) {
  if (!el) return false;
  
  const tagName = el.tagName;
  const isInput = tagName === 'INPUT' || tagName === 'TEXTAREA';
  const isContentEditable = el.contentEditable === 'true' || el.getAttribute('contenteditable') === 'true';
  
  // Also check parent elements for contentEditable (for Gmail)
  if (!isContentEditable && el.parentElement) {
    return isInput || isContentEditable || el.closest('[contenteditable="true"]');
  }
  
  return isInput || isContentEditable;
}

function insertMappedCharacter(el, char) {
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    // For regular input/textarea elements
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const oldValue = el.value;
    el.value = oldValue.substring(0, start) + char + oldValue.substring(end);
    el.selectionStart = el.selectionEnd = start + 1;
    
    // Trigger input and change events
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  } else if (el.contentEditable === 'true' || el.getAttribute('contenteditable') === 'true') {
    // For contenteditable elements (Gmail, etc) - use direct DOM manipulation
    try {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const textNode = document.createTextNode(char);
        range.deleteContents();
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Trigger input event
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } catch (err) {
      console.log('Error inserting character:', err);
    }
  }
}

console.log('Arabic Keyboard Mapper content script loaded!');
