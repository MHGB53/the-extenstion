// Arabic Keyboard Mapping
const arabicKeyboardMap = {
  // Number row
  '1': '١', '2': '٢', '3': '٣', '4': '٤', '5': '٥',
  '6': '٦', '7': '٧', '8': '٨', '9': '٩', '0': '٠',
  '-': '-', '=': '=',

  // Q row
  'q': 'ض', 'Q': 'َ', 'w': 'ص', 'W': 'ٌ', 'e': 'ث', 'E': 'ً',
  'r': 'ق', 'R': 'ٍ', 't': 'ف', 'T': 'ُ', 'y': 'غ', 'Y': 'ِ',
  'u': 'ع', 'U': 'ّ', 'i': 'ه', 'I': 'ْ', 'o': 'خ', 'O': ']',
  'p': 'ح', 'P': '[', '[': 'ج', '{': '}', ']': 'د', '}': '{',

  // A row
  'a': 'ش', 'A': 'َ', 's': 'س', 'S': 'ٌ', 'd': 'ي', 'D': 'ً',
  'f': 'ب', 'F': 'ٍ', 'g': 'ل', 'G': 'ُ', 'h': 'ا', 'H': 'ِ',
  'j': 'ت', 'J': 'ّ', 'k': 'ن', 'K': 'ْ', 'l': 'م', 'L': ':',
  ';': 'ك', ':': '"', "'": 'ط', '"': "'",

  // Z row
  'z': 'ئ', 'Z': 'ً', 'x': 'ء', 'X': 'ٌ', 'c': 'ؤ', 'C': 'َ',
  'v': 'ر', 'V': 'ِ', 'b': 'ى', 'B': 'ُ', 'n': 'ة', 'N': 'ّ',
  'm': 'و', 'M': 'ْ', ',': '،', '<': '،', '.': '.', '>': '؟',
  '/': 'ز', '?': 'ظ', '\\': '\\', '|': '|', ' ': ' ',
};

let isArabicEnabled = false;

// Initialize state
chrome.storage.local.get('arabicEnabled', (result) => {
  isArabicEnabled = result.arabicEnabled || false;
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TOGGLE_ARABIC') {
    isArabicEnabled = request.enabled;
  }
});

// Inject keyboard listener into page context
injectKeyboardListener();

function injectKeyboardListener() {
  try {
    // Create script to run in page context
    const script = document.createElement('script');
    script.textContent = `
      ${getMapData()}
      
      let arabicEnabled = false;
      
      // Get initial state
      chrome.storage.local.get('arabicEnabled', (result) => {
        arabicEnabled = result.arabicEnabled || false;
      });
      
      // Listen for messages
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'TOGGLE_ARABIC') {
          arabicEnabled = request.enabled;
        }
      });
      
      // Listen for keyboard input
      document.addEventListener('keydown', (e) => {
        if (!arabicEnabled) return;
        
        const target = e.target;
        if (!isTextInput(target)) return;
        
        const key = e.key;
        const mappedChar = arabicKeyboardMap[key];
        
        if (mappedChar && mappedChar !== key) {
          e.preventDefault();
          insertCharacter(target, mappedChar);
        }
      }, true);
      
      function isTextInput(el) {
        return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.contentEditable === 'true';
      }
      
      function insertCharacter(el, char) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          const start = el.selectionStart;
          const end = el.selectionEnd;
          el.value = el.value.substring(0, start) + char + el.value.substring(end);
          el.selectionStart = el.selectionEnd = start + char.length;
          el.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (el.contentEditable === 'true') {
          document.execCommand('insertText', false, char);
        }
      }
    `;
    
    // Try to inject into html element
    const html = document.documentElement;
    if (html) {
      html.appendChild(script);
      setTimeout(() => script.remove(), 100);
    }
  } catch (e) {
    console.log('Could not inject script:', e);
  }
}

function getMapData() {
  return `
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
  `;
}
