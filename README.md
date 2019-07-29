[![CircleCI](https://circleci.com/gh/BitHighlander/diagonAlley.svg?style=svg)](https://circleci.com/gh/BitHighlander/diagonAlley)


# diagonAlley

A simple GRIN wallet.

Usage: http://diagonalley.io/getting-started


## Build for development

install dependencies
```
npm i

```

package UI

```
npm run pack
```

Run Dev
```
npm run dev
```



##Build for release

Build restore node (grin R)
(install latest rustc)
```
npm build-rs
```

move node.info from /target to /grinRs

build project

```
npm build
```

bundle
```
npm tar-bundle-*
```






## DiagonAlley as of Version 2.0 shares a backend and is a fork of Niffler

[Niffler](https://github.com/grinfans/Niffler)

