# @randajan/browser-files

[![NPM](https://img.shields.io/npm/v/@randajan/browser-files.svg)](https://www.npmjs.com/package/@randajan/browser-files)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Lightweight browser file I/O with customizable serialization.

## Features

- save one file (`save`)
- load one file (`load`)
- load many files of the same type (`loadMany`)
- configurable `serialize` / `deserialize`
- works in both ESM and CJS consumers

API is intentionally asymmetric: there is no `saveMany`.

## Install

```bash
npm i @randajan/browser-files
```

## Quick Start (ESM)

```js
import FileIO from "@randajan/browser-files";

const io = new FileIO({
  extension: "json",
  mimeType: "application/json",
  serialize: JSON.stringify,
  deserialize: JSON.parse
});

io.save({ hello: "world" }, "example");

const one = await io.load();
const many = await io.loadMany();
```

## Quick Start (CJS)

```js
const { FileIO } = require("@randajan/browser-files");

const io = new FileIO({
  extension: "txt",
  mimeType: "text/plain"
});

io.save("Hello", "greeting");
```

## API

### `new FileIO(options?)`

```js
/**
 * @typedef {Object} FileIOOptions
 * @property {string} [mimeType="text/plain"]
 * @property {string} [charset="utf-8"]
 * @property {string} [extension="txt"]
 * @property {string} [defaultFileName="file"]
 * @property {(data:any)=>string} [serialize]
 * @property {(text:string)=>any} [deserialize]
 */
```

### `fileIO.save(data, fileName?)`

Serializes `data` and triggers one browser download.

### `await fileIO.load()`

Opens file picker and returns one deserialized value.

### `await fileIO.loadMany()`

Opens file picker in multi-select mode and returns an array of deserialized values.

## Named Exports

The package also exports helpers:

- `normalizeExtension(extension)`
- `normalizeFileName(fileName, extension, fallback?)`
- `createTextBlob(content, mimeType?, charset?)`
- `createObjectUrl(blob)`
- `revokeObjectUrl(url)`
- `downloadObjectUrl(url, fileName)`
- `createHiddenInput(extension, mimeType, multiple?)`
- `loadTexts(input, charset?, cancelCheckDelay?)`

## JSDoc

Public API is documented directly in source:

- `src/class/FileIO.js`
- `src/tools.js`

## Notes

- Browser-only API (`Blob`, `FileReader`, DOM, object URL).
- File dialogs/downloads should be called from user interaction handlers.
- Canceling picker rejects with `Error("No file selected")`.

## License

MIT (c) [randajan](https://github.com/randajan)
