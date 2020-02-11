import * as vs from "vscode";

const configValues = ["Error", "Warning", "Info", "Debug"] as const;
type cfgLogValues = typeof configValues[number];

function toNumber(value: cfgLogValues): number {
	return Math.abs(configValues.indexOf(value)); // if index is -1 then use the value 1 as default;
}

export class Logger {
	static readonly INFO: typeof configValues[0] = configValues[0];
	static readonly WARN: typeof configValues[1] = configValues[1];
	static readonly ERR: typeof configValues[2] = configValues[2];
	static readonly DEBUG: typeof configValues[3] = configValues[3];

	private static loggerInstance: Logger;
	private outputChannel: vs.OutputChannel;

	private constructor() {
		this.outputChannel = vs.window.createOutputChannel("Swagger Explorer");
		this.outputChannel.show(true);
	}
	static get Current(): Logger {
		if (!(Logger.loggerInstance instanceof Logger)) {
			Logger.loggerInstance = new Logger();
		}
		return Logger.loggerInstance;
	}

	Log(message: string, Level: cfgLogValues, newline: boolean = false) {
		const msg = `${message}`;
		const verbosity = vs.workspace.getConfiguration("swaggerExplorer").get<cfgLogValues>("loggerVerbosity") ?? "Warning";
		if (toNumber(verbosity) < toNumber(Level)) {
			console.log(msg);
			return;
		}

		try {
			if (newline) {
				this.outputChannel.appendLine(msg);
			} else {
				this.outputChannel.append(msg);
			}
		} catch (err) {
			// tslint:disable-next-line: no-console
			console.error(message);
		}
	}
	Info(message: string) {
		this.Log(`[${Logger.INFO[0]}] - ${message}`, Logger.INFO, true);
	}
	Warning(message: string) {
		this.Log(`[${Logger.WARN[0]}] - ${message}`, Logger.WARN, true);
	}
	Error(message: string) {
		this.Log(`[${Logger.ERR[0]}] - ${message}`, Logger.ERR, true);
	}
}
