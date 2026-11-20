const LEVELS = [
  {
    title: "Level 1: Erste Schritte (Plus/Minus)",
    hint: "Sammle alle Münzen auf einer geraden Linie! (Tipp: x + ?)",
    startX: -4,
    endX: 4,
    coins: [
      { x: -2, y: 0 },
      { x: 0, y: 2 },
      { x: 2, y: 4 }
    ]
  },
  {
    title: "Level 2: Steigung (Mal & Geteilt)",
    hint: "Die Linie ist flacher. Nutze z.B. 0.5*x oder x/2.",
    startX: -4,
    endX: 4,
    coins: [
      { x: -4, y: -3 },
      { x: 0, y: -1 },
      { x: 4, y: 1 }
    ]
  },
  {
    title: "Level 3: Der Parabel-Sprung",
    hint: "Springe im Bogen über das Tal! (Tipp: -x^2 + ?)",
    startX: -3,
    endX: 3,
    coins: [
      { x: -2, y: 0 },
      { x: 0, y: 4 },
      { x: 2, y: 0 }
    ]
  },
  {
    title: "Level 4: Breite Parabel",
    hint: "Ein weiter Sprung! Mach die Parabel breiter (z.B. -0.25*x^2 + ?).",
    startX: -5,
    endX: 5,
    coins: [
      { x: -4, y: -1 },
      { x: 0, y: 3 },
      { x: 4, y: -1 }
    ]
  }
];
