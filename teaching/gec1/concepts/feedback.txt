<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/feedback/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# Feedback

Alles, woran Spielende merken, dass ihre Handlung angekommen ist, etwa ein Ton, eine Bewegung, ein Aufblitzen oder ein kurzes Anhalten des Bildes. Ohne Rückmeldung wirkt auch eine funktionierende Mechanik kaputt.

Auch: Rückmeldung, Rückmeldungen, Juice, Game Feel, Spielgefühl, Hitstop, Screenshake

Verwandt: [event](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/), [animation](https://www.allknivesnobagel.com/teaching/gec1/concepts/animation/), [playtest](https://www.allknivesnobagel.com/teaching/gec1/concepts/playtest/), [state](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioSource.html


## Kurz

In der Spec ist die Rückmeldung eine der vier Zeilen: Verb, Regel, Rückmeldung, Scheitern. Sie beantwortet die Frage: Woran merken die Spielenden, dass es geklappt hat?

Ein Spiel kann den [Zustand](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/) richtig ändern und trotzdem kaputt wirken. Die Tür ist offen, aber niemand hat es gesehen, weil sie hinter der Kamera lag und kein Ton kam.

## Genauer

Gute Rückmeldung beginnt im selben [Frame](https://www.allknivesnobagel.com/teaching/gec1/concepts/frame/) wie die Handlung. Schon eine Zehntelsekunde ohne Reaktion fühlt sich träge an. Mehrere Rückmeldungen auf einmal verstärken sich: Ton, eine kurze Bewegung, ein Lichtwechsel, eine [Animation](https://www.allknivesnobagel.com/teaching/gec1/concepts/animation/).

Für diese Schichten gibt es den Spitznamen **Juice**. Die bekanntesten Mittel:

| Mittel | Wirkung | im Kit |
|---|---|---|
| Ton | bestätigt ohne Hinsehen | Ton abspielen |
| Kurz größer und zurück | „das Ding hat reagiert“ | zwei Bewegen-Knoten, Was: Größe (einer hin, einer zurück) |
| Aufblitzen | lenkt den Blick | Material tauschen, An/Aus |
| Partikel | Wucht, Belohnung | Erzeugen (Prefab mit Partikelsystem) |
| Bildschirmwackeln | Wucht | Kamera wackeln (nur mit Cinemachine) |
| Anhalten | Treffer wirkt schwer | nicht im Kit |

**Anhalten** heißt in Kampfspielen Hitstop: Das Bild steht für einige Hundertstelsekunden still. In HIGH WATER sind es 55, 65 und 130 ms für die drei Schläge des Dreier-Schlags.

Für „kurz größer und zurück“ braucht es zwei Bewegen-Knoten auf dasselbe Objekt: Der erste fährt hin, sein „Angekommen“ startet „Zurück“ am zweiten, und der zweite hat keine ausgehende Verbindung. Ein einzelner Knoten, dessen „Angekommen“ an sein eigenes „Zurück“ führt, stößt nach jeder Rückfahrt die nächste an.

Juice ersetzt keine Klarheit. Wackelt bei jeder Kleinigkeit der Bildschirm, wackelt er bei der wichtigen Sache nicht mehr auffällig. Die stärkste Rückmeldung gehört zum wichtigsten Moment.

## Ton als Rückmeldung

- Eine **AudioSource** an das Objekt, das klingen soll. **Play On Awake** ausschalten, sonst klingt es beim Start.
- **Spatial Blend** auf 3D: Der Ton kommt von der Stelle im Raum und wird mit Abstand leiser. 2D: überall gleich laut, gut für Menütöne.
- Derselbe Ton bei jedem Treffer nutzt sich ab. Zwei, drei Varianten mit dem Knoten **Zufällig** wechseln lassen.
- Freie Töne: [Kenney Audio](https://kenney.nl/assets/category:Audio) (CC0), [freesound.org](https://freesound.org/) mit Lizenzfilter CC0 oder CC-BY (dann mit Namensnennung), selbst erzeugt mit [sfxr.me](https://sfxr.me/).

## Weiterlesen

- [Juice it or lose it](https://www.youtube.com/watch?v=Fy0aCDmgnxg) – Martin Jonasson und Petri Purho machen aus einem nüchternen Breakout in 15 Minuten ein saftiges (Vortrag, englisch).
- [The art of screenshake](https://www.youtube.com/watch?v=AJdEqssNZ-U) – Jan Willem Nijman (Vlambeer) baut Rückmeldung Schritt für Schritt in einen Shooter ein (Vortrag, englisch).
- [Unity Manual: Audio Source](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioSource.html) – alle Einstellungen der AudioSource (Unity 6.3, englisch).
