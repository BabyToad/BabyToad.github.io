<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/overview/ · Stand 2026-10-05T12:36Z · 9fcef5f -->

Dauer: 5 Min lesen; im Kurs ca. 2–3 Stunden, viel davon Download im Hintergrund

Voraussetzungen: Laptop mit Ladekabel; ca. 20–25 GB freier Speicher; Zugriff auf das E-Mail-Postfach (Bestätigungscodes); Handy mit einer Authenticator-App (für GitHub)

Checkpunkte:
- [ ] Git ist installiert und der Unity-Download läuft
- [ ] Ein GitHub-Konto existiert und GitHub Desktop ist angemeldet
- [ ] Das Projekt aus der Kursvorlage ist in Unity geöffnet
- [ ] Der erste Commit ist gemacht und einmal rückgängig gemacht

Stand: nicht durchgespielt

# Setup im Kurs

Am ersten Kurstag (09.10.) richten alle ihren Laptop gemeinsam im Raum ein. Mitbringen: den
Laptop, das **Ladekabel** und das Handy.

Im Kurs wird mit vier Werkzeugen gearbeitet: **Unity** (die Engine), **Git** (die
Versionsverwaltung, der Rückgängig-Knopf), **Visual Studio Code** (Editor für C#) und einem
**KI-Agenten** (GitHub Copilot), der im Projekt Code liest und schreibt.

Alle nutzen dieselben Versionen. Dann sieht der Bildschirm aus wie in den Anleitungen, und
wenn etwas kaputt geht, lässt sich schnell helfen.

| Werkzeug | Version / Variante | Wofür |
|---|---|---|
| Git | aktuelle Version | Unity lädt damit das Kurs-Paket; Rückgängig-Knopf |
| Unity Hub | aktuelle Version | installiert und öffnet Unity |
| Unity Editor | **Unity 6.3 LTS – 6000.3.15f1** | die Engine |
| Projektvorlage | Kursvorlage auf GitHub (Universal 3D, URP) | das eigene Projekt |
| GitHub Desktop | aktuelle Version | Git ohne Kommandozeile |
| Visual Studio Code | aktuelle Version + Unity-Erweiterung | C# lesen und schreiben |
| GitHub Copilot | Free, später Student | der KI-Agent |

## Vorab: Rechner prüfen (2 Minuten)

| | Windows | Mac |
|---|---|---|
| Freier Speicher | Explorer > **Dieser PC**: bei Laufwerk C: mindestens 20–25 GB frei | Apple-Menü > **Systemeinstellungen > Allgemein > Speicher**: mindestens 20–25 GB frei |
| System | **Einstellungen > System > Info**: Windows 10 (21H1 oder neuer) oder 11, 64 Bit | Apple-Menü > **Über diesen Mac**: macOS 13 oder neuer; dort steht auch der Chip (Apple M… oder Intel) |
| Installieren erlaubt? | **Einstellungen > System > Aktivierung**: steht dort „S-Modus“, lassen sich nur Store-Apps installieren – Jonas Bescheid sagen | Ein Administrator-Konto ist nötig (Passwort beim Installieren) |

Ein Laptop mit 8 GB RAM reicht für den Kurs; mit 16 GB läuft alles flüssiger. Ein
Firmen-Laptop ohne Installationsrechte geht nicht – Jonas Bescheid sagen, dann am ersten Tag
zu zweit arbeiten.

## Die Reihenfolge im Kurs

Unity ist ein großer Download (Windows ca. 4 GB, Mac ca. 5 GB), und alle laden gleichzeitig
über dasselbe WLAN. Darum **startet der Unity-Download früh**, und alles andere läuft, während
er lädt. **Deckel offen lassen** – ein schlafender Rechner lädt nicht weiter.

| | Was | Anleitung | Wann |
|---|---|---|---|
| A | Git installieren (Mac: startet und lädt im Hintergrund), dann Unity Hub, Konto, **Unity-Download starten** | [Git installieren](../install-git/), dann [Unity installieren](../install-unity/) | sofort |
| B | GitHub-Konto, GitHub Desktop; VS Code, Unity-Erweiterung, Copilot anmelden (Schritte 1, 2 und 4) | [GitHub einrichten](../github/), [VS Code und KI-Agent](../vscode-and-agent/) | während Unity lädt |
| C | Projekt aus der Kursvorlage, in Unity öffnen, Setup prüfen | [Projekt anlegen](../create-project/) | wenn Unity fertig installiert ist |
| D | VS Code mit Unity verbinden, erste Frage an den Agenten (Schritte 3 und 5) | [VS Code und KI-Agent](../vscode-and-agent/) | nach C, notfalls zu Hause |
| E | Erster Commit und rückgängig machen | [Erster Commit](../first-commit/) | gemeinsam am Ende |

Jede Anleitung beendet ihre Schritte mit einem **Checkpoint**. Erst weitergehen, wenn zu
sehen ist, was dort steht.

**Wichtig beim Unity-Download:** Nur die Module wählen, die in der Anleitung stehen. Unter
Windows **Visual Studio Community abwählen** – das spart 1,7 GB für alle im WLAN. Unter Windows
zwischendurch auf den Hub schauen: Nach dem Download fragt Windows noch einmal nach Erlaubnis.

Was im Kurs nicht fertig wird, geht zu Hause mit denselben Anleitungen weiter. Alle Links und
optionalen Werkzeuge (Installationsskript, Claude Code, Codex) stehen unter
[Downloads & Optionen](../downloads/).

## Schon Erfahrung?

Wer Unity und Git schon kennt, darf eigene Wege gehen. **Fest** sind:

- Unity **6000.3.15f1**,
- das Projekt aus der **Kursvorlage**, als **privates** Repository auf GitHub,
- `AGENTS.md`, `KI-VERZEICHNIS.md` und `DOKUMENTATION.md` bleiben im Projekt,
- **Kurs > Setup prüfen** zeigt keinen FEHLER,
- Git ist für Unity erreichbar (das Kurs-Paket wird per Git geladen).

**Frei** sind Git-Programm (Kommandozeile statt GitHub Desktop ist in Ordnung), Code-Editor
(Rider, Visual Studio) und KI-Agent. GitHub Desktop wird nur für den gemeinsamen Schritt E
gezeigt. Wer fertig ist: bitte den Nachbarn helfen.

## Was angelegt wird

- ein **Unity-Konto** (kostenlos, Unity Personal)
- ein **GitHub-Konto** (kostenlos, mit Zwei-Faktor-Anmeldung über eine App auf dem Handy)

Für beide ist eine E-Mail-Adresse nötig, auf die im Kurs Zugriff besteht. Für GitHub am besten
die Hochschul-Adresse nehmen – das hilft beim Studierendenrabatt.

## Wenn es hakt

1. Den Abschnitt **Wenn es nicht klappt** am Ende der Anleitung lesen.
2. Die Nachbarin oder den Nachbarn mit demselben Betriebssystem fragen.
3. Bei Jonas melden. Dazu sagen, bei welcher Anleitung und welchem Schritt es hakt und was zu
   sehen ist.
4. Zu Hause: In Unity **Kurs > Setup prüfen** > **Bericht kopieren** und den Bericht dem
   KI-Agenten oder Jonas schicken.
