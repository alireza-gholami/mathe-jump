const LEVELS = [
  {
    title: "Level 1: Erste Schritte (Plus)",
    hint: "Starte bei x=0 und sammle die Münzen nach oben! (Tipp: x + 1)",
    startX: 0, // Figur startet direkt bei 0 ohne zurückzulaufen
    coins: [
      { x: 0, y: 1 },
      { x: 2, y: 3 },
      { x: 4, y: 5 }
    ]
  },
  {
    title: "Level 2: Flache Steigung (Mal & Geteilt)",
    hint: "Steige flacher an! Nutze z.B. 0.5*x oder x/2.",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 2, y: 1 },
      { x: 6, y: 3 }
    ]
  },
  {
    title: "Level 3: Der Parabel-Sprung",
    hint: "Springe im Bogen nach vorne! (Tipp: -(x-2)^2 + 4 oder -x^2 + 4*x)",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 2, y: 4 },
      { x: 4, y: 0 }
    ]
  },
  {
    title: "Level 4 (Schwer): Anlauf nach links!",
    hint: "Hier musst du erst nach links anlaufen (x = -3), um alle Münzen zu erwischen!",
    startX: -3, // Nur hier läuft die Figur erst nach links zurück!
    coins: [
      { x: -2, y: 0 },
      { x: 0, y: 4 },
      { x: 2, y: 0 }
    ]
  }
];
