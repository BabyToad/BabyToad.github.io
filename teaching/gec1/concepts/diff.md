<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/diff/ · Stand 2026-10-03T17:15Z · a299914 -->

# Diff

Die Gegenüberstellung zweier Stände, Zeile für Zeile: was weggefallen ist und was dazukam. Vor dem Commit gelesen, zeigt der Diff, was tatsächlich gespeichert wird.

Auch: Diffs, Unterschied, Änderungen, Changes

Verwandt: [commit](https://www.allknivesnobagel.com/teaching/gec1/concepts/commit/), [git](https://www.allknivesnobagel.com/teaching/gec1/concepts/git/), [revert](https://www.allknivesnobagel.com/teaching/gec1/concepts/revert/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/Manual/FormatDescription.html


## Kurz

Ein Diff zeigt, was sich zwischen zwei Ständen geändert hat. Weggefallene Zeilen sind mit `-` markiert, neue mit `+`. Unveränderte Zeilen drumherum geben Zusammenhang.

```diff
-    float tempo = 3f;
+    float tempo = 5f;
```

Hier wurde eine Zahl geändert. Git sieht das als: alte Zeile weg, neue Zeile dazu.

## Genauer

Der Diff ist das wichtigste Werkzeug, um Änderungen zu prüfen, die man nicht selbst getippt hat. Bevor die Änderung eines Agenten committet wird: Diff lesen. Stimmen die Dateien? Ist etwas dabei, worum niemand gebeten hat? Lässt sich jede Zeile erklären?

Was Diffs gut zeigen und was nicht:

| Datei | im Diff |
|---|---|
| Skripte (`.cs`) | gut lesbar |
| Szenen (`.unity`), Prefabs (`.prefab`) | lesbar, aber mühsam: Unity speichert sie als Text (YAML) mit vielen Kennungen |
| Bilder, Sounds, 3D-Modelle | nur „Datei geändert“, kein Inhalt |

Eine verschobene Kiste in der Szene erscheint zum Beispiel als geänderte Zeile mit `m_LocalPosition`. Das reicht, um zu sehen, dass sich etwas bewegt hat, und um ungewollte Änderungen zu bemerken.

## In GitHub Desktop sehen

- Reiter **Changes**: links eine Datei auswählen, rechts steht ihr Diff gegenüber dem letzten [Commit](https://www.allknivesnobagel.com/teaching/gec1/concepts/commit/).
- Reiter **History**: einen Commit auswählen, dann zeigt GitHub Desktop, was dieser Commit geändert hat.
- Im Terminal: `git diff` zeigt alle noch nicht gespeicherten Änderungen.

## Weiterlesen

- [Pro Git, Kapitel 2.2: Änderungen nachverfolgen](https://git-scm.com/book/de/v2/Git-Grundlagen-%C3%84nderungen-nachverfolgen-und-im-Repository-speichern) – der Abschnitt zu `git diff` erklärt, was gegen was verglichen wird (Deutsch).
- [Git-Dokumentation: git diff](https://git-scm.com/docs/git-diff) – alle Varianten des Befehls (englisch).
- [Unity Manual: Format of text serialized files](https://docs.unity3d.com/6000.3/Documentation/Manual/FormatDescription.html) – wie Szenen und Prefabs als Text aussehen; hilft beim Lesen ihrer Diffs (Unity 6.3, englisch).
