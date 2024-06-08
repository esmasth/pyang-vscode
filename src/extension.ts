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
} from 'vscode-languageclient/node';

let client: LanguageClient;
const config = vscode.workspace.getConfiguration('pyang');
const debug = config.get<boolean>('debug.server.enable', false)
const debug_host = config.get<string>('debug.server.host', "127.0.0.1")
const debug_port = config.get<number>('debug.server.port', 2087)
const extra_args = config.get<string>('cli.args', '')

export function activate(context: vscode.ExtensionContext) {
    let clientOptions: LanguageClientOptions = {
        documentSelector: ['yang'],
    };
    const clientId = { id: 'pyang', name: 'pyang Language Server' };
    client = debug
        ? getSocketLanguageClient(clientId, clientOptions)
        : getStdioLanguageClient(clientId, clientOptions, context);
    client.start();
    vscode.window.showInformationMessage(debug
        ? 'pyang: LSP socket mode'
        : 'pyang: LSP stdio mode');
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
    context: vscode.ExtensionContext
): LanguageClient {
    const lsp_command = 'pyang';
    let lsp_args = [
        '--lsp',
        '--no-env-path',
    ];
    lsp_args = lsp_args.concat(extra_args.split(' '))
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
    let connectionInfo = {
        port: debug_port,
        host: debug_host
    };
    let serverOptions: ServerOptions = () => {
        let socket = net.connect(connectionInfo);
        let result: StreamInfo = {
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
