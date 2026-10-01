Option Explicit
Dim readerShell, readerFiles, projectFolder, result
Set readerShell = CreateObject("WScript.Shell")
Set readerFiles = CreateObject("Scripting.FileSystemObject")
projectFolder = readerFiles.GetParentFolderName(WScript.ScriptFullName)
result = readerShell.Run("node " & Chr(34) & projectFolder & "\reader\start-reader.mjs" & Chr(34), 0, True)
If result <> 0 Then
  MsgBox "The book reader could not start. Please ask for help with the reader. The book's Markdown files have not been changed.", 48, "Victoria book reader"
End If
