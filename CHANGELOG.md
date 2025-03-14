# Change Log

All notable changes to the "pyang" [language extension][language-extensions]
will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.7.0]

### Added

- Generic YANG file template snippets for `module` and `submodule`
- Markdown code fence syntax highlighting for `yang` and `yangtree`

### Changed

- Keybinding for `pyang: Generate YANG Tree Diagram` from `Ctrl+Y T` to `Alt+Y T`
- Keybinding for `pyang: Generate PlantUML Diagram` from `Ctrl+Y U` to `Alt+Y U`

## [0.6.0]

### Added

- Editor context menu items to generate PlantUML and YANG Tree Diagrams
- Status bar item for associated files

### Changed

- `yangtree` syntax highlighting is fixed to handle prefixes and underscores
- Debug mode can be enabled per workspace as well, in addition to Remote

## [0.5.0]

### Added

- Support for YANG Tree Diagram generation
- Support for PlantUML Diagram source generation
- YANG Tree Diagram file icon
- Extension icon

## [0.4.0]

### Added

- Support for YANG Tree Diagram syntax highlighting

### Changed

- `--verbose` is added to `pyang` arguments
- Default `pyang.cli.args` configuration to be empty

## [0.3.0]

### Added

- Support for Code Lens command `pyang.show.references`

## [0.2.0]

### Added

- Support for older VS Code >= 1.65.0
- `Restart Language Server` Command

## [0.1.0]

### Added

- `syntaxes/yang.tmLanguage.json` for YANG [syntax highlight][syntax-highlight].
- `yang.lanugage-configuration.json` for YANG [language configuration][language-configuration].
- Integration for YANG [language server][language-server-extension] based on
  [`pyang`][pyang], with following configurability
  - CLI arguments to `pyang`
  - Use LSP over either stdio (default) and TCP socket (debug)
  - LSP server TCP socket host and port

[language-extensions]: https://code.visualstudio.com/api/language-extensions/overview
[syntax-highlight]: https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide
[language-configuration]: https://code.visualstudio.com/api/language-extensions/language-configuration-guide
[language-server-extension]: https://code.visualstudio.com/api/language-extensions/language-server-extension-guide

[pyang]: https://github.com/mbj4668/pyang

<!-- markdownlint-disable-file MD024 -->
