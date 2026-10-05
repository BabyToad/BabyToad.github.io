<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/reference/ · Stand 2026-10-05T10:26Z · 915d46a -->

# Referenz

Ein Verweis auf ein anderes Objekt statt einer Kopie davon. Ein Skript, das eine Tür öffnen soll, braucht eine Referenz auf genau diese Tür. Leere Referenzen sind die häufigste Fehlerquelle.

Auch: Referenzen, Verweis, Verweise, SerializeField, GetComponent, NullReferenceException, null

Verwandt: [component](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/), [game-object](https://www.allknivesnobagel.com/teaching/gec1/concepts/game-object/), [prefab](https://www.allknivesnobagel.com/teaching/gec1/concepts/prefab/), [state](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SerializeField.html


## Kurz

Eine Referenz zeigt auf ein bestimmtes Objekt: diese Tür, diese Lampe, dieses Prefab. Sie ist keine Kopie. Was über die Referenz geändert wird, ändert das Objekt selbst.

Im Inspector erscheint eine Referenz als Feld mit einem kleinen Kreis-Symbol rechts. Hineinziehen, was gemeint ist, aus der Hierarchy oder dem Project-Fenster:

```csharp
[SerializeField] GameObject tuer;   // im Inspector die Tür hineinziehen

void Oeffnen()
{
    tuer.SetActive(false);
}
```

`[SerializeField]` zeigt ein privates Feld im Inspector an; `public` hat dieselbe Wirkung, öffnet das Feld aber auch für alle anderen Skripte.

## Genauer

Eine Referenz, die auf nichts zeigt, hat den Wert `null`. Benutzt ein Skript sie trotzdem, bricht es an dieser Stelle ab, und die Console meldet einen Fehler:

| Meldung | heißt meist |
|---|---|
| `UnassignedReferenceException` | ein Feld im Inspector ist leer geblieben |
| `NullReferenceException` | eine Referenz ist `null`, etwa weil `GetComponent` nichts gefunden hat |
| `MissingReferenceException` | das Objekt, auf das die Referenz zeigte, wurde gelöscht |

Ein Doppelklick auf die Meldung öffnet die Zeile im Code. Oft fehlt dann eine Zuweisung im Inspector.

Referenzen lassen sich auch per Code holen. `GetComponent<Rigidbody>()` sucht eine [Component](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/) am selben GameObject und liefert `null`, wenn es keine gibt.

## In Unity sehen

- Ein GameObject in ein Feld ziehen, das eine Component erwartet (etwa `Rigidbody`): Unity nimmt die passende Component dieses Objekts. Hat es keine, lässt sich das Objekt nicht hineinziehen.
- Im Kit sind Referenzen die ◆-Anschlüsse. Sie zeigen auf Objekte in der Szene; ein leerer ◆ wird als Problem gemeldet.
- Das Symbol ◆ und die blaugrüne Farbe stehen im ganzen Kurs für Referenzen.

## Weiterlesen

- [Unity Manual: Manage references](https://docs.unity3d.com/6000.3/Documentation/Manual/InspectorReferences.html) – Referenzen im Inspector zuweisen (Unity 6.3, englisch).
- [Unity Manual: Serialization rules](https://docs.unity3d.com/6000.3/Documentation/Manual/script-serialization-rules.html) – welche Felder Unity speichert und im Inspector zeigt.
- [Unity Scripting API: GameObject.GetComponent](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/GameObject.GetComponent.html) – Komponenten per Code finden.
- [Microsoft Learn: Verweistypen](https://learn.microsoft.com/de-de/dotnet/csharp/language-reference/keywords/reference-types) – was in C# ein Verweis ist, im Unterschied zu Werttypen wie `int` (Deutsch, technisch).
