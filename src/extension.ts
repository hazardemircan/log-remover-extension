// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "log-remover" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('log-remover.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from log-remover!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}

// import * as vscode from 'vscode';

// export function activate(context: vscode.ExtensionContext) {
//   console.log('Congratulations, your extension "remove-console-log" is now active!');

//   let disposable = vscode.commands.registerCommand('extension.removeConsoleLogs', async () => {
//     const editor = vscode.window.activeTextEditor;
//     if (editor) {
//       const document = editor.document;
//       const fullText = document.getText();

//       // Regex to match console.log and other console functions (like console.debug, etc.)
//       const regex = /console\.(log|debug|info|warn|error)\(.*?\);?/g;

//       // Remove all console.* calls
//       const cleanedText = fullText.replace(regex, '');

//       // Apply the cleaned text back to the editor
//       const edit = new vscode.WorkspaceEdit();
//       edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), cleanedText);
//       await vscode.workspace.applyEdit(edit);

//       vscode.window.showInformationMessage('All console.log statements removed!');
//     }
//   });

//   context.subscriptions.push(disposable);
// }

// export function deactivate() {}

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "RemoveConsoleLogs" is now active!');
  const defaultGlobPatterns = {
    "include": "src/**/*",
    "exclude": "**/node_modules/**"
  };
  let disposable = vscode.commands.registerCommand(
    "extension.removeConsoleLogs",
    async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders;

      if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace is open.");
        return;
      }

      const folderPath = workspaceFolder[0].uri.fsPath;
      const globPatternsFilePath = path.join(folderPath, "adalet.json");
      if (!fs.existsSync(globPatternsFilePath)) {
		try {
			fs.writeFileSync(globPatternsFilePath, JSON.stringify(defaultGlobPatterns, null, 2));
			vscode.window.showInformationMessage('adalet.json file created with default patterns.');
		  } catch (error) {
			vscode.window.showErrorMessage('Failed to create adalet.json, Please create adalet.json on root of your project');
			return;
		  }
      }

      let globPatterns;
      try {
        const fileContent = fs.readFileSync(globPatternsFilePath, "utf-8");
        globPatterns = JSON.parse(fileContent);
        if (!globPatterns.include ) {
          vscode.window.showErrorMessage(
            'Invalid "include" pattern in adalet.json.'
          );
          return;
        }
        if (!globPatterns.exclude ) {
          vscode.window.showErrorMessage(
            'Invalid "exclude" pattern in adalet.json.'
          );
          return;
        }
      } catch (error) {
        vscode.window.showErrorMessage("Failed to parse adalet.json.");
        return;
      }

      // Use the user-defined Glob patterns to find files
      const includePattern = globPatterns.include;
      const excludePattern = globPatterns.exclude;

       


      try {
        // Find all files based on the provided patterns
        const files = await vscode.workspace.findFiles(
          includePattern,
          excludePattern
        );

        if (files.length === 0) {
          vscode.window.showInformationMessage(
            "No files matched the patterns."
          );
          return;
        }

        let processedFiles = 0;

        for (const file of files) {
          const document = await vscode.workspace.openTextDocument(file);
          const text = document.getText();

          // Remove all console.log statements
          const updatedText = text.replace(/console\.log\(.*?\);?/g, "");

          // If the file content has changed, save the file
          if (updatedText !== text) {
            const edit = new vscode.WorkspaceEdit();
            edit.replace(
              file,
              new vscode.Range(0, 0, document.lineCount, 0),
              updatedText
            );
            await vscode.workspace.applyEdit(edit);
            processedFiles++;
          }
        }

        vscode.window.showInformationMessage(
          `${processedFiles} file(s) processed to remove console.log statements.`
        );
      } catch (err) {
        vscode.window.showErrorMessage("Error while processing files.");
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
