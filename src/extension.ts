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

let client: LanguageClient;
const restartCmd = 'pyang.client.restart'
const showReferencesCmd = 'pyang.show.references'
const config = vscode.workspace.getConfiguration('pyang');
const debug = config.get<boolean>('debug.server.enable', false)
const debugHost = config.get<string>('debug.server.host', "127.0.0.1")
const debugPort = config.get<number>('debug.server.port', 2087)
const extraArgs = config.get<string>('cli.args', '')

export function activate(context: vscode.ExtensionContext) {
    const clientOptions: LanguageClientOptions = {
        documentSelector: ['yang'],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.yang')
        }
    };
    const clientId = { id: 'pyang', name: 'pyang Language Server' };
    client = debug
        ? getSocketLanguageClient(clientId, clientOptions)
        : getStdioLanguageClient(clientId, clientOptions);

    client.start();

    client.onReady().then(() => {
        vscode.window.showInformationMessage(debug
            ? 'pyang: LSP socket mode'
            : 'pyang: LSP stdio mode');

    });

    const restartCmdHandler = async () => {
        await client.stop();
        client.start();
    };

    context.subscriptions.push(vscode.commands.registerCommand(restartCmd, restartCmdHandler));

    vscode.commands.registerCommand(showReferencesCmd, (uri: string, position: Position, locations: Location[]) => {
        // vscode.window.showInformationMessage(
        //     vscode.Uri.parse(uri).toString() +
        //      ' ' + position.line.toString() +
        //      ' ' + position.character.toString()
        // );
        vscode.commands.executeCommand('editor.action.showReferences',
            vscode.Uri.parse(uri),
            client.protocol2CodeConverter.asPosition(position),
            locations.map(client.protocol2CodeConverter.asLocation));
    })
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

function getStdioLanguageClient(
    clientId: { id: string, name: string },
    clientOptions: LanguageClientOptions,
): LanguageClient {
    const lsp_command = 'pyang';
    let lsp_args = [
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
