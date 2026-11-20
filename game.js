const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const levelTitle = document.getElementById("level-title");
const levelHint = document.getElementById("level-hint");
const formulaInput = document.getElementById("formula");
const jumpBtn = document.getElementById("jumpBtn");
const nextBtn = document.getElementById("nextBtn");
const statusMsg = document.getElementById("status-msg");

const playerNameInput = document.getElementById("playerNameInput");
const savePlayerBtn = document.getElementById("savePlayerBtn");
const savedBadge = document.getElementById("savedBadge");

// Eigene Bilder laden
const figureImg = new Image();
figureImg.src = "figure.png";
figureImg.onload = () => draw();

const coinImg = new Image();
coinImg.src = "coin.png";
coinImg.onload = () => draw();

let currentPlayerName = localStorage.getItem("matheJump_lastPlayer") || "Gast";
let currentLevelIndex = 0;
let coins = [];
let player = { x: 0, y: 0 };
let pathPoints = [];
let isAnimating = false;

const scale = 38;
const originX = canvas.width / 2;
const originY = canvas.height / 2 + 25;
const groundY = 0;

function toPixelX(x) { return originX + x * scale; }
function toPixelY(y) { return originY - y * scale; }

// Spieler-Fortschritt laden & speichern
function loadPlayerProgress(name) {
  const cleanName = name.trim() || "Gast";
  currentPlayerName = cleanName;
  playerNameInput.value = cleanName;
  localStorage.setItem("matheJump_lastPlayer", cleanName);

  const savedLvl = parseInt(localStorage.getItem(`matheJump_lvl_${cleanName}`), 10);
  currentLevelIndex = (!isNaN(savedLvl) && savedLvl < LEVELS.length) ? savedLvl : 0;
  savedBadge.textContent = `Gespeichert: Level ${currentLevelIndex + 1}`;
  loadLevel(currentLevelIndex);
}

function savePlayerProgress() {
  localStorage.setItem(`matheJump_lvl_${currentPlayerName}`, currentLevelIndex);
  savedBadge.textContent = `Gespeichert: Level ${currentLevelIndex + 1}`;
}

savePlayerBtn.addEventListener("click", () => {
  loadPlayerProgress(playerNameInput.value);
  statusMsg.style.color = "#89b4fa";
  statusMsg.textContent = `Spielstand für "${currentPlayerName}" geladen!`;
});

function loadLevel(index) {
  const lvl = LEVELS[index];
  levelTitle.textContent = lvl.title;
  levelHint.textContent = lvl.hint;
  coins = [...lvl.coins]
    .sort((a, b) => a.x - b.x)
    .map(c => ({ ...c, collected: false }));

  player = { x: 0, y: groundY };
  pathPoints = [];
  statusMsg.textContent = "";
  nextBtn.classList.add("hidden");
  jumpBtn.disabled = false;
  draw();
}

function evaluateFormula(expr, x) {
  let clean = expr.toLowerCase().replace(/\s+/g, "");
  clean = clean.replace(/(^|[+\-*/(])-x/g, "$1-1*x");
  clean = clean.replace(/(\d)(x|\()/g, "$1*$2");
  clean = clean.replace(/\^/g, "**");
  clean = clean.replace(/(sin|cos|tan|abs|sqrt)/g, "Math.$1");

  const fn = new Function("x", `return ${clean};`);
  return fn(x);
}

formulaInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (!nextBtn.classList.contains("hidden")) {
      nextBtn.click();
    } else if (!isAnimating) {
      jumpBtn.click();
    }
  }
});

jumpBtn.addEventListener("click", () => {
  if (isAnimating) return;
  const expr = formulaInput.value.trim();
  if (!expr) return;

  try {
    const testY = evaluateFormula(expr, 0);
    if (isNaN(testY)) throw new Error();
  } catch {
    statusMsg.style.color = "#f38ba8";
    statusMsg.textContent = "Ungültige Formel! Nutze z.B. x + 1 oder -x^2 + 4*x";
    return;
  }

  const lvl = LEVELS[currentLevelIndex];
  coins.forEach(c => c.collected = false);
  pathPoints = [];
  statusMsg.textContent = "";
  isAnimating = true;
  jumpBtn.disabled = true;

  // Startpunkt des Sprungs: entweder 0 oder der im Level definierte startX
  const jumpStartX = lvl.startX !== undefined ? lvl.startX : 0;
  const jumpEndX = coins[coins.length - 1].x + 0.5;
  const entryY = evaluateFormula(expr, jumpStartX);

  // Wenn jumpStartX == 0, springt er direkt los, ohne erst zurückzulaufen!
  let phase = (jumpStartX !== 0) ? "runToStart" : "hopToCurve";
  player = { x: 0, y: groundY };
  let hopProgress = 0;
  let vx = 0.08;
  let vy = 0;

  function animate() {
    if (phase === "runToStart") {
      const dir = jumpStartX >= player.x ? 1 : -1;
      player.x += 0.1 * dir;
      player.y = groundY + Math.abs(Math.sin(player.x * 6)) * 0.12;

      if ((dir === 1 && player.x >= jumpStartX) || (dir === -1 && player.x <= jumpStartX)) {
        player.x = jumpStartX;
        player.y = groundY;
        phase = "hopToCurve";
      }
    } else if (phase === "hopToCurve") {
      // Wenn Formel bei x=0 über dem Boden startet (z.B. x + 1 -> y=1), hüpft er hoch
      if (Math.abs(entryY - groundY) < 0.1) {
        player.y = entryY;
        phase = "math";
      } else {
        hopProgress += 0.15;
        player.y = groundY + (entryY - groundY) * hopProgress;
        if (hopProgress >= 1) {
          player.y = entryY;
          phase = "math";
        }
      }
    } else if (phase === "math") {
      player.x += 0.07;
      player.y = evaluateFormula(expr, player.x);
      pathPoints.push({ x: player.x, y: player.y });

      coins.forEach(coin => {
        const dist = Math.hypot(player.x - coin.x, player.y - coin.y);
        if (dist < 0.55) coin.collected = true;
      });

      if (player.x >= jumpEndX) {
        const prevY = evaluateFormula(expr, player.x - 0.07);
        vy = Math.max(-0.05, Math.min(0.12, (player.y - prevY) * 0.6));
        phase = "land";
      }
    } else if (phase === "land") {
      player.x += vx;
      player.y += vy;
      vy -= 0.008;

      if (player.y <= groundY) {
        player.y = groundY;
        isAnimating = false;
        jumpBtn.disabled = false;
        draw();
        checkWin();
        return;
      }
    }

    draw();
    requestAnimationFrame(animate);
  }
  animate();
});

function checkWin() {
  const allCollected = coins.every(c => c.collected);
  if (allCollected) {
    statusMsg.style.color = "#a6e3a1";
    if (currentLevelIndex < LEVELS.length - 1) {
      statusMsg.textContent = "Perfekt! Alle Münzen gesammelt! 🎉 (Drücke Enter)";
      nextBtn.classList.remove("hidden");
      // Nächstes Level direkt unter dem Spielernamen speichern
      localStorage.setItem(`matheJump_lvl_${currentPlayerName}`, currentLevelIndex + 1);
      savedBadge.textContent = `Gespeichert: Level ${currentLevelIndex + 2}`;
    } else {
      statusMsg.textContent = `Glückwunsch ${currentPlayerName}! Alle Level gemeistert! 🏆`;
    }
  } else {
    statusMsg.style.color = "#fab387";
    statusMsg.textContent = "Knapp daneben! Passe deine Formel an und drücke Enter.";
  }
}

nextBtn.addEventListener("click", () => {
  currentLevelIndex++;
  savePlayerProgress();
  formulaInput.value = "";
  loadLevel(currentLevelIndex);
  formulaInput.focus();
});

function drawCloud(x, y, size) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.arc(x + size * 0.8, y - size * 0.2, size * 0.8, 0, Math.PI * 2);
  ctx.arc(x + size * 1.5, y, size * 0.7, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGrad.addColorStop(0, "#56ccf2");
  skyGrad.addColorStop(1, "#bfe9ff");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCloud(90, 55, 22);
  drawCloud(320, 40, 26);
  drawCloud(500, 70, 20);

  const grassTop = toPixelY(groundY) + 14;
  ctx.fillStyle = "#7bc96f";
  ctx.beginPath();
  ctx.arc(130, grassTop + 10, 120, Math.PI, 0);
  ctx.arc(460, grassTop + 10, 150, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  for (let x = -7; x <= 7; x++) {
    for (let y = -3; y <= 5; y++) {
      ctx.beginPath();
      ctx.arc(toPixelX(x), toPixelY(y), 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "#4caf50";
  ctx.fillRect(0, grassTop, canvas.width, canvas.height - grassTop);
  ctx.fillStyle = "#388e3c";
  ctx.fillRect(0, grassTop, canvas.width, 6);

  ctx.fillStyle = "#1b4332";
  ctx.font = "bold 11px sans-serif";
  for (let x = -6; x <= 6; x += 2) {
    ctx.fillText(x, toPixelX(x) - 4, grassTop + 18);
  }
  ctx.fillStyle = "rgba(27, 67, 50, 0.75)";
  for (let y = -2; y <= 4; y += 2) {
    ctx.fillText("y=" + y, 8, toPixelY(y) + 4);
  }

  if (pathPoints.length > 1) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 4;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(toPixelX(pathPoints[0].x), toPixelY(pathPoints[0].y));
    for (let p of pathPoints) {
      ctx.lineTo(toPixelX(p.x), toPixelY(p.y));
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  coins.forEach(coin => {
    if (!coin.collected) {
      const cx = toPixelX(coin.x);
      const cy = toPixelY(coin.y);
      if (coinImg.complete && coinImg.naturalWidth > 0) {
        ctx.drawImage(coinImg, cx - 16, cy - 16, 32, 32);
      } else {
        ctx.fillStyle = "#ffd166";
        ctx.beginPath();
        ctx.arc(cx, cy, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.fillStyle = "#b45309";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText("$", cx - 4, cy + 5);
      }
    }
  });

  const px = toPixelX(player.x);
  const py = toPixelY(player.y);
  if (figureImg.complete && figureImg.naturalWidth > 0) {
    ctx.drawImage(figureImg, px - 22, py - 26, 44, 44);
  } else {
    ctx.fillStyle = "#ef476f";
    ctx.beginPath();
    ctx.arc(px, py, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }
}

// Spiel mit letztem Spielernamen starten
loadPlayerProgress(currentPlayerName);
