<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/event/ · Stand 2026-10-03T17:15Z · a299914 -->

# Event

Ein Moment, in dem etwas passiert, zum Beispiel ein Tastendruck, ein Betreten oder ein Aufprall. Das Spiel reagiert genau dann, statt in jedem Frame nachzusehen.

Auch: Events, Ereignis, Ereignisse, Auslöser, UnityEvent

Verwandt: [state](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/), [condition](https://www.allknivesnobagel.com/teaching/gec1/concepts/condition/), [collision](https://www.allknivesnobagel.com/teaching/gec1/concepts/collision/), [update](https://www.allknivesnobagel.com/teaching/gec1/concepts/update/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Events.UnityEvent.html


## Kurz

Ein Event ist ein Zeitpunkt: Eine Taste wird gedrückt, die Spielfigur betritt eine Zone, zwei Objekte stoßen zusammen. Darauf lässt sich eine Reaktion hängen: Dann öffnet sich die Tür, dann spielt ein Ton.

Ein Event dauert nicht. Was dauert, ist ein [Zustand](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/): „Taste wird gedrückt“ ist ein Event, „Taste ist unten“ ist ein Zustand.

## Genauer

Ein Spiel kann auf zwei Arten mitbekommen, dass etwas passiert:

| Art | wie | Beispiel |
|---|---|---|
| Nachsehen | in jedem [Frame](https://www.allknivesnobagel.com/teaching/gec1/concepts/frame/) in [Update](https://www.allknivesnobagel.com/teaching/gec1/concepts/update/) fragen | „Ist die Spielfigur schon nah genug?“ |
| Event | die Engine meldet sich, wenn es passiert | Unity ruft `OnTriggerEnter` auf, sobald etwas die Zone betritt |

Viele Methoden in Unity-Skripten sind solche Meldungen. Unity nennt sie Event Functions: `Start()` einmal vor dem ersten `Update()`, `OnTriggerEnter()` beim Betreten eines Triggers, `OnCollisionEnter()` beim Aufprall (siehe [Kollision](https://www.allknivesnobagel.com/teaching/gec1/concepts/collision/)).

```csharp
void OnTriggerEnter(Collider other)
{
    if (other.CompareTag("Player"))   // eine Bedingung filtert das Event
        tuer.SetActive(false);
}
```

Daneben gibt es Events, die sich im Inspector verdrahten lassen (`UnityEvent`). Ein UI-Button hat zum Beispiel die Liste **On Click ()**: Dort wird eingetragen, was beim Klick passieren soll, ganz ohne Code.

## In Unity sehen

Im Kit beginnt jede Kette mit einem Auslöser-Knoten: **Start**, **Taste**, **Zone**, **Zusammenstoß**, **Benutzen**. Er feuert ein Event; die Drähte tragen es weiter zu **Wenn**, **Warten** oder einer Aktion. Im laufenden Spiel zeigt der Graph, wann ein Event durchläuft.

## Weiterlesen

- [Unity Manual: Event functions](https://docs.unity3d.com/6000.3/Documentation/Manual/event-functions.html) – welche Methoden Unity wann aufruft (Unity 6.3, englisch).
- [Unity Manual: Inspector-configurable custom events](https://docs.unity3d.com/6000.3/Documentation/Manual/unity-events.html) – `UnityEvent` im Inspector verdrahten.
- [Game Programming Patterns: Observer](https://gameprogrammingpatterns.com/observer.html) – Robert Nystrom erklärt, wie ein Teil des Spiels Bescheid gibt, ohne zu wissen, wer zuhört. Mit Beispiel aus einem Achievement-System (englisch).
- [Ryan Hipple: Game Architecture with Scriptable Objects](https://www.youtube.com/watch?v=raQ3iHhE_Kk) – Vortrag auf der Unite Austin 2017, rund eine Stunde. Baut Events als Assets im Projekt; für später, wenn ein Projekt wächst (englisch).
