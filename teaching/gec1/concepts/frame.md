<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/frame/ · Stand 2026-10-05T12:36Z · 9fcef5f -->

# Frame

Ein Durchlauf der Spielschleife. Eingabe lesen, Zustand ändern, Bild zeichnen. Viele davon pro Sekunde.

Auch: Frames, Einzelbild, Bild

Verwandt: [update](https://www.allknivesnobagel.com/teaching/gec1/concepts/update/), [delta-time](https://www.allknivesnobagel.com/teaching/gec1/concepts/delta-time/)


> **Interaktive Erklärung: Frame, Update und deltaTime.** Ein Spiel läuft in Frames: In jedem Frame ruft die Engine Update() auf. Zwei Würfel steigen nach oben, beide im selben Spiel. Der eine rechnet „pro Frame 0,05 weiter“ (transform.Translate(0, 0.05f, 0); ohne deltaTime), der andere „3 pro Sekunde mal deltaTime“ (transform.Translate(0, 3f * Time.deltaTime, 0); mit deltaTime). deltaTime ist die Zeit seit dem letzten Frame in Sekunden: bei 60 Frames pro Sekunde etwa 0,0167, bei 15 etwa 0,0667. Das Diagramm zeigt den Weg über der Zeit. Jeder Frame ist eine Stufe der Treppe und ein Strich auf der Frame-Leiste unter der Zeitachse; der Abstand zweier Striche ist deltaTime. Eine gestrichelte Linie zeigt das Soll: 3 Einheiten pro Sekunde. Bei 60 Frames pro Sekunde liegen beide Treppen auf dieser Linie. Bei 15 Frames pro Sekunde schafft der Würfel ohne deltaTime nur ein Viertel des Wegs (seine Treppe ist flacher), bei 144 Frames das 2,4-Fache (steiler). Der Würfel mit deltaTime bleibt bei jeder Bildrate auf der Linie: wenige Frames heißt große Stufen, viele Frames kleine. Ein Ruckler (ein Frame dauert eine halbe Sekunde) lässt den Würfel ohne deltaTime zurückfallen; der mit deltaTime springt in einer Stufe 1,5 Einheiten hoch und ist wieder auf der Linie. Merksatz: Ohne deltaTime gilt die Bewegung pro Frame, mit deltaTime pro Sekunde. [Zum Erklärer](https://www.allknivesnobagel.com/teaching/gec1/explainers/delta-time/)

## Kurz

Ein Spiel läuft in einer Schleife. Jeder Durchlauf heißt Frame: Die Engine liest die Eingabe, lässt die Skripte den Zustand ändern und zeichnet ein neues Bild. Bei 60 Frames pro Sekunde passiert das 60 Mal in jeder Sekunde.

## Genauer

Frames sind nicht gleich lang. Wie lange einer dauert, hängt davon ab, wie viel in der Szene los ist und wie schnell der Rechner ist. Deshalb misst Unity die Zeit jedes Frames und gibt sie als [deltaTime](https://www.allknivesnobagel.com/teaching/gec1/concepts/delta-time/) weiter.

Skripte bekommen ihren Platz im Frame über [Update](https://www.allknivesnobagel.com/teaching/gec1/concepts/update/).

## In Unity sehen

Im Game-Fenster zeigt **Stats** die aktuelle Bildrate. Der **Profiler** (Window › Analysis › Profiler) zeigt jeden einzelnen Frame und wofür die Zeit draufging.
