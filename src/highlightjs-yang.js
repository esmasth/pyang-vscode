/*
Language: YANG
Description: YANG is a network configuration domain-specific modeling language.
Author: Siddharth Sharma <siddharth.sharma@ericsson.com>
Category: modeling
*/

/** @type import("highlight.js").LanguageFn */
export default function(hljs) {
  // YANG Statements
  // https://datatracker.ietf.org/doc/html/rfc7950#section-7
  // Built-In Types specific statements
  // https://datatracker.ietf.org/doc/html/rfc7950#section-9
  const YANG_KEYWORDS = [
    "module",
    "yang-version",
    "namespace",
    "prefix",
    "import",
    "revision-date",
    "include",
    "organization",
    "contact",
    "revision",
    "submodule",
    "belongs-to",
    "typedef",
    "type",
    "units",
    "default",
    "container",
    "must",
    "must",
    "error-message",
    "error-app-tag",
    "presence",
    "leaf",
    "mandatory",
    "leaf-list",
    "min-elements",
    "max-elements",
    "ordered-by",
    "list",
    "key",
    "unique",
    "choice",
    "case",
    "anydata",
    "anyxml",
    "grouping",
    "uses",
    "refine",
    "rpc",
    "input",
    "output",
    "action",
    "notification",
    "augment",
    "identity",
    "base",
    "extension",
    "argument",
    "yin-element",
    "feature",
    "if-feature",
    "deviation",
    "deviate",
    "config",
    "status",
    "description",
    "reference",
    "when",
    "range",
    "fraction-digits",
    "length",
    "pattern",
    "modifier",
    "enum",
    "bit",
    "position",
    "path",
    "require-instance"
  ];

  // Built-In Types
  // https://datatracker.ietf.org/doc/html/rfc7950#section-9
  const YANG_TYPES = [
    "int8",
    "int16",
    "int32",
    "int64",
    "uint8",
    "uint16",
    "uint32",
    "uint64",
    "decimal64",
    "string",
    "boolean",
    "enumeration",
    "bits",
    "binary",
    "leafref",
    "identityref",
    "empty",
    "union",
    "instance-identifier"
  ];

  const KEYWORDS = {
    $pattern: /[\w-]+/,
    keyword: YANG_KEYWORDS,
    type: YANG_TYPES,
    // The boolean Built-In Type Lexical Representation
    // https://datatracker.ietf.org/doc/html/rfc7950#section-9.5.1
    literal: 'true false',
    // XPath Functions
    // https://datatracker.ietf.org/doc/html/rfc7950#section-10
    built_in: 'current re-match deref derived-from derived-from-or-self enum-value bit-is-set'
  };

  return {
    name: "YANG",
    aliases: [ 'yang' ],
    keywords: KEYWORDS,
    disableAutodetect: false,
    exports: {
      keywords: KEYWORDS
    }
  };
}
