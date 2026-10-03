<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/git/ · Stand 2026-10-03T17:03Z · b690772 -->

# Git

Ein Programm, das den Verlauf eines Projekts speichert. Jeder gespeicherte Stand lässt sich ansehen, vergleichen und zurückholen. GitHub ist ein Dienst, der Git-Projekte online aufbewahrt.

Auch: Versionskontrolle, Versionsverwaltung, GitHub, GitHub Desktop

Verwandt: [repository](https://www.allknivesnobagel.com/teaching/gec1/concepts/repository/), [commit](https://www.allknivesnobagel.com/teaching/gec1/concepts/commit/), [diff](https://www.allknivesnobagel.com/teaching/gec1/concepts/diff/), [revert](https://www.allknivesnobagel.com/teaching/gec1/concepts/revert/), [branch](https://www.allknivesnobagel.com/teaching/gec1/concepts/branch/), [tag](https://www.allknivesnobagel.com/teaching/gec1/concepts/tag/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/Manual/VersionControl.html


## Kurz

Git merkt sich, wie ein Projekt zu bestimmten Zeitpunkten aussah. Diese Stände heißen [Commits](https://www.allknivesnobagel.com/teaching/gec1/concepts/commit/) und liegen in einem [Repository](https://www.allknivesnobagel.com/teaching/gec1/concepts/repository/). Damit lässt sich jeder Fehler rückgängig machen, solange es einen Commit von vorher gibt.

Git und GitHub sind zwei verschiedene Dinge:

| | ist | läuft |
|---|---|---|
| Git | das Programm für den Verlauf | auf dem eigenen Rechner |
| GitHub | ein Dienst, der Repositories online aufbewahrt und teilt | im Netz |
| GitHub Desktop | ein Programm, das Git mit Knöpfen bedienbar macht | auf dem eigenen Rechner |

## Genauer

Im Kurs ist Git aus drei Gründen Pflicht:

1. **Rückgängig.** Ein Agent oder ein Experiment hat das Projekt kaputt gemacht? Zurück zum letzten guten Commit ([Revert](https://www.allknivesnobagel.com/teaching/gec1/concepts/revert/)).
2. **Nachvollziehen.** Was hat sich geändert? Der [Diff](https://www.allknivesnobagel.com/teaching/gec1/concepts/diff/) zeigt es Zeile für Zeile, auch bei Änderungen, die ein Agent gemacht hat.
3. **Nachweis.** Der Verlauf zeigt, wie das Projekt entstanden ist, und gehört in die Dokumentation.

Die Grundbewegung ist immer gleich: ändern, Diff lesen, committen, pushen.

Jede Kopie eines Repositories enthält den vollständigen Verlauf. Arbeiten und Committen geht deshalb auch offline; erst **Push** lädt neue Commits zu GitHub hoch, **Pull** holt fremde herunter.

## In Unity sehen

Unity bringt kein Git mit. Gearbeitet wird in GitHub Desktop oder im Terminal, ein Agent nutzt meist das Terminal. Damit Unity-Projekte in Git gut funktionieren, speichert Unity Szenen und Prefabs als Text; das ist in neuen Projekten voreingestellt (**Edit › Project Settings › Editor**, **Asset Serialization › Mode: Force Text**).

## Weiterlesen

- [Pro Git, Kapitel 1.3: Was ist Git?](https://git-scm.com/book/de/v2/Erste-Schritte-Was-ist-Git%3F) – das Standardbuch zu Git, frei online und auf Deutsch.
- [GitHub Docs: Informationen zu Git](https://docs.github.com/de/get-started/using-git/about-git) – Git und GitHub im Zusammenspiel (Deutsch).
- [Learn Git Branching](https://learngitbranching.js.org/?locale=de_DE) – interaktive Übungen im Browser, auf Deutsch. Zeigt Commits und Branches als Grafik.
- [Michael Schwern: Git for Ages 4 and Up](https://www.youtube.com/watch?v=1ffBJ4sVUb4) – Vortrag (linux.conf.au 2013, rund 100 Minuten), der Git mit Steckspielzeug auf dem Tisch nachbaut (englisch).
