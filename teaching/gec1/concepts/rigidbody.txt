<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/rigidbody/ · Stand 2026-10-03T17:07Z · ddec830 -->

# Rigidbody

Die Component, die ein GameObject der Physik übergibt. Es fällt, lässt sich anstoßen und prallt ab. Bewegt wird es dann mit Kräften, nicht mehr über die Transform.

Auch: Rigidbodies, Physik, Kraft, Kräfte, AddForce, Is Kinematic, kinematisch, Schwerkraft

Verwandt: [collision](https://www.allknivesnobagel.com/teaching/gec1/concepts/collision/), [transform](https://www.allknivesnobagel.com/teaching/gec1/concepts/transform/), [vector](https://www.allknivesnobagel.com/teaching/gec1/concepts/vector/), [component](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.html


## Kurz

Ein Würfel mit Collider ist fest, bleibt aber in der Luft stehen. Erst ein **Rigidbody** übergibt ihn der Physik: Er fällt, rollt, prallt ab und lässt sich anstoßen.

Wichtige Einstellungen im Inspector:

| Feld | macht |
|---|---|
| Mass | Masse in Kilogramm, Standard 1. Ändert nicht, wie schnell etwas fällt |
| Linear Damping | bremst die Bewegung, wie Luftwiderstand |
| Use Gravity | Schwerkraft an oder aus |
| Is Kinematic | die Physik bewegt das Objekt nicht mehr; ein Skript oder eine Animation tut es |

## Genauer

Mit Rigidbody gilt: Die Physik bestimmt die Position. Wer stattdessen die [Transform](https://www.allknivesnobagel.com/teaching/gec1/concepts/transform/) direkt verschiebt, arbeitet gegen sie; das Objekt ruckelt oder rutscht durch Wände. Bewegt wird also über den Rigidbody, meist mit einer Kraft:

```csharp
Rigidbody rb;

void Start()
{
    rb = GetComponent<Rigidbody>();
    rb.AddForce(Vector3.up * 5f, ForceMode.Impulse);   // ein Stoß nach oben
}
```

Eine Kraft ist ein [Vektor](https://www.allknivesnobagel.com/teaching/gec1/concepts/vector/): Richtung und Stärke. `ForceMode.Impulse` gibt einen einzelnen Stoß, etwa für einen Sprung. Ohne Angabe wirkt die Kraft als gleichmäßiges Schieben und gehört dann in `FixedUpdate()`. Die Physik rechnet nämlich in festem Takt, unabhängig von der Bildrate (Standard: 50 Mal pro Sekunde).

**Kinematisch** heißt: Das Objekt nimmt an Kollisionen teil und schiebt andere weg, wird selbst aber nicht geschoben. Typisch für Aufzüge und bewegte Plattformen.

Achtung beim Lesen älterer Tutorials: In Unity 6.3 heißen `velocity` und `drag` jetzt `linearVelocity` und `linearDamping`.

## In Unity sehen

- **Add Component › Rigidbody** an einen Würfel über dem Boden, Play drücken: Er fällt.
- Im Kit stößt der Knoten **Kraft** einen Rigidbody an.
- Kollisionsmeldungen hängen vom Rigidbody ab, siehe [Kollision](https://www.allknivesnobagel.com/teaching/gec1/concepts/collision/).

## Weiterlesen

- [Unity Manual: Introduction to rigid body physics](https://docs.unity3d.com/6000.3/Documentation/Manual/RigidbodiesOverview.html) – Physik statt Transform, kinematische Körper, Schlafmodus (Unity 6.3, englisch).
- [Unity Manual: Rigidbody component reference](https://docs.unity3d.com/6000.3/Documentation/Manual/class-Rigidbody.html) – jedes Feld im Inspector.
- [Unity Scripting API: Rigidbody.AddForce](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Rigidbody.AddForce.html) – Kräfte und ihre Modi.
- [Catlike Coding: Physics](https://catlikecoding.com/unity/tutorials/movement/physics/) – eine Kugel per Rigidbody steuern, mit Springen und Bodenkontakt. Für eine ältere Unity-Version geschrieben, daher noch mit `velocity` (englisch).
