# Markdown YANG Test

```yang
module test-good {
  yang-version 1.1;
  namespace "urn:test-good";
  prefix prfx;

  organization
    "organization";
  contact
    "contact";
  description
    "module description";

  revision 2024-11-12 {
    description
      "revision description";
  }
}
```

```yangtree
module: test-good
  +--rw alpha
     +--rw beta?    typese:percent
     x--rw gamma?   string {goode:test-feature-a}?
```
