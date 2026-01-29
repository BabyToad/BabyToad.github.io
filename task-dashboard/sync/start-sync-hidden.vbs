' Task Dashboard Sync - Runs hidden on Windows startup
' Place shortcut to this file in shell:startup

Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd /d ""H:\Personal Projects\BabyToad.github.io\task-dashboard"" && node sync/sync.js --watch", 0, False
