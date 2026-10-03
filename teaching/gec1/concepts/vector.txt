<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/vector/ · Stand 2026-10-03T22:11Z · 981ef7d -->

# Vektor

Drei Zahlen x, y, z. Sie beschreiben einen Punkt im Raum oder eine Richtung mit Länge, etwa eine Bewegung oder eine Kraft. In Unity heißt der Typ Vector3.

Auch: Vektoren, Vector3, Vector2, Richtung, magnitude, normalized

Verwandt: [transform](https://www.allknivesnobagel.com/teaching/gec1/concepts/transform/), [delta-time](https://www.allknivesnobagel.com/teaching/gec1/concepts/delta-time/), [rigidbody](https://www.allknivesnobagel.com/teaching/gec1/concepts/rigidbody/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Vector3.html


## Kurz

Ein Vektor ist ein Bündel aus drei Zahlen: `(x, y, z)`. Unity verwendet dafür den Typ `Vector3`; für 2D gibt es `Vector2`.

Derselbe Typ kann zweierlei bedeuten:

| als | Beispiel | gelesen als |
|---|---|---|
| Punkt | `transform.position` | hier steht etwas |
| Richtung mit Länge | Geschwindigkeit, Kraft, Versatz | so weit in diese Richtung |

In Unity zeigt y nach oben. `Vector3.up` ist `(0, 1, 0)`, `Vector3.forward` ist `(0, 0, 1)`, `Vector3.right` ist `(1, 0, 0)`.

## Genauer

Drei Rechnungen reichen für das meiste:

- **Addieren:** Punkt plus Versatz ergibt einen neuen Punkt. `boden + new Vector3(0, 5, 0)` liegt fünf Einheiten über dem Boden.
- **Subtrahieren:** Ziel minus Start ergibt den Pfeil vom Start zum Ziel. Seine Länge ist der Abstand.
- **Mit einer Zahl malnehmen:** Die Richtung bleibt, die Länge ändert sich.

Die Länge heißt `magnitude`. `normalized` liefert denselben Pfeil mit Länge 1: nur noch Richtung. Mit Tempo und [deltaTime](https://www.allknivesnobagel.com/teaching/gec1/concepts/delta-time/) malgenommen, wird daraus eine Bewegung pro Sekunde:

```csharp
Vector3 zumZiel = ziel.position - transform.position;   // Pfeil zum Ziel
float abstand = zumZiel.magnitude;                       // wie weit
transform.position += zumZiel.normalized * tempo * Time.deltaTime;
```

## In Unity sehen

Position, Rotation und Scale in der [Transform](https://www.allknivesnobagel.com/teaching/gec1/concepts/transform/) sind je drei Zahlen. Position und Scale sind `Vector3`. Die Rotation zeigt der Inspector als drei Winkel, intern speichert Unity sie anders (als Quaternion).

## Weiterlesen

- [Unity Manual: Moving objects with vectors](https://docs.unity3d.com/6000.3/Documentation/Manual/scripting-vectors.html) – Addieren, Subtrahieren, Abstand, Richtung, Skalarprodukt, mit Beispielen (Unity 6.3, englisch).
- [Unity Scripting API: Vector3](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Vector3.html) – alle Funktionen, etwa `Distance`, `Lerp`, `MoveTowards`.
- [Freya Holmér: Math for Game Devs, Teil 1](https://www.youtube.com/watch?v=fjOdtSu4Lm4) – Zahlen, Vektoren, Skalarprodukt; aufgezeichnete Live-Vorlesung mit sehr klaren Zeichnungen. Rund vier Stunden, der Anfang reicht für diesen Begriff (englisch).
