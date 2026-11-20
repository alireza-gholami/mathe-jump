const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const levelTitle = document.getElementById("level-title");
const levelHint = document.getElementById("level-hint");
const formulaInput = document.getElementById("formula");
const jumpBtn = document.getElementById("jumpBtn");
const nextBtn = document.getElementById("nextBtn");
const statusMsg = document.getElementById("status-msg");

let currentLevelIndex = 0;
let coins = [];
let player = { x: -4, y: 0 };
let pathPoints = [];
let isAnimating = false;

// Koordinaten-Umrechnung (Mathe -> Pixel)
const scale = 40; // 1 Einheit = 40 Pixel
const originX = canvas.width / 2;
const originY = canvas.height / 2;

function toPixelX(x) { return originX + x * scale; }
function toPixelY(y) { return originY - y * scale; }

// Level laden
function loadLevel(index) {
  const lvl = LEVELS[index];
  levelTitle.textContent = lvl.title;
  levelHint.textContent = lvl.hint;
  coins = lvl.coins.map(c => ({ ...c, collected: false }));
  player = { x: lvl.startX, y: 0 };
  pathPoints = [];
  statusMsg.textContent = "";
  nextBtn.classList.add("hidden");
  jumpBtn.disabled = false;
  draw();
}

// Mathe-Formel sicher auswerten (unterstützt +, -, *, /, ^, sin, cos, abs, sqrt)
function evaluateFormula(expr, x) {
  let clean = expr.toLowerCase().replace(/\s+/g, "");
  // Implizite Multiplikation erlauben (z.B. 2x -> 2*x, 2(x) -> 2*(x))
  clean = clean.replace(/(\d)(x|\()/g, "$1*$2");
  // Potenzen ^ zu ** umwandeln
  clean = clean.replace(/\^/g, "**");
  // Mathe-Funktionen erlauben
  clean = clean.replace(/(sin|cos|tan|abs|sqrt)/g, "Math.$1");

  const fn = new Function("x", `return ${clean};`);
  return fn(x);
}

// Sprung starten
jumpBtn.addEventListener("click", () => {
  if (isAnimating) return;
  const expr = formulaInput.value.trim();
  if (!expr) return;

  const lvl = LEVELS[currentLevelIndex];
  // Münzen für neuen Versuch zurücksetzen
  coins.forEach(c => c.collected = false);
  pathPoints = [];
  statusMsg.textContent = "";

  // Testen, ob Formel gültig ist
  try {
    const testY = evaluateFormula(expr, lvl.startX);
    if (isNaN(testY)) throw new Error();
  } catch {
    statusMsg.style.color = "#f38ba8";
    statusMsg.textContent = "Ungültige Formel! Nutze z.B. 2*x + 1 oder -x^2 + 4";
    return;
  }

  isAnimating = true;
  jumpBtn.disabled = true;
  let currentX = lvl.startX;
  const step = 0.08;

  function animate() {
    if (currentX <= lvl.endX) {
      const currentY = evaluateFormula(expr, currentX);
      player.x = currentX;
      player.y = currentY;
      pathPoints.push({ x: currentX, y: currentY });

      // Prüfen, ob eine Münze berührt wird
      coins.forEach(coin => {
        const dist = Math.hypot(player.x - coin.x, player.y - coin.y);
        if (dist < 0.45) coin.collected = true;
      });

      draw();
      currentX += step;
      requestAnimationFrame(animate);
    } else {
      isAnimating = false;
      jumpBtn.disabled = false;
      checkWin();
    }
  }
  animate();
});

// Prüfen ob alle Münzen gesammelt wurden
function checkWin() {
  const allCollected = coins.every(c => c.collected);
  if (allCollected) {
    statusMsg.style.color = "#a6e3a1";
    statusMsg.textContent = "Perfekt! Alle Münzen gesammelt! 🎉";
    if (currentLevelIndex < LEVELS.length - 1) {
      nextBtn.classList.remove("hidden");
    } else {
      statusMsg.textContent = "Glückwunsch! Du hast alle Level gemeistert! 🏆";
    }
  } else {
    statusMsg.style.color = "#fab387";
    statusMsg.textContent = "Knapp daneben! Passe deine Formel an und versuch es nochmal.";
  }
}

nextBtn.addEventListener("click", () => {
  currentLevelIndex++;
  formulaInput.value = "";
  loadLevel(currentLevelIndex);
});

// Spielfeld zeichnen
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Koordinatengitter
  ctx.strokeStyle = "#2b2b3d";
  ctx.lineWidth = 1;
  for (let x = -7; x <= 7; x++) {
    ctx.beginPath();
    ctx.moveTo(toPixelX(x), 0);
    ctx.lineTo(toPixelX(x), canvas.height);
    ctx.stroke();
  }
  for (let y = -5; y <= 5; y++) {
    ctx.beginPath();
    ctx.moveTo(0, toPixelY(y));
    ctx.lineTo(canvas.width, toPixelY(y));
    ctx.stroke();
  }

  // X- und Y-Achse
  ctx.strokeStyle = "#6c7086";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, originY); ctx.lineTo(canvas.width, originY);
  ctx.moveTo(originX, 0); ctx.lineTo(originX, canvas.height);
  ctx.stroke();

  // Achsen-Zahlen
  ctx.fillStyle = "#a6adc8";
  ctx.font = "12px sans-serif";
  for (let x = -6; x <= 6; x += 2) {
    if (x !== 0) ctx.fillText(x, toPixelX(x) - 4, originY + 15);
  }
  for (let y = -4; y <= 4; y += 2) {
    if (y !== 0) ctx.fillText(y, originX + 6, toPixelY(y) + 4);
  }

  // Flugbahn (Kurve) zeichnen
  if (pathPoints.length > 1) {
    ctx.strokeStyle = "#89b4fa";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(toPixelX(pathPoints[0].x), toPixelY(pathPoints[0].y));
    for (let p of pathPoints) {
      ctx.lineTo(toPixelX(p.x), toPixelY(p.y));
    }
    ctx.stroke();
  }

  // Münzen zeichnen
  coins.forEach(coin => {
    if (!coin.collected) {
      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.arc(toPixelX(coin.x), toPixelY(coin.y), 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#e09f3e";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  // Spielfigur zeichnen
  ctx.fillStyle = "#f38ba8";
  ctx.beginPath();
  ctx.arc(toPixelX(player.x), toPixelY(player.y), 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Spiel starten
loadLevel(0);
