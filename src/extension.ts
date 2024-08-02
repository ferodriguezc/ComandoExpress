import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.runCommandsFromFile', async () => {
        const options: vscode.OpenDialogOptions = {
            canSelectMany: false,
            openLabel: 'Open',
            filters: {
                'paste file': ['pf']
            }
        };

        const fileUri = await vscode.window.showOpenDialog(options);
        if (fileUri && fileUri[0]) {
            const filePath = fileUri[0].fsPath;

            // Get the current working directory
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

            if (workspaceFolder) {
                // Read the file
                fs.readFile(filePath, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
                    if (err) {
                        vscode.window.showErrorMessage('Failed to read file.');
                        return;
                    }

                    const commands = data.split('\n').filter(cmd => cmd.trim().length > 0);

                    // Create a new terminal
                    const terminal = vscode.window.createTerminal('Command Executor');
                    terminal.show();

                    // Execute commands
                    commands.forEach(command => {
                        terminal.sendText(command);
                    });
                });
            } else {
                vscode.window.showErrorMessage('No workspace folder found.');
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
