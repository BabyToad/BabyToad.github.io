<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/animator/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# Animator

Die Komponente, die entscheidet, welcher Animation Clip gerade läuft. Ihr Animator Controller ist ein Zustandsautomat aus Zuständen, Übergängen und Parametern, die von außen gesetzt werden.

Auch: Animator Controller, Animator-Fenster, Übergang, Übergänge, Transition, Transitions, Has Exit Time, Animator-Wert, Parameter

Verwandt: [animation](https://www.allknivesnobagel.com/teaching/gec1/concepts/animation/), [state](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/), [event](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/), [condition](https://www.allknivesnobagel.com/teaching/gec1/concepts/condition/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/Manual/class-Transition.html


## Kurz

Ein [Animation Clip](https://www.allknivesnobagel.com/teaching/gec1/concepts/animation/) beschreibt eine Bewegung. Der Animator entscheidet, welche gerade dran ist. Dazu hängt an ihm ein **Animator Controller**: eine Datei, die einen [Zustandsautomaten](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/) enthält.

- **Zustände** (Kästchen): Jeder spielt einen Clip, oder keinen.
- **Übergänge** (Pfeile): von einem Zustand zum nächsten.
- **Parameter**: Werte, die ein Übergang abfragt. Typen: Trigger, Bool, Int, Float.

Ein Zustand ist der Standard (orange im Animator-Fenster); in ihm beginnt alles.

## Genauer

Ein **Trigger** ist ein Parameter für einen Moment: Er wird gesetzt, ein Übergang verbraucht ihn, danach ist er wieder aus. Er passt zu einem [Event](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/) wie „Truhe benutzt“. Ein **Bool** bleibt stehen, bis er wieder umgestellt wird, und passt zu einem Zustand wie „Licht an“.

**Has Exit Time** ist bei neuen Übergängen eingeschaltet. Dann wartet der Übergang, bis der Clip des aktuellen Zustands einen bestimmten Punkt erreicht hat, und prüft erst danach seine Bedingungen. Hat ein Übergang gar keine Bedingung, geht er nach dieser Zeit von selbst. Für alles, was sofort auf eine Handlung reagieren soll: Has Exit Time aus, eine Bedingung hinzufügen.

Was ein Animator animiert, schreibt er in jedem [Frame](https://www.allknivesnobagel.com/teaching/gec1/concepts/frame/) neu. Ein anderer Knoten oder ein Skript, das denselben Wert ändert, kommt dagegen nicht an. Bewegt der Kit-Knoten **Bewegen** also dieselbe Drehung, die auch ein Clip animiert, gewinnt der Animator.

## Im Kit

Der Knoten **Animator-Wert** setzt einen Parameter: Animator als Ziel, Name des Parameters, Art (Trigger, Ja/Nein, Zahl, Ganzzahl). Passt der Name oder die Art nicht zum Animator Controller, meldet der Knoten den Fehler im Graphen und in der Console, statt still nichts zu tun. „Gesetzt“ heißt nur, dass der Parameter gesetzt ist, nicht, dass die Animation schon gelaufen ist.

## In Unity sehen

- **Window › Animation › Animator** zeigt den Controller des ausgewählten Objekts. Im Play-Modus läuft im aktiven Zustand ein blauer Fortschrittsbalken mit.
- Rechtsklick auf die freie Fläche: **Create State › Empty**. Rechtsklick auf einen Zustand: **Make Transition**, dann auf das Ziel klicken.
- Links im Reiter **Parameters** mit **+** einen Parameter anlegen.
- Einen Übergang anklicken: Im Inspector stehen **Has Exit Time** und unten **Conditions**.

## Weiterlesen

- [Unity Manual: Animation transitions](https://docs.unity3d.com/6000.3/Documentation/Manual/class-Transition.html) – Has Exit Time, Dauer, Bedingungen (Unity 6.3, englisch).
- [Unity Manual: Animation parameters](https://docs.unity3d.com/6000.3/Documentation/Manual/AnimationParameters.html) – die vier Parametertypen (englisch).
- [Game Programming Patterns: State](https://gameprogrammingpatterns.com/state.html) – warum Zustandsautomaten so viele `if`-Abfragen ersetzen (englisch).
