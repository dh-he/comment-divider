import { commands, TextEditorEdit, window, ExtensionContext } from 'vscode';

import { render } from './renders';
import { checkEmptyLine } from './errors';
import { Action } from './types';

export const insertDividerAction: Action = async (type, line, lang, context) => {
  const editor = window.activeTextEditor;
  if (!editor) return;

  const docUri = editor.document.uri.toString();
  const cacheKey = `divider-cache:${docUri}:${line.lineNumber}`;

  const cached = context.workspaceState.get<{ text: string; lang: string; indent?: string }>(
    cacheKey
  );

  // If cached original exists, restore it and clear cache
  if (cached) {
    await editor.edit((editBuilder: TextEditorEdit) => {
      editBuilder.replace(line.range, cached.text);
    });

    await context.workspaceState.update(cacheKey, undefined);
    await commands.executeCommand('cursorEnd');
    return;
  }

  // For headers ensure line is not empty
  if (type === 'mainHeader' || type === 'subheader') {
    checkEmptyLine(line);
  }

  const content = render(type, line.text, lang);

  // Save original line for later restore
  const indent = line.text.split(/\S+/)[0];
  await context.workspaceState.update(cacheKey, { text: line.text, lang, indent });

  await editor.edit((textEditorEdit: TextEditorEdit) => {
    textEditorEdit.replace(line.range, content);
  });

  await commands.executeCommand('cursorEnd');
};
