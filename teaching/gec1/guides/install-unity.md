<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/install-unity/ · Stand 2026-10-03T16:46Z · f9bdc78 -->

Dauer: ca. 60 Min (davon 30–45 Min Download)

Voraussetzungen: 25 GB freier Speicher; Internet (der Download ist ca. 4 GB unter Windows, 5 GB am Mac)

Checkpunkte:
- [ ] Unity Hub startet und zeigt das angemeldete Konto
- [ ] Im Hub steht eine aktive Lizenz "Unity Personal"
- [ ] Unter Installs steht 6000.3.25f1
- [ ] Im Kurs reicht es, dass der Download läuft

Stand: nicht durchgespielt

# Unity installieren

Unity besteht aus zwei Programmen. Der **Unity Hub** ist der Startbildschirm: Er lädt
Unity-Versionen herunter und öffnet Projekte. Der **Unity Editor** ist die eigentliche
Engine. Zuerst wird der Hub installiert, dann damit genau eine Editor-Version: **6000.3.25f1**
(Unity 6.3 LTS).

Warum genau diese Version? Ein Unity-Projekt merkt sich, mit welcher Version es angelegt
wurde. Wird es mit einer anderen geöffnet, baut Unity es um. Das klappt meistens, aber nicht
immer – und dann sieht das Projekt anders aus als bei allen anderen.

## Schritt 1: Unity Hub herunterladen und installieren

1. <https://unity.com/download> öffnen.
2. Den Unity Hub für das eigene System herunterladen.
   - **Windows:** `UnityHubSetup.exe` starten und mit den Standardeinstellungen durchklicken.
   - **Mac:** Die `.dmg`-Datei öffnen und **Unity Hub** in den Ordner **Programme** ziehen.
3. Den Unity Hub starten.

(Screenshot folgt: Zeigt die Download-Seite von unity.com mit dem Download-Knopf für den Unity Hub, Windows und Mac nebeneinander.)

**Mac mit Apple-Chip (M1, M2, …):** Unity braucht zusätzlich **Rosetta 2**. Fragt der Mac
beim Start danach, auf **Installieren** klicken. Fragt er nicht, das Programm **Terminal**
öffnen und eingeben:

```
softwareupdate --install-rosetta --agree-to-license
```

✅ **Checkpoint:** Jetzt sollte das Fenster des Unity Hub zu sehen sein, mit einer
Anmeldeseite oder der Projektliste.

## Schritt 2: Unity-Konto anlegen und anmelden

1. Im Hub auf **Sign in** klicken. Der Browser öffnet sich.
2. Falls noch kein Unity-Konto existiert: **Create a Unity ID**. Die E-Mail bestätigen, die
   Unity schickt.
3. Anmelden. Der Browser fragt, ob er den Unity Hub öffnen darf: **Ja / Öffnen**.
4. Fragt der Hub nach einer Lizenz, **Unity Personal** (kostenlos) wählen. Bestätigen, dass
   man nicht für eine Firma mit mehr als 200.000 $ Umsatz arbeitet.

(Screenshot folgt: Zeigt Hub > Einstellungen (Zahnrad) > Licenses mit einer aktiven Lizenz "Personal".)

**Fragt der Hub direkt, ob er die neueste Unity-Version installieren soll: Überspringen**
(**Skip installation**). Wir brauchen eine bestimmte Version, nicht die neueste.

✅ **Checkpoint:** Oben links im Hub ist das Konto-Symbol zu sehen. Unter **Einstellungen
(Zahnrad) > Licenses** steht eine aktive Lizenz **Unity Personal**.

## Schritt 3: Unity 6000.3.25f1 installieren

Der Hub zeigt in seiner Liste immer nur die neueste 6.3-Version. Bis zum Kurs kann das schon
eine neuere als unsere sein. Darum kommt unsere Version über einen Link:

1. Diesen Link in die Adresszeile des Browsers kopieren und Enter drücken:
   `unityhub://6000.3.25f1/e1dba0a9aba4`
2. Der Browser fragt, ob er den Unity Hub öffnen darf: **Ja / Öffnen**.
3. Der Hub zeigt **Install Unity 6000.3.25f1** und eine Liste von **Modulen**. So einstellen:

| Modul | Windows | Mac |
|---|---|---|
| Microsoft Visual Studio Community | **abwählen** (wir nehmen VS Code) | – |
| Windows Build Support (Mono) | ist schon dabei | **im Kurs weglassen**, zu Hause nachinstallieren (siehe unten) |
| Mac Build Support (Mono) | nicht nötig | ist schon dabei |
| Documentation | weglassen | weglassen |
| alles andere (Android, iOS, WebGL, Sprachpakete) | weglassen | weglassen |

4. Auf **Install** klicken (eventuell vorher Lizenzbedingungen bestätigen).
5. Warten. Der Fortschritt steht unter **Installs** und **Downloads**. Den Rechner anlassen
   und den Hub offen lassen.

(Screenshot folgt: Zeigt den Modul-Dialog unter Windows: Visual Studio Community abgewählt, sonst nichts angehakt.)

(Screenshot folgt: Zeigt den Modul-Dialog am Mac: nichts angehakt.)

Warum so wenig? Alle laden im Kurs gleichzeitig über dasselbe WLAN. Der Editor allein ist
schon ca. 4 GB (Windows) bzw. 5 GB (Mac) groß. Jedes weggelassene Modul hilft allen.
Visual Studio Community allein wären 1,7 GB.

✅ **Checkpoint:** Unter **Downloads** (bzw. **Installs**) erscheint ein Fortschrittsbalken
für **6000.3.25f1**. Im Kurs: Jetzt mit **GitHub einrichten** weitermachen, während Unity lädt.
Ist der Download fertig, steht unter **Installs** ein Eintrag **6000.3.25f1** mit dem Zusatz
**LTS**, ohne Fortschrittsbalken.

(Screenshot folgt: Zeigt Installs mit genau einem Eintrag 6000.3.25f1 LTS.)

## Später, zu Hause (nur Mac): Windows-Build-Modul

Abgegeben wird ein Windows-Build. Der lässt sich auch am Mac erstellen, wenn das Modul
**Windows Build Support (Mono)** installiert ist (ca. 400 MB). Das Modul zu Hause installieren,
irgendwann vor der Abgabe: Unity Hub > **Installs** > Zahnrad bei **6000.3.25f1** >
**Add modules** > **Windows Build Support (Mono)** anhaken > **Install**. **Kurs > Setup prüfen**
zeigt eine Warnung, solange es fehlt.

**Unity im Kurs vom USB-Stick installiert?** Dann geht **Add modules** im Hub nicht
(das geht nur bei Versionen, die der Hub selbst installiert hat). Stattdessen den
offiziellen Modul-Installer von Unity nehmen (ca. 400 MB):
<https://download.unity3d.com/download_unity/e1dba0a9aba4/MacEditorTargetInstaller/UnitySetup-Windows-Mono-Support-for-Editor-6000.3.25f1.pkg>
Datei öffnen, durchklicken, Unity neu starten. Er installiert das Modul in das Unity unter
`/Applications/Unity/`. _(Dieser Weg ist noch nicht getestet. Falls er nicht klappt, Jonas
Bescheid sagen.)_

Fertig. Weiter mit **GitHub einrichten**.

## Wenn es nicht klappt

**Der Link `unityhub://…` tut nichts.**
Ist der Hub installiert und einmal gestartet worden? Dann den Link nicht anklicken, sondern
in die Adresszeile kopieren. Klappt es immer noch nicht:
<https://unity.com/releases/editor/archive> öffnen, **6000.3.25f1** suchen und dort auf
**Install** (bzw. **Unity Hub**) klicken.

**Im Kurs: Der Download ist sehr langsam (Restzeit über eine Stunde).**
Jonas Bescheid sagen. Er hat USB-Sticks mit den offiziellen Unity-Installern dabei. Den
Hub-Download dann unter **Downloads** abbrechen.

**Der Mac sagt: "Unity Hub kann nicht geöffnet werden, da der Entwickler nicht verifiziert
werden kann."**
Rechtsklick auf **Unity Hub** im Programme-Ordner > **Öffnen** > **Öffnen**.

**"No valid Unity Editor license found" / "Lizenz fehlt".**
Hub > Zahnrad > **Licenses** > **Add** > **Get a free personal license**.

**Die Installation bricht ab oder steht bei "Validating" / "Unpacking" still.**
Meist Speicherplatz oder ein abgebrochener Download. Prüfen, ob 25 GB frei sind. Dann im
Hub unter Installs das Zahnrad am Eintrag > **Uninstall** und Schritt 3 wiederholen.
Virenscanner (nicht Windows Defender) können die Installation bremsen.

**Auf C: (Windows) ist zu wenig Platz.**
Hub > Zahnrad > **Installs** > **Installs location** auf eine andere Festplatte stellen, dann
Schritt 3 wiederholen. Einen Ordner ohne Umlaute und Leerzeichen nehmen, z. B. `D:\Unity\Editors`.

**Der Windows-Benutzername enthält Umlaute oder Sonderzeichen (z. B. `Jörg`).**
Die Installation klappt trotzdem. Projekte aber später in einen Ordner wie `C:\Unity\` legen
statt unter `C:\Users\Jörg\…` (Anleitung 3).

**Der Hub zeigt nur eine neuere Version (höhere Zahl vor dem `f1`).**
Nicht installieren. Den Link aus Schritt 3 nehmen. Ist schon eine andere Version installiert,
ist das kein Problem – sie schadet nicht, kostet aber Platz.

**Mac: "Diese App benötigt Rosetta" oder Unity startet nicht.**
Rosetta installieren (siehe Schritt 1), dann den Hub neu starten.

**Mac: Der Hub fragt nach Zugriff auf Ordner (Dokumente, Schreibtisch).**
Erlauben. Sonst kann er die Projekte nicht öffnen.
