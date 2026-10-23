<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1-vorschau/concepts/update/ · Stand 2026-10-23T13:18Z · f266f45 -->

# Update

Die Methode, die Unity in jedem Frame auf jedem aktiven Skript aufruft. Hier passiert alles, was laufend geschehen soll.

Auch: Update(), void Update

Verwandt: [frame](https://www.allknivesnobagel.com/teaching/gec1-vorschau/concepts/frame/), [delta-time](https://www.allknivesnobagel.com/teaching/gec1-vorschau/concepts/delta-time/), [component](https://www.allknivesnobagel.com/teaching/gec1-vorschau/concepts/component/)

Unity-Doku: https://docs.unity3d.com/ScriptReference/MonoBehaviour.Update.html


## Kurz

Hat ein Skript eine Methode `Update()`, ruft Unity sie in jedem [Frame](https://www.allknivesnobagel.com/teaching/gec1-vorschau/concepts/frame/) einmal auf, solange das Skript und sein [GameObject](https://www.allknivesnobagel.com/teaching/gec1-vorschau/concepts/game-object/) aktiv sind.

```csharp
void Update()
{
    transform.Translate(0, 3f * Time.deltaTime, 0);
}
```

## Genauer

Was in `Update()` steht, läuft also viele Male pro Sekunde. Darum gehört hinein, was laufend geprüft oder verändert werden soll: Bewegung, Eingabe abfragen, Timer weiterzählen. Was nur einmal passieren soll, gehört in `Start()`.

Weil Frames unterschiedlich lang sind, wird Bewegung mit [deltaTime](https://www.allknivesnobagel.com/teaching/gec1-vorschau/concepts/delta-time/) umgerechnet.

## Unter der Haube

Unity hat noch weitere Aufrufe im Frame, zum Beispiel `FixedUpdate()` für Physik in festem Takt und `LateUpdate()` nach allen `Update()`-Aufrufen, etwa für Kameras.
