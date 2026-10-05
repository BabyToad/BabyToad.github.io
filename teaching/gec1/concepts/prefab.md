<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/concepts/prefab/ · Stand 2026-10-05T12:36Z · 9fcef5f -->

# Prefab

Ein gespeichertes GameObject als Vorlage im Projekt. In der Szene stehen Instanzen davon. Eine Änderung am Prefab erreicht alle Instanzen, außer an Stellen, die eine Instanz selbst überschreibt.

Auch: Prefabs, Instanz, Instanzen, Prefab-Instanz, Prefab Variant, Override

Verwandt: [game-object](https://www.allknivesnobagel.com/teaching/gec1/concepts/game-object/), [scene](https://www.allknivesnobagel.com/teaching/gec1/concepts/scene/), [reference](https://www.allknivesnobagel.com/teaching/gec1/concepts/reference/)

Unity-Doku: https://docs.unity3d.com/6000.3/Documentation/Manual/Prefabs.html


## Kurz

Ein Prefab ist ein [GameObject](https://www.allknivesnobagel.com/teaching/gec1/concepts/game-object/) samt Komponenten und Kindern, gespeichert als Datei im Projekt. Aus dieser Vorlage entstehen beliebig viele **Instanzen** in einer oder mehreren Szenen.

Wird das Prefab geändert, übernimmt Unity die Änderung in alle Instanzen. Zehn Laternen aus einem Prefab lassen sich so an einer Stelle umbauen.

## Genauer

Eine Instanz darf von ihrem Prefab abweichen. Solche Abweichungen heißen **Overrides**: ein anderer Wert, eine zusätzliche oder entfernte Component, ein zusätzliches Kindobjekt. Ein Override gilt immer vor dem Wert aus dem Prefab. Ändert man später genau diesen Wert im Prefab, merkt die Instanz davon nichts.

Position und Rotation der Instanz zählen nicht als Override; jede Instanz steht ohnehin woanders.

Prefabs lassen sich auch zur Laufzeit erzeugen: ein Projektil beim Schuss, ein Gegner pro Welle. Das Skript braucht dafür eine [Referenz](https://www.allknivesnobagel.com/teaching/gec1/concepts/reference/) auf das Prefab:

```csharp
public GameObject kugelPrefab;   // im Inspector das Prefab hineinziehen

void Schiessen()
{
    Instantiate(kugelPrefab, transform.position, transform.rotation);
}
```

## In Unity sehen

- **Anlegen:** ein Objekt aus der Hierarchy in das Project-Fenster ziehen. Der Name in der Hierarchy wird blau: Das Objekt ist jetzt eine Instanz.
- **Bearbeiten:** das Prefab im Project-Fenster doppelklicken. Unity öffnet es im Prefab-Modus, ohne den Rest der Szene.
- **Overrides erkennen:** Im Inspector einer Instanz stehen überschriebene Werte fett, mit einem blauen Strich links.
- **Overrides übernehmen oder verwerfen:** Im Inspector der Instanz oben **Overrides** öffnen, dann **Apply All** (ins Prefab schreiben) oder **Revert All** (zurück zum Prefab).

Achtung, Namensgleichheit: Dieses **Revert** setzt eine Instanz auf ihr Prefab zurück. Mit dem [Revert](https://www.allknivesnobagel.com/teaching/gec1/concepts/revert/) in Git hat es nichts zu tun.

## Weiterlesen

- [Unity Manual: Introduction to prefabs](https://docs.unity3d.com/6000.3/Documentation/Manual/prefabs-introduction.html) – Instanzen, Verschachtelung, Varianten (Unity 6.3, englisch).
- [Unity Manual: Override prefab instances](https://docs.unity3d.com/6000.3/Documentation/Manual/PrefabInstanceOverrides.html) – was als Override zählt und wie Apply und Revert arbeiten.
- [Unity Manual: Introduction to instantiating prefabs](https://docs.unity3d.com/6000.3/Documentation/Manual/instantiating-prefabs-intro.html) – Prefabs per Skript erzeugen.
- [Game Programming Patterns: Prototype](https://gameprogrammingpatterns.com/prototype.html) – Robert Nystrom über die Idee dahinter: neue Objekte als Kopien einer Vorlage (englisch).
