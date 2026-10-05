<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/material/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# Material

Ein Material legt fest, wie eine Oberfläche gezeichnet wird. Der Shader ist das Rechenverfahren; das Material liefert Werte wie Farbe, Textur, Metallanteil und Rauheit.

Auch: Materialien, Materials, Oberfläche, Oberflächen

Verwandt: [light](https://www.allknivesnobagel.com/teaching/gec1/concepts/light/), [component](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/), [prefab](https://www.allknivesnobagel.com/teaching/gec1/concepts/prefab/)

Unity-Doku: https://docs.unity.com/en-us/engine/6000.3/manual/materials-and-shaders/built-in/shaders-in-universalrp


## Kurz

Ein Material beschreibt die sichtbare Oberfläche eines Objekts. Es verändert nicht dessen Form und nicht das Licht der Szene. Ein Material verweist auf einen **Shader** und gibt ihm Werte: Farbe oder Textur, Metallanteil, Glätte, Normal Map und Emission.

Ein Material kann auf vielen Objekten liegen. Wird das gemeinsame Asset geändert, sehen alle diese Objekte anders aus. Für eine einzelne Ausnahme wird eine eigene Materialkopie angelegt.

## Genauer

Der Shader ist das Rechenverfahren, das aus Oberfläche, Licht und Blickrichtung ein Pixel macht. Das Material ist der ausgefüllte Parametersatz für dieses Verfahren. Im Kurs reicht fast immer **Universal Render Pipeline/Lit**:

- **Base Map**: Grundfarbe oder Farbtextur
- **Metallic**: Metall oder Nichtmetall; Zwischenwerte sind selten plausibel
- **Smoothness**: scharfe oder breite Reflexe, also glatt oder rau
- **Normal Map**: kleine Unebenheiten ohne zusätzliche Geometrie
- **Emission**: eine sichtbare Leuchtfarbe; sie ersetzt nicht automatisch eine Lichtquelle

URP/Lit verwendet physikalisch basierte Darstellung. Dadurch bleiben Materialien unter verschiedenen Lichtern eher nachvollziehbar. Für einen stilisierten Look sind **Simple Lit** oder **Unlit** oft günstiger. Unlit ignoriert Licht vollständig.

## In Unity sehen

1. Im Project-Fenster `Create › Material` wählen.
2. Im Inspector als Shader `Universal Render Pipeline/Lit` lassen.
3. Base Map, Metallic und Smoothness mit einer Kugel oder einem Würfel unter demselben Licht vergleichen.
4. Das Material auf einen Mesh Renderer ziehen.

Eine eigene PNG-Zeichnung kann zwei verschiedene Rollen haben:

- **Textur auf einem Material:** Datei nach `Assets/Art` ziehen, im Import Inspector `Texture Type: Default` lassen und die Textur in die Base Map ziehen.
- **Bild im UI:** `Texture Type: Sprite (2D and UI)` wählen und das Sprite in `Image › Source Image` einsetzen.

`Max Size` sollte nicht größer sein als für die tatsächliche Darstellung nötig. Bei PNGs mit transparentem Rand Alpha und Filterung in der Game View prüfen. Die Quelldatei außerhalb des Unity-Imports aufheben und im Devlog notieren, dass die Zeichnung selbst erstellt wurde.

Ein magentafarbenes Objekt ist meist kein gewollter Look: Häufig fehlt ein passender Shader für die aktive Render Pipeline. Die Kursvorlage verwendet URP; dort URP-Shader statt des alten Standard Shaders verwenden.

## Weiterlesen

- [Unity Manual: Prebuilt shaders in URP](https://docs.unity.com/en-us/engine/6000.3/manual/materials-and-shaders/built-in/shaders-in-universalrp) – Lit, Simple Lit, Baked Lit und Unlit (Unity 6.3, englisch).
- [Unity Manual: Choose a prebuilt shader in URP](https://docs.unity.com/en-us/engine/6000.3/manual/materials-and-shaders/built-in/shaders-in-universalrp/choose) – Nutzen und Kosten der Shader.
- [Unity Manual: Import an image as Sprite (2D and UI)](https://docs.unity3d.com/6000.0/Documentation/Manual/sprite/import-images-sprites/set-texture-type-imported-image-sprite-2d-ui.html) – Importtyp für Bilder im Canvas.
