import { commands, ExtensionContext } from 'vscode';

import { EXT_ID } from './constants';
import { mainHeaderCommand, subHeaderCommand, solidLineCommand } from './commands';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(`${EXT_ID}.makeMainHeader`, () => mainHeaderCommand(context))
  );

  context.subscriptions.push(
    commands.registerCommand(`${EXT_ID}.makeSubHeader`, () => subHeaderCommand(context))
  );

  context.subscriptions.push(
    commands.registerCommand(`${EXT_ID}.insertSolidLine`, () => solidLineCommand(context))
  );
}
