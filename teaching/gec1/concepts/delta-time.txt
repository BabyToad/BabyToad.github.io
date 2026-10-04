<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/delta-time/ · Stand 2026-10-04T10:20Z · cb3c273 -->

# deltaTime

Die Zeit seit dem letzten Frame, in Sekunden. Damit multipliziert, gilt Bewegung pro Sekunde statt pro Frame.

Auch: Time.deltaTime, Delta-Zeit, Deltatime

Verwandt: [frame](https://www.allknivesnobagel.com/teaching/gec1/concepts/frame/), [update](https://www.allknivesnobagel.com/teaching/gec1/concepts/update/), [vector](https://www.allknivesnobagel.com/teaching/gec1/concepts/vector/)

Unity-Doku: https://docs.unity3d.com/ScriptReference/Time-deltaTime.html

> **Interaktive Erklärung: Frame, Update und deltaTime.** Ein Spiel läuft in Frames: In jedem Frame ruft die Engine Update() auf. Zwei Würfel steigen nach oben, beide im selben Spiel. Der eine rechnet „pro Frame 0,05 weiter“ (transform.Translate(0, 0.05f, 0); ohne deltaTime), der andere „3 pro Sekunde mal deltaTime“ (transform.Translate(0, 3f * Time.deltaTime, 0); mit deltaTime). deltaTime ist die Zeit seit dem letzten Frame in Sekunden: bei 60 Frames pro Sekunde etwa 0,0167, bei 15 etwa 0,0667. Das Diagramm zeigt den Weg über der Zeit. Jeder Frame ist eine Stufe der Treppe und ein Strich auf der Frame-Leiste unter der Zeitachse; der Abstand zweier Striche ist deltaTime. Eine gestrichelte Linie zeigt das Soll: 3 Einheiten pro Sekunde. Bei 60 Frames pro Sekunde liegen beide Treppen auf dieser Linie. Bei 15 Frames pro Sekunde schafft der Würfel ohne deltaTime nur ein Viertel des Wegs (seine Treppe ist flacher), bei 144 Frames das 2,4-Fache (steiler). Der Würfel mit deltaTime bleibt bei jeder Bildrate auf der Linie: wenige Frames heißt große Stufen, viele Frames kleine. Ein Ruckler (ein Frame dauert eine halbe Sekunde) lässt den Würfel ohne deltaTime zurückfallen; der mit deltaTime springt in einer Stufe 1,5 Einheiten hoch und ist wieder auf der Linie. Merksatz: Ohne deltaTime gilt die Bewegung pro Frame, mit deltaTime pro Sekunde. [Zum Erklärer](https://www.allknivesnobagel.com/teaching/gec1/explainers/delta-time/)

## Kurz

Ein Spiel zeichnet viele Bilder pro Sekunde, aber nicht immer gleich viele. `Time.deltaTime` gibt an, wie lange der letzte [Frame](https://www.allknivesnobagel.com/teaching/gec1/concepts/frame/) gedauert hat. Bei 60 Frames pro Sekunde sind das etwa 0,0167 Sekunden, bei 15 etwa 0,0667.

## Genauer

Verschiebt ein Skript in [Update](https://www.allknivesnobagel.com/teaching/gec1/concepts/update/) etwas um einen festen Betrag, passiert das einmal pro Frame. Ein schneller Rechner zeigt mehr Frames, also bewegt sich das Objekt dort schneller. Mit `Time.deltaTime` multipliziert, wird aus „pro Frame“ „pro Sekunde“:

```csharp
// 3 Einheiten pro Sekunde, egal wie viele Frames
transform.Translate(0, 3f * Time.deltaTime, 0);
```

## Unter der Haube

Unity misst die Zeit zwischen zwei Frames und begrenzt sie nach oben (`Time.maximumDeltaTime`), damit ein langer Ruckler keinen riesigen Sprung erzeugt. Für Physik gibt es einen eigenen, festen Takt: `Time.fixedDeltaTime` in `FixedUpdate()`.
