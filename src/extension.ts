// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CacheManager } from "./cache/manager";
import { SwaggerTreeDataProvider } from "./swagger/TreeDataProvider";
import { Logger } from "./utils/Logger";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	Logger.Current.Log("Welcome to Swagger Explorer!", "Info", true);

	const cache = new CacheManager(context);
	CacheManager.SetCurrent(cache);
	const sw = new SwaggerTreeDataProvider(context);
	const treeView = vscode.window.createTreeView("swaggerExplorer", { treeDataProvider: sw });

	treeView.onDidExpandElement(e => {
		e.element.redraw();
		setTimeout(() => {
			try {
				sw.refresh();
			} catch (err) {
				Logger.Current.Error(`Error refreshing tree: ${(err as Error).message}`);
			}
		}, 100);
	});

	context.subscriptions.push(treeView);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand("swaggerExplorer.refresh", (...args) => {
			sw.refresh(...args);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand("swaggerExplorer.addNew", (...args) => {
			sw.addNewSource(...args);
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
