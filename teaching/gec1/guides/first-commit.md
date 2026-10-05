<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/first-commit/ · Stand 2026-10-05T10:26Z · 915d46a -->

Dauer: ca. 15 Min

Voraussetzungen: VS Code und KI-Agent eingerichtet (Setup prüfen zeigt „Alles bereit“)

Checkpunkte:
- [ ] Ein erster Commit mit einer eigenen Änderung ist angelegt
- [ ] Der Commit ist auf github.com zu sehen
- [ ] Eine Änderung wurde mit "Discard changes" rückgängig gemacht, und Unity hat sie zurückgeholt

Stand: nicht durchgespielt

# Erster Commit

Ein **Commit** ist ein gespeicherter Zwischenstand des Projekts, mit einer kurzen
Beschreibung. **Push** lädt die Commits zu GitHub hoch. In dieser Anleitung kommt beides
einmal vor – dazu der wichtigste Handgriff des Kurses: eine Änderung **rückgängig** machen.

## Schritt 1: Etwas in der Szene ändern

1. In Unity unten im **Project**-Fenster: **Assets > Scenes** > Doppelklick auf die Szene
   (z. B. `SampleScene`).
2. Im **Hierarchy**-Fenster: Rechtsklick > **3D Object > Cube**.
3. Speichern: **File > Save** (Strg+S / Cmd+S).

✅ **Checkpoint:** In der Scene-Ansicht ist ein Würfel zu sehen. In der **Hierarchy** steht
ganz oben der Szenenname (z. B. `SampleScene`) **ohne Sternchen** (`*`) – das heißt:
gespeichert.

## Schritt 2: Die Änderung in GitHub Desktop ansehen

1. Zu GitHub Desktop wechseln, Reiter **Changes**.
2. Links steht die Szenendatei, z. B. `Assets/Scenes/SampleScene.unity`. Darauf klicken.
3. Rechts ist zu sehen, was sich geändert hat: grüne Zeilen sind neu. Unity speichert Szenen als
   Text – darin steht jetzt der Würfel (`Cube`, seine Position, seine [Components](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/)).

(Screenshot folgt: Zeigt den Reiter Changes mit der Szenendatei links und rechts grünen Zeilen, in denen "m\_Name: Cube" zu sehen ist.)

Diese Ansicht heißt **Diff**. Sie wird ständig gebraucht: Wenn der KI-Agent etwas
geändert hat, zeigt sie, **was** er geändert hat.

✅ **Checkpoint:** Links steht mindestens die Szenendatei. Nirgends steht `Library/`.

## Schritt 3: Committen

1. Unten links bei **Summary** eine kurze Beschreibung: `Würfel in die Szene gestellt`.
2. Auf **Commit to main** klicken.

✅ **Checkpoint:** Links steht **No local changes**. Im Reiter **History** steht der Commit
ganz oben.

## Schritt 4: Hochladen (Push)

1. Oben auf **Push origin** klicken.
2. Danach auf **Repository > View on GitHub** klicken.

(Screenshot folgt: Zeigt die Repository-Seite auf github.com mit "Würfel in die Szene gestellt" als letztem Commit.)

✅ **Checkpoint:** Auf github.com steht über der Dateiliste der Commit **Würfel in die Szene
gestellt**.

## Schritt 5: Rückgängig machen

Jetzt das Wichtigste: zurück zum letzten Commit.

1. In Unity den Würfel löschen (auswählen, Entf bzw. Cmd+Backspace) und **speichern**.
2. In GitHub Desktop erscheint die Szenendatei wieder unter **Changes** – diesmal mit roten
   Zeilen (gelöscht).
3. Rechtsklick auf die Datei > **Discard changes…** > bestätigen.
4. Zurück in Unity: Unity merkt, dass sich die Szene geändert hat, und lädt sie neu. Fragt
   Unity nach: auf **Reload** klicken.

✅ **Checkpoint:** Der Würfel ist wieder da. GitHub Desktop zeigt **No local changes**.

Das ist der Rückgängig-Knopf. Er funktioniert für alles, was seit dem letzten Commit passiert
ist – auch für Änderungen, die der KI-Agent gemacht hat.

## Die Arbeitsregel für den Kurs

Von jetzt an gilt diese Schleife:

1. **Committen**, bevor der Agent eine Aufgabe bekommt. (Nichts unter Changes.)
2. Dem Agenten **genau beschreiben**, was passieren soll.
3. Im Spiel **ausprobieren** (Play).
4. In GitHub Desktop den **Diff lesen**: Welche Dateien hat er angefasst? Ist klar, was
   passiert?
5. Passt es: **committen**. Passt es nicht: **Discard changes** und neu beschreiben.
6. **Pushen** selbst übernehmen, wenn das Ergebnis passt – auch wenn der Agent Git bedienen kann.
   Er pusht nur, wenn man ihn ausdrücklich darum bittet. Man bleibt selbst in der Schleife, bis man <!-- Durchsicht -->
   versteht, wann es klug ist, einem Agenten das Steuer zu überlassen: Zustimmen kann man nur
   einer Zusammenarbeit, die man versteht.

Zum Schluss **Kurs > Setup prüfen**: alles OK, auch **Commits** und **Mit GitHub verbunden**.

## Wenn es nicht klappt

**Unter Changes steht nichts, obwohl etwas geändert wurde.**
Nicht gespeichert. Im Szenen-Reiter in Unity nach dem Sternchen schauen und mit
Strg+S / Cmd+S speichern.

**Unter Changes stehen hunderte Dateien oder etwas mit `Library/`.**
Nicht committen. **Kurs > Setup prüfen** öffnen und den Fehler bei **.gitignore** beheben.

**Neben der eigenen Datei stehen `.meta`-Dateien.**
Richtig so. Jede Datei in `Assets` hat eine `.meta`-Datei, in der Unity sich ihre Verknüpfungen
merkt. Immer mit committen.

**Statt "Push origin" steht dort "Publish repository".**
Das Repository ist noch nicht auf GitHub. Darauf klicken, **Keep this code private** angehakt
lassen.

**Push: "Authentication failed" oder "rejected".**
In GitHub Desktop ab- und wieder anmelden (**File > Options > Accounts**). Steht da
"rejected … fetch first": erst **Fetch origin**, dann **Pull origin**, dann nochmal Push.

**Push: "file … exceeds GitHub's file size limit of 100 MB".**
Eine Datei ist zu groß für GitHub. **Kurs > Setup prüfen** zeigt sie unter **Große Dateien**.
Jonas fragen, bevor etwas gelöscht wird – der Commit muss dann neu gemacht werden.

**Nach Discard changes ist der Würfel nicht wieder da.**
Unity hat die Szene nicht neu geladen. Doppelklick auf die Szene im Project-Fenster und
**Don't Save** wählen, falls Unity fragt.
