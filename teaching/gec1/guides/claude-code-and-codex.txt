<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/claude-code-and-codex/ · Stand 2026-10-03T16:41Z · a49d988 -->

Dauer: ca. 20 Min pro Agent

Voraussetzungen: Anleitung 3 (Projekt geöffnet, Setup prüfen ohne Fehler); Für Claude Code ein Claude-Abo (Pro oder höher); Für Codex ein ChatGPT-Abo (Plus oder höher)

Checkpunkte:
- [ ] git --version zeigt im Terminal eine Versionsnummer
- [ ] Der Agent startet im Projektordner und ist angemeldet
- [ ] Der Agent hat AGENTS.md gelesen und zusammengefasst, ohne etwas zu ändern
- [ ] Der Agent hat auf Anfrage einen Commit gemacht, und GitHub Desktop zeigt ihn in History

Stand: nicht durchgespielt

# Claude Code und Codex (optional)

**Copilot in VS Code (Anleitung 4) reicht für den ganzen Kurs.** Diese Anleitung ist für alle,
die zusätzlich einen der beiden Agenten nutzen wollen, mit denen Jonas selbst arbeitet:
**Claude Code** (Anthropic) oder **Codex** (OpenAI). Beide kosten Geld.

Der Vorteil: Beide laufen im **Terminal** im Projektordner und können dort auch **Git**
bedienen. Statt in GitHub Desktop jede Datei anzuklicken, genügt ein Satz wie "Committe das mit
einer passenden Nachricht", und der Agent zeigt, was er committen will. Den Diff muss man
trotzdem selbst lesen – dafür bleibt GitHub Desktop das Werkzeug.

| | Claude Code | Codex |
|---|---|---|
| Hersteller | Anthropic | OpenAI |
| Nötiges Abo | Claude **Pro**, Max, Team oder Enterprise. Das kostenlose Claude-Konto reicht **nicht**. | ChatGPT **Plus** oder höher für Terminal und VS Code. Mit Free/Go nur in der ChatGPT-Desktop-App, und nur, wo schon freigeschaltet. |
| Preis (Herstellerseite, 03.10.2026) | Pro: 20 $/Monat, 17 $/Monat bei Jahreszahlung, zzgl. MwSt. | Plus: 20 $/Monat; Go: 8 $/Monat |
| Liest Regeln aus | `CLAUDE.md` (in der Kursvorlage holt sie `AGENTS.md` dazu) | `AGENTS.md` |
| Offizielle Anleitung | <https://code.claude.com/docs/en/setup> | <https://learn.chatgpt.com/docs/codex/cli> |

Quellen: [Claude-Preise](https://claude.com/pricing),
[ChatGPT-/Codex-Preise](https://learn.chatgpt.com/docs/pricing). Preise ändern sich – vor dem
Bezahlen nachsehen.

## Schritt 1: Git für die Kommandozeile

GitHub Desktop bringt Git mit, aber nur für sich selbst. Ein Agent im Terminal braucht Git als
eigenes Programm.

- **Windows:** Git für Windows von <https://git-scm.com/downloads/win> installieren. Im
  Installer alle Vorschläge übernehmen. (Mit winget: `winget install --id Git.Git --exact`.)
- **Mac:** Terminal öffnen und `xcode-select --install` eingeben. Ein Fenster bietet die
  "Command Line Tools" an: **Installieren**. Darin ist Git.

Danach ein **neues** Terminal (Windows: PowerShell) öffnen und eingeben:

```
git --version
```

✅ **Checkpoint:** Eine Zeile wie `git version 2.…` erscheint.

## Schritt 2: Terminal im Projektordner öffnen

Am einfachsten über GitHub Desktop: **Repository > Open in Command Prompt** (Windows; je nach
Einstellung PowerShell) bzw. **Repository > Open in Terminal** (Mac). Das Terminal startet dann
direkt im Projektordner.

Zur Kontrolle `dir` (Windows) bzw. `ls` (Mac) eingeben.

✅ **Checkpoint:** Es erscheinen `Assets`, `Packages`, `ProjectSettings` und `AGENTS.md`.

Ab hier entweder **Claude Code** (Schritt 3) oder **Codex** (Schritt 4) – oder beide.

## Schritt 3: Claude Code

### Installieren

Die offiziellen Befehle (Stand 03.10.2026, <https://code.claude.com/docs/en/setup>):

- **Windows (PowerShell):** `irm https://claude.ai/install.ps1 | iex`
  – oder mit winget: `winget install Anthropic.ClaudeCode`
- **Mac:** `curl -fsSL https://claude.ai/install.sh | bash`
  – oder mit Homebrew: `brew install --cask claude-code`

Admin-Rechte sind dafür nicht nötig. Danach ein **neues** Terminal im Projektordner öffnen
(Schritt 2) und prüfen:

```
claude --version
```

### Anmelden und starten

Im Projektordner eingeben:

```
claude
```

Beim ersten Start öffnet sich der Browser. Mit dem Claude-Konto anmelden (dem mit dem
Pro-Abo) und bestätigen. Zurück im Terminal fragt Claude Code eventuell, ob man dem Ordner
vertraut: Ja.

**Wichtig – den Modus einstellen:** Claude Code startet in neuen Versionen im **Auto-Modus**.
Darin entscheidet ein zweites KI-Modell, welche Aktionen ohne Rückfrage laufen. Für den Anfang
ist es besser, jede Änderung selbst zu sehen. **Shift+Tab** drücken, bis unten **Manual** (bzw.
"default") steht. Dann fragt Claude Code vor jeder Dateiänderung und jedem Befehl.
(Quelle: <https://code.claude.com/docs/en/permission-modes>)

> **\[Screenshot: claude-code-start.png]** Zeigt Claude Code im Terminal nach dem Start im
> Projektordner, unten die Modusanzeige auf Manual.

✅ **Checkpoint:** Claude Code zeigt ein Eingabefeld und unten den Modus **Manual**.

### Erste Frage – nur lesen

```
Lies AGENTS.md und ProjectSettings/ProjectVersion.txt. Fass mir in drei Sätzen zusammen,
welche Regeln in diesem Projekt gelten und welche Unity-Version es nutzt. Ändere nichts.
```

✅ **Checkpoint:** Die Antwort nennt Unity **6000.3.25f1** und Regeln aus `AGENTS.md`.
GitHub Desktop zeigt weiterhin **No local changes**.

Weiter mit **Schritt 5: Der erste Commit durch den Agenten**.

## Schritt 4: Codex

### Installieren

Die offiziellen Befehle (Stand 03.10.2026, <https://learn.chatgpt.com/docs/codex/cli>):

- **Windows (PowerShell):**
  `powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"`
- **Mac:** `curl -fsSL https://chatgpt.com/codex/install.sh | sh`
  – oder mit Homebrew: `brew install --cask codex`

Codex läuft auf Windows direkt in PowerShell, WSL ist nicht nötig. Danach ein **neues**
Terminal im Projektordner öffnen (Schritt 2) und prüfen:

```
codex --version
```

### Anmelden und starten

Im Projektordner eingeben:

```
codex
```

**Sign in with ChatGPT** wählen und im Browser mit dem ChatGPT-Konto anmelden. Zurück im
Terminal fragt Codex eventuell, ob man dem Ordner vertraut: Ja.

**Der Modus:** Codex darf standardmäßig im Projektordner lesen, Dateien ändern und Befehle
ausführen, und fragt nach, wenn es darüber hinaus will. Für die ersten Schritte Codex
vorsichtiger einstellen: `/permissions` eingeben und **Read-only** wählen. Für den Commit in
Schritt 5 wieder auf **Auto** stellen – dann fragt Codex vor dem Commit nach.
(Quelle: <https://learn.chatgpt.com/docs/agent-approvals-security.md>)

> **\[Screenshot: codex-start.png]** Zeigt Codex im Terminal nach dem Start im Projektordner,
> mit dem Menü von /permissions.

✅ **Checkpoint:** Codex zeigt ein Eingabefeld und ist angemeldet.

### Erste Frage – nur lesen

```
Lies AGENTS.md und ProjectSettings/ProjectVersion.txt. Fass mir in drei Sätzen zusammen,
welche Regeln in diesem Projekt gelten und welche Unity-Version es nutzt. Ändere nichts.
```

✅ **Checkpoint:** Die Antwort nennt Unity **6000.3.25f1** und Regeln aus `AGENTS.md`.
GitHub Desktop zeigt weiterhin **No local changes**.

## Schritt 5: Der erste Commit durch den Agenten

Gleicher Ablauf für Claude Code und Codex.

1. In Unity eine kleine Änderung machen: In der Szene eine **Sphere** hinzufügen
   (Hierarchy > Rechtsklick > **3D Object > Sphere**) und **speichern**.

2. Dem Agenten schreiben:

   ```
   Zeig mir mit git status und git diff --stat, was sich seit dem letzten Commit geändert
   hat, und erklär es in einem Satz. Dann committe genau diese Änderung mit einer kurzen
   deutschen Commit-Nachricht. Nicht pushen.
   ```

3. Der Agent will Befehle ausführen (`git status`, `git diff`, `git add`, `git commit`) und
   fragt nach. Jeden Befehl vor dem Zustimmen lesen:
   - `git status`, `git diff`, `git add`, `git commit`: in Ordnung.
   - `git push`: nur, wenn es gewollt ist (hier: ablehnen, im Prompt steht "nicht pushen").
   - `git reset --hard`, `git push --force`, `git clean`, alles mit Löschen: **ablehnen**.

4. In **GitHub Desktop** nachsehen: Reiter **History**.

> **\[Screenshot: agent-commit-history.png]** Zeigt GitHub Desktop, History, oben der Commit
> mit der Nachricht des Agenten; rechts der Diff der Szenendatei.

✅ **Checkpoint:** In GitHub Desktop steht der neue Commit oben in **History**. Oben rechts
zeigt GitHub Desktop **Push origin** mit einer 1 – der Commit ist noch nicht hochgeladen. Hochgeladen
wird von Hand mit **Push origin**, wenn das Ergebnis passt.

Das ist die Arbeitsweise im Kurs: Der Agent darf committen, aber was er committet hat, wird in
GitHub Desktop gelesen.

**Warum der Agent nicht selbst pusht:** In `AGENTS.md` steht, dass der Agent nur pusht, wenn
man ihn ausdrücklich darum bittet. Der Grund: Man bleibt selbst in der Schleife, bis man versteht, wann <!-- Durchsicht -->
es klug ist, einem Agenten das Steuer zu überlassen. Zustimmen und aushandeln kann man nur
eine Zusammenarbeit, die man versteht. Wer weiß, was ein Push bewirkt und was man dabei
abgibt, kann später selbst entscheiden, wie viel man dem Agenten überlässt. Rückgängig machen geht wie immer: In GitHub Desktop **History** >
Rechtsklick auf den Commit > **Revert changes in commit**, oder den Agenten bitten: "Mach den
letzten Commit mit git revert rückgängig."

## Das KI-Verzeichnis

Die Hochschule Macromedia verlangt in jeder Projektarbeit ein **KI-Verzeichnis**: welches
KI-Werkzeug wofür benutzt wurde (KI-Richtlinie vom 28.04.2025). KI ist erlaubt. Wer sie nutzt,
muss sie nur vollständig angeben und die Verantwortung übernehmen. Das Projekt bringt dafür die Datei
`KI-VERZEICHNIS.md` mit. Laut `AGENTS.md` hängt der Agent nach jeder Aufgabe selbst eine Zeile
an und sagt Bescheid. Die Zeile lesen, wenn nötig korrigieren und mit committen. Für die
Abgabe kommt die Tabelle in den Anhang der Dokumentation. Sie ist auch Material für die
Dokumentation selbst: Was wurde gefragt, was übernommen, was verworfen?

## Wenn es nicht klappt

**"claude" bzw. "codex" wird nicht erkannt / command not found.**
Das Terminal war schon vor der Installation offen. Neues Terminal öffnen. Hilft das nicht:
Für Claude Code `claude doctor` ausprobieren bzw. die Fehlerhilfe auf
<https://code.claude.com/docs/en/troubleshoot-install> lesen.

**Windows: "irm wird nicht erkannt" oder "Das Token '&&' ist kein gültiges Anweisungstrennzeichen".**
Das falsche Terminal ist offen. `irm …` gehört in **PowerShell**, Befehle mit `&&` in die
**Eingabeaufforderung (CMD)**. Vorne im Terminal steht `PS C:\…` bei PowerShell.

**Claude Code: "Your account does not have access to Claude Code" o. ä.**
Das kostenlose Claude-Konto enthält Claude Code nicht. Nötig ist Pro oder höher – oder bei
Copilot bleiben.

**Codex: Nach der Anmeldung kommt eine Meldung zum Plan oder Limit.**
Mit ChatGPT Free/Go gibt es Codex im Terminal nicht. Nötig ist Plus – oder bei
Copilot bleiben.

**Der Agent sagt "not a git repository".**
Das Terminal ist im falschen Ordner. Schritt 2 nochmal, über GitHub Desktop.

**Der Agent sagt "git: command not found".**
Schritt 1 fehlt oder das Terminal war schon vorher offen. Neues Terminal öffnen.

**Der Agent hat etwas committet, das nicht gewollt war.**
Noch nicht gepusht? In GitHub Desktop **History** > Rechtsklick auf den Commit > **Undo commit**
(nur beim obersten Commit möglich). Die Änderungen stehen dann wieder unter **Changes**, und
es kann neu entschieden werden.

**Der Agent will `git push --force` oder `git reset --hard` ausführen.**
Ablehnen. Dem Agenten schreiben, dass das in diesem Projekt verboten ist (steht auch in `AGENTS.md`).
