<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/vscode-and-agent/ · Stand 2026-10-03T17:03Z · b690772 -->

Dauer: ca. 30 Min

Voraussetzungen: Anleitung 3 (Projekt geöffnet, Setup prüfen ohne Fehler); GitHub-Konto (Anleitung 2)

Checkpunkte:
- [ ] VS Code mit der Erweiterung "Unity" von Microsoft ist installiert
- [ ] In Unity ist Visual Studio Code als External Script Editor eingestellt
- [ ] Ein Doppelklick auf ein C#-Skript öffnet es in VS Code, mit farbigem Code
- [ ] Copilot ist mit dem eigenen GitHub-Konto angemeldet
- [ ] Der Agent hat AGENTS.md gelesen und zusammengefasst
- [ ] Menü „Kurs > Setup prüfen“ zeigt alles OK

Stand: nicht durchgespielt

# VS Code und KI-Agent einrichten

**Visual Studio Code** (kurz VS Code) ist der Editor zum Lesen und Schreiben von C#-Code.
**GitHub Copilot** ist in VS Code eingebaut. Im **Agent-Modus** liest Copilot die Dateien
des Projekts, schlägt Änderungen vor und schreibt sie. Prüfen und entscheiden muss man selbst.

Der Agent ist im Kurs das Arbeitsmittel. Der Ablauf: eine Mechanik genau beschreiben, der Agent <!-- Durchsicht -->
setzt sie um, dann spielen, die Änderung lesen und committen. Damit das funktioniert, muss der
Agent das Projekt sehen können. Das wird hier eingerichtet.

## Schritt 1: VS Code installieren

1. <https://code.visualstudio.com> öffnen und VS Code herunterladen.
   - **Windows:** Installer starten. Bei **Zusätzliche Aufgaben** die Häkchen bei
     **Zu PATH hinzufügen** und **"Mit Code öffnen" … hinzufügen** setzen.
   - **Mac:** Die `.zip` entpacken und **Visual Studio Code** in **Programme** ziehen.
2. VS Code starten.

✅ **Checkpoint:** VS Code ist offen und zeigt die Willkommensseite.

## Schritt 2: Die Unity-Erweiterung installieren

1. Links in der Leiste auf **Extensions** (die vier Quadrate) klicken oder
   Strg+Shift+X (Mac: Cmd+Shift+X) drücken.
2. Nach **Unity** suchen. Den Eintrag **Unity** von **Microsoft** (blauer Haken) wählen.
3. **Install**. Die Erweiterung holt sich **C#** und **C# Dev Kit** automatisch dazu und lädt
   im Hintergrund ein .NET herunter. Das dauert ein, zwei Minuten.

(Screenshot folgt: Zeigt die Erweiterungssuche mit "Unity" von Microsoft, Herausgeber verifiziert, Knopf "Install".)

✅ **Checkpoint:** Unter **Extensions > Installed** stehen **Unity**, **C# Dev Kit** und
**C#**.

## Schritt 3: Unity mit VS Code verbinden

1. In Unity: **Edit > Preferences** (Mac: **Unity > Settings**) > **External Tools**.
2. Bei **External Script Editor**: **Visual Studio Code** auswählen. Steht es nicht in der
   Liste: **Browse…** und VS Code auswählen (Windows meist
   `C:\Users\…\AppData\Local\Programs\Microsoft VS Code\Code.exe`, Mac
   **Programme > Visual Studio Code**).
3. Auf **Regenerate project files** klicken.
4. Das Fenster schließen.

(Screenshot folgt: Zeigt Preferences > External Tools mit "Visual Studio Code" als External Script Editor.)

Test: Im **Project**-Fenster Rechtsklick > **Create > Scripting > MonoBehaviour
Script** (bzw. **Create > C# Script**), Name `Test`. Doppelklick darauf.

✅ **Checkpoint:** VS Code öffnet sich mit `Test.cs`. Der Code ist farbig, und wenn die
Maus über `MonoBehaviour` steht, erscheint eine Erklärung. Fragt VS Code **Do you trust
the authors of the files in this folder?**: **Yes, I trust the authors**.

Das Skript `Test` danach wieder löschen (in Unity: Rechtsklick > **Delete**).

## Schritt 4: Copilot anmelden

1. In VS Code: oben rechts in der Titelleiste auf das **Copilot-Symbol** klicken (bzw. unten
   rechts in der Statusleiste) > **Sign in** / **Use AI features**.
2. **Sign in with GitHub** wählen. Der Browser öffnet sich: anmelden und auf
   **Authorize Visual Studio Code** klicken. Zurück in VS Code bestätigen.
3. Ist der Education-Antrag noch nicht durch, gibt es **Copilot Free**. Das reicht zum
   Start.

**Modellauswahl:** In Copilot Free und Copilot Student steht die Modellauswahl im Chat fest auf
**Auto** – GitHub wählt das Modell selbst. Eine Auswahl wie "Claude" oder "GPT" gibt es in
diesen Plänen seit dem 24.06.2026 nicht mehr. Das ist kein Fehler im eigenen Setup.
(Quelle: GitHub, <https://github.com/orgs/community/discussions/189268>)

**Datenschutz – einmal einstellen:** <https://github.com/settings/copilot> öffnen. Dort gibt
es eine Einstellung, ob GitHub die eigenen Eingaben und Code-Ausschnitte zum Verbessern und
Trainieren seiner Modelle verwenden darf. Wer das nicht möchte, schaltet sie aus.

(Screenshot folgt: Zeigt github.com/settings/copilot mit dem aktuellen Plan (Free oder Student) und der Datenschutz-Einstellung.)

✅ **Checkpoint:** Rechts in VS Code ist die **Chat**-Ansicht offen (sonst: Strg+Alt+I bzw.
Cmd+Ctrl+I). Unten im Eingabefeld ist ein Modus-Schalter zu sehen (**Ask** / **Edit** /
**Agent** o. ä.).

## Schritt 5: Den Agenten zum ersten Mal benutzen

1. Das Projekt in VS Code als Ordner öffnen, falls noch nicht geschehen: In Unity
   **Assets > Open C# Project**. Im Explorer links in VS Code stehen `Assets`, `AGENTS.md`
   usw.
2. Im Chat den Modus auf **Agent** stellen.
3. Eingeben:

   ```
   Lies AGENTS.md und ProjectSettings/ProjectVersion.txt. Fass mir in drei Sätzen zusammen,
   welche Regeln in diesem Projekt gelten und welche Unity-Version es nutzt. Ändere nichts.
   ```

(Screenshot folgt: Zeigt die Chat-Ansicht im Agent-Modus mit der Frage und einer Antwort, die AGENTS.md und 6000.3.25f1 nennt.)

✅ **Checkpoint:** Der Agent antwortet und nennt Unity **6000.3.25f1** und Regeln aus
`AGENTS.md`. In GitHub Desktop steht weiterhin **No local changes** (er hat nichts geändert).

Zum Schluss in Unity **Kurs > Setup prüfen**: Jetzt ist auch **Code-Editor** OK.

✅ **Checkpoint:** **Setup prüfen** zeigt **Alles bereit**.

Fertig. Weiter mit **Erster Commit**.

## Das KI-Verzeichnis

Die Hochschule Macromedia verlangt in jeder Projektarbeit ein **KI-Verzeichnis**: welches
KI-Werkzeug wofür benutzt wurde (KI-Richtlinie vom 28.04.2025). KI ist erlaubt. Wer sie nutzt,
muss sie nur vollständig angeben und die Verantwortung übernehmen. Das Projekt bringt dafür die Datei
`KI-VERZEICHNIS.md` mit. Laut `AGENTS.md` hängt der Agent nach jeder Aufgabe selbst eine Zeile
an und sagt Bescheid. Die Zeile lesen, wenn nötig korrigieren und mit committen. Bei Copilot steht als Modell
„Copilot (Auto)“, weil Copilot Free/Student das Modell selbst wählt. Für die
Abgabe kommt die Tabelle in den Anhang der Dokumentation. Sie ist auch Material für die
Dokumentation selbst: Was wurde gefragt, was übernommen, was verworfen?

## Copilot Student freischalten (später)

Sobald GitHub den Education-Antrag bestätigt (E-Mail), wird Copilot Student meist von
selbst aktiv – das kann nach der Bestätigung noch bis zu drei Tage dauern. Prüfen lässt sich das
unter <https://github.com/settings/copilot>. In VS Code einmal abmelden und neu anmelden
(Konto-Symbol unten links), falls VS Code noch Free anzeigt.

## Wenn es nicht klappt

**Doppelklick auf ein Skript öffnet einen anderen Editor (z. B. Visual Studio oder Notepad).**
Schritt 3 nochmal. Wichtig ist **Regenerate project files**.

**Der Code in VS Code ist nicht farbig, oder es gibt keine Erklärungen beim Drüberfahren.**
VS Code hat das Projekt nicht als C#-Projekt erkannt.

1. Das Projekt aus Unity heraus öffnen (**Assets > Open C# Project**), nicht irgendwo über
   **Datei > Ordner öffnen**.
2. Unten in VS Code nachsehen: **Ausgabe** (Output) > im Auswahlfeld **C# Dev Kit** bzw. **C#**.
   Steht dort etwas von .NET, das nicht installiert werden konnte: VS Code neu starten, Internet
   prüfen.
3. In Unity: **Window > Package Manager** > **In Project** – ist **Visual Studio Editor**
   installiert? Wenn nicht: installieren (gleiches Paket, auch für VS Code).

**VS Code fragt nach Anmeldung bei C# Dev Kit / Microsoft-Konto.**
Für Studierende ist C# Dev Kit kostenlos. Wegklicken geht meist; sonst mit einem Microsoft-
Konto anmelden.

**Im Chat gibt es keinen Agent-Modus.**
VS Code aktualisieren: **Hilfe > Nach Updates suchen** (Mac: **Code > Nach Updates suchen**).

**"You've reached your monthly limit" / Copilot antwortet nicht mehr.**
Copilot Free hat ein Monatskontingent. Ist der Education-Antrag durch, gibt es mehr
(siehe oben). Bis dahin: Fragen bündeln, genauer formulieren, und Jonas Bescheid geben.

**Der Agent will einen Befehl im Terminal ausführen und fragt um Erlaubnis.**
Nur erlauben, was man versteht. Im Zweifel den Agenten fragen: "Was macht dieser Befehl, und was passiert,
wenn ich ablehne?" Befehle, die Dateien löschen oder "git reset" / "git push --force"
enthalten, ablehnen.

**Der Agent kennt die Regeln aus AGENTS.md nicht, obwohl die Datei im Projektordner liegt.**
VS Code-Einstellungen öffnen (Strg+, bzw. Cmd+,), nach `useAgentsMdFile` suchen und
**Chat: Use Agents Md File** anhaken. Chat neu starten.

**Der Agent sagt, er findet AGENTS.md nicht.**
In VS Code ist ein falscher Ordner offen. Links im Explorer muss ganz oben der
Projektordner stehen (mit `Assets` darin). **Datei > Ordner öffnen** > den Projektordner.
