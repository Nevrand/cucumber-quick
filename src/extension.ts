import * as vscode from 'vscode';
import {
	executeCucumberQuickCommand,
	createCommandToExecuteScenario,
	getScenarioName,
} from './utils';
import { killActiveProcess } from './executeCommand';

export let commandOutput: vscode.OutputChannel | null = null;

export function activate(context: vscode.ExtensionContext) {
	commandOutput = vscode.window.createOutputChannel('CucumberQuickRunnerLog');
	context.subscriptions.push(commandOutput);
	context.subscriptions.push(runChromeDesktopDisposable);
	context.subscriptions.push(runChromeTabletDisposable);
	context.subscriptions.push(runChromeMobileDisposable);
	context.subscriptions.push(runWebkitDesktopDisposable);
	context.subscriptions.push(runWebkitTabletDisposable);
	context.subscriptions.push(runWebkitMobileDisposable);
	context.subscriptions.push(runFirefoxDisposable);
}

const runChromeDesktopDisposable = vscode.commands.registerCommand('execute.scenario.chrome.desktop', () => {
	const currentScenarioName: string = getScenarioName();
	const scenarioCommand: string = createCommandToExecuteScenario(currentScenarioName);
	if (commandOutput) {
		executeCucumberQuickCommand(scenarioCommand + " chrome desktop");
	} else {
		logErrorIfOutputNotDefined();
	}
});

const runChromeTabletDisposable = vscode.commands.registerCommand('execute.scenario.chrome.tablet', () => {
	const currentScenarioName: string = getScenarioName();
	const scenarioCommand: string = createCommandToExecuteScenario(currentScenarioName);
	if (commandOutput) {
		executeCucumberQuickCommand(scenarioCommand + " chrome tablet");
	} else {
		logErrorIfOutputNotDefined();
	}
});

const runChromeMobileDisposable = vscode.commands.registerCommand('execute.scenario.chrome.mobile', () => {
	const currentScenarioName: string = getScenarioName();
	const scenarioCommand: string = createCommandToExecuteScenario(currentScenarioName);
	if (commandOutput) {
		executeCucumberQuickCommand(scenarioCommand + " chrome mobile");
	} else {
		logErrorIfOutputNotDefined();
	}
});

const runWebkitDesktopDisposable = vscode.commands.registerCommand('execute.scenario.webkit.desktop', () => {
	const currentScenarioName: string = getScenarioName();
	const scenarioCommand: string = createCommandToExecuteScenario(currentScenarioName);
	if (commandOutput) {
		executeCucumberQuickCommand(scenarioCommand + " webkit desktop");
	} else {
		logErrorIfOutputNotDefined();
	}
});

const runWebkitTabletDisposable = vscode.commands.registerCommand('execute.scenario.webkit.tablet', () => {
	const currentScenarioName: string = getScenarioName();
	const scenarioCommand: string = createCommandToExecuteScenario(currentScenarioName);
	if (commandOutput) {
		executeCucumberQuickCommand(scenarioCommand + " webkit tablet");
	} else {
		logErrorIfOutputNotDefined();
	}
});

const runWebkitMobileDisposable = vscode.commands.registerCommand('execute.scenario.webkit.mobile', () => {
	const currentScenarioName: string = getScenarioName();
	const scenarioCommand: string = createCommandToExecuteScenario(currentScenarioName);
	if (commandOutput) {
		executeCucumberQuickCommand(scenarioCommand + " webkit mobile");
	} else {
		logErrorIfOutputNotDefined();
	}
});

const runFirefoxDisposable = vscode.commands.registerCommand('execute.scenario.firefox', () => {
	const currentScenarioName: string = getScenarioName();
	const scenarioCommand: string = createCommandToExecuteScenario(currentScenarioName);
	if (commandOutput) {
		executeCucumberQuickCommand(scenarioCommand + " firefox");
	} else {
		logErrorIfOutputNotDefined();
	}
});

const logErrorIfOutputNotDefined = () => {
	vscode.window.showErrorMessage(
		`VS Code output terminal not defined. Please ensure all required configuration.`
	);
	throw new Error('VS Code output terminal not defined. Please ensure all required configuration.');
};
// This method is called when the extension is deactivated
export function deactivate() {
	if (commandOutput) {
		killActiveProcess(commandOutput);
	}
}
