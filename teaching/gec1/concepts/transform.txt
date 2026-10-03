<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/transform/ · Stand 2026-10-03T17:07Z · ddec830 -->

# Transform

Die Component, die Position, Drehung und Größe eines GameObjects hält. Jedes GameObject hat genau eine. Bei Kindobjekten gelten die Werte relativ zum Elternobjekt.

Auch: Transforms, Position, Rotation, Scale, Elternobjekt, Kindobjekt, lokale Koordinaten, Weltkoordinaten

Verwandt: [game-object](https://www.allknivesnobagel.com/teaching/gec1/concepts/game-object/), [component](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/), [vector](https://www.allknivesnobagel.com/teaching/gec1/concepts/vector/), [scene](https://www.allknivesnobagel.com/teaching/gec1/concepts/scene/), [rigidbody](https://www.allknivesnobagel.com/teaching/gec1/concepts/rigidbody/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.html


## Kurz

Jedes [GameObject](https://www.allknivesnobagel.com/teaching/gec1/concepts/game-object/) hat eine Transform-[Component](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/). Sie lässt sich nicht entfernen. Sie hält drei Werte, jeweils für x, y und z:

| Feld | bedeutet |
|---|---|
| Position | wo das Objekt steht |
| Rotation | wie es gedreht ist, in Grad |
| Scale | wie groß es ist; 1 ist die Originalgröße |

Eine Einheit gilt in Unity als ein Meter. Die Physik rechnet damit: Ein Würfel mit Kantenlänge 50 fällt wie ein Hochhaus, also scheinbar in Zeitlupe.

## Lokal und Welt

GameObjects lassen sich verschachteln. In der Hierarchy ein Objekt auf ein anderes ziehen: Es wird zum Kindobjekt. Ein Kind bewegt, dreht und skaliert sich mit seinem Elternobjekt mit.

Der Inspector zeigt die Werte eines Kindobjekts **relativ zum Elternobjekt**. Das sind lokale Koordinaten. Ein Objekt ohne Elternobjekt steht direkt in Weltkoordinaten.

Ein Beispiel: Ein Schlüssel liegt als Kind eines Tisches bei (0, 1, 0). Steht der Tisch bei (5, 0, 2), liegt der Schlüssel in der Welt bei (5, 1, 2), solange der Tisch weder gedreht noch skaliert ist.

```csharp
transform.localPosition   // relativ zum Elternobjekt, wie im Inspector
transform.position        // in der Welt
```

## In Unity sehen

- In der Scene-Ansicht verschieben, drehen und skalieren die Werkzeuge **Move**, **Rotate** und **Scale** (Tasten W, E, R). Die Achsen sind farbig: x rot, y grün, z blau.
- Tipp aus der Unity-Doku: Ein leeres Elternobjekt vor dem Einhängen auf (0, 0, 0) setzen, ungedreht, Scale 1. Dann sind die lokalen Werte der Kinder gleich ihren Weltwerten.
- Scale nie auf 0 setzen; das führt zu Rechenfehlern beim Zeichnen.
- Hat ein Objekt einen [Rigidbody](https://www.allknivesnobagel.com/teaching/gec1/concepts/rigidbody/), bewegt es die Physik. Die Transform dann nicht zusätzlich per Skript verschieben.

## Weiterlesen

- [Unity Manual: Transforms](https://docs.unity3d.com/6000.3/Documentation/Manual/class-Transform.html) – Felder, Werkzeuge, Eltern und Kinder, Scale (Unity 6.3, englisch).
- [Unity Scripting API: Transform](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Transform.html) – alles, was ein Skript mit `transform` tun kann.
- [Catlike Coding: Game Objects and Scripts](https://catlikecoding.com/unity/tutorials/basics/game-objects-and-scripts/) – eine Uhr aus verschachtelten Objekten, deren Zeiger ein Skript über ihre Transform dreht. Ausführliches Tutorial in Bildern (englisch).
