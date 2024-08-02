import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    // Registrar el comando 'extension.runCommandsFromFile'
    let disposable = vscode.commands.registerCommand('extension.runCommandsFromFile', async (fileUri: vscode.Uri) => {
        // Verificar si el URI del archivo es válido
        if (fileUri && fileUri.scheme === 'file') {
            try {
                // Obtener la ruta del archivo y leer su contenido
                const filePath = fileUri.fsPath;
                const commands = fs.readFileSync(filePath, 'utf8').split('\n').filter(line => line.trim() !== '');

                // Intentar obtener la terminal activa
                let terminal = vscode.window.activeTerminal;
                if (!terminal) {
                    // Si no hay una terminal activa, crear una nueva
                    terminal = vscode.window.createTerminal('ComandoExpress Terminal');
                }

                // Mostrar la terminal para asegurarse de que sea visible
                terminal.show();

                // Enviar cada comando leído del archivo a la terminal
                for (const command of commands) {
                    terminal.sendText(command);
                }

            } catch (error) {
                // Mostrar un mensaje de error si ocurre algún problema
                if (error instanceof Error) {
                    vscode.window.showErrorMessage(`Error al ejecutar los comandos: ${error.message}`);
                } else {
                    vscode.window.showErrorMessage('Error desconocido.');
                }
            }
        } else {
            // Mostrar un mensaje de error si el URI del archivo no es válido
            vscode.window.showErrorMessage('No se ha proporcionado un archivo válido.');
        }
    });

    // Añadir el comando a las suscripciones del contexto de la extensión
    context.subscriptions.push(disposable);
}

export function deactivate() {}
