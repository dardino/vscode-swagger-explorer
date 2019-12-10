import * as vscode from "vscode";
import Axios from "axios";
import { Logger } from "../utils/Logger";
export interface IConfigUrl {
	projectName: string;
	url: vscode.Uri;
	label: string;
	local: boolean;
	projectFolder?: vscode.WorkspaceFolder;
	config: Partial<IConfig>;
}

export interface IConfig {
	sources: Array<{ label: string; url: string }>;
	generators: {
		basePath: string;
		endpoints: string[];
		dtos: string[];
	};
}

export async function parseConfigFile(project: vscode.WorkspaceFolder, uri: vscode.Uri, timeOut: number): Promise<IConfigUrl> {
	const document = await vscode.workspace.openTextDocument(uri).then(document => Promise.resolve(document));
	let config: Partial<IConfig> = {};
	try {
		config = JSON.parse(document.getText());
	} catch (err) {
		if (err.stack) {
			Logger.Current.Warning(err.stack.join("\r\n"));
		}
		Logger.Current.Error(`Error while parsing config file: ${err.message}`);
	}

	return {
		projectName: project.name,
		url: uri,
		label: project.name,
		projectFolder: project,
		local: project.uri.scheme === "file",
		config
	};
}
