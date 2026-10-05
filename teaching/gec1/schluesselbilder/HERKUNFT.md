# Herkunft der Schlüsselbilder

Stand: 04.10.2026. Alle zwölf Bilder wurden mit dem integrierten OpenAI-ImageGen-Werkzeug neu als transparente Kreidezeichnungen erzeugt. Die konkrete Modellbezeichnung weist das Werkzeug nicht aus. Die ausgewählten PNGs wurden mit FFmpeg auf 4:3 eingepasst und als WebP mit Alphakanal komprimiert. `prefab.webp` und `scene.webp` messen 1000 × 750 Pixel, alle anderen 1200 × 900 Pixel; jede Datei bleibt unter 250 kB.

## Gemeinsame Vorgaben

Finale Prompts enthielten jeweils diese Vorgaben: Zeichnung einer geübten Lehrperson auf einer echten Tafel, angelehnt an die sachliche Klarheit deutscher Telekolleg-Tafelbilder; sichere Kreidestriche mit Pigmentkorn, gebrochenen Rändern, Druckwechseln, kleinen Konstruktionsspuren und höchstens sparsamer Schraffur. Echter transparenter Hintergrund, damit die Zeichnung direkt auf `#1d2a25` steht. Kreideweiß `#eeece4`, Gelb `#f7f09c` nur zur Betonung; Orange `#f6a54e` nur für Ereignisse, Violett `#cfa9f7` nur für Daten, Blaugrün `#72d5c0` nur für Referenzen. Keine Schrift im Bild.

Ausgeschlossen waren insbesondere: Café- oder Menüschrift, ornamentale Rahmen und Banner, Herzen, Sterne und Füll-Doodles, Pinterest-Kreideästhetik, Neon, Leuchteffekte, 3D-Fasen, Vignetten aus Wischspuren, Icons statt erklärender Zeichnungen, Logos und Wasserzeichen.

## Tag 1 · `tag-01.webp`

- Versuche: 1
- Finaler Prompt-Kern: Offene mechanische Spielmaschine in Dreiviertelansicht. Ein Controller schickt genau einen orangefarbenen Ereignispfeil in ein sichtbares Kreide-Räderwerk; rechts entstehen drei aufeinanderfolgende Würfelbilder, das neueste gelb betont. Eingabe, Verarbeitung und wiederholtes Bild werden ohne Beschriftung lesbar.

## Tag 2 · `tag-02.webp`

- Versuche: 2
- Finaler Prompt-Kern: Isometrischer Ein-Raum-Blockout mit drei Wandflächen, Tür, Rampe, drei Hindernissen und kleiner Spielfigur. Figur und kurzes Wegende gelb, alles andere weiß; offene Linien statt Flächen.
- Verworfen: Der erste Lauf legte eine große weiße Schmierfläche über den Boden und wirkte dadurch illustriert statt an der Tafel entwickelt.

## Frame · `frame.webp`

- Versuche: 3
- Finaler Prompt-Kern: Genau drei gleich große Szenenfelder mit demselben Würfel: links ruhend, in der Mitte gelb in der Luft, rechts gelandet. Zwei Vorwärtspfeile und ein großer Rückpfeil schließen die Frame-Schleife.
- Verworfen: Lauf 1 wurde zur Gamepad-Vignette; Lauf 2 zeigte geräteartige Würfel statt drei eindeutig gleicher Zustände.

## Component · `component.webp`

- Versuche: 1
- Finaler Prompt-Kern: Explosionszeichnung eines schlichten Grundkörpers, an den Rad-, Lampen- und Federbaustein an sichtbare Anschlüsse gesetzt werden. Nur das Licht der bereits montierten Lampe ist gelb.

## deltaTime · `delta-time.webp`

- Versuche: 1
- Finaler Prompt-Kern: Acht bewusst ungleich verteilte Frame-Striche auf einer Zeitlinie. An jedem Strich sitzt ein Punkt auf derselben geraden Bewegungsbahn; Falllinien verbinden Punkt und Strich. Nur ein kleines Steigungsdreieck ist gelb.

## Transform · `transform.webp`

- Versuche: 2
- Finaler Prompt-Kern: Zwei versetzte Tische mit derselben Tasse an derselben lokalen Stelle. Zwei identische blaugrüne lokale Referenzpfeile beginnen an den Tischursprüngen; zwei verschieden lange weiße Weltpfeile beginnen am festen Weltursprung und enden an den Tassen. Gelber Bewegungspfeil zwischen beiden Zuständen.
- Verworfen: Lauf 1 färbte den ganzen verschobenen Tisch gelb und ließ die Pfeilbeziehungen mehrdeutig werden.

## Vektor · `vector.webp`

- Versuche: 1
- Finaler Prompt-Kern: Zwei identische gelbe Verschiebungspfeile beginnen an verschiedenen puckartigen Punkten und enden an Zielkreisen. Gestrichelte Projektionen zeigen bei einem Pfeil die Komponenten.

## Prefab · `prefab.webp`

- Versuche: 2
- Finaler Prompt-Kern: Eine große Lampenform erzeugt fünf gleiche Kreidelampen in räumlicher Folge. Nur die letzte Instanz erhält als Override einen gelben Lampenschirm.
- Verworfen: Lauf 1 führte braune Holzfarbe ein; Lauf 2 übersetzte die Quelle vollständig in weißes Kreide-Linienwerk.

## Szene · `scene.webp`

- Versuche: 1
- Finaler Prompt-Kern: Räumlicher Bühnenkasten mit genau Würfel, Kamera und Lampe. Rechts stehen dieselben drei Objekte einzeln; drei blaugrüne Referenzlinien verbinden die Paare. Nur der Lichtkegel darf gelb sein.

## Build · `build.webp`

- Versuche: 2
- Finaler Prompt-Kern: Links offener Arbeitsplatz mit Rechner, Würfel, Kamera und Lampe; rechts läuft dieselbe Welt in einem geschlossenen eigenständigen Gerät. Dazwischen trägt ein weißer Montagepfeil die Teile zum fertigen Gerät; nur dessen Bildfläche ist gelb.
- Verworfen: Lauf 1 ergänzte Joystick, runde Arcade-Tasten und Pseudo-Oberfläche. Im finalen Edit wurden sie durch eine schlichte Ablage und einen rechteckigen Netzschalter ersetzt; der Monitor zeigt nur die drei Szenenobjekte.

## Commit · `commit.webp`

- Versuche: 2
- Finaler Prompt-Kern: Vier Ansichten desselben Raums zeigen nacheinander leer, Tisch, Lampe und Würfel. Sie liegen auf einer weißen Verlaufsbahn mit genau vier violetten Datenpunkten; der neue Stand ist gelb unterstrichen.
- Verworfen: Lauf 1 behandelte die einsetzende Hand wie einen grauen Fotoausschnitt. Der finale Edit macht daraus eine offene weiße Kreidekontur.

## Zwei Minuten · `zwei-minuten.webp`

- Versuche: 2
- Finaler Prompt-Kern: Leicht gekippte Sanduhr mit blasser Drehkontur. Oben verbleibt gelber Sand, ein einzelner Strom fällt sichtbar in den wachsenden unteren Haufen; Rahmen und Glas bleiben weißes offenes Linienwerk.
- Verworfen: Lauf 1 war zu dicht mit dunkler Kohleschattierung gefüllt und stand dadurch nicht in derselben Hand wie die Tafelbilder.
