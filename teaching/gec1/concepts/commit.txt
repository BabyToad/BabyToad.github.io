<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/commit/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# Commit

Ein gespeicherter Stand des ganzen Projekts mit einer kurzen Beschreibung. Commits reihen sich zum Verlauf; zu jedem lässt sich später zurückkehren.

Auch: Commits, committen, Commit-Nachricht, Verlauf, History, Push, pushen

Verwandt: [git](https://www.allknivesnobagel.com/teaching/gec1/concepts/git/), [repository](https://www.allknivesnobagel.com/teaching/gec1/concepts/repository/), [diff](https://www.allknivesnobagel.com/teaching/gec1/concepts/diff/), [revert](https://www.allknivesnobagel.com/teaching/gec1/concepts/revert/), [branch](https://www.allknivesnobagel.com/teaching/gec1/concepts/branch/), [tag](https://www.allknivesnobagel.com/teaching/gec1/concepts/tag/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/Manual/VersionControl.html


## Kurz

Ein Commit ist wie ein Foto des Projekts zu einem Zeitpunkt, mit einer Zeile darunter, was sich geändert hat. Die Commits hintereinander ergeben den **Verlauf** (History).

Jeder Commit bekommt eine Kennung aus Ziffern und Buchstaben, zum Beispiel `9f45bb9`. Dazu speichert Git Autor, Zeit und den Commit davor.

## Genauer

**Was ein guter Commit ist:** eine Änderung, die für sich funktioniert und sich in einem Satz beschreiben lässt. „Tür öffnet sich mit Schlüssel“ ist gut. „Zeug“ hilft in drei Wochen niemandem.

**Wann committen:** immer, wenn etwas funktioniert. Spätestens vor einem Experiment und bevor ein Agent loslegt. Ein Commit kostet nichts; ein fehlender Commit kann einen Nachmittag kosten.

**Vorher den [Diff](https://www.allknivesnobagel.com/teaching/gec1/concepts/diff/) lesen.** Er zeigt, was tatsächlich in den Commit geht. Gerade bei Änderungen durch einen Agenten ist das der Moment, in dem man noch Nein sagen kann.

**Commit und Push sind zwei Schritte.** Ein Commit liegt zunächst nur im lokalen [Repository](https://www.allknivesnobagel.com/teaching/gec1/concepts/repository/). Erst **Push** lädt ihn zu GitHub hoch.

Unity schreibt Änderungen an einer Szene erst beim Speichern in die Datei. Vor dem Commit deshalb in Unity **File › Save** (Strg+S, macOS Cmd+S), sonst fehlt die letzte Änderung an der Szene.

## In GitHub Desktop sehen

1. Links im Reiter **Changes** stehen alle geänderten Dateien; rechts der Diff der ausgewählten.
2. Unten links in **Summary** die Beschreibung eintragen.
3. **Commit to main** klicken.
4. Oben rechts **Push origin**: Erst dann ist der Commit auf GitHub.

Der Reiter **History** zeigt den Verlauf, neuester Commit oben.

```
git add -A
git commit -m "Tür öffnet sich mit Schlüssel"
git push
```

## Weiterlesen

- [Pro Git, Kapitel 2.2: Änderungen nachverfolgen und im Repository speichern](https://git-scm.com/book/de/v2/Git-Grundlagen-%C3%84nderungen-nachverfolgen-und-im-Repository-speichern) – Deutsch.
- [GitHub Docs: Committen und Überprüfen von Änderungen in GitHub Desktop](https://docs.github.com/de/desktop/making-changes-in-a-branch/committing-and-reviewing-changes-to-your-project-in-github-desktop) – die Knöpfe Schritt für Schritt (Deutsch).
- [Julia Evans: Do we think of git commits as diffs, snapshots, and/or histories?](https://jvns.ca/blog/2024/01/05/do-we-think-of-git-commits-as-diffs--snapshots--or-histories/) – warum ein Commit ein Foto ist und trotzdem oft als Änderung gezeigt wird (englisch).
