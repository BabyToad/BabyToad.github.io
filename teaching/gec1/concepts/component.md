<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/component/ · Stand 2026-10-03T16:48Z · 87a2a07 -->

# Component

Ein Baustein an einem GameObject mit eigenen Einstellungen. Transform, Renderer, Collider und eigene Skripte sind Komponenten.

Auch: Components, Komponente, Komponenten

Verwandt: [game-object](https://www.allknivesnobagel.com/teaching/gec1/concepts/game-object/), [update](https://www.allknivesnobagel.com/teaching/gec1/concepts/update/)

Unity-Doku: https://docs.unity3d.com/Manual/Components.html


## Kurz

Eine Component gibt einem [GameObject](https://www.allknivesnobagel.com/teaching/gec1/concepts/game-object/) eine Fähigkeit. Im Inspector erscheint jede als eigener Kasten mit Einstellungen.

| Component | macht |
|---|---|
| Transform | Position, Drehung, Größe |
| Mesh Renderer | sichtbar machen |
| Collider | Form für Kollisionen |
| Rigidbody | von Physik bewegen lassen |
| eigenes Skript | eigenes Verhalten |

## Genauer

Ein Skript wird zur Component, indem es von `MonoBehaviour` erbt. Dann lässt es sich mit **Add Component** an ein Objekt hängen, und Unity ruft seine Methoden wie [Update](https://www.allknivesnobagel.com/teaching/gec1/concepts/update/) auf.

Objekte bekommen ihr Verhalten aus der Kombination ihrer Komponenten. Ein Würfel mit Collider und Rigidbody fällt; ohne Rigidbody bleibt er stehen.
