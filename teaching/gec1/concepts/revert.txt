<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/revert/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# Revert

Macht einen früheren Commit rückgängig. Git legt dazu einen neuen Commit an, der das Gegenteil enthält. Der Verlauf bleibt vollständig, auch der Fehler ist darin noch zu sehen.

Auch: Reverts, reverten, rückgängig machen, Discard, Discard changes, Undo

Verwandt: [commit](https://www.allknivesnobagel.com/teaching/gec1/concepts/commit/), [diff](https://www.allknivesnobagel.com/teaching/gec1/concepts/diff/), [git](https://www.allknivesnobagel.com/teaching/gec1/concepts/git/), [prefab](https://www.allknivesnobagel.com/teaching/gec1/concepts/prefab/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/Manual/VersionControl.html


## Kurz

Ein Revert nimmt die Änderungen eines bestimmten [Commits](https://www.allknivesnobagel.com/teaching/gec1/concepts/commit/) zurück. Dazu löscht Git nichts, sondern legt einen **neuen** Commit an, der genau das Gegenteil enthält. Im Verlauf steht danach beides: der Fehler und seine Rücknahme.

Das ist sicher, auch wenn der fehlerhafte Commit schon auf GitHub liegt.

## Genauer

Drei Wege zurück, je nachdem, wie weit eine Änderung schon gekommen ist:

| Lage | Werkzeug in GitHub Desktop | Wirkung |
|---|---|---|
| geändert, noch nicht committet | **Discard changes** (Rechtsklick auf die Datei) | Änderung verworfen; GitHub Desktop legt sie in den Papierkorb |
| committet, noch nicht gepusht | **Undo commit** (History, Rechtsklick) | Commit aufgelöst, Änderungen wieder offen |
| committet und gepusht | **Revert Changes in Commit** (History, Rechtsklick) | neuer Commit mit dem Gegenteil |

Ein Revert nimmt nur den einen Commit zurück. Ist danach weitergearbeitet worden, bleibt das Spätere erhalten. Haben spätere Commits dieselben Zeilen geändert, meldet Git einen Konflikt, der von Hand gelöst werden muss.

Vor dem Revert in Unity alles speichern. Nach dem Revert lädt Unity die geänderten Dateien neu; ist die Szene offen, fragt Unity, ob sie neu geladen werden soll.

Achtung, Namensgleichheit: Bei [Prefabs](https://www.allknivesnobagel.com/teaching/gec1/concepts/prefab/) gibt es in Unity ebenfalls **Revert**. Das setzt eine Instanz auf ihr Prefab zurück und hat mit Git nichts zu tun.

## In GitHub Desktop sehen

1. Reiter **History** öffnen.
2. Rechtsklick auf den Commit, der rückgängig werden soll.
3. **Revert Changes in Commit** wählen. Der neue Commit erscheint oben.
4. **Push origin**, damit die Rücknahme auch auf GitHub ankommt.

Im Terminal: `git revert 9f45bb9` (die Kennung des Commits).

## Weiterlesen

- [GitHub Docs: Rückgängigmachen eines Commits in GitHub Desktop](https://docs.github.com/de/desktop/managing-commits/reverting-a-commit-in-github-desktop) – Deutsch.
- [Pro Git, Kapitel 2.4: Ungewollte Änderungen rückgängig machen](https://git-scm.com/book/de/v2/Git-Grundlagen-Ungewollte-%C3%84nderungen-r%C3%BCckg%C3%A4ngig-machen) – die anderen Wege zurück, vor allem für noch nicht gepushte Änderungen (Deutsch).
- [Git-Dokumentation: git revert](https://git-scm.com/docs/git-revert) – der Befehl im Detail (englisch).
- [Oh Shit, Git!?!](https://ohshitgit.com/de) – kurze Rezepte für typische Pannen, auf Deutsch; etwas derb im Ton.
