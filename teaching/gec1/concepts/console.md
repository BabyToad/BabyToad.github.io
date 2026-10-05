<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/console/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# Console

Das Fenster, in dem Unity und eure Skripte melden, was passiert und was schiefgeht. Rot sind Fehler, gelb Warnungen, weiß Hinweise. Ein Doppelklick führt zur Zeile im Code.

Auch: Konsole, Fehlermeldung, Fehlermeldungen, Debug.Log, Exception, Compilerfehler

Verwandt: [reference](https://www.allknivesnobagel.com/teaching/gec1/concepts/reference/), [update](https://www.allknivesnobagel.com/teaching/gec1/concepts/update/), [event](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/Manual/Console.html


## Kurz

Die Console ist das Logbuch des Editors: **Window › General › Console**, oder Strg + Umschalt + C (Mac: Cmd + Umschalt + C). Jede Zeile ist eine Meldung.

| Symbol | heißt | Beispiel |
|---|---|---|
| rot | Fehler | `UnassignedReferenceException: The variable fluegel of Windrad has not been assigned.` |
| gelb | Warnung | `[Kit] Vor Play: Lampe › An/Aus: ◆ Objekt fehlt` |
| weiß | Hinweis | was ein Skript mit `Debug.Log("…")` schreibt |

## Genauer

Zwei Sorten roter Meldungen fühlen sich verschieden an:

- **Kompilierfehler** (`error CS…`): Ein Skript ist kein gültiges C#, etwa weil ein Semikolon fehlt. Unity kann dann gar nichts mehr ausführen; Play bleibt gesperrt mit „All compiler errors have to be fixed before you can enter playmode!“.
- **Laufzeitfehler** (Exception): Das Skript bricht an einer Stelle ab, das Spiel läuft weiter. Kommt der Fehler aus `Update()` oder `FixedUpdate()`, steht er in jedem Frame neu da.

Lesen von oben: Der erste Fehler ist oft die Ursache der folgenden. Ein Doppelklick auf eine Meldung öffnet das Skript an der Zeile, aus der sie kam. Häufig ist die Zeile richtig und die Ursache liegt im Inspector, etwa ein leeres Feld (siehe [Referenz](https://www.allknivesnobagel.com/teaching/gec1/concepts/reference/)).

Die Knöpfe oben:

| Knopf | macht |
|---|---|
| Clear | leert die Liste, Kompilierfehler bleiben stehen; im Pfeil daneben: Clear on Play, Clear on Build, Clear on Recompile |
| Collapse | fasst gleiche Meldungen zu einer Zeile mit Zähler zusammen |
| Error Pause | hält das Spiel an, sobald ein Skript einen Fehler meldet |

Nicht jeder Fehler meldet sich. Eine Kiste ohne Rigidbody schwebt, ohne dass die Console etwas sagt. Dann hilft nur Hinsehen: Szene, Inspector, im Kit der Graph.

## In Unity sehen

- Ein Skript mit `Debug.Log("Hallo");` in `Start()` schreibt eine weiße Zeile.
- Das Kit meldet sich mit `[Kit]` am Anfang. Vor Play prüft es alle Interaktionen und schreibt, was fehlt.
- Die Zahlen oben rechts zählen Hinweise, Warnungen und Fehler; ein Klick blendet die Sorte aus.

## Weiterlesen

- [Unity Manual: Console window](https://docs.unity3d.com/6000.3/Documentation/Manual/Console.html) – alle Knöpfe und Einstellungen (Unity 6.3, englisch).
- [Unity Scripting API: Debug.Log](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Debug.Log.html) – eigene Meldungen schreiben.
