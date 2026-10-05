<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/ui/ · Stand 2026-10-05T13:39Z · 21cef83 -->

# UI

Das User Interface zeigt Zustand und bietet Handlungen an. Im Kurs entsteht mindestens eine projektbezogene UI-Handlung mit uGUI und Kit-Graphen.

Auch: User Interface, Benutzeroberfläche, Oberfläche, HUD, Menü, Canvas, uGUI, Unity UI

Verwandt: [state](https://www.allknivesnobagel.com/teaching/gec1/concepts/state/), [event](https://www.allknivesnobagel.com/teaching/gec1/concepts/event/), [component](https://www.allknivesnobagel.com/teaching/gec1/concepts/component/), [reference](https://www.allknivesnobagel.com/teaching/gec1/concepts/reference/)

Unity-Doku: https://docs.unity.com/en-us/engine/6000.3/manual/uitoolkits


## Kurz

UI ist die Schicht zwischen Spielzustand und Spielenden. Ein HUD zeigt wichtige Werte. Ein Start-, Ziel- oder Scheiterbildschirm bietet eine nächste Handlung an. Gute UI beantwortet drei Fragen: Was ist passiert? Was ist wichtig? Was kann als Nächstes getan werden?

Im Kurs wird **uGUI (Unity UI)** mit den vorhandenen Kit-Graphen verwendet. uGUI ist GameObject-basiert: Ein Canvas enthält Panels, Texte, Bilder und Buttons. Für das Kursprojekt reicht **eine projektbezogene UI-Handlung**. Ein vollständiger Ablauf mit Start, Spiel und Ende ist eine Erweiterung.

## Warum uGUI und nicht UI Toolkit?

Unity 6.3 bietet mehrere UI-Systeme. **UI Toolkit** verwendet UI Documents, UXML und Stylesheets und eignet sich besonders für wiederverwendbare, datenreiche Oberflächen und Editor-Werkzeuge. uGUI arbeitet mit Canvas, GameObjects und Komponenten, die aus Hierarchy und Inspector schon bekannt sind.

Beide können Runtime-UI bauen. Die Kursentscheidung gilt nicht allgemein: uGUI passt hier besser zum Kit und führt für eine kleine Spieloberfläche weniger neue Begriffe ein. Beide Systeme parallel zu lernen, würde das Arbeitsmodell verdoppeln.

## Ein vollständiges Graph-Beispiel

Ein Schlüssel-und-Tür-Spiel kann mit einem Canvas und zwei Panels auskommen:

1. `Beginn → An/Aus` schaltet `Start` ein → `Pause` .
2. Der Spielen-Button feuert `Knopf gedrückt` ; danach schaltet `An/Aus` das Start-Panel aus und `Weiter`  gibt Spieler und Cursor zurück.
3. Wenn die Tür geöffnet ist, schaltet `An/Aus` das Panel `Geschafft` ein und `Pause`  hält das Spiel an.
4. Der Neustart-Button feuert `Knopf gedrückt`  zu `Szene laden`. Der Szenenname muss stimmen und die Szene muss in der Scene List stehen.

Die drei provisorischen Knotenbezeichnungen kommen mit Kit v0.3.2. Der vollständige Drei-Screen-Ablauf ist optional. Hat ein Projekt keinen Scheiterzustand, braucht es kein Game Over.

## Vorhandene Kit-Bausteine

- `HUD-Anzeige` liest eine Zahl laufend und formatiert sie in ein gebundenes TMP-Textfeld.
- `An/Aus` schaltet ein gebundenes GameObject ein, aus oder um.
- `Lebenspunkte` liefert `Tot` genau einmal, wenn der Wert auf null fällt.
- `Checkpoint` merkt einen Respawn-Punkt oder setzt den Kit-Spieler dorthin zurück.
- `Szene laden` lädt eine Szene nur, wenn sie in der Scene List aktiviert ist.

Nicht alle Bausteine gehören in jedes Projekt. Der Graph folgt der Spec, nicht umgekehrt.

## In Unity sehen

1. `GameObject › UI › Canvas` anlegen. Unity ergänzt bei Bedarf ein EventSystem.
2. Unter dem Canvas nur die benötigten Panels anlegen, zum Beispiel `Start` und `Geschafft`.
3. Für Bildschirmgrößen den **Canvas Scaler** auf `Scale With Screen Size` stellen und eine Referenzauflösung wählen.
4. Elemente über ihre **Anchors** an einer Ecke, Kante oder der Mitte festhalten.
5. Das EventSystem braucht beim neuen Input System ein **Input System UI Input Module**.
6. Im Kit-Graph die vorhandenen Knoten verbinden und alle Szene-Referenzen binden.
7. Im Play-Modus dreimal prüfen: öffnen, Button anklicken, spielen, zurückkehren. Im UI ist der Cursor frei; im Spiel wird der Blick wieder gefangen.

Reagiert ein Button nicht, zuerst EventSystem, sichtbares Panel, `Interactable`, Graph-Instanz und gebundene Szene-Referenzen prüfen. Keine Szene oder Prefab-Datei außerhalb von Unity als YAML bearbeiten.

## Weiterlesen

- [Unity Manual: UI systems](https://docs.unity.com/en-us/engine/6000.3/manual/uitoolkits) – UI Toolkit, uGUI und IMGUI im Überblick (Unity 6.3, englisch).
- [Input System Manual: UI support](https://docs.unity.cn/Packages/com.unity.inputsystem@1.11/manual/UISupport.html) – Input System UI Input Module für uGUI.
