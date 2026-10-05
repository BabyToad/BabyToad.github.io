<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/tag/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# Tag

Ein fester Name für einen bestimmten Commit, etwa „alpha“ oder „abgabe“. Anders als ein Branch rückt ein Tag nie weiter. Releases auf GitHub bauen auf Tags auf.

Auch: Tags, taggen, Release, Releases, Git-Tag

Verwandt: [commit](https://www.allknivesnobagel.com/teaching/gec1/concepts/commit/), [branch](https://www.allknivesnobagel.com/teaching/gec1/concepts/branch/), [build](https://www.allknivesnobagel.com/teaching/gec1/concepts/build/), [git](https://www.allknivesnobagel.com/teaching/gec1/concepts/git/)



## Kurz

Ein Tag hängt ein Namensschild an einen [Commit](https://www.allknivesnobagel.com/teaching/gec1/concepts/commit/). Kennungen wie `9f45bb9` merkt sich niemand; „alpha“ schon.

Im Kurs markiert ein Tag den Stand, aus dem ein getesteter [Build](https://www.allknivesnobagel.com/teaching/gec1/concepts/build/) entstanden ist. Läuft später etwas schief, ist klar, welcher Stand zuletzt funktioniert hat.

## Genauer

Tag und [Branch](https://www.allknivesnobagel.com/teaching/gec1/concepts/branch/) sind beide Namen für Commits. Der Unterschied:

| | rückt mit neuen Commits weiter? | wofür |
|---|---|---|
| Branch | ja | eine Arbeitslinie |
| Tag | nein, nie | ein fester Meilenstein |

Auf GitHub wird aus einem Tag ein **Release**: Zu dem markierten Stand lassen sich Dateien hochladen, etwa der Windows-Build als ZIP. So bleibt der Build neben dem Code, aber außerhalb des Repositorys.

Tags reisen nicht immer automatisch mit. Im Terminal überträgt `git push` keine Tags; ein Tag wird eigens hochgeladen. GitHub Desktop überträgt neue Tags zusammen mit dem zugehörigen Commit.

## In GitHub Desktop sehen

1. Reiter **History** öffnen.
2. Rechtsklick auf den Commit, **Create Tag…** wählen.
3. Namen eintragen, etwa `alpha`, und bestätigen.
4. **Push origin**.

Im Terminal:

```
git tag alpha
git push origin alpha
```

## Weiterlesen

- [Pro Git, Kapitel 2.6: Taggen](https://git-scm.com/book/de/v2/Git-Grundlagen-Taggen) – Tags anlegen, ansehen, hochladen (Deutsch).
- [GitHub Docs: Verwalten von Tags in GitHub Desktop](https://docs.github.com/de/desktop/managing-commits/managing-tags-in-github-desktop) – Deutsch.
- [GitHub Docs: Informationen zu Releases](https://docs.github.com/de/repositories/releasing-projects-on-github/about-releases) – aus einem Tag ein Release mit Downloads machen (Deutsch).
