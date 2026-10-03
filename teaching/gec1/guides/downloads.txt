<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/downloads/ · Stand 2026-10-03T16:36Z · a410945 -->

Dauer: 5 Min lesen

Checkpunkte:
- [ ] Klar ist, welche Programme Pflicht sind und welche optional
- [ ] Klar ist, welcher KI-Agent genutzt wird (mindestens Copilot)
- [ ] Entschieden ist, ob von Hand oder mit dem Installationsskript installiert wird

Stand: nicht durchgespielt

# Downloads & Optionen

Im Kurs am 09.10. richten alle gemeinsam ein – die Reihenfolge steht in **Setup im Kurs**.
Diese Seite ist das Nachschlagewerk: alle Links, Größen und Optionen.

Alle Links auf dieser Seite führen zu den offiziellen Seiten der Hersteller. Nichts von
anderen Seiten herunterladen, auch wenn sie in der Suchmaschine weiter oben stehen.

## Pflicht: das brauchen alle

| Programm | Windows | Mac | Anleitung |
|---|---|---|---|
| Unity Hub | <https://unity.com/download> | <https://unity.com/download> | 1 |
| Unity 6000.3.25f1 | Link `unityhub://6000.3.25f1/e1dba0a9aba4` (öffnet den Hub) | gleicher Link; Modul **Windows Build Support (Mono)** erst zu Hause (vor der Abgabe) | 1 |
| GitHub Desktop | <https://desktop.github.com> | <https://desktop.github.com> | 2 |
| Visual Studio Code | <https://code.visualstudio.com/download> | <https://code.visualstudio.com/download> | 4 |
| Unity-Erweiterung für VS Code | [Marketplace: Unity (Microsoft)](https://marketplace.visualstudio.com/items?itemName=VisualStudioToolsForUnity.vstuc) – in VS Code nach "Unity" suchen | wie Windows | 4 |
| GitHub Copilot | in VS Code eingebaut, Anmeldung mit GitHub | wie Windows | 4 |
| Rosetta 2 | – | nur Apple-Chip (M1 …): `softwareupdate --install-rosetta --agree-to-license` | 1 |

Unity braucht ein kostenloses **Unity-Konto**, GitHub ein kostenloses **GitHub-Konto**.

Download-Größen (Unity 6000.3.25f1, laut Unity): Editor Windows ca. **4,2 GB**, Mac ca.
**5,2 GB**; Windows-Build-Modul für den Mac ca. 0,4 GB; Visual Studio Community (unter Windows
**abwählen**) 1,7 GB. Installiert braucht Unity ca. 8–10 GB.

## Optional: Git und ein zweiter KI-Agent

| Programm | Wofür | Windows | Mac |
|---|---|---|---|
| Git (Kommandozeile) | Damit ein KI-Agent im Terminal Commits machen kann. GitHub Desktop bringt zwar Git mit, aber nur für den eigenen Gebrauch. | <https://git-scm.com/downloads/win> | im Terminal `xcode-select --install` (Apple-Entwicklerwerkzeuge, enthält Git) oder <https://git-scm.com/downloads/mac> |
| Claude Code | KI-Agent von Anthropic, **kostenpflichtig** (Claude Pro oder höher) | [Installationsanleitung](https://code.claude.com/docs/en/setup) | gleiche Seite |
| Codex | KI-Agent von OpenAI, mit ChatGPT-Konto. Im Terminal und in VS Code ab **ChatGPT Plus**; mit Free/Go nur in der ChatGPT-Desktop-App und nur, wo schon freigeschaltet | [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) | gleiche Seite |

## Welcher KI-Agent passt?

| Wer … | nimmt | Kosten | Anleitung |
|---|---|---|---|
| nichts bezahlen will | **GitHub Copilot** in VS Code (Pflicht für alle) | 0 € (Free, mit Studierendennachweis Copilot Student) | 4 |
| schon ChatGPT Plus hat oder bereit ist, dafür zu zahlen | zusätzlich **Codex** | Plus 20 $/Monat (Free/Go: nur Desktop-App, eingeschränkt) | Claude Code und Codex |
| schon Claude Pro hat oder bereit ist, dafür zu zahlen | zusätzlich **Claude Code** | Pro 20 $/Monat (17 $ bei Jahreszahlung), zzgl. MwSt. | Claude Code und Codex |

Jonas arbeitet selbst mit Claude Code und Codex. Der Vorteil gegenüber Copilot im Kurs: Git
lässt sich an den Agenten abgeben ("committe das mit einer passenden Nachricht"), statt jeden
Schritt in GitHub Desktop selbst zu klicken. Pflicht ist das nicht. Alles im Kurs geht auch mit
Copilot und GitHub Desktop.

Preise laut Herstellerseiten am 03.10.2026: [Claude](https://claude.com/pricing),
[ChatGPT/Codex](https://learn.chatgpt.com/docs/pricing),
[Copilot](https://github.com/features/copilot/plans). Sie ändern sich oft – vor dem Bezahlen
nachsehen.

## Von Hand oder mit Skript?

| Weg | Für wen | Wie |
|---|---|---|
| **Von Hand** (empfohlen bei Unsicherheit) | alle | Anleitungen 1–5 der Reihe nach, Links oben |
| **Installationsskript** (optional) | wer ein Terminal öffnen kann und Zeit sparen will | Windows: [windows.ps1](https://www.allknivesnobagel.com/teaching/gec1/downloads/windows.ps1) (nutzt **winget**), Mac: [macos.sh](https://www.allknivesnobagel.com/teaching/gec1/downloads/macos.sh) (nutzt **Homebrew**) |

Das Skript installiert nur Pakete aus den offiziellen Paketquellen (winget bzw. Homebrew), die
auf die Downloads der Hersteller zeigen. Es zeigt jeden Befehl an, erklärt ihn und fragt vor
jedem Schritt nach. Konten anlegen, anmelden und die Unity-Lizenz bleiben trotzdem Handarbeit –
also danach trotzdem die Anleitungen durchgehen und die Checkpoints abhaken.

### Windows-Skript benutzen

1. Prüfen, ob winget vorhanden ist: **Start** > "PowerShell" öffnen > `winget --version` eingeben.
   Kommt eine Versionsnummer: gut. Kommt ein Fehler: Im **Microsoft Store** die App
   **App Installer** installieren bzw. aktualisieren, PowerShell neu öffnen.
2. Das Skript herunterladen: <https://www.allknivesnobagel.com/teaching/gec1/downloads/windows.ps1>
   **Vor dem Starten lesen.** Die Datei mit einem Texteditor öffnen (Rechtsklick >
   **Öffnen mit** > Editor). Sie ist kurz und kommentiert. Nie ein Skript ausführen, das man
   nicht gelesen hat – auch nicht von einer Kursseite.
3. In PowerShell, im Ordner der Datei (meist **Downloads**: `cd $HOME\Downloads`):

   ```
   powershell -ExecutionPolicy Bypass -File .\windows.ps1
   ```

   `-ExecutionPolicy Bypass` erlaubt genau dieses eine Skript, ohne Windows dauerhaft
   umzustellen.

### Mac-Skript benutzen

1. Prüfen, ob Homebrew vorhanden ist: **Terminal** öffnen > `brew --version`. Fehlt es: Den
   Installationsbefehl von <https://brew.sh> kopieren und im Terminal ausführen (er fragt nach
   dem Mac-Passwort – das ist normal).
2. Das Skript herunterladen: <https://www.allknivesnobagel.com/teaching/gec1/downloads/macos.sh>
   **Vor dem Starten lesen.** Die Datei mit TextEdit öffnen. Sie ist kurz und kommentiert.
   Nie ein Skript ausführen, das man nicht gelesen hat – auch nicht von einer Kursseite.
3. Im Terminal, im Ordner der Datei (meist **Downloads**: `cd ~/Downloads`):

   ```
   bash macos.sh
   ```

## Wenn es nicht klappt

**winget: "Der Begriff 'winget' wurde nicht erkannt".**
App Installer fehlt oder ist veraltet. Microsoft Store > **App Installer** > Aktualisieren.
Auf Hochschul- oder Firmenrechnern ist winget manchmal gesperrt – dann von Hand installieren.

**Das Skript bricht bei einem Programm ab.**
Kein Problem: Dieses eine Programm über den Link oben von Hand installieren und das Skript
erneut starten. Schon Installiertes überspringt es.

**Homebrew: "command not found: brew" direkt nach der Installation.**
Homebrew zeigt am Ende zwei, drei Befehle unter **Next steps** an (sie tragen brew in die
Shell ein). Diese ausführen, Terminal neu öffnen.
