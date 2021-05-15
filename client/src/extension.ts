import {ExtensionContext} from 'vscode';
import { sendLoadAddonRequest } from './interop';

export function activate(context: ExtensionContext) {
	sendLoadAddonRequest(context.extensionPath);
}
