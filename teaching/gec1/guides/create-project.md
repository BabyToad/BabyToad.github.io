<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/create-project/ · Stand 2026-10-05T12:36Z · 9fcef5f -->

Dauer: ca. 20–30 Min (davon 2–15 Min erstes Öffnen)

Voraussetzungen: Git ist installiert (Git installieren); Unity 6000.3.15f1 ist installiert (Unity installieren); GitHub-Konto und GitHub Desktop (GitHub einrichten)

Checkpunkte:
- [ ] Es gibt einen Ordner Unity direkt unter C:\ (Windows) bzw. im Benutzerordner (Mac)
- [ ] Auf GitHub gibt es das eigene private Repository, erstellt aus der Kursvorlage
- [ ] GitHub Desktop zeigt das Repository mit "No local changes"
- [ ] Das Projekt ist in Unity 6000.3.15f1 geöffnet
- [ ] Menü „Kurs > Setup prüfen“ zeigt keine Fehler

Stand: nicht durchgespielt

# Projekt anlegen

Das Kursprojekt wird nicht leer angelegt, sondern aus der **Kursvorlage**. Die Vorlage ist
ein fertiges, leeres Unity-Projekt (Szene, Einstellungen, URP), in dem schon alles liegt,
was sonst gern schiefgeht:

- die richtige Unity-Version und Render-Pipeline (URP),
- eine `.gitignore`, die Unitys riesige Zwischendateien (`Library/`) aus Git heraushält,
- `AGENTS.md`: die Regeln, die der KI-Agent im Projekt befolgt,
- `KI-VERZEICHNIS.md` und `DOKUMENTATION.md` für die Abgabe,
- das **Kurs-Paket** mit dem Menüpunkt **Kurs > Setup prüfen**. Unity lädt es beim ersten
  Öffnen per Git – darum muss Git installiert sein.

Daraus entsteht ein eigenes Repository auf GitHub. Das wird auf den eigenen Rechner geholt
und in Unity geöffnet.

## Schritt 1: Einen Ordner für Unity-Projekte anlegen

Einen Ordner anlegen, in dem alle Unity-Projekte liegen. Er soll **nicht** in OneDrive,
iCloud, Dropbox oder Downloads liegen und **keine Umlaute** im Pfad haben.

- **Windows:** Explorer öffnen > links **Dieser PC** > **Doppelklick** auf **Lokaler
  Datenträger (C:)** > Rechtsklick auf eine freie Stelle im Fenster > **Neu > Ordner** > `Unity`.
  Ergebnis: `C:\Unity`
- **Mac:** Finder > **Gehe zu > Benutzerordner** (Cmd+Shift+H) > Rechtsklick auf eine freie
  Stelle > **Neuer Ordner** > `Unity`. Ergebnis: `/Users/benutzername/Unity`

Warum nicht unter Dokumente? Auf vielen Windows-Rechnern ist Dokumente unbemerkt ein
OneDrive-Ordner. OneDrive synchronisiert dann tausende Unity-Dateien und kommt Git in die
Quere.

✅ **Checkpoint:** An der Stelle oben gibt es jetzt einen leeren Ordner `Unity`.

## Schritt 2: Das eigene Repository aus der Kursvorlage erstellen

1. Die Kursvorlage öffnen: <https://github.com/BabyToad/macromedia-gec1-ws26>.
2. Oben rechts auf den grünen Knopf **Use this template** > **Create a new repository** klicken.
3. Einstellen:
   - **Owner:** der eigene GitHub-Name
   - **Repository name:** ein kurzer Name ohne Leerzeichen und Umlaute, z. B. `gec1-nachname`.
     Der Name des Spiels steht noch nicht fest – das ist in Ordnung.
   - **Private** auswählen.
4. Auf **Create repository** klicken.

(Screenshot folgt: Zeigt die Kursvorlage auf GitHub mit dem aufgeklappten Knopf "Use this template" > "Create a new repository".)

(Screenshot folgt: Zeigt das Formular "Create a new repository" mit Owner, Name gec1-nachname und "Private" ausgewählt.)

Freiwillig: Jetzt lässt sich Jonas als Collaborator einladen (**Settings** >
**Collaborators** > **Add people** > `BabyToad`). Keine Bedingung, aber hilfreich, falls
später Hilfe nötig ist (siehe [GitHub einrichten](../github/)).

✅ **Checkpoint:** Die Seite des neuen Repositorys ist offen. Oben steht
`github-name / gec1-nachname`, daneben **Private**, darunter "generated from …" mit dem Namen
der Vorlage. Ordner wie `Assets`, `Packages`, `ProjectSettings` sind zu sehen.

## Schritt 3: Das Repository auf den Rechner holen (klonen)

1. Auf der Repository-Seite auf den grünen Knopf **Code** > **Open with GitHub
   Desktop** klicken. Der Browser fragt, ob er GitHub Desktop öffnen darf: **Ja / Öffnen**.
   (Alternativ in GitHub Desktop: **File > Clone repository** > Reiter **GitHub.com** > das
   Repository auswählen.)
2. GitHub Desktop zeigt **Clone a repository**. Neben **Local path** auf **Choose…** klicken
   und den Ordner **`C:\Unity`** (Mac: **`Unity`** im Benutzerordner) auswählen. GitHub Desktop
   hängt den Namen des Repositorys selbst an. Der Pfad endet danach auf
   `\Unity\gec1-nachname` (Mac: `/Unity/gec1-nachname`) – den Namen **nicht** noch einmal
   von Hand anhängen.
3. Auf **Clone** klicken.

(Screenshot folgt: Zeigt den Clone-Dialog mit Local path C:\Unity\gec1-nachname und dem Knopf "Choose…".)

✅ **Checkpoint:** GitHub Desktop zeigt oben links **Current repository: gec1-nachname** und in
der Mitte **No local changes**. Im Explorer/Finder gibt es jetzt den Ordner
`Unity/gec1-nachname` mit `Assets`, `Packages`, `ProjectSettings` und `AGENTS.md`.

## Schritt 4: Das Projekt in Unity öffnen

1. Den Unity Hub öffnen > **Projects**.
2. Auf den Pfeil neben **Add** (bzw. **Open**) > **Add project from disk** klicken.
3. Den Ordner `gec1-nachname` wählen – **den Ordner selbst**, in dem `Assets` liegt, nicht
   einen Ordner darin oder darüber. Auf **Öffnen** / **Add Project** klicken.
4. In der Projektliste steht jetzt `gec1-nachname` mit der Editor-Version **6000.3.15f1**.
   Darauf klicken.
5. Das erste Öffnen dauert lange (2–15 Minuten, auf älteren Rechnern länger): Unity baut den
   Ordner `Library/` auf und lädt das Kurs-Paket. Einfach laufen lassen.
6. **Windows:** Fragt die Windows-Firewall nach Unity, **Zulassen** (privates Netzwerk) oder
   **Abbrechen** wählen – beides geht.

(Screenshot folgt: Zeigt die Projektliste im Hub mit gec1-nachname, Editor-Version 6000.3.15f1, ohne Warnsymbol.)

✅ **Checkpoint:** Unity ist offen. Oben in der Menüleiste gibt es einen Eintrag **Kurs**.

## Schritt 5: Setup prüfen

1. In Unity auf **Kurs > Setup prüfen** klicken.
2. Ein Fenster zeigt eine Liste mit **OK**, **INFO**, **WARNUNG** und **FEHLER**.

(Screenshot folgt: Zeigt das Fenster "Setup prüfen" nach diesem Schritt: OK und INFO, eine WARNUNG bei "Code-Editor".)

Erwartet ist an dieser Stelle: kein **FEHLER**, höchstens eine **WARNUNG** bei **Code-Editor**
(die verschwindet in [VS Code und KI-Agent](../vscode-and-agent/)). **INFO**-Zeilen sind
normal, z. B. beim KI-Verzeichnis oder am Mac beim Windows-Build.

Zum Schluss ein Blick in GitHub Desktop: Dort steht weiter **No local changes**. Zeigt es doch
ein paar geänderte Dateien (z. B. `packages-lock.json`), ist das in Ordnung. Sie kommen beim
[Ersten Commit](../first-commit/) mit.

✅ **Checkpoint:** **Setup prüfen** zeigt **keinen FEHLER**.

Fertig. Weiter mit [VS Code und KI-Agent](../vscode-and-agent/) (Schritte 3 und 5).

## Wenn es nicht klappt

**Den Knopf "Use this template" gibt es nicht.**
Ist die Anmeldung auf github.com erfolgt? Ohne Anmeldung fehlt er. Ist die Vorlage gar nicht
zu sehen (Seite 404), ist der Link falsch – bei Jonas nachfragen.

**GitHub Desktop: "This directory already exists and is not empty".**
Unter dem Local path liegt schon ein Ordner mit dem Namen. Einen anderen Namen am Ende
des Pfads nehmen oder den alten Ordner löschen, wenn er nur ein missglückter Versuch war.

**Der Pfad endet auf `gec1-nachname\gec1-nachname`.**
Der Name wurde doppelt angehängt. Den inneren Ordner nicht verwenden: In GitHub Desktop
**Repository > Remove**, den Ordner löschen und Schritt 3 mit **Choose…** wiederholen.

**GitHub Desktop: "Authentication failed" beim Klonen.**
Abmelden und neu anmelden: **File > Options > Accounts** (Mac: **Settings > Accounts**) >
**Sign out**, dann **Sign in**.

**Der Hub sagt beim Hinzufügen "Invalid project path" oder "not a valid Unity project".**
Der falsche Ordner ist gewählt. Richtig ist der Ordner, der direkt `Assets`, `Packages`
und `ProjectSettings` enthält.

**Im Hub steht beim Projekt ein Warnsymbol und "Editor version not installed".**
Unity 6000.3.15f1 fehlt oder ist noch nicht fertig installiert (siehe
[Unity installieren](../install-unity/), Schritt 3). **Nicht** "Choose another Editor version"
wählen – das baut das Projekt auf eine andere Version um.

**Unity meldet „Project has invalid dependencies … No 'git' executable was found“.**
Unity findet kein Git. Git installieren ([Git installieren](../install-git/)). Unter Windows
danach den Unity Hub ganz beenden (Taskleiste > **Quit**) und neu starten, dann das Projekt
erneut öffnen. Am Mac warten, bis die Command Line Tools fertig sind.

**Unity fragt: "Enter Safe Mode?"**
Unity hat Fehler im Code gefunden. Auf **Enter Safe Mode** klicken und einen Screenshot
der Fehler unten in der **Console** machen. Den an Jonas schicken. In der frischen Vorlage
sollte das nicht passieren.

**Es gibt kein Menü "Kurs".**
Unity hat noch nicht fertig geladen (unten rechts dreht sich etwas) – warten. Kommt es nicht:
Unten in der **Console** nach roten Fehlern sehen, die `de.macromedia.gec1` oder `git`
erwähnen, und den Eintrag oben zu Git prüfen.

**Setup prüfen zeigt FEHLER bei "Projektordner" oder WARNUNG wegen OneDrive/Umlauten.**
Projekt schließen. In GitHub Desktop **Repository > Remove** (nur aus der Liste entfernen,
**nicht** "Also move this repository to the trash" anhaken), den Ordner nach `C:\Unity`
bzw. `~/Unity` verschieben, dann in GitHub Desktop **File > Add local repository** und im Hub
das Projekt neu hinzufügen.

**Setup prüfen zeigt einen anderen FEHLER.**
Die Zeile **Lösung** lesen. Hilft das nicht: **Bericht kopieren** und den Text an Jonas
schicken (sobald VS Code eingerichtet ist, auch an den KI-Agenten).

**Mac: Der Hub kann den Ordner nicht öffnen oder zeigt ihn leer.**
**Systemeinstellungen > Datenschutz & Sicherheit > Dateien und Ordner** (oder
**Festplattenvollzugriff**) > dem Unity Hub Zugriff geben. Hub neu starten.
