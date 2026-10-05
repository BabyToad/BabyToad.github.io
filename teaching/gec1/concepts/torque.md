<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/torque/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# Drehmoment

Eine Kraft, die einen Rigidbody um eine Achse dreht, statt ihn zu verschieben. In Unity heißt das AddTorque. Richtung und Länge des Vektors geben Achse und Stärke.

Auch: Torque, AddTorque, Drehung, Drehmomente, Drehimpuls

Verwandt: [rigidbody](https://www.allknivesnobagel.com/teaching/gec1/concepts/rigidbody/), [vector](https://www.allknivesnobagel.com/teaching/gec1/concepts/vector/), [collision](https://www.allknivesnobagel.com/teaching/gec1/concepts/collision/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.AddTorque.html


## Kurz

Eine Kraft schiebt einen [Rigidbody](https://www.allknivesnobagel.com/teaching/gec1/concepts/rigidbody/) in eine Richtung. Ein Drehmoment dreht ihn um eine Achse: ein Drehkreuz, ein Windrad, eine Kiste, die sich beim Wegfliegen überschlägt.

```csharp
// ein Ruck um die senkrechte Achse
rb.AddTorque(Vector3.up * 4f, ForceMode.Impulse);
```

## Genauer

Das Drehmoment ist ein [Vektor](https://www.allknivesnobagel.com/teaching/gec1/concepts/vector/). Seine Richtung ist die Drehachse, seine Länge die Stärke. `Vector3.up` dreht um die senkrechte Achse wie ein Karussell, `Vector3.right` wie ein Rad, das auf euch zurollt, `Vector3.forward` wie die Zeiger einer Uhr, auf die ihr schaut.

Wie bei `AddForce` gibt es zwei übliche Arten:

| Art | wirkt | wohin im Code |
|---|---|---|
| `ForceMode.Impulse` | ein einzelner Ruck | beim Event, z. B. beim Tastendruck |
| `ForceMode.Force` (Standard) | gleichmäßig in jedem Physik-Schritt | in `FixedUpdate()` |

Was bremst: **Angular Damping** am Rigidbody, sonst dreht sich etwas ohne Reibung sehr lange weiter. Was sperrt: **Constraints › Freeze Rotation** verhindert die Drehung um einzelne Achsen. Ein kinematischer Rigidbody reagiert auf kein Drehmoment.

Eine Kraft, die nicht am Schwerpunkt angreift, erzeugt ebenfalls ein Drehmoment: `AddForceAtPosition` stößt an einer Stelle, und der Körper schiebt sich und dreht sich zugleich.

## In Unity sehen

- Ein flacher Würfel als Arm, Rigidbody mit Use Gravity aus, Constraints: Position ganz gesperrt, Drehung nur um Y frei. Ein Drehmoment um `Vector3.up` macht ein Drehkreuz.
- Das Kit hat einen Knoten **Kraft**, aber keinen für Drehmoment. Wie ein eigener Knoten dafür aussieht, steht in [Tag 3](https://www.allknivesnobagel.com/teaching/gec1/days/03/).

## Weiterlesen

- [Unity Scripting API: Rigidbody.AddTorque](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.AddTorque.html) – mit Beispiel (Unity 6.3, englisch).
- [Unity Scripting API: ForceMode](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/ForceMode.html) – die vier Arten, eine Kraft wirken zu lassen.
- [Unity Manual: Rigidbody component reference](https://docs.unity3d.com/6000.3/Documentation/Manual/class-Rigidbody.html) – Angular Damping und Constraints.
