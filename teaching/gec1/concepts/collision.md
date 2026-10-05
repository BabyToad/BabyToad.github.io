<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/collision/ · Stand 2026-10-05T12:36Z · 9fcef5f -->

# Kollision

Zwei Collider berühren sich. Ein normaler Collider ist fest, Dinge prallen ab. Ein Trigger ist durchlässig und meldet nur, dass etwas hineinkommt oder hinausgeht.

Auch: Kollisionen, Collider, Trigger, Is Trigger, OnCollisionEnter, OnTriggerEnter, Zusammenstoß, Zone

Verwandt: [rigidbody](https://www.allknivesnobagel.com/teaching/gec1/concepts/rigidbody/), [event](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/), [component](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/), [condition](https://www.allknivesnobagel.com/teaching/gec1/concepts/condition/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Collider.OnTriggerEnter.html


## Kurz

Für die Physik besteht ein Objekt aus seinem **Collider**: einer einfachen, unsichtbaren Form wie Box, Kugel oder Kapsel. Wie das Objekt aussieht, spielt für Kollisionen keine Rolle.

Ein Collider kann zweierlei sein:

| | normaler Collider | Trigger (**Is Trigger** an) |
|---|---|---|
| fühlt sich an wie | Wand, Boden, Kiste | unsichtbare Lichtschranke |
| andere Objekte | prallen ab | gehen hindurch |
| meldet | `OnCollisionEnter` (Aufprall) | `OnTriggerEnter` (betreten), `OnTriggerExit` (verlassen) |

Beide Meldungen sind [Events](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/): Unity ruft die Methode genau in dem Moment auf, in dem es passiert.

## Genauer

Unity meldet nicht jede Berührung. Mindestens eines der beiden Objekte braucht einen [Rigidbody](https://www.allknivesnobagel.com/teaching/gec1/concepts/rigidbody/):

- **Aufprall-Meldungen** gibt es nur, wenn mindestens ein Objekt einen Rigidbody hat, bei dem **Is Kinematic** aus ist. Zwei Wände ohne Rigidbody melden sich nie, auch wenn sie sich überlappen.
- **Trigger-Meldungen** gibt es, wenn mindestens eines der Objekte einen Rigidbody hat, auch einen kinematischen. Meist ist der Trigger fest und das Objekt, das hindurchgeht, hat den Rigidbody.

Die Spielfigur des Kits hat keinen Rigidbody, sondern einen **CharacterController**. Der löst Trigger trotzdem aus.

```csharp
void OnTriggerEnter(Collider other)   // auf dem Objekt mit dem Trigger
{
    if (other.CompareTag("Player"))
        Debug.Log("Spielfigur ist in der Zone");
}
```

## In Unity sehen

- Ein Collider ist eine [Component](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/). Ausgewählt zeigt die Scene-Ansicht seine Form als grünen Drahtrahmen.
- Trigger anlegen: ein leeres GameObject, einen Box Collider dazu, **Is Trigger** anhaken. Meist bleibt ein Trigger unsichtbar.
- Kommt keine Meldung an, die Regeln oben prüfen: Rigidbody vorhanden? Is Trigger auf der richtigen Seite? Stimmt der Tag?
- Im Kit melden die Knoten **Zone** (Trigger) und **Zusammenstoß** (Aufprall). Die Zone warnt, wenn ihr Collider kein Trigger ist.

## Weiterlesen

- [Unity Manual: Interaction between collider types](https://docs.unity3d.com/6000.3/Documentation/Manual/collider-types-interaction.html) – die vollständige Tabelle, welche Kombination welche Meldung auslöst (Unity 6.3, englisch).
- [Unity Manual: OnTrigger events](https://docs.unity3d.com/6000.3/Documentation/Manual/collider-interactions-ontrigger.html) und [OnCollision events](https://docs.unity3d.com/6000.3/Documentation/Manual/collider-interactions-oncollision.html) – Enter, Stay, Exit mit Beispielskript.
- [Unity Manual: Create and configure a trigger collider](https://docs.unity3d.com/6000.3/Documentation/Manual/collider-interactions-create-trigger.html) – Schritt für Schritt.
- [Unity Manual: Character Controller](https://docs.unity3d.com/6000.3/Documentation/Manual/class-CharacterController.html) – warum Spielfiguren oft keinen Rigidbody haben.
