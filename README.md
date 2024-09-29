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
by the extension, except pull diagnostics since it is not automatically
triggered.

See `pyang` documentation corresponding to installation for expected features.

See: [Programmatic Language Features][programmatic],
     [Language Server Extension Guide][lseg]

## Requirements

The extension requires a `pyang` version installation that supports LSP. At the
time of writing, only a work in progress `pyang` supports `--lsp --no-env-path`
arguments, which are used to execute it as an LSP server.

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

## Extension Commands

This extension contributes the following commands:

* `pyang.client.restart`
  > `pyang: Restart Language Server` restarts the language client and in turn
  reinstantiates the language server. When `pyang.debug.server.enable` is set,
  it merely reinitiates the TCP connection and hence TCP server should already
  be initiated.

* `pyang.trigger.tree.diagram`
  > `pyang: Generate YANG Tree Diagram` generates the YANG Tree diagram source
  text corresponding to the YANG file in the active editor, and brings the
  generated file into focus.

* `pyang.trigger.puml.diagram`
  > `pyang: Generate PlantUML Diagram` generates the PlantUML diagram source
  text corresponding to the YANG file in the active editor, and brings the
  generated file into focus.

## Known Issues

Missing `pyang` or older installations that do not meet requirements are not
handled gracefully.

Change of some settings e.g., CLI arguments, requires reload of manual reload of
the editor. `pyang: Restart Language Server` command reuses the settings from
the last startup.

For issues pertaining to the language server, please refer to documentation for
`pyang`.

## Release Notes

### 0.4.0

* `pyang.cli.args` configuration is now empty by default
* `pyang` startup arguments now include `--verbose`, in addition to `--lsp` and
  `--no-env-path` arguments earlier
* Added support for YANG Tree Diagram syntax highlighting. `.yangtree` and
  `.ytd` file extensions are registered as YANG Tree Diagram by default.

### 0.3.0

* Added support for pyang's "References" Code Lens command

### 0.2.0

* Added support for older VS Code >= 1.65.0
* Added command `pyang: Restart Language Server`

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
