<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/ui/ · Stand 2026-11-20T09:28Z · 1a29bcd -->

# UI

Das User Interface zeigt Zustand und bietet Handlungen an. Im Kurs entsteht mindestens eine projektbezogene UI-Handlung mit uGUI und Logik-Graphen.

Auch: User Interface, Benutzeroberfläche, Oberfläche, HUD, Menü, Canvas, uGUI, Unity UI

Verwandt: [state](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/), [event](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/), [component](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/), [reference](https://www.allknivesnobagel.com/teaching/gec1/concepts/reference/)

Unity-Doku: https://docs.unity.com/en-us/engine/6000.3/manual/uitoolkits


## Kurz

UI ist die Schicht zwischen Spielzustand und Spielenden. Ein HUD zeigt wichtige Werte. Ein Start-, Ziel- oder Scheiterbildschirm bietet eine nächste Handlung an. Gute UI beantwortet drei Fragen: Was ist passiert? Was ist wichtig? Was kann als Nächstes getan werden?

Im Kurs wird **uGUI (Unity UI)** mit den Logik-Graphen von Besteck verwendet. uGUI ist GameObject-basiert: Ein Canvas enthält Panels, Texte, Bilder und Buttons. Für das Kursprojekt reicht **eine projektbezogene UI-Handlung**. Ein vollständiger Ablauf mit Start, Spiel und Ende ist eine Erweiterung.

## Warum uGUI und nicht UI Toolkit?

Unity 6.3 bietet mehrere UI-Systeme. **UI Toolkit** verwendet UI Documents, UXML und Stylesheets und eignet sich besonders für wiederverwendbare, datenreiche Oberflächen und Editor-Werkzeuge. uGUI arbeitet mit Canvas, GameObjects und Komponenten, die aus Hierarchy und Inspector schon bekannt sind.

Beide können Runtime-UI bauen. Die Kursentscheidung gilt nicht allgemein: uGUI passt hier besser zu Besteck und führt für eine kleine Spieloberfläche weniger neue Begriffe ein. Beide Systeme parallel zu lernen, würde das Arbeitsmodell verdoppeln.

## Ein vollständiges Graph-Beispiel

Ein Schlüssel-und-Tür-Spiel kommt mit zwei fertigen Bildschirmen aus Besteck aus (**GameObject › Besteck › Bildschirm**):

1. **Bildschirm › Start** liegt in einer eigenen Szene „Start“, der ersten in **Tools › Besteck › Szenen**. Sein Knopf „Spielen“ feuert `Knopf gedrückt` zu `Nächste Szene`.
2. Ein Bildschirm erscheint, wenn `An/Aus` ihn einschaltet. Solange er zu sehen ist, steht das Spiel und der Mauszeiger ist frei.
3. Wenn die Tür geöffnet ist, schaltet `An/Aus` den Bildschirm **Gewonnen** ein.
4. Sein Knopf „Nochmal“ feuert `Knopf gedrückt` zu `Neustart`. Szenen kommen als Datei in den Knoten, nicht als getippter Name; Besteck trägt sie selbst in die Build Settings ein.

Die Knöpfe der Bildschirme tun erst etwas, wenn eine Logik auf sie hört; ein unverbundener Knopf sagt beim Klicken, was fehlt. Der vollständige Drei-Screen-Ablauf ist optional. Hat ein Projekt keinen Scheiterzustand, braucht es kein Game Over.

## Vorhandene Bausteine in Besteck

- `Wert anzeigen` hält eine fertige Anzeige (**GameObject › Besteck › Anzeige**: Zahl, Balken, Symbolreihe) auf dem Stand einer Variable.
- `An/Aus` schaltet ein gebundenes GameObject ein, aus oder um, auch einen Bildschirm.
- Eine Variable **Zahl** mit Grenzen meldet `Minimum erreicht`, wenn sie auf ihr Minimum fällt, etwa null.
- `Checkpoint` merkt einen Respawn-Punkt oder setzt den Spieler dorthin zurück.
- `Neustart`, `Nächste Szene` und `Szene laden` wechseln die Szene über eine Blende.

Nicht alle Bausteine gehören in jedes Projekt. Der Graph folgt der Spec, nicht umgekehrt.

## In Unity sehen

1. `GameObject › UI › Canvas` anlegen. Unity ergänzt bei Bedarf ein EventSystem.
2. Unter dem Canvas nur die benötigten Panels anlegen, zum Beispiel `Start` und `Geschafft`.
3. Für Bildschirmgrößen den **Canvas Scaler** auf `Scale With Screen Size` stellen und eine Referenzauflösung wählen.
4. Elemente über ihre **Anchors** an einer Ecke, Kante oder der Mitte festhalten.
5. Das EventSystem braucht beim neuen Input System ein **Input System UI Input Module**.
6. Im Logik-Graph die vorhandenen Knoten verbinden und alle Rollen binden.
7. Im Play-Modus dreimal prüfen: öffnen, Button anklicken, spielen, zurückkehren. Im UI ist der Cursor frei; im Spiel wird der Blick wieder gefangen.

Reagiert ein Button nicht, zuerst EventSystem, sichtbares Panel, `Interactable`, Graph-Instanz und gebundene Szene-Referenzen prüfen. Keine Szene oder Prefab-Datei außerhalb von Unity als YAML bearbeiten.

## Weiterlesen

- [Unity Manual: UI systems](https://docs.unity.com/en-us/engine/6000.3/manual/uitoolkits) – UI Toolkit, uGUI und IMGUI im Überblick (Unity 6.3, englisch).
- [Input System Manual: UI support](https://docs.unity.cn/Packages/com.unity.inputsystem@1.11/manual/UISupport.html) – Input System UI Input Module für uGUI.
