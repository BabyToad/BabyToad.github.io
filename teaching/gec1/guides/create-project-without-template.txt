<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/create-project-without-template/ · Stand 2026-10-04T09:03Z · 033fe2a -->

Dauer: ca. 30 Min

Voraussetzungen: Git ist installiert (Git installieren); Unity 6000.3.15f1 ist installiert (Unity installieren); GitHub-Konto und GitHub Desktop (GitHub einrichten); die Datei kursdateien.zip (von Jonas)

Checkpunkte:
- [ ] Das Projekt liegt in C:\Unity bzw. ~/Unity und wurde mit der Vorlage Universal 3D angelegt
- [ ] GitHub Desktop zeigt das Projekt als Repository mit Unity-.gitignore
- [ ] AGENTS.md, CLAUDE.md, KI-VERZEICHNIS.md, DOKUMENTATION.md und bilder/ liegen im Projekt; das Kurs-Paket ist installiert
- [ ] Das Repository ist privat auf GitHub veröffentlicht
- [ ] Menü „Kurs > Setup prüfen“ zeigt keine Fehler

Stand: nicht durchgespielt

# Projekt ohne Vorlage anlegen (Ersatzweg)

**Diese Anleitung nur verwenden, wenn Jonas es sagt oder die Kursvorlage nicht erreichbar ist.**
Der normale Weg ist [Projekt anlegen](../create-project/) (aus der Kursvorlage). Hier wird von Hand nachgebaut,
was die Vorlage mitbringt. Die heikle Stelle ist Schritt 2: Das Git-Repository muss **genau**
im Projektordner liegen.

## Schritt 1: Projekt im Unity Hub anlegen

1. Einen Ordner `C:\Unity` (Windows) bzw. `~/Unity` (Mac) anlegen – siehe
   [Projekt anlegen](../create-project/), Schritt 1.
2. Unity Hub > **Projects** > **New project**.
3. Oben bei **Editor Version**: **6000.3.15f1** auswählen.
4. Vorlage: **Universal 3D**. (Fehlt das Vorschaubild: auf **Download template** klicken.)
5. Rechts:
   - **Project name:** kurz, ohne Leerzeichen und Umlaute, z. B. `gec1-nachname`
   - **Location:** der Ordner `C:\Unity` bzw. `~/Unity`
   - **Connect to Unity Cloud** und **Use Unity Version Control:** **abwählen**. Der Kurs
     arbeitet mit Git und GitHub.
6. **Create project**. Unity öffnet sich nach einigen Minuten. Unity danach wieder schließen.

(Screenshot folgt: Zeigt den Dialog "New project" mit Editor-Version 6000.3.15f1, Vorlage Universal 3D ausgewählt, Name und Location ausgefüllt, beide Cloud- Häkchen aus.)

✅ **Checkpoint:** Im Ordner `Unity/gec1-nachname` liegen `Assets`, `Packages`,
`ProjectSettings` und `Library`.

## Schritt 2: Den Projektordner zum Git-Repository machen

1. GitHub Desktop > **File > Add local repository**.
2. **Choose…** > den Projektordner `gec1-nachname` auswählen – den, in dem `Assets` liegt.
3. GitHub Desktop sagt: _This directory does not appear to be a Git repository._ Auf den
   Link **create a repository** klicken.
4. Im Dialog **Create a new repository**:
   - **Name:** muss genau der Ordnername sein (`gec1-nachname`) – ist vorausgefüllt, nicht
     ändern.
   - **Local path:** der Ordner **darüber** (`C:\Unity` bzw. `~/Unity`) – vorausgefüllt,
     nicht ändern.
   - **Git ignore:** **Unity** auswählen. **Das ist der wichtigste Klick dieser Anleitung.**
   - **License:** None.
5. **Create repository**.

(Screenshot folgt: Zeigt den Dialog "Create a new repository" mit Name gec1-nachname, Local path C:\Unity, Git ignore "Unity".)

✅ **Checkpoint:** GitHub Desktop zeigt **Current repository: gec1-nachname** und links unter
**History** einen ersten Commit **Initial commit**. Im Reiter **Changes** steht **nicht**
`Library` – wenn doch, siehe unten.

## Schritt 3: Kursdateien und Kurs-Paket hinzufügen

1. `kursdateien.zip` entpacken.
2. Die Dateien `AGENTS.md`, `CLAUDE.md`, `KI-VERZEICHNIS.md`, `DOKUMENTATION.md`,
   `.gitattributes` und den Ordner `bilder` in den Projektordner kopieren (neben `Assets`).
   Mac: Dateien mit Punkt vorne (`.gitattributes`) sind im Finder versteckt.
   **Cmd+Shift+Punkt** blendet sie ein.
3. Das Projekt im Hub öffnen.
4. In Unity: **Window > Package Manager** > oben links **+** > **Install package from git URL…**
5. Diese Adresse einfügen und **Install** klicken:

   ```
   https://github.com/BabyToad/macromedia-gec1-kit.git#v0.3.0
   ```

(Screenshot folgt: Zeigt den Package Manager mit dem aufgeklappten "+"-Menü und dem Feld "Install package from git URL" mit der Kurs-Adresse.)

6. Nach kurzer Zeit erscheint oben das Menü **Kurs**.
7. In GitHub Desktop: links stehen die neuen Dateien und die geänderte
   `Packages/manifest.json`. Unten bei **Summary** `Kursdateien` eintragen > **Commit to main**.

✅ **Checkpoint:** GitHub Desktop zeigt **No local changes**. In Unity gibt es **Kurs > Setup
prüfen**.

## Schritt 4: Auf GitHub veröffentlichen

1. GitHub Desktop > oben **Publish repository**.
2. **Keep this code private** angehakt lassen. **Publish repository**.

✅ **Checkpoint:** Oben steht jetzt **Fetch origin** statt Publish repository. Unter
**Repository > View on GitHub** ist das Projekt auf github.com zu sehen, als **Private**.

## Schritt 5: Setup prüfen

**Kurs > Setup prüfen**. Erwartet: kein **FEHLER**, höchstens eine **WARNUNG** bei Code-Editor.
**INFO**-Zeilen sind normal.

✅ **Checkpoint:** **Setup prüfen** zeigt **keinen FEHLER**.

Weiter mit [VS Code und KI-Agent](../vscode-and-agent/).

## Wenn es nicht klappt

**Im Reiter Changes stehen tausende Dateien, viele davon in `Library/`.**
Die `.gitignore` fehlt oder liegt am falschen Ort. **Nichts committen.** Prüfen: Liegt im
Projektordner eine Datei `.gitignore`? Wenn nicht: **Repository > Repository settings >
Ignored files** öffnen und den Inhalt von `Unity.gitignore` aus den Kursdateien einfügen,
speichern. Die Liste sollte dann auf wenige Dateien schrumpfen.

**Der erste Commit enthält schon `Library/`.**
Repository entfernen und neu anlegen ist hier am einfachsten: GitHub Desktop **Repository >
Remove** (Häkchen "move to trash" **nicht** setzen), im Projektordner den versteckten Ordner
`.git` löschen, dann Schritt 2 nochmal – diesmal mit Git ignore **Unity**.
Wurde das Repository schon veröffentlicht: Jonas fragen.

**Name oder Local path im Create-Dialog sehen anders aus als beschrieben.**
Abbrechen und Schritt 2 nochmal, diesmal über **Add local repository** mit dem Projektordner.
Wird das Repository woanders angelegt, landet es in einem neuen leeren Ordner neben dem
Projekt.

**Package Manager: „No 'git' executable was found“ oder „Unable to add package“.**
Git fehlt oder der Unity Hub lief schon vor der Git-Installation. Siehe
[Git installieren](../install-git/); unter Windows danach den Hub ganz beenden und neu starten.

**Package Manager: Die Adresse wird nicht gefunden.**
Die Adresse genau so einfügen, inklusive `#v0.1.0` am Ende, ohne Leerzeichen.

**Die Vorlage "Universal 3D" fehlt im Hub.**
Ist oben die Editor-Version 6000.3.15f1 gewählt? Die Vorlagen hängen an der Version.
Gegebenenfalls **Download template** klicken.

**Unity fragt beim Anlegen nach Unity Cloud / Organisation.**
Abwählen bzw. überspringen. Der Kurs braucht keinen Cloud-Dienst.
