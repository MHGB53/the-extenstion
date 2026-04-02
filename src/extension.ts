import * as vscode from 'vscode';
import { arabicKeyboardMap } from './arabicKeyboardMap';

let isArabicEnabled: boolean = false;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log('Arabic Keyboard Mapper extension activated');

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = 'arabicKeyboardMapper.toggleArabic';
  updateStatusBar();
  statusBarItem.show();

  // Get initial state from settings
  const config = vscode.workspace.getConfiguration('arabicKeyboardMapper');
  isArabicEnabled = config.get('enabled', false);

  // Register commands
  const toggleCommand = vscode.commands.registerCommand(
    'arabicKeyboardMapper.toggleArabic',
    toggleArabic
  );

  const enableCommand = vscode.commands.registerCommand(
    'arabicKeyboardMapper.enableArabic',
    enableArabic
  );

  const disableCommand = vscode.commands.registerCommand(
    'arabicKeyboardMapper.disableArabic',
    disableArabic
  );

  // Register text edit command for character replacement
  const replaceCommand = vscode.commands.registerCommand(
    'arabicKeyboardMapper.replaceChar',
    replaceCharacter
  );

  // Listen to editor changes
  const changeListener = vscode.workspace.onDidChangeTextDocument(
    onTextchange
  );

  context.subscriptions.push(
    toggleCommand,
    enableCommand,
    disableCommand,
    replaceCommand,
    changeListener,
    statusBarItem
  );
}

function toggleArabic() {
  isArabicEnabled = !isArabicEnabled;
  updateConfig();
  updateStatusBar();
  showNotification();
}

function enableArabic() {
  if (!isArabicEnabled) {
    isArabicEnabled = true;
    updateConfig();
    updateStatusBar();
    showNotification();
  }
}

function disableArabic() {
  if (isArabicEnabled) {
    isArabicEnabled = false;
    updateConfig();
    updateStatusBar();
    showNotification();
  }
}

function updateStatusBar() {
  if (isArabicEnabled) {
    statusBarItem.text = '$(globe) Arabic Keyboard ON';
    statusBarItem.backgroundColor = new vscode.ThemeColor(
      'statusBarItem.warningBackground'
    );
  } else {
    statusBarItem.text = '$(globe) Arabic Keyboard OFF';
    statusBarItem.backgroundColor = undefined;
  }
}

function updateConfig() {
  const config = vscode.workspace.getConfiguration('arabicKeyboardMapper');
  config.update('enabled', isArabicEnabled, vscode.ConfigurationTarget.Global);
}

function showNotification() {
  const status = isArabicEnabled ? 'enabled' : 'disabled';
  vscode.window.showInformationMessage(`Arabic keyboard mapping ${status}`);
}

function onTextchange(event: vscode.TextDocumentChangeEvent) {
  if (!isArabicEnabled) {
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document !== event.document) {
    return;
  }

  // Process each change
  event.contentChanges.forEach((change: any) => {
    const insertedText = change.text;

    // Only process single character insertions
    if (insertedText.length === 1 && /[a-zA-Z0-9\[\]\;\'\-=,./\\`]/.test(insertedText)) {
      const mappedChar = arabicKeyboardMap[insertedText];

      if (mappedChar && mappedChar !== insertedText) {
        // Replace the character with its Arabic equivalent
        const range = new vscode.Range(
          change.range.start,
          change.range.end
        );

        editor.edit((editBuilder: any) => {
          editBuilder.replace(range, mappedChar);
        });
      }
    }
  });
}

function replaceCharacter() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  if (selectedText && arabicKeyboardMap[selectedText]) {
    editor.edit((editBuilder: any) => {
      editBuilder.replace(selection, arabicKeyboardMap[selectedText]);
    });
  }
}

export function deactivate() {
  console.log('Arabic Keyboard Mapper extension deactivated');
}
