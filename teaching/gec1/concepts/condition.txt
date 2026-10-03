<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/condition/ · Stand 2026-10-03T17:15Z · a299914 -->

# Bedingung

Eine Frage mit der Antwort ja oder nein, etwa „Hat die Spielfigur den Schlüssel?“. Je nach Antwort geht es auf dem einen oder dem anderen Weg weiter.

Auch: Bedingungen, if, Wenn, Vergleich, bool, Verzweigung

Verwandt: [state](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/), [event](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/GameObject.CompareTag.html


## Kurz

Eine Bedingung ist eine Weiche. Sie stellt eine Frage, deren Antwort nur ja oder nein sein kann, und schickt den Ablauf je nach Antwort weiter.

```csharp
if (hatSchluessel)
{
    tuer.SetActive(false);    // ja: Tür verschwindet
}
else
{
    Debug.Log("Verschlossen.");   // nein
}
```

## Genauer

Die Frage richtet sich fast immer an einen [Zustand](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/): Ist der Merker gesetzt? Ist der Zähler bei 3? Ist der Abstand kleiner als 2 Meter? Ausgelöst wird sie meist von einem [Event](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/). Daraus ergibt sich ein Muster, das in fast jeder Interaktion steckt: **Event, Bedingung, Aktion.** Wenn etwas passiert und etwas gilt, folgt eine Reaktion.

Vergleiche liefern ja oder nein:

| Schreibweise | fragt |
|---|---|
| `a == b` | gleich? (zwei Gleichheitszeichen; eines allein weist zu) |
| `a != b` | ungleich? |
| `a < b`, `a >= b` | kleiner? mindestens? |
| `x && y` | beides wahr? |
| `x \|\| y` | mindestens eins wahr? |
| `!x` | nicht wahr? |

Ein Ja/Nein-Wert hat in C# den Typ `bool`, mit den Werten `true` und `false`.

## In Unity sehen

Im Kit prüft der Knoten **Wenn** seine Bedingung in dem Moment, in dem ein Event ankommt, und schickt es zu **Ja** oder **Nein**. Die Bedingung kommt über eine Datenleitung, etwa von einem **Merker** oder einem **Vergleich**, der eine Zahl prüft.

Bei Zonen und Zusammenstößen filtert oft ein Tag: `other.CompareTag("Player")` fragt, ob das, was hereinkam, die Spielfigur ist.

## Weiterlesen

- [Microsoft Learn: if- und switch-Anweisungen](https://learn.microsoft.com/de-de/dotnet/csharp/language-reference/statements/selection-statements) – die C#-Referenz auf Deutsch, knapp und mit Beispielen.
- [Microsoft Learn: Boolesche logische Operatoren](https://learn.microsoft.com/de-de/dotnet/csharp/language-reference/operators/boolean-logical-operators) – `&&`, `||`, `!` im Detail (Deutsch).
- [Game Programming Patterns: State](https://gameprogrammingpatterns.com/state.html) – zeigt, wann zu viele verschachtelte `if` unübersichtlich werden und was dann hilft (englisch).
