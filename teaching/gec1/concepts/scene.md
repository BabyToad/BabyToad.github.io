<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/scene/ · Stand 2026-10-05T12:36Z · 9fcef5f -->

# Szene

Eine Datei, die eine Welt oder einen Teil davon enthält: alle GameObjects mit ihren Einstellungen. Ein Spiel kann aus einer Szene bestehen oder aus vielen, etwa einer pro Level.

Auch: Szenen, Scene, Scenes, Level

Verwandt: [game-object](https://www.allknivesnobagel.com/teaching/gec1/concepts/game-object/), [prefab](https://www.allknivesnobagel.com/teaching/gec1/concepts/prefab/), [build](https://www.allknivesnobagel.com/teaching/gec1/concepts/build/), [transform](https://www.allknivesnobagel.com/teaching/gec1/concepts/transform/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SceneManagement.SceneManager.LoadScene.html


## Kurz

In einer Szene steht alles, was in einem Teil des Spiels da ist: Boden, Wände, Spielfigur, Kamera, Licht. Die **Hierarchy** zeigt ihre [GameObjects](https://www.allknivesnobagel.com/teaching/gec1/concepts/game-object/) als Liste, die **Scene**-Ansicht zeigt sie im Raum.

Eine Szene ist eine Datei im Projekt mit der Endung `.unity`. Ein neues Projekt startet mit einer Beispielszene, die nur eine Kamera und ein Licht enthält.

## Genauer

Wie viele Szenen ein Spiel braucht, ist eine Designentscheidung. Für ein Spiel mit einem Raum reicht eine. Menü, Level und Abspann bekommen oft je eine eigene.

Ein Wechsel lädt eine andere Szene; die Objekte der alten verschwinden. Damit das im fertigen Spiel klappt, muss die Szene in der **Scene List** des [Builds](https://www.allknivesnobagel.com/teaching/gec1/concepts/build/) stehen:

```csharp
using UnityEngine.SceneManagement;

SceneManager.LoadScene("Abspann");   // Name der Szenendatei ohne .unity
```

Szenen speichert Unity als Text (YAML). Deshalb zeigt Git in einem [Diff](https://www.allknivesnobagel.com/teaching/gec1/concepts/diff/), was sich in einer Szene geändert hat, wenn auch schwer lesbar. Zwei Leute, die gleichzeitig dieselbe Szene ändern, bekommen dagegen leicht Konflikte. Eine Szene pro Person oder Prefabs für die Teile helfen.

## In Unity sehen

- **File › New Scene**, **File › Save** (Strg+S, macOS Cmd+S). Ein Sternchen am Szenennamen in der Hierarchy heißt: ungespeichert.
- **File › Build Profiles**, Abschnitt **Scene List**: welche Szenen ins Spiel kommen und in welcher Reihenfolge. **Add Open Scenes** fügt die offenen hinzu.
- Im Kit wechselt der Knoten **Szene laden** die Szene.

## Weiterlesen

- [Unity Manual: Introduction to scenes](https://docs.unity3d.com/6000.3/Documentation/Manual/CreatingScenes.html) und [Creating, loading, and saving scenes](https://docs.unity3d.com/6000.3/Documentation/Manual/scenes-working-with.html) (Unity 6.3, englisch).
- [Unity Manual: Manage scenes in a build](https://docs.unity3d.com/6000.3/Documentation/Manual/build-profile-scene-list.html) – die Scene List in den Build Profiles.
- [Unity Scripting API: SceneManager.LoadScene](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/SceneManagement.SceneManager.LoadScene.html) – Szenen per Skript laden.
