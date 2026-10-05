<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/graph/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# Graph

Eine Interaktion des Kurs-Pakets, gezeichnet aus Knoten und Drähten. Events laufen durch die Drähte von Knoten zu Knoten; im Play-Modus zeigt jeder Knoten, was er gerade tut.

Auch: Graphen, Knoten, Draht, Drähte, Kit, Interaktion, Interaktionen, Node, Nodes

Verwandt: [event](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/), [condition](https://www.allknivesnobagel.com/teaching/gec1/concepts/condition/), [state](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/), [reference](https://www.allknivesnobagel.com/teaching/gec1/concepts/reference/)



## Kurz

Ein Graph ist eine Datei mit der Endung `.kit`. Darin stehen Knoten, etwa **Zone**, **Wenn**, **Bewegen**, und die Drähte dazwischen. Zusammen beschreiben sie eine Interaktion: Wenn das passiert und das gilt, geschieht dies.

Drei Drahtarten:

| Draht | trägt | Bild |
|---|---|---|
| ▶ Event | den Moment, in dem etwas passiert | orange, gestrichelt |
| ● Daten | einen Wert, der gelesen wird | violett, durchgezogen |
| ◆ Referenz | welches Objekt gemeint ist | blaugrün, doppelt |

## Genauer

Der Graph kennt keine Objekte der [Szene](https://www.allknivesnobagel.com/teaching/gec1/concepts/scene/), nur Plätze für sie. Die Component **Interaktion** an einem GameObject verbindet einen Graph mit der Szene: Sie hält die Tabelle, welches Objekt welchen Platz füllt. So kann derselbe Graph an zwei Türen hängen, und jede hat ihren eigenen [Zustand](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/).

Jeder Knoten ist eine kleine C#-Klasse. **Code ansehen** (`</>` am Knoten) zeigt sie. Eigene Knoten folgen demselben Muster: Markierungen wie `[Input("…")]`, `[Output("…")]` und `[Ref("…")]` machen aus Methoden und Feldern Anschlüsse. Eigene Knoten liegen immer in `Assets/Eigene Knoten`; **Tools › Kit › Eigener Knoten (C#)** legt die beiden Dateien dafür an.

Im Play-Modus meldet jeder Knoten seinen Zustand: ○ empfangen, ▬ läuft, ✓ fertig, ⛔ blockiert (mit Grund), ! Fehler. Ein Knoten mit Fehler feuert seinen Erfolgs-Ausgang nie.

## In Unity sehen

- **Tools › Kit › Beispiel „Schlüssel und Tür“ bauen** legt ein fertiges Beispiel an.
- **GameObject › Kit › Interaktion** legt eine neue Interaktion an; im Inspector **Neuer Graph …**.
- Doppelklick auf eine `.kit`-Datei öffnet den Graph. „+ Knoten“ unten links holt Knoten.

## Weiterlesen

- [Tag 3](https://www.allknivesnobagel.com/teaching/gec1/days/03/) – Schlüssel und Tür Schritt für Schritt, mit Bildern aus dem Editor.
- [Unity Manual: Graph Toolkit](https://docs.unity3d.com/Packages/com.unity.graphtoolkit@0.4/manual/index.html) – das Werkzeug, auf dem der Graph-Editor des Kits aufbaut (englisch, experimentell).
