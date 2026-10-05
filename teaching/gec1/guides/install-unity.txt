<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/install-unity/ · Stand 2026-10-05T13:39Z · 21cef83 -->

Dauer: ca. 60 Min (davon 30–45 Min Download)

Voraussetzungen: 25 GB freier Speicher (während der Installation werden ca. 20 GB gebraucht); Internet (der Download ist ca. 4 GB unter Windows, 5 GB am Mac); Git ist installiert oder lädt gerade (Git installieren)

Checkpunkte:
- [ ] Unity Hub startet und zeigt das angemeldete Konto
- [ ] Im Hub steht eine aktive Lizenz "Unity Personal"
- [ ] Unter Installs steht 6000.3.15f1 (im Kurs reicht es, dass der Download läuft)

Stand: nicht durchgespielt

# Unity installieren

Unity besteht aus zwei Programmen. Der **Unity Hub** ist der Startbildschirm: Er lädt
Unity-Versionen herunter und öffnet Projekte. Der **Unity Editor** ist die eigentliche
Engine. Zuerst wird der Hub installiert, dann damit genau eine Editor-Version: **6000.3.15f1**
(Unity 6.3 LTS).

Warum genau diese Version? Ein Unity-Projekt merkt sich, mit welcher Version es angelegt
wurde. Wird es mit einer anderen geöffnet, baut Unity es um. Das klappt meistens, aber nicht
immer – und dann sieht das Projekt anders aus als bei allen anderen.

**Keine neuere 6.3-Version nehmen.** Ab 6000.3.16 hat Unity etwas geändert, das den
Graph-Editor des Kurs-Kits kaputt macht. Darum nutzt der Kurs genau **6000.3.15f1**, auch wenn
der Hub eine neuere anbietet. **Kurs > Setup prüfen** meldet neuere Versionen als FEHLER.

**Im Kurs:** Den Download so früh wie möglich starten (Schritt 3), danach geht es mit
[GitHub einrichten](../github/) weiter, während Unity lädt. **Deckel offen lassen und das
Netzteil anstecken** – schläft der Rechner, hält der Download an.

## Schritt 1: Unity Hub herunterladen und installieren

Den Hub direkt von Unity herunterladen:

| System | Download |
|---|---|
| Windows | <https://public-cdn.cloud.unity3d.com/hub/prod/UnityHubSetup-x64.exe> |
| Mac mit Apple-Chip (M1, M2, …) | <https://public-cdn.cloud.unity3d.com/hub/prod/UnityHubSetup-arm64.dmg> |
| Mac mit Intel-Chip | <https://public-cdn.cloud.unity3d.com/hub/prod/UnityHubSetup-x64.dmg> |

(Welcher Mac? Apple-Menü > **Über diesen Mac**: Steht dort „Chip Apple M…“, ist es ein
Apple-Chip.) Die Seite unity.com/download führt inzwischen zuerst zur Anmeldung – die Links oben
sparen diesen Umweg.

- **Windows:** `UnityHubSetup-x64.exe` starten. Windows fragt **Möchten Sie zulassen, dass durch
  diese App Änderungen …?** – **Ja**. Dann mit den Standardeinstellungen durchklicken.
- **Mac:** Die `.dmg`-Datei öffnen und **Unity Hub** in den Ordner **Programme** ziehen.

Den Unity Hub starten.

**Mac mit Apple-Chip:** Unity braucht zusätzlich **Rosetta 2**. Fragt der Mac beim Start danach,
auf **Installieren** klicken. Fragt er nicht, das Programm **Terminal** öffnen und eingeben:

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
(**Skip installation**). Der Kurs braucht eine bestimmte Version, nicht die neueste.

✅ **Checkpoint:** Oben links im Hub ist das Konto-Symbol zu sehen. Unter **Einstellungen
(Zahnrad) > Licenses** steht eine aktive Lizenz **Unity Personal**.

## Schritt 3: Unity 6000.3.15f1 installieren

Der Hub zeigt in seiner Liste immer nur die neueste 6.3-Version. Bis zum Kurs kann das schon
eine neuere als die Kursversion sein. Darum kommt die Kursversion über einen Link:

1. Auf diesen Link klicken: [**Unity 6000.3.15f1 im Hub installieren**](unityhub://6000.3.15f1/c1aa84e375f6)
   (oder `unityhub://6000.3.15f1/c1aa84e375f6` in die Adresszeile kopieren und Enter drücken).
2. Der Browser fragt, ob er den Unity Hub öffnen darf: **Ja / Öffnen**.
3. Der Hub zeigt **Install Unity 6000.3.15f1** und eine Liste von **Modulen**. So einstellen:

| Modul | Windows | Mac |
|---|---|---|
| Microsoft Visual Studio Community | **abwählen** (der Kurs nutzt VS Code) | – |
| Windows Build Support (Mono) | ist schon dabei | **im Kurs weglassen**, zu Hause nachinstallieren (siehe unten) |
| Windows Build Support (IL2CPP) | **weglassen** | weglassen |
| Mac Build Support (Mono) | weglassen | ist schon dabei |
| Mac Build Support (IL2CPP) | weglassen | weglassen |
| Documentation | weglassen | weglassen |
| alles andere (Android, iOS, Linux, WebGL, Sprachpakete) | weglassen | weglassen |

4. Auf **Install** klicken (eventuell vorher Lizenzbedingungen bestätigen).
5. Warten. Der Fortschritt steht unter **Downloads**.

(Screenshot folgt: Zeigt den Modul-Dialog unter Windows: Visual Studio Community abgewählt, alle Module darunter (auch IL2CPP) ohne Haken.)

(Screenshot folgt: Zeigt den Modul-Dialog am Mac: nichts angehakt.)

Warum so wenig? Alle laden im Kurs gleichzeitig über dasselbe WLAN. Der Editor allein ist
schon ca. 4 GB (Windows) bzw. 5 GB (Mac) groß. Jedes weggelassene Modul hilft allen.
Visual Studio Community allein wären 1,7 GB.

**Windows: Zwischendurch auf den Hub schauen.** Ist der Download fertig, fragt Windows noch
einmal **Möchten Sie zulassen, dass durch diese App Änderungen …?** – **Ja**. Diese Frage kommt
oft mitten in der Vorlesung. Bleibt sie unbeantwortet, bricht die Installation ab. Darum den
Hub zwischendurch ansehen (Taskleiste).

✅ **Checkpoint:** Unter **Downloads** erscheint ein Fortschrittsbalken für **6000.3.15f1**. Im
Kurs: Jetzt mit [GitHub einrichten](../github/) weitermachen, während Unity lädt. Ist alles
fertig, steht unter **Installs** ein Eintrag **6000.3.15f1** mit dem Zusatz **LTS**, ohne
Fortschrittsbalken.

(Screenshot folgt: Zeigt Installs mit genau einem Eintrag 6000.3.15f1 LTS.)

## Später, zu Hause (nur Mac): Windows-Build-Modul

Abgegeben wird ein Windows-Build. Der lässt sich auch am Mac erstellen, wenn das Modul
**Windows Build Support (Mono)** installiert ist (ca. 400 MB). Das Modul zu Hause installieren,
irgendwann vor der Abgabe: Unity Hub > **Installs** > Zahnrad bei **6000.3.15f1** >
**Add modules** > **Windows Build Support (Mono)** anhaken > **Install**. **Kurs > Setup prüfen**
erinnert daran (bis kurz vor der Abgabe als INFO, danach als WARNUNG).

Weiter mit [GitHub einrichten](../github/).

## Wenn es nicht klappt

**Der Link `unityhub://…` tut nichts.**
Ist der Hub installiert und einmal gestartet worden? Dann den Link in die Adresszeile kopieren
statt ihn anzuklicken. Klappt es immer noch nicht: Die Seite
<https://unity.com/releases/editor/whats-new/6000.3.15f1> öffnen und dort auf **Install** klicken
(derselbe Link, als Knopf).

**Windows: Die Installation ist abgebrochen, unter Installs steht nichts.**
Meist wurde die Frage **Änderungen zulassen?** nicht rechtzeitig beantwortet. Den Link aus
Schritt 3 noch einmal öffnen und diesmal beim Hub bleiben, bis die Frage kommt. Der Download
wird nicht wiederholt, wenn er schon fertig war.

**Der Mac sagt: "Unity Hub kann nicht geöffnet werden".**
macOS 15 und neuer: **Systemeinstellungen > Datenschutz & Sicherheit**, ganz nach unten
scrollen, bei Unity Hub **Dennoch öffnen** klicken. Ältere macOS-Versionen: Rechtsklick auf
**Unity Hub** im Programme-Ordner > **Öffnen** > **Öffnen**.

**"No valid Unity Editor license found" / "Lizenz fehlt".**
Hub > Zahnrad > **Licenses** > **Add** > **Get a free personal license**.

**Die Installation bricht ab oder steht bei "Validating" / "Unpacking" still.**
Meist zu wenig Speicher: Beim Entpacken braucht Unity vorübergehend mehr Platz, als am Ende
belegt ist. Ca. 20 GB freien Platz schaffen, dann im Hub unter Installs das Zahnrad am Eintrag >
**Uninstall** und Schritt 3 wiederholen. Virenscanner (nicht Windows Defender) können die
Installation bremsen.

**Windows: Auf C: ist zu wenig Platz.**
Hub > Zahnrad > **Installs** > **Installs location** auf eine andere Festplatte stellen, dann
Schritt 3 wiederholen. Einen Ordner ohne Umlaute und Leerzeichen nehmen, z. B. `D:\Unity\Editors`.

**Mac: Zu wenig Platz.**
**Systemeinstellungen > Allgemein > Speicher** zeigt, was Platz belegt, und bietet Aufräumen an.
Reicht das nicht: Hub > **Settings** > **Installs** > **Installs location** auf eine externe SSD
(Format APFS) stellen und Schritt 3 wiederholen. Die SSD muss dann beim Arbeiten mit Unity
angeschlossen sein.

**Der Windows-Benutzername enthält Umlaute oder Sonderzeichen (z. B. `Jörg`).**
Die Installation klappt trotzdem. Projekte aber später in einen Ordner wie `C:\Unity\` legen
statt unter `C:\Users\Jörg\…` (siehe [Projekt anlegen](../create-project/)).

**Der Hub zeigt nur eine neuere Version (höhere Zahl vor dem `f1`).**
Nicht installieren – ab 6000.3.16 funktioniert der Graph-Editor des Kurs-Kits nicht. Den Link
aus Schritt 3 nehmen. Ist schon eine andere Version installiert,
ist das kein Problem – sie schadet nicht, kostet aber Platz.

**Mac: "Diese App benötigt Rosetta" oder Unity startet nicht.**
Rosetta installieren (siehe Schritt 1), dann den Hub neu starten.

**Mac: Der Hub fragt nach Zugriff auf Ordner (Dokumente, Schreibtisch).**
Erlauben. Sonst kann er die Projekte nicht öffnen.

**Im Kurs: Der Download ist extrem langsam (Restzeit über eine Stunde).**
Jonas Bescheid sagen. Den Download laufen lassen und zu Hause fertig werden lassen; der Rest
der Einrichtung geht trotzdem weiter.
