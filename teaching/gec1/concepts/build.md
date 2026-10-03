<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/build/ · Stand 2026-10-03T17:07Z · ddec830 -->

# Build

Das fertige Programm, das ohne Unity läuft. Unity packt dafür die Szenen aus der Scene List und alles, was sie brauchen, in einen Ordner mit einer startbaren Datei.

Auch: Builds, Windows-Build, Build Profiles, Build Settings, Player, Scene List

Verwandt: [scene](https://www.allknivesnobagel.com/teaching/gec1/concepts/scene/), [tag](https://www.allknivesnobagel.com/teaching/gec1/concepts/tag/), [repository](https://www.allknivesnobagel.com/teaching/gec1/concepts/repository/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/Manual/build-profiles.html


## Kurz

Im Editor läuft das Spiel nur, solange Unity offen ist. Ein Build ist das eigenständige Programm, das Unity daraus macht. Unity nennt es auch **Player**. Abgegeben wird am Ende ein Windows-Build.

## Genauer

In den Build kommen die Szenen der **Scene List** und alles, was sie verwenden. Eine Szene, die dort fehlt, gibt es im fertigen Spiel nicht, und `SceneManager.LoadScene` findet sie nicht.

Ein Windows-Build ist ein **Ordner**, keine einzelne Datei: die `.exe` und daneben unter anderem ein Ordner mit den Spieldaten, der auf `_Data` endet. Die `.exe` startet nur zusammen mit diesen Dateien. Weitergegeben wird also der ganze Ordner, am besten als ZIP.

Was im Editor funktioniert, funktioniert im Build nicht automatisch. Typische Überraschungen: eine fehlende Szene, andere Bildschirmauflösung, Code, der nur im Editor läuft. Deshalb früh bauen und den Build auf einem anderen Rechner testen.

Für einen Windows-Build auf einem Mac braucht Unity das Modul **Windows Build Support (Mono)**. Es lässt sich im Unity Hub zur installierten Version hinzufügen.

## In Unity sehen

1. **File › Build Profiles** öffnen (früher hieß das Fenster Build Settings).
2. Links die Plattform **Windows** wählen.
3. In der **Scene List** prüfen, ob alle Szenen drin und angehakt sind. Die erste Szene startet zuerst.
4. **Build** klicken und einen leeren Ordner außerhalb von `Assets` wählen.

Build-Ordner gehören nicht ins [Repository](https://www.allknivesnobagel.com/teaching/gec1/concepts/repository/). Den getesteten Stand markiert ein [Tag](https://www.allknivesnobagel.com/teaching/gec1/concepts/tag/); die Dateien selbst kommen als Release auf GitHub oder als ZIP in die Abgabe.

## Weiterlesen

- [Unity Manual: Introduction to build profiles](https://docs.unity3d.com/6000.3/Documentation/Manual/build-profiles.html) – das Fenster Build Profiles (Unity 6.3, englisch).
- [Unity Manual: Manage scenes in a build](https://docs.unity3d.com/6000.3/Documentation/Manual/build-profile-scene-list.html) – die Scene List.
- [Unity Manual: Windows build settings reference](https://docs.unity3d.com/6000.3/Documentation/Manual/WindowsStandaloneBinaries.html) – Architektur, Development Build und weitere Optionen für Windows.
