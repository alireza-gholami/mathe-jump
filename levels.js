const LEVELS = [
  {
    title: "Level 1: Gerade Linie nach oben",
    hint: "Für 1 Schritt nach rechts gehst du 1 hoch. (Tipp: x + n)",
    startX: 0,
    coins: [
      { x: 0, y: 1 },
      { x: 2, y: 3 },
      { x: 4, y: 5 }
    ],
    platforms: [],
    maxAttempts: 3
  },
  {
    title: "Level 2: Flache Gerade durch den Ursprung",
    hint: "Für 2 Schritte nach rechts nur 1 hoch. (Tipp: n * x)",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 2, y: 1 },
      { x: 4, y: 2 },
      { x: 6, y: 3 }
    ],
    platforms: [],
    maxAttempts: 3
  },
  {
    title: "Level 3: Der Parabel-Bogen",
    hint: "Ein Bogen, der hochgeht und wieder runterkommt. (Tipp: -x^2 + n*x)",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 2, y: 4 },
      { x: 4, y: 0 }
    ],
    platforms: [],
    maxAttempts: 3
  },
  {
    title: "Level 4: Anlauf nach links",
    hint: "Laufe erst nach links, dann wirf einen Bogen über die Münzen. (Tipp: -x^2 + n)",
    startX: -3,
    coins: [
      { x: -2, y: 0 },
      { x: 0, y: 4 },
      { x: 2, y: 0 }
    ],
    platforms: [],
    maxAttempts: 3
  },
  {
    title: "Level 5: Gerade nach unten",
    hint: "Laufe bergab! Für jeden Schritt nach rechts gehst du 1 runter. (Tipp: -x + n)",
    startX: 0,
    coins: [
      { x: 0, y: 4 },
      { x: 2, y: 2 },
      { x: 4, y: 0 }
    ],
    platforms: [],
    maxAttempts: 3
  },
  {
    title: "Level 6: Landung auf der Plattform",
    hint: "Flieg hoch und lande genau auf der braunen Plattform. (Tipp: n * x)",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 2, y: 1 },
      { x: 4, y: 2 }
    ],
    platforms: [
      { x: 3.5, y: 2, w: 1, h: 0.5 }
    ],
    maxAttempts: 3
  },
  {
    title: "Level 7: Breite Parabel",
    hint: "Ein weiter Bogen über das ganze Level. (Tipp: -n*x^2 + m*x)",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 4, y: 4 },
      { x: 8, y: 0 },
      { x: 10, y: -2 }
    ],
    platforms: [],
    maxAttempts: 3
  },
  {
    title: "Level 8: Sehr steil nach oben",
    hint: "Extrem steil! (Tipp: n * x)",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 1, y: 3 },
      { x: 2, y: 6 }
    ],
    platforms: [],
    maxAttempts: 3
  },
  {
    title: "Level 9: Die V-Form",
    hint: "Laufe erst nach links zu x = -2, dann über 0 nach rechts. (Tipp: abs(x) + n)",
    startX: -2,
    coins: [
      { x: -2, y: 2 },
      { x: 0, y: 0 },
      { x: 2, y: 2 },
      { x: 4, y: 4 }
    ],
    platforms: [],
    maxAttempts: 3
  },
  {
    title: "Level 10: Der große Abschuss",
    hint: "Eine weite Parabel mit hohem Scheitel. (Tipp: -n*x^2 + m*x)",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 3, y: 6 },
      { x: 6, y: 0 },
      { x: 8, y: -4 }
    ],
    platforms: [],
    maxAttempts: 3
  }
];
