<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/graph/ · Stand 2026-11-20T15:03Z · d3f31b3 -->

# Graph

Ein Logik-Graph von Besteck, gezeichnet aus Knoten und Drähten. Die Komponente Logik spielt ihn ab; Events laufen von Knoten zu Knoten, und im Play-Modus zeigt jeder Knoten, was er gerade tut.

Auch: Graphen, Logik-Graph, Logik-Graphen, Logik, Knoten, Draht, Drähte, Besteck, Kit, Rolle, Rollen, Node, Nodes

Verwandt: [event](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/), [condition](https://www.allknivesnobagel.com/teaching/gec1/concepts/condition/), [state](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/), [reference](https://www.allknivesnobagel.com/teaching/gec1/concepts/reference/)



## Kurz

Ein Logik-Graph ist eine Datei im Projekt. Darin stehen Knoten, etwa **Zone**, **Wenn**, **Bewegen**, und die Drähte dazwischen. Zusammen beschreiben sie eine Interaktion: Wenn das passiert und das gilt, geschieht dies. Abgespielt wird der Graph von der [Component](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/) **Logik** an einem GameObject, so wie ein Animator seinen Animator Controller abspielt.

Drei Drahtarten:

| Draht | trägt | Bild |
|---|---|---|
| ▶ Event | den Moment, in dem etwas passiert | orange, gestrichelt |
| ● Daten | einen Wert, der gelesen wird | violett, durchgezogen |
| ◆ Referenz | welches Objekt gemeint ist | blaugrün, doppelt |

## Genauer

Der Graph kennt keine Objekte der [Szene](https://www.allknivesnobagel.com/teaching/gec1/concepts/scene/), nur Anschlüsse für sie (◆). Einer ist immer schon da: **Dieses Objekt**, das Objekt mit der Logik (im Code: `gameObject`). Alle anderen Objekte spielen **Rollen**; die Logik hält fest, welches Objekt welche Rolle spielt, und jedes dieser Objekte trägt dann die Komponente **Rolle**. So kann derselbe Graph auf zwei Türen liegen: Jede meint sich selbst, und jede hat ihre eigenen Variablen, also ihren eigenen [Zustand](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/).

Faustregel: Was nur einem Objekt gehört, ist eine Komponente an diesem Objekt (Variable, Verhalten, Kamera). Was mehrere Objekte verbindet, steht in einem Graph.

Jeder Knoten ist eine kleine C#-Klasse. **Code ansehen** (`</>` am Knoten) zeigt sie. Eigene Knoten folgen demselben Muster: Markierungen wie `[Input("…")]`, `[Output("…")]` und `[Ref("…")]` machen aus Methoden und Feldern Anschlüsse. Eigene Knoten liegen immer in `Assets/Eigene Knoten`; **Tools › Besteck › Eigener Knoten (C#)** legt die beiden Dateien dafür an.

Im Play-Modus meldet jeder Knoten seinen Zustand: ○ empfangen, ▬ läuft, ✓ fertig, ⛔ blockiert (mit Grund), ! Fehler. Ein Knoten mit Fehler feuert seinen Erfolgs-Ausgang nie.

## In Unity sehen

- **Tools › Besteck › Beispiel „Schlüssel und Tür“ bauen** legt ein fertiges Beispiel an.
- Ein Objekt auswählen, **Add Component › Besteck › Logik**, dann im Inspector **Neu**: Der neue Graph öffnet sich mit **Dieses Objekt** darin.
- **Graph öffnen** an der Logik oder ein Doppelklick auf die Datei öffnet den Graph. „+ Knoten“ unten links holt Knoten.

## Weiterlesen

- [Tag 3](https://www.allknivesnobagel.com/teaching/gec1/days/03/) – Schlüssel und Tür Schritt für Schritt, mit Bildern aus dem Editor.
- [Unity Manual: Graph Toolkit](https://docs.unity3d.com/Packages/com.unity.graphtoolkit@0.4/manual/index.html) – das Werkzeug, auf dem der Graph-Editor von Besteck aufbaut (englisch, experimentell).
