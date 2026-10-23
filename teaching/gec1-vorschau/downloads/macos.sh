#!/bin/bash
# Game Engines & Coding 1 - optionales Installationsskript fuer macOS
#
# Was es tut: installiert die Kursprogramme ueber Homebrew (https://brew.sh).
# Homebrew laedt die Programme von den Seiten der Hersteller.
# Jeder Befehl wird vorher angezeigt und erklaert. Jeder Schritt wird mit j/n bestaetigt.
# Schon installierte Programme werden uebersprungen.
#
# Was es NICHT tut: Homebrew selbst installieren, Konten anlegen, anmelden,
# Lizenzen annehmen. Das passiert mit den Anleitungen 1-5.
#
# Starten (im Terminal, im Ordner dieser Datei):
#   bash macos.sh

UNITY_VERSION="6000.3.15f1"     # aus setup/stack.json (apply_stack.py haelt das aktuell)
UNITY_CHANGESET="c1aa84e375f6"

ask() { read -r -p "$1 [j/n] " a; [[ "$a" =~ ^(j|ja|y|yes)$ ]]; }

show_and_run() { # $1 Erklaerung, $2 Befehl
  echo
  echo "== $1"
  echo "   Befehl: $2"
  if ask "   Ausfuehren?"; then
    bash -c "$2" || echo "   Hat nicht geklappt. Das Programm bitte von Hand installieren (Anleitung 'Downloads & Optionen')."
  else
    echo "   Uebersprungen."
  fi
}

cask() { # $1 Cask-Name, $2 Erklaerung
  if brew list --cask "$1" >/dev/null 2>&1; then
    echo; echo "== $2: schon installiert, uebersprungen."
  else
    show_and_run "$2" "brew install --cask $1"
  fi
}

echo "Kurs-Setup fuer Game Engines & Coding 1 (macOS)"
echo "Unity-Version des Kurses: $UNITY_VERSION"

# 0. Gibt es Homebrew?
if ! command -v brew >/dev/null 2>&1; then
  echo
  echo "Homebrew fehlt. Den Installationsbefehl von https://brew.sh ins Terminal kopieren und ausfuehren,"
  echo "dann die Befehle unter 'Next steps' ausfuehren, das Terminal neu oeffnen und dieses Skript erneut starten."
  exit 1
fi

# 1. Rosetta 2 (nur Apple-Chip). Unity braucht es laut Unity-Doku auch fuer die Apple-Silicon-Version.
if [[ "$(uname -m)" == "arm64" ]] && ! /usr/bin/pgrep -q oahd; then
  show_and_run "Rosetta 2 (Apple-Werkzeug, von Unity benoetigt)" "softwareupdate --install-rosetta --agree-to-license"
fi

# 2a. Pflicht: Git ueber Apples Command Line Tools. Unity laedt das Kurs-Paket per Git.
#     (Nicht Homebrew-Git: Programme aus dem Dock/Unity Hub sehen /opt/homebrew/bin nicht.)
if ! xcode-select -p >/dev/null 2>&1; then
  show_and_run "Git ueber Apples Command Line Tools (Pflicht; Download 10-25 Min, laeuft im Hintergrund weiter)" "xcode-select --install"
else
  echo; echo "== Git (Command Line Tools): schon installiert, uebersprungen."
fi

# 2. Pflichtprogramme
cask unity-hub          "Unity Hub (startet Unity und installiert Editor-Versionen)"
cask github             "GitHub Desktop (Git mit Knoepfen statt Befehlen)"
cask visual-studio-code "Visual Studio Code (Editor fuer C#, mit GitHub Copilot)"

# 3. Unity-Erweiterung fuer VS Code (voller Pfad, weil 'code' noch nicht im PATH ist)
CODE="/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
[[ -x "$CODE" ]] || CODE="code"
show_and_run "Unity-Erweiterung von Microsoft fuer VS Code (holt C# und C# Dev Kit dazu)" "\"$CODE\" --install-extension VisualStudioToolsForUnity.vstuc"

echo
echo "Optional: Claude Code und Codex. Nur noetig fuer einen kostenpflichtigen Agenten im Terminal."

# 5. Optional: KI-Agenten im Terminal (beide kostenpflichtig, siehe 'Downloads & Optionen')
cask claude-code "Claude Code (optional, braucht Claude Pro oder hoeher)"
cask codex       "Codex CLI (optional, braucht ChatGPT Plus oder hoeher)"

# 6. Unity Editor ueber den Hub. Der Link oeffnet den Hub mit genau unserer Version.
echo
echo "Letzter Schritt: Unity $UNITY_VERSION. Vorher den Unity Hub einmal starten und anmelden (Anleitung "Unity installieren", Schritt 2)."
show_and_run "Unity $UNITY_VERSION im Unity Hub installieren (Hub fragt nach Modulen: nichts anhaken; 'Windows Build Support (Mono)' spaeter zu Hause)" "open \"unityhub://$UNITY_VERSION/$UNITY_CHANGESET\""

echo
echo "Fertig. Danach die Anleitungen ab 'Unity installieren' durchgehen und die Checkpoints abhaken."
