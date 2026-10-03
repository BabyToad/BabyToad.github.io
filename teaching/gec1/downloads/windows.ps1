# Game Engines & Coding 1 - optionales Installationsskript fuer Windows
#
# Was es tut: installiert die Kursprogramme ueber winget, den Paketmanager von Microsoft.
# winget laedt die Programme von den Seiten der Hersteller (Pakete aus microsoft/winget-pkgs).
# Jeder Befehl wird vorher angezeigt und erklaert. Jeder Schritt wird mit j/n bestaetigt.
# Schon installierte Programme werden uebersprungen.
#
# Was es NICHT tut: Konten anlegen, anmelden, Lizenzen annehmen, Einstellungen aendern.
# Das passiert danach mit den Anleitungen 1-5.
#
# Starten (in PowerShell, im Ordner dieser Datei):
#   powershell -ExecutionPolicy Bypass -File .\windows.ps1
# "-ExecutionPolicy Bypass" gilt nur fuer diesen einen Aufruf.

$UnityVersion   = "6000.3.25f1"   # aus setup/stack.json (apply_stack.py haelt das aktuell)
$UnityChangeset = "e1dba0a9aba4"

function Ask($question) {
    $answer = Read-Host "$question [j/n]"
    return $answer -match '^(j|ja|y|yes)$'
}

function Show-And-Run($explanation, $command) {
    Write-Host ""
    Write-Host "== $explanation" -ForegroundColor Cyan
    Write-Host "   Befehl: $command" -ForegroundColor Yellow
    if (Ask "   Ausfuehren?") {
        Invoke-Expression $command
        if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne $null) {
            Write-Host "   Hat nicht geklappt (Code $LASTEXITCODE). Das Programm bitte von Hand installieren (Anleitung 'Downloads & Optionen')." -ForegroundColor Red
        }
    } else {
        Write-Host "   Uebersprungen."
    }
}

function Winget-Install($id, $explanation) {
    $installed = winget list --id $id --exact --accept-source-agreements 2>$null | Select-String -SimpleMatch $id
    if ($installed) {
        Write-Host ""
        Write-Host "== $explanation : schon installiert, uebersprungen." -ForegroundColor Green
        return
    }
    # --exact: genau dieses Paket, --source winget: nur die offizielle winget-Quelle.
    # Lizenzbedingungen fragt winget selbst ab.
    Show-And-Run $explanation "winget install --id $id --exact --source winget"
}

Write-Host "Kurs-Setup fuer Game Engines & Coding 1 (Windows)" -ForegroundColor Cyan
Write-Host "Unity-Version des Kurses: $UnityVersion"

# 0. Gibt es winget?
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "winget fehlt. Im Microsoft Store die App 'App Installer' installieren:" -ForegroundColor Red
    Write-Host "  https://apps.microsoft.com/detail/9nblggh4nns1"
    Write-Host "Dann PowerShell neu oeffnen und dieses Skript erneut starten."
    exit 1
}

# 1. Pflichtprogramme. Git zuerst: Unity laedt das Kurs-Paket per Git, und der Unity Hub
#    sieht Git nur, wenn Git vor dem Hub installiert wurde (sonst Hub neu starten).
Winget-Install "Git.Git"                    "Git fuer Windows (Pflicht: Unity laedt das Kurs-Paket per Git)"
Winget-Install "Unity.UnityHub"             "Unity Hub (startet Unity und installiert Editor-Versionen)"
Winget-Install "GitHub.GitHubDesktop"       "GitHub Desktop (Git mit Knoepfen statt Befehlen)"
Winget-Install "Microsoft.VisualStudioCode" "Visual Studio Code (Editor fuer C#, mit GitHub Copilot)"

# 2. Unity-Erweiterung fuer VS Code. "code" ist direkt nach der Installation noch nicht im PATH,
#    darum der volle Pfad der Benutzerinstallation.
$code = Join-Path $env:LOCALAPPDATA "Programs\Microsoft VS Code\bin\code.cmd"
if (-not (Test-Path $code)) { $code = "code" }
Show-And-Run "Unity-Erweiterung von Microsoft fuer VS Code (holt C# und C# Dev Kit dazu)" "& `"$code`" --install-extension VisualStudioToolsForUnity.vstuc"

# 3. Optional: KI-Agenten im Terminal (beide kostenpflichtig)
Write-Host ""
Write-Host "Optional: Claude Code und Codex. Nur noetig fuer einen kostenpflichtigen Agenten im Terminal."

# 4. Optional: KI-Agenten im Terminal (beide kostenpflichtig, siehe 'Downloads & Optionen')
Winget-Install "Anthropic.ClaudeCode" "Claude Code (optional, braucht Claude Pro oder hoeher)"
if (-not (Get-Command codex -ErrorAction SilentlyContinue)) {
    # OpenAI dokumentiert fuer Windows dieses Installationsskript (nicht winget).
    Show-And-Run "Codex CLI (optional, braucht ChatGPT Plus oder hoeher) - offizielles Skript von chatgpt.com" "powershell -ExecutionPolicy ByPass -c `"irm https://chatgpt.com/codex/install.ps1 | iex`""
}

# 5. Unity Editor ueber den Hub. Der Link oeffnet den Hub mit genau unserer Version.
Write-Host ""
Write-Host "Letzter Schritt: Unity $UnityVersion. Vorher den Unity Hub einmal starten und anmelden (Anleitung "Unity installieren", Schritt 2)."
Show-And-Run "Unity $UnityVersion im Unity Hub installieren (Hub fragt nach Modulen: Visual Studio Community abwaehlen, spart 1,7 GB)" "Start-Process `"unityhub://$UnityVersion/$UnityChangeset`""

Write-Host ""
Write-Host "Fertig. Danach die Anleitungen ab 'Unity installieren' durchgehen und die Checkpoints abhaken." -ForegroundColor Green
