<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/branch/ · Stand 2026-10-04T10:20Z · cb3c273 -->

# Branch

Eine eigene Linie im Verlauf, auf der sich etwas ausprobieren lässt, ohne den Hauptstand zu gefährden. Gelingt es, wird der Branch zurückgeführt (Merge); sonst bleibt er liegen oder wird gelöscht.

Auch: Branches, Zweig, Zweige, main, Merge, mergen, Konflikt, Merge-Konflikt

Verwandt: [commit](https://www.allknivesnobagel.com/teaching/gec1/concepts/commit/), [git](https://www.allknivesnobagel.com/teaching/gec1/concepts/git/), [tag](https://www.allknivesnobagel.com/teaching/gec1/concepts/tag/), [repository](https://www.allknivesnobagel.com/teaching/gec1/concepts/repository/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/Manual/SmartMerge.html


## Kurz

Der Verlauf eines [Repositorys](https://www.allknivesnobagel.com/teaching/gec1/concepts/repository/) muss keine einzelne Linie sein. Ein Branch zweigt an einem [Commit](https://www.allknivesnobagel.com/teaching/gec1/concepts/commit/) ab; neue Commits landen dann nur auf ihm. Der Hauptzweig heißt meist `main`.

Typischer Fall im Kurs: Eine riskante Idee („Was, wenn die Tür ein Rätsel wird?“) auf einem eigenen Branch ausprobieren. Funktioniert sie, wird der Branch in `main` gemergt. Funktioniert sie nicht, zurück zu `main`, und der Hauptstand ist unberührt.

## Genauer

Ein Branch ist nur ein Name, der auf einen Commit zeigt und mit jedem neuen Commit weiterrückt. Deshalb ist ein Branch billig: Anlegen kostet keine Kopie des Projekts.

Beim Wechsel des Branches tauscht Git die Dateien im Projektordner aus. Unity bemerkt das und lädt neu. Vorher alles committen; offene Änderungen machen den Wechsel unübersichtlich.

**Merge** führt zwei Linien zusammen. Haben beide Seiten dieselben Zeilen derselben Datei verändert, entsteht ein **Konflikt**, und ein Mensch muss entscheiden. Bei Skripten geht das gut. Bei Szenen und Prefabs ist es mühsam, weil ihre Dateien schwer lesbar sind. Daher: Auf zwei Branches nicht gleichzeitig an derselben Szene arbeiten.

## In GitHub Desktop sehen

- **Current Branch** (oben, Mitte) zeigt den aktiven Branch. Darüber lässt sich wechseln oder mit **New Branch** ein neuer anlegen.
- Zurückführen: auf `main` wechseln, dann **Branch › Merge into current branch…** und den Experiment-Branch wählen.
- Im Terminal: `git switch -c experiment` legt an und wechselt, `git switch main` wechselt zurück, `git merge experiment` führt zusammen.

## Weiterlesen

- [Pro Git, Kapitel 3.1: Branches auf einen Blick](https://git-scm.com/book/de/v2/Git-Branching-Branches-auf-einen-Blick) und [3.2: Einfaches Branching und Merging](https://git-scm.com/book/de/v2/Git-Branching-Einfaches-Branching-und-Merging) – mit Zeichnungen (Deutsch).
- [GitHub Docs: Verwalten von Branches in GitHub Desktop](https://docs.github.com/de/desktop/making-changes-in-a-branch/managing-branches-in-github-desktop) – Deutsch.
- [Learn Git Branching](https://learngitbranching.js.org/?locale=de_DE) – Branches im Browser bauen und zusehen, was passiert (Deutsch).
- [Julia Evans: git branches: intuition & reality](https://jvns.ca/blog/2023/11/23/branches-intuition-reality/) – warum sich ein Branch wie eine Linie anfühlt, aber nur ein Zeiger ist (englisch).
