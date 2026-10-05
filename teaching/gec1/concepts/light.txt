<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/light/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# Licht

Licht macht Form, Tiefe und Blickführung sichtbar. Realtime wird in jedem Frame berechnet; Baked steckt vorberechnet in Lightmaps; Mixed verbindet beides.

Auch: Lichter, Lighting, Beleuchtung, Light, Lightmap, Lightmaps, Lichtbacken, Lightmapping

Verwandt: [material](https://www.allknivesnobagel.com/teaching/gec1/concepts/material/), [scene](https://www.allknivesnobagel.com/teaching/gec1/concepts/scene/), [build](https://www.allknivesnobagel.com/teaching/gec1/concepts/build/)

Unity-Doku: https://docs.unity.com/en-us/engine/6000.3/manual/lighting-overview/lighting-light-sources/components/configuring/light-modes/light-modes


## Kurz

Licht entscheidet, welche Formen lesbar sind, wohin der Blick fällt und welche Stimmung ein Raum hat. Ein Material reagiert erst durch Licht sichtbar als rau, glatt oder metallisch.

Unity kennt drei Light Modes:

| Mode | wann berechnet? | geeignet für |
|---|---|---|
| **Realtime** | während des Spiels, jeden Frame | bewegte, flackernde oder zerstörbare Lichter |
| **Baked** | vorher im Editor | feste Architektur und Hintergrundlicht |
| **Mixed** | teils vorher, teils im Spiel | feste Lichter, die bewegte Figuren beleuchten sollen |

## Genauer

Bei **Lightmapping** berechnet Unity die Helligkeit fester Oberflächen vorab und speichert sie in Texturen, den Lightmaps. Das kostet Zeit beim Backen und Speicher im Build, spart aber Rechenarbeit während des Spiels. Die gespeicherte Beleuchtung kann sich im Spiel nicht verändern.

Realtime-Licht reagiert sofort auf Änderungen, kostet aber in jedem Frame Rechenzeit. Schatten, viele überlappende Lichter und große Reichweiten erhöhen diese Kosten. Mixed ist kein kostenloser Mittelweg: Es kombiniert gebackene Anteile mit Realtime-Berechnung.

Für das Kursprojekt reicht meist ein klares Hauptlicht, wenige gezielte lokale Lichter und gebackenes Licht für unveränderliche Umgebung. Erst nach einem Test im Build mehr hinzufügen.

## In Unity sehen

1. Ein Light in der Hierarchy auswählen und im Inspector `Mode` auf Realtime, Baked oder Mixed stellen.
2. Für Lightmaps feste Mesh Renderer unter `Mesh Renderer › Lighting › Contribute Global Illumination` markieren.
3. `Window › Rendering › Lighting` öffnen und **Baked Global Illumination** aktivieren.
4. Unten **Generate Lighting** wählen. In neuen Unity-6-Projekten läuft das Backen standardmäßig nicht automatisch beim Öffnen einer Szene.

Die Kursvorlage verwendet URP. Das aktive URP Asset steht standardmäßig unter `Edit › Project Settings › Graphics › Default Render Pipeline`. Ein Qualitätslevel kann es unter `Edit › Project Settings › Quality › Rendering › Render Pipeline Asset` überschreiben.

## Post-Processing in URP

1. An der Kamera unter `Rendering` **Post Processing** aktivieren.
2. `GameObject › Volume › Global Volume` anlegen und mit `New` ein Profil erstellen.
3. `Add Override › Post-processing › Color Adjustments` wählen.
4. Das Häkchen links neben `Post Exposure` aktivieren. Ohne dieses Parameter-Override ignoriert URP den eingetragenen Wert.
5. Als eindeutigen Test `Post Exposure: +3` setzen. Wird das Bild nicht deutlich heller, prüfen, ob die `Volume Mask` der Kamera die Ebene des Volumes enthält.
6. Danach einen begründeten, kleineren Wert einstellen und im Build prüfen.

URP enthält dieses Post-Processing bereits. Kein zusätzliches Post-Processing-Paket installieren.

## Weiterlesen

- [Unity Manual: Set the Mode of a Light](https://docs.unity.com/en-us/engine/6000.3/manual/lighting-overview/lighting-light-sources/components/configuring/light-modes/light-modes) – Realtime, Baked und Mixed (Unity 6.3, englisch).
- [Unity Manual: Introduction to lightmaps and baking](https://docs.unity.com/en-us/engine/6000.3/manual/lighting-overview/direct-and-indirect-lighting/lightmapping/baking-before-runtime/lightmappers) – was eine Lightmap speichert.
- [Unity Manual: Lighting window reference](https://docs.unity.com/en-us/engine/6000.3/manual/lighting-overview/lighting-reference/lighting-window) – `Generate Lighting` und Unity-6-Standardwerte.
- [Unity Manual: Universal Render Pipeline asset](https://docs.unity.com/en-us/engine/6000.3/manual/render-pipelines/universal-render-pipeline/urp-quality-settings/urp-asset-and-renderer) – URP Asset und Qualitätsstufen.
- [Unity Manual: Add post-processing in URP](https://docs.unity3d.com/6000.0/Documentation/Manual/urp/add-post-processing.html) – Kamera, Global Volume, Profil und Override.
