<!-- Markdown-Fassung von https://www.allknivesnobagel.com/teaching/gec1/guides/github/ · Stand 2026-10-03T16:46Z · f9bdc78 -->

Dauer: ca. 20 Min (plus Wartezeit für die Studierenden-Prüfung)

Voraussetzungen: Zugriff auf das Hochschul-E-Mail-Postfach; eine aktuelle Immatrikulationsbescheinigung als PDF oder Foto

Checkpunkte:
- [ ] Auf github.com angemeldet, mit Zwei-Faktor-Anmeldung
- [ ] Der Antrag bei GitHub Education ist abgeschickt
- [ ] GitHub Desktop ist installiert und mit dem eigenen Konto angemeldet

Stand: nicht durchgespielt

# GitHub einrichten

**Git** speichert Zwischenstände des Projekts. Jeder Zwischenstand heißt **Commit**. Wenn
etwas kaputt geht – durch eigene Änderungen oder durch den KI-Agenten –, lässt sich der letzte
Commit wiederherstellen. Darum ist Git im Kurs Pflicht: Es ist der Rückgängig-Knopf.

**GitHub** ist eine Website, auf der die Commits zusätzlich liegen: als Sicherung und
damit Jonas ins Projekt schauen kann. **GitHub Desktop** ist das Programm, mit dem sich
Git bedienen lässt, ohne Befehle zu tippen.

## Schritt 1: GitHub-Konto anlegen

1. <https://github.com/signup> öffnen.
2. Als E-Mail die **Hochschul-Adresse** nehmen. (Eine private lässt sich später dazunehmen.)
3. Einen Benutzernamen wählen, der auch in einer Bewerbung stehen kann. Er steht in jeder
   Adresse der eigenen Projekte.
4. Die E-Mail mit dem Code bestätigen, den GitHub schickt.

GitHub verlangt eine **Zwei-Faktor-Anmeldung** (2FA). Sie am besten gleich einrichten:
Profilbild oben rechts > **Settings** > **Password and authentication** > **Enable two-factor
authentication**. Am einfachsten mit einer Authenticator-App auf dem Handy. **Die
Wiederherstellungscodes** (Recovery codes) an einem sicheren Ort speichern.

✅ **Checkpoint:** Die Anmeldung auf github.com hat geklappt. Unter **Settings > Password and
authentication** steht bei Two-factor authentication **Enabled**.

## Schritt 2: Studierendenrabatt beantragen (GitHub Education)

Studierende bekommen **GitHub Copilot Student** kostenlos – mehr KI-Nutzung als im
kostenlosen Copilot Free. Die Prüfung kann ein paar Tage dauern. Darum **heute** beantragen,
auch wenn Copilot erst später gebraucht wird. Bis zur Freigabe geht es mit Copilot Free.

1. <https://github.com/education/students> öffnen und auf **Join GitHub Education** bzw.
   **Get student benefits** klicken.
2. Die Hochschul-E-Mail wählen und die Hochschule suchen (**Macromedia**, Standort Leipzig).
3. Als Nachweis die **Immatrikulationsbescheinigung** hochladen. Wichtig: Darauf müssen
   Name, Hochschule und ein **aktuelles Datum** zu sehen sein. Ein scharfes Foto
   geht auch.
4. Den Antrag abschicken. GitHub fragt eventuell nach dem Standort – erlauben, das ist Teil
   der Prüfung.

(Screenshot folgt: Zeigt das Antragsformular mit ausgewählter Hochschule und hochgeladenem Nachweis, persönliche Daten geschwärzt.)

✅ **Checkpoint:** Eine Bestätigung erscheint, dass der Antrag eingegangen ist. Der Status
steht später unter <https://github.com/settings/education/benefits>.

## Schritt 3: GitHub Desktop installieren

1. <https://desktop.github.com> öffnen und GitHub Desktop herunterladen.
   - **Windows:** Installer starten. Er installiert sich ohne Rückfragen und öffnet sich.
   - **Mac:** Die `.zip` entpacken (passiert meist automatisch) und **GitHub Desktop** in den
     Ordner **Programme** ziehen. Dann starten.
2. Auf **Sign in to GitHub.com** klicken. Der Browser öffnet sich. Anmelden und auf
   **Authorize desktop** klicken. Der Browser fragt, ob er GitHub Desktop öffnen darf: **Ja / Öffnen**.
3. GitHub Desktop fragt nach **Configure Git**: Name und E-Mail. Die Vorschläge stehen lassen
   (GitHub-Name und E-Mail-Auswahl) und auf **Finish** klicken.

(Screenshot folgt: Zeigt GitHub Desktop nach dem Anmelden: die leere Startseite mit "Let's get started!" und den Knöpfen Clone / Create / Add.)

GitHub Desktop bringt Git selbst mit. Git muss **nicht** extra installiert werden.

✅ **Checkpoint:** GitHub Desktop zeigt **Let's get started!**. Unter **File > Options >
Accounts** (Mac: **GitHub Desktop > Settings > Accounts**) steht der eigene GitHub-Name.

## Jonas Zugriff geben – freiwillig

Das Projekt-Repository ist **privat**: Nur der Besitzer oder die Besitzerin sieht es. Wer <!-- Durchsicht -->
will, lädt Jonas als Mitarbeiter (Collaborator) ein. Dann kann er bei Bedarf ins Projekt
schauen und helfen. Das ist **freiwillig und keine Bedingung** für den Kurs oder die Bewertung.
Empfohlen ist es trotzdem: Mit Zugriff sieht Jonas Probleme oft in einer Minute, statt sie
sich beschreiben zu lassen.

Das geht erst, wenn das Repository existiert (Anleitung **Projekt anlegen**): auf github.com im
eigenen Repository **Settings** > **Collaborators** > **Add people** > `BabyToad` > **Add to
repository**. Der Zugriff lässt sich jederzeit an derselben Stelle wieder entfernen.

Fertig. Weiter mit **Projekt anlegen**.

## Wenn es nicht klappt

**GitHub schickt keinen Bestätigungscode.**
Spam-Ordner prüfen. Hochschul-Postfächer filtern manchmal stark – dann mit einer privaten
Adresse anmelden und die Hochschul-Adresse später unter **Settings > Emails** hinzufügen
(sie ist für den Education-Antrag nötig).

**Der Education-Antrag wird abgelehnt.**
Meist ist der Nachweis das Problem: kein Datum, unscharf, abgeschnitten, oder der Name im
Dokument passt nicht zum GitHub-Profil. Unter **Settings > Public profile** den
echten Namen eintragen und den Antrag mit einem besseren Nachweis neu stellen. Bis dahin reicht
Copilot Free für den Anfang.

**Die Hochschule ist in der Liste nicht zu finden.**
Nach "Macromedia" ohne Zusatz suchen und den Eintrag wählen, der zur eigenen E-Mail-Adresse passt.
Falls nichts passt: Jonas Bescheid sagen und mit Copilot Free weitermachen.

**GitHub Desktop: Nach "Authorize desktop" passiert nichts.**
Der Browser hat die Rückfrage "GitHub Desktop öffnen?" eventuell blockiert. Prüfen, ob oben in
der Adresszeile ein Hinweis steht, oder einen anderen Browser versuchen. Alternativ in
GitHub Desktop **File > Options > Accounts > Sign in** nochmal.

**Mac: "GitHub Desktop kann nicht geöffnet werden".**
Rechtsklick auf **GitHub Desktop** im Programme-Ordner > **Öffnen** > **Öffnen**.

**Die 2FA-Wiederherstellungscodes sind nicht gespeichert.**
Jetzt nachholen: **Settings > Password and authentication > Recovery codes > View**. Ohne
Handy und ohne Codes ist das Konto sonst nicht mehr zugänglich.
