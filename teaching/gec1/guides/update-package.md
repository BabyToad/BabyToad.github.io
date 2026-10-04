<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/update-package/ · Stand 2026-10-04T09:03Z · 033fe2a -->

Dauer: ca. 5 Min

Voraussetzungen: Projekt aus der Kursvorlage (Projekt anlegen); Git ist installiert (Git installieren); Jonas hat eine neue Version angekündigt (zum 23.10.: v0.2.0)

Checkpunkte:
- [ ] Im Package Manager steht beim GEC1 Kurs-Paket die neue Versionsnummer
- [ ] Menü „Kurs > Setup prüfen“ zeigt beim Kurs-Paket die neue Version
- [ ] Die Änderung an Packages/manifest.json ist committet
- [ ] Ab v0.2.0: Im Project-Fenster liegt unter Packages > GEC1 Kurs-Paket > Player das Prefab „Spieler“

Stand: nicht durchgespielt

# Kurs-Paket aktualisieren

Das **Kurs-Paket** (`de.macromedia.gec1`) bringt das Menü **Kurs > Setup prüfen** und im Lauf
des Semesters weitere Werkzeuge: den Spieler-Controller und das Kit. Es liegt nicht im eigenen
Projekt, sondern in einem eigenen Repository auf GitHub. Das Projekt merkt sich nur, **welche
Version** es verwendet – eine einzige Zeile in `Packages/manifest.json`:

```
"de.macromedia.gec1": "https://github.com/BabyToad/macromedia-gec1-kit.git#v0.1.0",
```

Das `#v0.1.0` am Ende ist die Version. Aktualisieren heißt: diese Zeile auf die neue Version
setzen. Unity lädt den Rest selbst (dafür braucht es Git).

Vorher committen: Dann lässt sich die Aktualisierung mit einem Klick rückgängig machen.

| Version | Ab | Neu |
|---|---|---|
| v0.1.0 | 09.10. (in der Kursvorlage) | Menü **Kurs > Setup prüfen** |
| v0.2.0 | 23.10. | Spieler-Controller: Prefab **Spieler** (laufen, springen, umsehen; Ich- und Dritte-Person-Ansicht) |
| v0.3.0 | 13.11. | Kit mit Graph-Editor: Interaktionen als Graph bauen und beim Spielen beobachten; Beispiel „Schlüssel und Tür“ |

## Schritt 1: Neue Version eintragen

1. In GitHub Desktop prüfen: **No local changes**. Wenn nicht, erst committen.
2. In Unity: **Window > Package Manager**.
3. Oben links auf **+** > **Install package from git URL…** klicken.
4. Die Adresse mit der neuen Version einfügen, z. B. für Version 0.2.0:

   ```
   https://github.com/BabyToad/macromedia-gec1-kit.git#v0.2.0
   ```

   Die genaue Versionsnummer nennt Jonas.
5. **Install** klicken. Unity lädt die neue Version und kompiliert kurz.

(Screenshot folgt: Zeigt den Package Manager mit dem Feld "Install package from git URL" und der Adresse mit #v0.2.0.)

✅ **Checkpoint:** Im Package Manager steht unter **In Project** das **GEC1 Kurs-Paket** mit
der neuen Versionsnummer. **Kurs > Setup prüfen** zeigt bei **Kurs-Paket** dieselbe Version.
Ab v0.2.0 liegt im **Project**-Fenster unter **Packages > GEC1 Kurs-Paket > Player** das Prefab
**Spieler**; es lässt sich von dort in die Szene ziehen.

**Ab v0.3.0: Beispiel importieren.** Im Package Manager beim **GEC1 Kurs-Paket** den Reiter
**Samples** öffnen und bei **Schlüssel und Tür** auf **Import** klicken. Das Beispiel landet unter
`Assets/Samples/GEC1 Kurs-Paket/…`. Ein Doppelklick auf `Schlüssel und Tür.kit` öffnet den
Graph-Editor; die Szene `Keller` zeigt das Beispiel im Spiel.

(Screenshot folgt: Zeigt den Package Manager mit dem GEC1 Kurs-Paket, Reiter "Samples", Eintrag "Schlüssel und Tür" mit dem Knopf "Import".)

## Schritt 2: Die Änderung ansehen und committen

1. In GitHub Desktop, Reiter **Changes**: Geändert sind `Packages/manifest.json` und
   `Packages/packages-lock.json`.
2. Auf `manifest.json` klicken. Rechts zeigt der **Diff** genau eine geänderte Zeile: rot die
   alte Version, grün die neue.
3. Unten bei **Summary** z. B. `Kurs-Paket auf 0.2.0` eintragen > **Commit to main** >
   **Push origin**.

✅ **Checkpoint:** GitHub Desktop zeigt **No local changes**, der Commit steht oben in
**History**.

Das ist der ganze Mechanismus: Die Version eines Pakets ist eine Zeile Text im Projekt, und
Git bewahrt jede Version auf. Ging bei der Aktualisierung etwas schief, macht **History** >
Rechtsklick auf den Commit > **Revert changes in commit** sie wieder rückgängig.

## Mit einem KI-Agenten

Mit Claude Code oder Codex im Projektordner geht es auch so:

```
Ändere in Packages/manifest.json die Version von de.macromedia.gec1 auf v0.2.0. Ändere sonst
nichts. Zeig mir danach den Diff. Nicht committen.
```

Danach Unity in den Vordergrund holen (Unity lädt das Paket dann neu) und weiter mit Schritt 2.

## Wenn es nicht klappt

**„No 'git' executable was found“ oder „Unable to add package“.**
Git fehlt oder der Unity Hub lief schon vor der Git-Installation. Siehe
[Git installieren](../install-git/).

**„Could not find … v0.2.0“ / die Version wird nicht gefunden.**
Tippfehler in der Adresse oder die Version gibt es (noch) nicht. Die Adresse genau so einfügen,
mit `#v` vor der Nummer und ohne Leerzeichen.

**Nach der Aktualisierung zeigt Unity rote Fehler in der Console.**
In GitHub Desktop beide geänderten Dateien mit **Discard changes** zurücksetzen (vor dem
Commit) bzw. den Commit mit **Revert changes in commit** rückgängig machen. Dann Jonas Bescheid
sagen und den Text aus der Console mitschicken.

**Ab v0.3.0 zeigt Unity oben einen Hinweis auf „experimentelle Pakete“.**
Das ist erwartet: Der Graph-Editor des Kits baut auf dem **Graph Toolkit** von Unity auf, das
noch als experimentell gekennzeichnet ist. Der Kurs nutzt genau die getestete Version. Den
Hinweis einfach stehen lassen.

**Im Package Manager steht noch die alte Version.**
Unity neu starten. Steht in `Packages/manifest.json` die neue Version, lädt Unity sie beim Öffnen.
