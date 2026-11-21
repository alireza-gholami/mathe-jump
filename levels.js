const LEVELS = [
  {
    title: "Level 1: Gerade Linie nach oben",
    hint: "Steige gleichmäßig an! Für 1 Schritt nach rechts gehst du 1 hoch. (Tipp: x + 1)",
    startX: 0,
    coins: [
      { x: 0, y: 1 },
      { x: 2, y: 3 },
      { x: 4, y: 5 }
    ],
    platforms: []
  },
  {
    title: "Level 2: Flache Gerade durch den Ursprung",
    hint: "Steige flacher an! Für 2 Schritte nach rechts nur 1 hoch. (Tipp: 0.5*x)",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 2, y: 1 },
      { x: 4, y: 2 }
    ],
    platforms: []
  },
  {
    title: "Level 3: Der Parabel-Bogen",
    hint: "Worfen im Bogen! Hoch und wieder runter auf den Boden. (Tipp: -x^2 + 4*x)",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 2, y: 4 },
      { x: 4, y: 0 }
    ],
    platforms: []
  },
  {
    title: "Level 4: Anlauf nach links",
    hint: "Laufe erst nach links zu x = -3, dann wirf den Bogen über alle drei Münzen. (Tipp: -x^2 + 4)",
    startX: -3,
    coins: [
      { x: -2, y: 0 },
      { x: 0, y: 4 },
      { x: 2, y: 0 }
    ],
    platforms: []
  },
  {
    title: "Level 5: Gerade nach unten",
    hint: "Laufe bergab! Für jeden Schritt nach rechts gehst du 1 runter. (Tipp: -x + 4)",
    startX: 0,
    coins: [
      { x: 0, y: 4 },
      { x: 2, y: 2 },
      { x: 4, y: 0 }
    ],
    platforms: []
  },
  {
    title: "Level 6: Landung auf der Plattform",
    hint: "Flieg hoch und lande genau auf der braunen Plattform bei y = 2. (Tipp: 0.5*x)",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 2, y: 1 },
      { x: 4, y: 2 }
    ],
    platforms: [
      { x: 3.5, y: 2, w: 1, h: 0.5 }
    ]
  },
  {
    title: "Level 7: Breite Parabel",
    hint: "Ein weiter Bogen über das ganze Level. (Tipp: -0.25*x^2 + 2*x)",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 4, y: 4 },
      { x: 8, y: 0 }
    ],
    platforms: []
  },
  {
    title: "Level 8: Sehr steil nach oben",
    hint: "Extrem steil! Für 1 Schritt nach rechts gehst du 3 hoch. (Tipp: 3*x)",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 1, y: 3 },
      { x: 2, y: 6 }
    ],
    platforms: []
  },
  {
    title: "Level 9: Die V-Form (Absolutwert)",
    hint: "Laufe erst nach links zu x = -2, dann über 0 nach rechts. (Tipp: abs(x))",
    startX: -2,
    coins: [
      { x: -2, y: 2 },
      { x: 0, y: 0 },
      { x: 2, y: 2 }
    ],
    platforms: []
  },
  {
    title: "Level 10: Der große Abschuss",
    hint: "Eine weite Parabel mit hohem Scheitel. (Tipp: -0.5*x^2 + 4*x)",
    startX: 0,
    coins: [
      { x: 0, y: 0 },
      { x: 4, y: 8 },
      { x: 8, y: 0 }
    ],
    platforms: []
  }
];
