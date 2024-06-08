# pyang

YANG Language Support using [pyang][pyang].

This package can be used on [Visual Studio Code][vscode], as well as any other
[Code - OSS][codeoss] and [Theia][theia] derivatives that are compatible with
[VS Code Extension API][codeapi].

## Features

### Inbuilt

Following features are provided directly by this [Language Extension][codeapilsp]

* Syntax highlighting
* Comment toggling
* Brackets definition
* Autoclosing
* Autosurrounding

See: [Syntax Highlight][grammars], [Language Configuration][languages]

### Language Server Based

`pyang` provides [LSP][lsp] based features for YANG, all of which are supported
by the extension, except pull diagnostics and commands.

See `pyang` documentation corresponding to installation for expected features.

See: [Programmatic Language Features][programmatic], [Language Server Extension Guide][lseg]

## Requirements

The extension requires a `pyang` version installation that supports LSP. At the
time of writing, only a work in progress `pyang` supports `--lsp` argument,
which is used to execute it as an LSP server.

## Extension Settings

This extension contributes the following settings:

* `pyang.cli.args`
  > Extra `pyang` CLI arguments, above `--lsp --no-env-path` (which are already
  provided). This allows for tuning of LSP server defaults, providing search
  paths, and provisioning of `pyang` plugins, for example.
* `pyang.trace.server`
  > LSP trace level.
* `pyang.debug.server.enable`
  > LSP is used via TCP socket, instead of stdio.
* `pyang.debug.server.host`
  > LSP Server Host, when LSP is used via TCP socket.
* `pyang.debug.server.port`
  > LSP Server Port, when LSP is used via TCP socket.

## Known Issues

Missing `pyang` or older installations that do not meet requirements are not
handled gracefully.

Change of configuration requires reload of editor for application.

For issues pertaining to the language server, please refer to documentation for
`pyang`.

## Unknown Issues

The extension has only been verified with VS Code, hence issues may exist with
other VS Code compatible editors/IDE.

## Release Notes

### 0.1.0

Initial release of the extension

---

[pyang]: https://github.com/mbj4668/pyang
[vscode]: https://code.visualstudio.com
[codeoss]: https://github.com/microsoft/vscode
[theia]: https://theia-ide.org
[codeapi]: https://code.visualstudio.com/api
[lsp]: https://microsoft.github.io/language-server-protocol/
[codeapilsp]: https://code.visualstudio.com/api/language-extensions/overview
[grammars]: https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide
[languages]: https://code.visualstudio.com/api/language-extensions/language-configuration-guide
[programmatic]: https://code.visualstudio.com/api/language-extensions/programmatic-language-features
[lseg]: https://code.visualstudio.com/api/language-extensions/language-server-extension-guide
