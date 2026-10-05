<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/repository/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# Repository

Ein Projektordner, dessen Verlauf Git aufzeichnet. Lokal liegt er auf dem eigenen Rechner, eine Kopie davon meist auf GitHub. Was nicht hineingehört, regelt die Datei .gitignore.

Auch: Repositories, Repo, Repos, .gitignore, gitignore, Remote, origin

Verwandt: [git](https://www.allknivesnobagel.com/teaching/gec1/concepts/git/), [commit](https://www.allknivesnobagel.com/teaching/gec1/concepts/commit/), [branch](https://www.allknivesnobagel.com/teaching/gec1/concepts/branch/), [build](https://www.allknivesnobagel.com/teaching/gec1/concepts/build/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/Manual/VersionControl.html


## Kurz

Ein Repository ist ein ganz normaler Ordner, plus ein versteckter Unterordner `.git`. Darin speichert [Git](https://www.allknivesnobagel.com/teaching/gec1/concepts/git/) alle [Commits](https://www.allknivesnobagel.com/teaching/gec1/concepts/commit/), also den gesamten Verlauf. Den `.git`-Ordner nie von Hand verändern oder löschen; dann ist der Verlauf weg.

Meist gibt es zwei Kopien:

| Kopie | liegt | heißt |
|---|---|---|
| lokal | auf dem eigenen Rechner, hier wird gearbeitet | – |
| Remote | auf GitHub | oft `origin` |

**Push** schickt lokale Commits zum Remote, **Pull** holt neue vom Remote. Bis zum Push existiert ein Commit nur auf dem eigenen Rechner.

## Genauer

Nicht alles im Unity-Projekt gehört ins Repository. Unity erzeugt viele Dateien selbst neu, und die wären groß und ständig geändert:

| gehört hinein | bleibt draußen |
|---|---|
| `Assets/` mit allen `.meta`-Dateien | `Library/`, `Temp/`, `Logs/`, `UserSettings/` |
| `Packages/` | Build-Ordner |
| `ProjectSettings/` | `obj/`, Dateien der Code-Editoren |

Das regelt eine Textdatei namens `.gitignore` im Projektordner. Die Vorlage des Kurses bringt eine passende mit.

Die `.meta`-Dateien sind wichtig: Darin steht die Kennung, über die Unity Dateien untereinander verknüpft. Fehlt eine `.meta`-Datei, gehen Verknüpfungen zu dieser Datei verloren, etwa ein Material an einem Objekt.

Sehr große Dateien (Videos, große Audio- oder 3D-Dateien) machen ein Repository langsam. GitHub [lehnt einzelne Dateien über 100 MiB ab](https://docs.github.com/de/repositories/working-with-files/managing-large-files/about-large-files-on-github).

## In GitHub Desktop sehen

In GitHub Desktop zeigt **Current Repository** oben links, welches Repository offen ist. **Repository › Show in Explorer** (macOS: Show in Finder) öffnet den Ordner.

## Weiterlesen

- [Pro Git, Kapitel 2.1: Ein Git-Repository anlegen](https://git-scm.com/book/de/v2/Git-Grundlagen-Ein-Git-Repository-anlegen) – Deutsch.
- [GitHub Docs: Informationen zu Repositorys](https://docs.github.com/de/repositories/creating-and-managing-repositories/about-repositories) – was ein Repository auf GitHub ist (Deutsch).
- [GitHubs .gitignore-Vorlage für Unity](https://github.com/github/gitignore/blob/main/Unity.gitignore) – die verbreitete Vorlage, kommentiert.
- [Julia Evans: Inside .git](https://jvns.ca/blog/2024/01/26/inside-git/) – was im versteckten Ordner liegt, als gezeichnete Übersicht (englisch).
