<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/overview/ · Stand 2026-10-03T16:48Z · 87a2a07 -->

Dauer: 5 Min lesen; im Kurs ca. 2 Stunden, viel davon Download im Hintergrund

Voraussetzungen: eigener Laptop mit Ladekabel; 25 GB freier Speicher; Zugriff auf das eigene E-Mail-Postfach (Bestätigungscodes); eigenes Handy (Zwei-Faktor-Anmeldung für GitHub)

Checkpunkte:
- [ ] Der Unity-Download läuft im Unity Hub
- [ ] Ein GitHub-Konto existiert und GitHub Desktop ist angemeldet
- [ ] Das eigene Projekt aus der Kursvorlage ist in Unity geöffnet
- [ ] Der erste Commit ist gemacht und einmal rückgängig gemacht

Stand: nicht durchgespielt

# Setup im Kurs

Am ersten Kurstag (09.10.) richten alle ihren Laptop gemeinsam im Raum ein. Vorher muss
nichts installiert werden. Mitzubringen: Laptop, **Ladekabel** und Handy.

Im Kurs kommen vier Werkzeuge zum Einsatz: **Unity** (die Engine), **Git** (die
Versionsverwaltung, der Rückgängig-Knopf), **Visual Studio Code** (Editor für C#) und ein
**KI-Agent** (GitHub Copilot), der im Projekt Code liest und schreibt.

Alle nutzen dieselben Versionen. Dann sieht der Bildschirm aus wie in den Anleitungen, und
wenn etwas kaputt geht, ist schnell Hilfe möglich.

| Werkzeug | Version / Variante | Wofür |
|---|---|---|
| Unity Hub | aktuelle Version | installiert und öffnet Unity |
| Unity Editor | **Unity 6.3 LTS – 6000.3.25f1** | die Engine |
| Projektvorlage | Kursvorlage auf GitHub (Universal 3D, URP) | das eigene Projekt |
| GitHub Desktop | aktuelle Version | Git ohne Kommandozeile |
| Visual Studio Code | aktuelle Version + Unity-Erweiterung | C# lesen und schreiben |
| GitHub Copilot | Free, später Student | der KI-Agent |

## Die Reihenfolge im Kurs

Unity ist ein großer Download (Windows ca. 4 GB, Mac ca. 5 GB), und alle laden gleichzeitig
über dasselbe WLAN. Darum **zuerst den Unity-Download starten** und alles andere erledigen,
während er läuft.

| | Was | Anleitung | Wann |
|---|---|---|---|
| A | Unity Hub installieren, anmelden, **Unity-Download starten** | **Unity installieren** | sofort |
| B | GitHub-Konto, GitHub Desktop | **GitHub einrichten** | während Unity lädt |
| B | VS Code, Unity-Erweiterung, Copilot anmelden (nur Schritte 1, 2 und 4) | **VS Code und KI-Agent** | während Unity lädt |
| C | Projekt aus der Kursvorlage, in Unity öffnen, Setup prüfen | **Projekt anlegen** | wenn Unity fertig ist |
| D | VS Code mit Unity verbinden, erste Frage an den Agenten (Schritte 3 und 5) | **VS Code und KI-Agent** | nach C |
| E | Erster Commit und rückgängig machen | **Erster Commit** | nach D |

Die Schritte jeder Anleitung enden mit einem **Checkpoint**. Erst weitermachen, wenn das zu
sehen ist, was dort steht.

**Wichtig beim Unity-Download:** Nur die Module wählen, die in der Anleitung stehen. Unter
Windows **Visual Studio Community abwählen** – das spart 1,7 GB auf dem eigenen Rechner und
im WLAN für alle anderen.

Was im Kurs nicht fertig wird, geht zu Hause mit denselben Anleitungen weiter. Optional,
und zu Hause: **Claude Code und Codex** (zwei kostenpflichtige Agenten im Terminal). Alle Links
stehen auf **Downloads & Optionen**.

## Was der Rechner braucht

| | Windows | Mac |
|---|---|---|
| Betriebssystem | Windows 10 (21H1) oder 11, 64 Bit, **nicht im S-Modus** | macOS 13 Ventura oder neuer |
| Prozessor | x64 (Intel/AMD) | Apple Silicon (M1 oder neuer) oder Intel |
| Speicher | mind. 25 GB frei | mind. 25 GB frei |
| Rechte | Programme installieren muss erlaubt sein | Programme installieren muss erlaubt sein |

Ein Laptop mit 8 GB RAM reicht für den Kurs. Mit 16 GB läuft alles flüssiger. Ein <!-- Durchsicht -->
Firmen-Laptop, auf dem nichts installiert werden darf, geht nicht. In dem Fall Jonas Bescheid
sagen, dann wird am ersten Tag zu zweit gearbeitet.

## Welche Konten angelegt werden

- ein **Unity-Konto** (kostenlos, Unity Personal)
- ein **GitHub-Konto** (kostenlos, mit Zwei-Faktor-Anmeldung über eine App auf dem Handy)

Für beide ist eine E-Mail-Adresse nötig, auf die im Kurs Zugriff besteht. Für GitHub am
besten die Hochschul-Adresse nehmen – das hilft beim Studierendenrabatt.

## Wenn es hakt

1. Den Abschnitt **Wenn es nicht klappt** am Ende der Anleitung lesen.
2. Bei Sitznachbarn mit demselben Betriebssystem nachfragen.
3. Bei Jonas melden. Dazu sagen: welche Anleitung, welcher Schritt, was zu sehen ist.
4. Zu Hause: In Unity **Kurs > Setup prüfen** > **Bericht kopieren** und den Bericht an den
   KI-Agenten oder an Jonas schicken.
