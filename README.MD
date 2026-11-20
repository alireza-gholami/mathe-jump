# 🚀 Mathe-Jump

Ein kreatives Browser-Jump-'n'-Run, bei dem die Spielfigur nicht über Tasten, sondern über **mathematische Funktionen** gesteuert wird. Der Spieler gibt eine Gleichung (`y = ...`) ein, um entlang der berechneten Kurve Münzen einzusammeln.

---

## 🎮 Spielprinzip & Steuerung

1. **Spielername eingeben:** Oben links deinen Namen eintragen und auf **Laden / Speichern** klicken. Der Level-Fortschritt wird lokal im Browser gespeichert.
2. **Formel eingeben:** Im Feld `y =` eine mathematische Funktion eingeben (z. B. `x + 1`, `0.5*x`, `-x^2 + 4*x`).
3. **Springen:** Auf **Springen!** klicken oder einfach **Enter** drücken.
4. **Unterstützte Rechenzeichen:** `+`, `-`, `*`, `/`, `^` (Potenzen) sowie `sin()`, `cos()`, `tan()`, `abs()`, `sqrt()`.

---

## 📁 Projektstruktur

```text
mathe-jump/
├── index.html      # Grundgerüst, Spieler-Leiste & Eingabefeld
├── style.css       # Responsive Design für PC, Mac & Smartphone
├── levels.js       # Level-Baukasten (Münz-Koordinaten, Hinweise & Startpunkte)
├── game.js         # Mathe-Parser, Canvas-Welt, Animation & Speicherstand
├── figure.png      # Eigene Spielfigur (optional, sonst Ersatz-Grafik)
├── coin.png        # Eigene Münz-Grafik (optional, sonst Ersatz-Grafik)
└── README.md       # Projektdokumentation
```

---

## 🛠️ Lokale Entwicklung (VS Code)

1. Projektordner in **VS Code** öffnen.
2. Die Extension **Live Server** nutzen und unten rechts auf **Go Live** klicken, um das Spiel direkt im Browser zu testen.

### Eigene Level hinzufügen (`levels.js`)
Neue Level lassen sich jederzeit als neues Objekt im Array `LEVELS` ergänzen:
```javascript
{
  title: "Level 5: Mein neues Level",
  hint: "Tipp für den Spieler",
  startX: 0, // Optional: z.B. -3, falls die Figur erst nach links anlaufen soll
  coins: [
    { x: 0, y: 1 },
    { x: 2, y: 3 }
  ]
}
```

---

## 🌐 Deployment mit Git & GitHub Pages

Änderungen werden über das VS Code Terminal veröffentlicht:

```bash
git add .
git commit -m "Beschreibung der Änderung"
git push
```

Über **Settings → Pages** im GitHub-Repository (Branch: `main`) ist das Spiel automatisch über eine öffentliche URL auf jedem Gerät (Windows, Mac, iOS, Android) spielbar.

---

## 🔑 Aktuelle Level-Lösungen

* **Level 1:** `x + 1`
* **Level 2:** `0.5*x` *(oder `x/2`)*
* **Level 3:** `-(x-2)^2 + 4` *(oder `-x^2 + 4*x`)*
* **Level 4:** `-x^2 + 4`
