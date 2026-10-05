<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/install-git/ · Stand 2026-10-05T13:39Z · 21cef83 -->

Dauer: Windows ca. 5 Min; Mac 10–25 Min (läuft im Hintergrund)

Voraussetzungen: Rechte, Programme zu installieren

Checkpunkte:
- [ ] Im Terminal (Windows: PowerShell) zeigt "git --version" eine Versionsnummer

Stand: nicht durchgespielt

# Git installieren

Unity lädt das Kurs-Paket (Menü **Kurs > Setup prüfen**, Spieler-Controller und Kit)
direkt aus einem Git-Repository. Dafür muss **Git** als eigenes Programm installiert sein.
GitHub Desktop bringt zwar ein Git mit, aber nur für sich selbst – Unity findet es nicht. Ohne
Git öffnet sich das Kursprojekt mit dem Fehler _„No 'git' executable was found“_. KI-Agenten im
Terminal (Claude Code, Codex) brauchen Git ebenfalls.

**Im Kurs:** Diese Anleitung kommt **zuerst**, noch vor dem Unity Hub. Unter Windows ist sie in
fünf Minuten erledigt. Am Mac startet der Download, und während er läuft, geht es mit
[Unity installieren](../install-unity/) weiter.

## Windows: Git für Windows

1. <https://git-scm.com/downloads/win> öffnen. Der Download startet (sonst auf **Click here to
   download** klicken).
2. Die heruntergeladene Datei `Git-…-64-bit.exe` starten. Windows fragt **Möchten Sie zulassen,
   dass durch diese App Änderungen …?** – **Ja**.
3. Durch alle Seiten mit **Next** klicken, **nichts ändern**, am Ende **Install** und **Finish**.
   Wichtig ist nur die Seite _Adjusting your PATH environment_: Dort muss der vorausgewählte
   Punkt **Git from the command line and also from 3rd-party software** stehen bleiben.

(Screenshot folgt: Zeigt die Installer-Seite "Adjusting your PATH environment" mit dem vorausgewählten mittleren Punkt.)

4. **Start** > „PowerShell“ öffnen (ein **neues** Fenster) und eingeben:

   ```
   git --version
   ```

✅ **Checkpoint:** Es erscheint eine Zeile wie `git version 2.5…windows.1`.

**Wichtig:** Lief der Unity Hub schon, bevor Git installiert wurde, kennt er Git noch nicht.
Dann den Hub einmal ganz beenden (Symbol unten rechts in der Taskleiste > **Quit**) und neu
starten – aber erst, wenn kein Unity-Download mehr läuft.

## Mac: Command Line Tools von Apple

Apple liefert Git mit den **Command Line Tools** (Entwicklerwerkzeuge, ohne das große Xcode).

1. Das Programm **Terminal** öffnen (Spotlight: Cmd+Leertaste, „Terminal“).

2. Eingeben:

   ```
   xcode-select --install
   ```

3. Ein Fenster fragt, ob die Command Line Tools installiert werden sollen: **Installieren**,
   dann den Lizenzbedingungen zustimmen. Der Download dauert je nach WLAN 10–25 Minuten.
   **Im Kurs: nicht warten**, sondern mit [Unity installieren](../install-unity/) weitermachen.
   Das Fenster meldet sich, wenn es fertig ist.

4. Wenn es fertig ist, im Terminal eingeben:

   ```
   git --version
   ```

✅ **Checkpoint:** Es erscheint eine Zeile wie `git version 2.39.5 (Apple Git-154)`.

Steht dort stattdessen _„xcode-select: note: install requested …“_ oder öffnet sich wieder das
Installationsfenster, sind die Command Line Tools noch nicht fertig.

Warum nicht Git über Homebrew? Programme, die aus dem Dock oder dem Unity Hub starten, sehen
Homebrew-Programme nicht. Das Git der Command Line Tools sehen sie.

## Wenn es nicht klappt

**Windows: „git“ wird in PowerShell nicht erkannt.**
Das PowerShell-Fenster war schon offen, bevor Git installiert war. Ein neues öffnen. Hilft das
nicht: Den Installer erneut starten und auf der Seite _Adjusting your PATH environment_ prüfen,
dass der mittlere Punkt gewählt ist.

**Windows: Unity meldet „No 'git' executable was found“, obwohl git --version funktioniert.**
Der Unity Hub lief schon vor der Git-Installation. Hub ganz beenden (Taskleiste > **Quit**),
neu starten, Projekt neu öffnen.

**Mac: „xcode-select: error: command line tools are already installed“.**
Gut – Git ist schon da. `git --version` prüfen.

**Mac: Der Download der Command Line Tools bricht ab oder hängt.**
Später erneut `xcode-select --install` eingeben. Alternativ die Command Line Tools von
<https://developer.apple.com/download/all/> laden (Apple-Konto nötig).

**Firmen- oder Hochschulrechner ohne Installationsrechte.**
Jonas Bescheid sagen. Ohne Git lässt sich das Kursprojekt nicht öffnen.
