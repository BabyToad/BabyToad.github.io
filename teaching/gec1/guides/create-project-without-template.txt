<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/create-project-without-template/ · Stand 2026-10-03T16:48Z · 87a2a07 -->

Dauer: ca. 30 Min

Voraussetzungen: Anleitung 1 (Unity 6000.3.25f1 installiert); Anleitung 2 (GitHub-Konto und GitHub Desktop); die Datei kursdateien.zip (von Jonas)

Checkpunkte:
- [ ] Das Projekt liegt in C:\Unity bzw. ~/Unity und wurde mit der Vorlage Universal 3D angelegt
- [ ] GitHub Desktop zeigt das Projekt als Repository mit Unity-.gitignore
- [ ] AGENTS.md, CLAUDE.md, KI-VERZEICHNIS.md und der Ordner Packages/de.macromedia.gec1.setupcheck liegen im Projekt
- [ ] Das Repository ist privat auf GitHub veröffentlicht
- [ ] Menü „Kurs > Setup prüfen“ zeigt keine Fehler

Stand: nicht durchgespielt

# Projekt ohne Vorlage anlegen (Ersatzweg)

**Diese Anleitung nur verwenden, wenn Jonas es sagt oder die Kursvorlage nicht erreichbar ist.**
Der normale Weg ist **Projekt anlegen** (aus der Kursvorlage). Hier wird von Hand nachgebaut,
was die Vorlage mitbringt. Die heikle Stelle ist Schritt 2: Das Git-Repository muss **genau**
im Projektordner liegen.

## Schritt 1: Projekt im Unity Hub anlegen

1. Einen Ordner `C:\Unity` (Windows) bzw. `~/Unity` (Mac) anlegen – siehe **Projekt anlegen**,
   Schritt 1.
2. Unity Hub > **Projects** > **New project**.
3. Oben bei **Editor Version**: **6000.3.25f1** auswählen.
4. Vorlage: **Universal 3D**. (Fehlt das Vorschaubild: auf **Download template** klicken.)
5. Rechts:
   - **Project name:** kurz, ohne Leerzeichen und Umlaute, z. B. `gec1-nachname`
   - **Location:** der Ordner `C:\Unity` bzw. `~/Unity`
   - **Connect to Unity Cloud** und **Use Unity Version Control:** **abwählen**. Der Kurs
     arbeitet mit Git und GitHub.
6. **Create project**. Unity öffnet sich nach einigen Minuten. Unity danach wieder schließen.

(Screenshot folgt: Zeigt den Dialog "New project" mit Editor-Version 6000.3.25f1, Vorlage Universal 3D ausgewählt, Name und Location ausgefüllt, beide Cloud- Häkchen aus.)

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

## Schritt 3: Kursdateien hinzufügen

1. `kursdateien.zip` entpacken.
2. Die Dateien `AGENTS.md`, `CLAUDE.md`, `KI-VERZEICHNIS.md` und `.gitattributes` in den
   Projektordner kopieren (neben `Assets`).
3. **Den Ordner `Packages` nicht als Ganzes kopieren.** Das Projekt hat schon einen Ordner
   `Packages` mit wichtigen Dateien (`manifest.json`, `packages-lock.json`). Wird er ersetzt,
   sind diese Dateien weg, und das Projekt öffnet nicht mehr richtig. So geht es:

   - In den entpackten Kursdateien den Ordner `Packages` öffnen. Darin liegt
     `de.macromedia.gec1.setupcheck`.
   - In einem zweiten Fenster den Ordner `Packages` **des Projekts** öffnen.
   - Nur den Ordner `de.macromedia.gec1.setupcheck` dort hineinkopieren.
   - Fragt Windows oder der Mac, ob etwas **ersetzt** werden soll: **Abbrechen** und nochmal
     prüfen, ob der richtige Ordner offen ist. Beim ersten Mal gibt es nichts zu ersetzen.

   Danach liegen in `Packages` des Projekts: `manifest.json`, `packages-lock.json` und der
   Ordner `de.macromedia.gec1.setupcheck`.
4. Mac: Dateien mit Punkt vorne (`.gitattributes`) sind im Finder versteckt.
   **Cmd+Shift+Punkt** blendet sie ein.
5. Das Projekt im Hub öffnen. Oben gibt es jetzt das Menü **Kurs**.
6. In GitHub Desktop: links stehen die neuen Dateien. Unten bei **Summary** `Kursdateien`
   eintragen > **Commit to main**.

✅ **Checkpoint:** GitHub Desktop zeigt **No local changes**. In Unity gibt es **Kurs > Setup
prüfen**.

## Schritt 4: Auf GitHub veröffentlichen

1. GitHub Desktop > oben **Publish repository**.
2. **Keep this code private** angehakt lassen. **Publish repository**.

✅ **Checkpoint:** Oben steht jetzt **Fetch origin** statt Publish repository. Unter
**Repository > View on GitHub** ist das Projekt auf github.com zu sehen, als **Private**.

## Schritt 5: Setup prüfen

**Kurs > Setup prüfen**. Erwartet: alles **OK**, höchstens eine **WARNUNG** bei Code-Editor.

✅ **Checkpoint:** **Setup prüfen** zeigt **keinen FEHLER**.

Weiter mit **VS Code und KI-Agent**.

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

**Nach dem Kopieren öffnet Unity das Projekt nicht mehr, oder `manifest.json` fehlt.**
Der Ordner `Packages` wurde ersetzt statt ergänzt. In GitHub Desktop unter **Changes** auf
`Packages/manifest.json` (und `packages-lock.json`) rechtsklicken > **Discard changes**. Dann
Schritt 3 nochmal, diesmal nur den einen Ordner kopieren.

**Die Vorlage "Universal 3D" fehlt im Hub.**
Ist oben die Editor-Version 6000.3.25f1 gewählt? Die Vorlagen hängen an der Version.
Gegebenenfalls **Download template** klicken.

**Unity fragt beim Anlegen nach Unity Cloud / Organisation.**
Abwählen bzw. überspringen. Der Kurs braucht keinen Cloud-Dienst.
