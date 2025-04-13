# log-remover README

**log-remover** is a VSCode extension that removes all `console.log()` statements from your codebase. It helps maintain a clean codebase by ensuring that debugging statements are removed before committing or deploying your project.

## Installation

You can install the extension directly from the Visual Studio Code Marketplace:

[![Install from VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/hazardemircan.log-cleaner?label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=hazardemircan.log-cleaner)

Or search for `log-remover` inside the Extensions panel in VS Code.


## Features

- **Automatically removes all `console.log()` statements** from your files.
- **Customizable configuration** to specify which files or directories to include/exclude from the removal process.
- **Support for multiple file types**, such as `.js`, `.ts`, `.jsx`, and `.tsx`.

## Extension Settings

### Configuration File: `adalet.json`

This extension uses a configuration file called `adalet.json` that allows you to define the files and directories to include or exclude in the removal process.

The `adalet.json` file is created automatically in the root of your project when the extension is first run. If you prefer to customize it before running the extension, you can create the file yourself.

### Default `adalet.json`:

```json
{
    "include": "src/**/*",
    "exclude": "**/node_modules/**"
}
```
  
* `log-remover.removeConsoleLogs`: Starts removing process.

### 1.0.0

Initial release of ...

