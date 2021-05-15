import * as vscode from 'vscode';

export function sendLoadAddonRequest(extensionPath: string) {
	const antlersLanguageClient = vscode.extensions.getExtension('stillat.vscode-antlers');


	if (typeof antlersLanguageClient !== 'undefined') {
		if (antlersLanguageClient.isActive == false) {
			antlersLanguageClient.activate().then(() => {
				vscode.commands.executeCommand('vscodeAntlers.reloadAddons', extensionPath + '/antlers/package.json');
			});
		}
	} else {
		vscode.commands.executeCommand('vscodeAntlers.reloadAddons', extensionPath + '/antlers/package.json');
	}
}
