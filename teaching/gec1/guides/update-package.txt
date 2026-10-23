<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/update-package/ · Stand 2026-10-23T16:10Z · 22dcf2f -->

Dauer: ca. 5 Min

Voraussetzungen: Projekt aus der Kursvorlage (Projekt anlegen); Git ist installiert (Git installieren); Jonas hat eine neue Version angekündigt

Checkpunkte:
- [ ] Im Package Manager steht beim Kurs-Paket „Besteck“ die neue Versionsnummer
- [ ] Menü „Kurs > Setup prüfen“ zeigt beim Kurs-Paket die neue Version
- [ ] Die Änderung an Packages/manifest.json ist committet

Stand: nicht durchgespielt

# Kurs-Paket aktualisieren

Das **Kurs-Paket „Besteck“** (`de.macromedia.gec1`) bringt das Menü **Kurs > Setup prüfen**, den
Spieler-Controller (Prefab **Spieler**) und die Logik mit dem Graph-Editor (Menüs unter **Tools › Besteck**). Es liegt nicht im eigenen
Projekt, sondern in einem eigenen Repository auf GitHub. Das Projekt merkt sich nur, **welche
Version** es verwendet – eine einzige Zeile in `Packages/manifest.json`:

```
"de.macromedia.gec1": "https://github.com/BabyToad/macromedia-gec1-kit.git#v0.3.2",
```

Das `#v0.3.2` am Ende ist die Version. Mit ihr startet die Kursvorlage. Neue Versionen gibt es,
wenn Korrekturen oder Ergänzungen fertig sind; Jonas kündigt sie an. Aktualisieren heißt: diese
Zeile auf die neue Version setzen. Unity lädt den Rest selbst (dafür braucht es Git).

Vorher committen: Dann lässt sich die Aktualisierung mit einem Klick rückgängig machen.

| Version | Ab | Neu |
|---|---|---|
| v0.3.2 | 09.10. (in der Kursvorlage) | Setup-Check, Spieler-Controller (Prefab **Spieler**), Kit mit Graph-Editor, Beispiele „Schlüssel und Tür“ und „Werkstatt (kaputt)“ und Rohling „Truhe“ (alle über **Tools › Kit**; seit 0.4 heißt das Menü **Tools › Besteck**), Vorlage für eigene Knoten |

Neue Versionen kommen in diese Tabelle, sobald sie erscheinen.

## Schritt 1: Neue Version eintragen

1. In GitHub Desktop prüfen: **No local changes**. Wenn nicht, erst committen.
2. In Unity: **Window > Package Manager**.
3. Oben links auf **+** > **Install package from git URL…** klicken.
4. Die Adresse mit der neuen Version einfügen, z. B. für eine Version 0.4.0:

   ```
   https://github.com/BabyToad/macromedia-gec1-kit.git#v0.4.0
   ```

   Die genaue Versionsnummer nennt Jonas.
5. **Install** klicken. Unity lädt die neue Version und kompiliert kurz.

(Screenshot folgt: Zeigt den Package Manager mit dem Feld "Install package from git URL" und der Adresse mit #v0.4.0.)

✅ **Checkpoint:** Im Package Manager steht unter **In Project** das Paket **Besteck – Kurs-Paket GEC1**
mit der neuen Versionsnummer (bis 0.3.2 hieß es **GEC1 Kurs-Paket**). **Kurs > Setup prüfen** zeigt bei
**Kurs-Paket** dieselbe Version. Das Prefab **Spieler** liegt weiterhin im **Project**-Fenster unter
**Packages > Besteck – Kurs-Paket GEC1 > Player**.

**Beispiele bauen.** Die Beispiele kommen aus dem Menü **Tools › Besteck**, nicht aus dem Package
Manager: z. B. **Tools › Besteck › Beispiel „Schlüssel und Tür“ bauen** oder **Tools › Besteck › Beispiel
„Werkstatt (kaputt)“ bauen**. Sie landen unter `Assets/Kit Beispiel/…`; eigene Änderungen daran
bleiben beim Aktualisieren erhalten.

**Ab 0.4: einmal anpassen.** Nach dem Update fragt Unity einmal, ob Szenen, Prefabs und Logik-Graphen
angepasst werden sollen („Jetzt anpassen“); das geht auch später über **Tools › Besteck › Projekt auf den
neuen Stand bringen**. Meldet die Console danach rot **CS0246** mit **'Interaction'** oder **'KitGraph'**,
benutzt ein eigenes Skript noch die alten Namen: im Skript **Interaction** durch **Logic** und **KitGraph**
durch **LogicGraph** ersetzen (oder den Agenten darum bitten). Einen eigenen Spieler zum Anpassen gibt es über
**Tools › Besteck › Spieler-Variante anlegen** (`Assets/Spieler.prefab`).

## Schritt 2: Die Änderung ansehen und committen

1. In GitHub Desktop, Reiter **Changes**: Geändert sind `Packages/manifest.json` und
   `Packages/packages-lock.json`. Wurde das Projekt angepasst („Jetzt anpassen“, ab 0.4), kommen
   Szenen, Prefabs und Logik-Graphen dazu, außerdem `ProjectSettings/KitMigration.asset` und, falls
   umgestellt, eigene Skripte.
2. Auf `manifest.json` klicken. Rechts zeigt der **Diff** genau eine geänderte Zeile: rot die
   alte Version, grün die neue.
3. Alles zusammen committen, damit Update und Anpassung ein Schritt bleiben: unten bei **Summary**
   z. B. `Kurs-Paket auf 0.4.0` eintragen > **Commit to main** > **Push origin**.

✅ **Checkpoint:** GitHub Desktop zeigt **No local changes**, der Commit steht oben in
**History**.

Das ist der ganze Mechanismus: Die Version eines Pakets ist eine Zeile Text im Projekt, und
Git bewahrt jede Version auf. Ging bei der Aktualisierung etwas schief, macht **History** >
Rechtsklick auf den Commit > **Revert changes in commit** sie wieder rückgängig.

## Mit einem KI-Agenten

Mit Claude Code oder Codex im Projektordner geht es auch so:

```
Ändere in Packages/manifest.json die Version von de.macromedia.gec1 auf v0.4.0. Ändere sonst
nichts. Zeig mir danach den Diff. Nicht committen.
```

Danach Unity in den Vordergrund holen (Unity lädt das Paket dann neu) und weiter mit Schritt 2.

## Wenn es nicht klappt

**„No 'git' executable was found“ oder „Unable to add package“.**
Git fehlt oder der Unity Hub lief schon vor der Git-Installation. Siehe
[Git installieren](../install-git/).

**„Could not find … v0.4.0“ / die Version wird nicht gefunden.**
Tippfehler in der Adresse oder die Version gibt es (noch) nicht. Die Adresse genau so einfügen,
mit `#v` vor der Nummer und ohne Leerzeichen.

**Nach der Aktualisierung zeigt Unity rote Fehler in der Console.**
Erst prüfen, ob es **CS0246** mit **'Interaction'** oder **'KitGraph'** ist (siehe „Ab 0.4: einmal
anpassen“). Sonst zurück zum Stand vor dem Update: Unity schließen, in GitHub Desktop **alle**
geänderten Dateien mit **Discard changes** zurücksetzen (vor dem Commit; auch die angepassten Szenen,
Prefabs, Graphen und `ProjectSettings/KitMigration.asset`) bzw. den Commit mit **Revert changes in
commit** rückgängig machen, dann Unity wieder öffnen. Danach Jonas Bescheid sagen und den Text aus der
Console mitschicken.

**Unity zeigt oben einen Hinweis auf „experimentelle Pakete“.**
Das ist erwartet: Der Graph-Editor des Kits baut auf dem **Graph Toolkit** von Unity auf, das
noch als experimentell gekennzeichnet ist. Der Kurs nutzt genau die getestete Version. Den
Hinweis einfach stehen lassen.

**Im Package Manager steht noch die alte Version.**
Unity neu starten. Steht in `Packages/manifest.json` die neue Version, lädt Unity sie beim Öffnen.
