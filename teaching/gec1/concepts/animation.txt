<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/animation/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# Animation

Ein Animation Clip hält fest, wie sich Werte über die Zeit ändern, etwa Drehung, Position oder Farbe. Gesetzt werden nur einzelne Keyframes; die Frames dazwischen rechnet Unity aus.

Auch: Animationen, Animation Clip, Animation Clips, Keyframe, Keyframes, Animation-Fenster, Loop Time, Mixamo

Verwandt: [animator](https://www.allknivesnobagel.com/teaching/gec1/concepts/animator/), [frame](https://www.allknivesnobagel.com/teaching/gec1/concepts/frame/), [transform](https://www.allknivesnobagel.com/teaching/gec1/concepts/transform/), [feedback](https://www.allknivesnobagel.com/teaching/gec1/concepts/feedback/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/Manual/animeditor-CreatingANewAnimationClip.html


## Kurz

Ein Animation Clip ist eine Datei (`.anim`), die für bestimmte Eigenschaften festhält, welchen Wert sie zu welcher Zeit haben. Ein Deckel ist bei 0 s um 0° gedreht und bei 1 s um 100°. Diese festen Punkte heißen **Keyframes**. In jedem [Frame](https://www.allknivesnobagel.com/teaching/gec1/concepts/frame/) dazwischen berechnet Unity einen passenden Zwischenwert.

Animieren lässt sich fast alles, was im Inspector eine Zahl, eine Farbe oder ein Häkchen ist: Werte im [Transform](https://www.allknivesnobagel.com/teaching/gec1/concepts/transform/), die Farbe eines Lichts, ob ein Objekt aktiv ist.

## Genauer

Ein Clip allein spielt nichts ab. Abgespielt wird er von einem [Animator](https://www.allknivesnobagel.com/teaching/gec1/concepts/animator/), der entscheidet, wann welcher Clip läuft.

Zwei Einstellungen am Clip sorgen oft für Überraschungen:

- **Loop Time:** Clips, die im Animation-Fenster entstehen, wiederholen sich zunächst endlos. Für eine Tür, die einmal aufgeht, das Häkchen entfernen (Clip im Project-Fenster anklicken, Inspector).
- **Feste Werte:** Ein Clip schreibt genau die Werte, die aufgenommen wurden. Animiert er die Position des Objekts, das den Animator trägt, springt dieses Objekt beim Abspielen an die aufgenommene Stelle zurück, auch wenn es inzwischen woanders steht. Darum kommt der Animator auf ein leeres Elternobjekt, animiert wird ein Kind.

Für eine einzelne Bewegung von A nach B reicht im Kit oft der Knoten **Bewegen**. Ein Clip lohnt sich, sobald mehrere Werte zusammenspielen, die Kurve eine eigene Form braucht (erst langsam, dann schnell, kurz überschwingen) oder die Bewegung sich wiederholt, wie eine flackernde Lampe.

## In Unity sehen

1. Objekt auswählen, **Window › Animation › Animation**.
2. **Create**, Clip speichern. Unity legt dabei einen Animator Controller an, trägt den Clip dort als Standardzustand ein und setzt eine Animator-Komponente auf das Objekt.
3. **Add Property**, die Eigenschaft wählen (etwa Transform › Rotation) und mit **+** hinzufügen. Unity setzt je einen Keyframe an Anfang und Ende des Clips, beide mit dem aktuellen Wert.
4. Aufnahme mit dem roten Punkt einschalten, den Abspielkopf auf den letzten Keyframe setzen und den Wert im Inspector oder in der Szene ändern. In der Aufnahme wird jede Änderung an der Stelle des Abspielkopfs zum Keyframe.
5. Aufnahme beenden, im Animation-Fenster mit dem Abspielknopf ansehen.

Die Kurven zwischen den Keyframes zeigt der Reiter **Curves** unten im Animation-Fenster.

## Fertige Animationen importieren

Für Figuren mit Skelett gibt es fertige Bewegungen. Sie kommen als FBX-Datei ins Projekt und laufen nur auf einer Figur mit passendem Skelett; der Kursspieler ist eine Kapsel ohne Skelett.

- **Mixamo** (Adobe, kostenlos mit Adobe-Konto): Figuren und Animationen. Export als **FBX for Unity**. In Unity im Inspector der Datei, Reiter **Rig**, **Animation Type: Humanoid**. Laufanimationen mit **In Place** exportieren, sonst läuft die Figur aus ihrem eigenen Collider heraus.
- **Pakete mit CC0-Lizenz**, etwa von Kenney oder Quaternius: frei verwendbar, ohne Namensnennung.

Lizenzen kurz und richtig: Mixamo erlaubt die Nutzung in eigenen Projekten, auch in Hochschul- und kommerziellen Projekten, ohne Gebühren. Verboten ist, die rohen Dateien weiterzugeben, auch kostenlos. Ein öffentliches Repository mit Mixamo-FBX-Dateien wäre genau das; das Kursprojekt bleibt deshalb privat. CC-BY verlangt eine Namensnennung, CC0 nicht. Pakete aus dem Unity Asset Store stehen unter der Asset-Store-EULA: im eigenen Spiel verwenden ja, als Dateien weitergeben nein. Jede fremde Datei kommt mit Quelle und Lizenz in die Asset-Liste der Dokumentation.

## Weiterlesen

- [Unity Manual: Creating a new Animation Clip](https://docs.unity3d.com/6000.3/Documentation/Manual/animeditor-CreatingANewAnimationClip.html) – was Unity beim Anlegen automatisch erzeugt (Unity 6.3, englisch).
- [Unity Manual: Animating a GameObject](https://docs.unity3d.com/6000.3/Documentation/Manual/animeditor-AnimatingAGameObject.html) – Aufnahme, Vorschau, Keyframes mit K (englisch).
- [Mixamo FAQ: Licensing, Royalties, Ownership](https://community.adobe.com/t5/mixamo-discussions/mixamo-faq-licensing-royalties-ownership-eula-and-tos/m-p/13234775) – Lizenzfragen im Wortlaut von Adobe (englisch).
