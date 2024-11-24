/*
 * Copyright (C) 2024 Siddharth Sharma.
 */

import * as net from 'net';
import * as vscode from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    StreamInfo,
    Position,
    Location,
} from 'vscode-languageclient/node';
import type MarkdownIt from 'markdown-it';

let client: LanguageClient;
const restartCmd = 'pyang.client.restart'
const statusBarCmd = 'pyang.client.status';
const showReferencesCmd = 'pyang.show.references'
const editorTreeDiagramCmd = 'pyang.editor.tree.diagram'
const editorPumlDiagramCmd = 'pyang.editor.puml.diagram'
const generateTreeDiagramCmd = 'pyang.generate.tree.diagram'
const generatePumlDiagramCmd = 'pyang.generate.puml.diagram'
const config = vscode.workspace.getConfiguration('pyang');
const debug = config.get<boolean>('debug.server.enable', false)
const debugHost = config.get<string>('debug.server.host', "127.0.0.1")
const debugPort = config.get<number>('debug.server.port', 2087)
const extraArgs = config.get<string>('cli.args', '')
const clientName = 'pyang';
const mode = debug ? 'socket' : 'stdio';
const msg = clientName + ': LSP ' + mode + ' mode';

let statusBarItem: vscode.StatusBarItem;
let pumlYangPreviewing: boolean = false;
let pumlYangViewColumn: vscode.ViewColumn | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
    const clientOptions: LanguageClientOptions = {
        documentSelector: ['yang'],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.yang')
        }
    };
    const clientId = { id: clientName, name: 'pyang Language Server' };
    client = debug
        ? getSocketLanguageClient(clientId, clientOptions)
        : getStdioLanguageClient(clientId, clientOptions);

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = statusBarCmd;
    context.subscriptions.push(statusBarItem);

    client.start();

    client.onReady().then(
        () => {
            vscode.window.showInformationMessage(msg);

            statusBarItem.text = clientName;
            statusBarItem.tooltip = mode;
            statusBarItem.show();
        }
    );

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
    context.subscriptions.push(client.onDidChangeState(updateStatusBarItem));

    context.subscriptions.push(vscode.commands.registerCommand(
        restartCmd,
        async () => {
            await client.stop();
            client.start();
        }
    ));

    context.subscriptions.push(vscode.commands.registerCommand(
        statusBarCmd,
        () => {
            let items: string[] = [];
            items.push('pyang.client.restart');
            vscode.window.showInformationMessage(msg, ...items);
        }
    ));

    context.subscriptions.push(vscode.commands.registerCommand(
        editorTreeDiagramCmd,
        async () => {
            const command = generateTreeDiagramCmd;
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
                return;
            }
            const uri = activeEditor.document.uri.toString();
            const args = [uri];

            try {
                // XXX: Following sleep is needed to allow LSP Server to register the command
                await sleep(1000);
                await vscode.commands.executeCommand(command, ...args);
                await triggerTreePreview(activeEditor);
            } catch (error) {
                vscode.window.showErrorMessage(`Error executing command: ${error}`);
            }
        }
    ));

    context.subscriptions.push(vscode.commands.registerCommand(
        editorPumlDiagramCmd,
        async () => {
            const command = generatePumlDiagramCmd;
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
                return;
            }
            pumlYangViewColumn = activeEditor.viewColumn;
            const uri = activeEditor.document.uri.toString();
            const args = [uri];

            try {
                await vscode.commands.executeCommand(command, ...args);
                pumlYangPreviewing = false;
            } catch (error) {
                vscode.window.showErrorMessage(`Error executing command: ${error}`);
            }
        }
    ));

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(triggerPumlPreview));

    context.subscriptions.push(vscode.commands.registerCommand(
        showReferencesCmd,
        async (uri: string, position: Position, locations: Location[]) => {
            await vscode.commands.executeCommand('editor.action.showReferences',
                vscode.Uri.parse(uri),
                client.protocol2CodeConverter.asPosition(position),
                locations.map(client.protocol2CodeConverter.asLocation));
        }
    ));

    return {
        extendMarkdownIt(mdi: MarkdownIt) {
            return mdi.use(require('markdown-it-highlightjs'), {
                register: {
                    yang: require('./highlightjs-yang')
                }
            });
        }
    };
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

async function updateStatusBarItem(): Promise<void> {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        statusBarItem.hide();
        return;
    }
    const langId = activeEditor.document.languageId;
    if (langId === 'yang' || langId === 'yangtree') {
        statusBarItem.show();
    } else {
        statusBarItem.hide();
    }
}

async function triggerTreePreview(activeEditor: vscode.TextEditor): Promise<void> {
    // Following sleep is needed to allow diagram to be generated
    await sleep(500);
    const uri = activeEditor.document.uri.toString();
    await vscode.window.showTextDocument(vscode.Uri.parse(uri + '.tree'), { viewColumn: vscode.ViewColumn.Beside });
}

async function triggerPumlPreview(): Promise<void> {
    if (pumlYangPreviewing) {
        return;
    }
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        return;
    }

    const langId = activeEditor.document.languageId;
    if (langId !== 'plantuml') {
        return;
    }

    if (pumlYangViewColumn === undefined) {
        return;
    }

    var pumlExtension = vscode.extensions.getExtension('jebbs.plantuml');
    if (!pumlExtension) {
        vscode.window.showErrorMessage('PlantUML extension is not installed');
        return;
    }
    if (!pumlExtension.isActive) {
        await pumlExtension.activate();
    }

    // Following cursorMove command is needed to move to the diagram part of the file
    await vscode.commands.executeCommand('cursorMove', { to: 'down', by: 'line', value: 5, select: false });

    await vscode.commands.executeCommand('plantuml.preview');
    pumlYangPreviewing = true;

    const uri = activeEditor.document.uri.toString();
    await vscode.window.showTextDocument(vscode.Uri.parse(uri.slice(0, -5)), { viewColumn: pumlYangViewColumn });
}

function getStdioLanguageClient(
    clientId: { id: string, name: string },
    clientOptions: LanguageClientOptions,
): LanguageClient {
    const lsp_command = 'pyang';
    let lsp_args = [
        '--verbose',
        '--lsp',
        '--no-env-path',
    ];
    lsp_args = lsp_args.concat(extraArgs.split(' '))
    const serverOptions: ServerOptions = {
        run: {
            command: lsp_command,
            args: lsp_args
        },
        debug: {
            command: lsp_command,
            args: lsp_args.concat('--verbose')
        }
    };
    return new LanguageClient(
        clientId.id,
        clientId.name,
        serverOptions,
        clientOptions,
        true
    );
}

function getSocketLanguageClient(
    clientId: { id: string, name: string },
    clientOptions: LanguageClientOptions,
): LanguageClient {
    const connectionInfo = {
        port: debugPort,
        host: debugHost
    };
    const serverOptions: ServerOptions = () => {
        const socket = net.connect(connectionInfo);
        const result: StreamInfo = {
            writer: socket,
            reader: socket
        };
        return Promise.resolve(result);
    };
    return new LanguageClient(
        clientId.id,
        clientId.name,
        serverOptions,
        clientOptions,
        true
    );
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
