<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/state/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# Zustand

Was sich das Spiel von einem Frame zum nächsten merkt. Ist die Tür offen? Wie viele Münzen sind gesammelt? Events ändern den Zustand, Bedingungen fragen ihn ab.

Auch: Zustände, State, Variable, Variablen, Merker, Zähler, Zustandsautomat, State Machine

Verwandt: [event](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/), [condition](https://www.allknivesnobagel.com/teaching/gec1/concepts/condition/), [frame](https://www.allknivesnobagel.com/teaching/gec1/concepts/frame/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/Manual/StateMachineBasics.html


## Kurz

Jeder [Frame](https://www.allknivesnobagel.com/teaching/gec1/concepts/frame/) beginnt mit dem, was der letzte hinterlassen hat. Was dabei erhalten bleibt, ist der Zustand: Position der Spielfigur, Lebenspunkte, ob der Schlüssel schon aufgehoben ist.

Im Code steht Zustand in Variablen:

```csharp
bool hatSchluessel = false;   // ja oder nein
int muenzen = 0;              // eine Zahl
```

## Genauer

Zustand und [Event](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/) gehören zusammen. Ein Event ist ein Moment und ändert den Zustand: Beim Aufheben wird `hatSchluessel` wahr. Eine [Bedingung](https://www.allknivesnobagel.com/teaching/gec1/concepts/condition/) liest ihn später: Die Tür geht nur auf, wenn `hatSchluessel` wahr ist.

Viele Dinge im Spiel haben wenige, klar getrennte Zustände. Eine Tür ist verschlossen, zu oder offen. Zwischen ihnen gibt es feste Übergänge: Erst der Schlüssel macht aus „verschlossen“ „zu“. So ein Modell heißt **Zustandsautomat** (State Machine). Es lohnt sich, ihn erst auf Papier zu zeichnen: Kästchen für Zustände, Pfeile für Übergänge, an jeden Pfeil das Event, das ihn auslöst.

Ein häufiger Fehler: Zustand, der nirgends gespeichert ist. Fragt ein Skript nur „wird gerade E gedrückt?“, weiß es im nächsten Frame nicht mehr, dass die Tür schon offen ist.

## In Unity sehen

- Im Kit halten die Knoten **Merker** (ja oder nein) und **Zähler** (eine Zahl) Zustand. Jeder Merker hat einen Namen, etwa „Schlüssel vorhanden“.
- Öffentliche Variablen eines Skripts erscheinen im Inspector. Im Play-Modus lässt sich dort zusehen, wie sie sich ändern.
- Der **Animator** ist ein Zustandsautomat zum Ansehen: Zustände als Kästchen, Übergänge als Pfeile (Tag 4).

## Weiterlesen

- [Game Programming Patterns: State](https://gameprogrammingpatterns.com/state.html) – Robert Nystrom baut eine Spielfigur aus verknoteten `if`-Abfragen zu einem Zustandsautomaten um. Der beste Text zum Thema (englisch).
- [Unity Manual: State machine basics](https://docs.unity3d.com/6000.3/Documentation/Manual/StateMachineBasics.html) – Zustandsautomaten im Animator (Unity 6.3, englisch).
