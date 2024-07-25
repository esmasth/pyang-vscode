# Change Log

All notable changes to the "pyang" [language extension][language-extensions]
will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0]

## Added

- Support for Code Lens command `pyang.show.references`

## [0.2.0]

## Added

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
