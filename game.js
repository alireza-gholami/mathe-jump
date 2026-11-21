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
let previewPoints = [];
let platforms = [];

let scale = 38;
let originX = canvas.width / 2;
let originY = canvas.height - 85;
const groundY = 0;

function toPixelX(x) { return originX + x * scale; }
function toPixelY(y) { return originY - y * scale; }

function updateCameraForLevel(lvl) {
  const startX = lvl.startX !== undefined ? lvl.startX : 0;
  const allX = [0, startX, ...lvl.coins.map(c => c.x)];
  const allY = [0, ...lvl.coins.map(c => c.y)];

  const minX = Math.min(...allX) - 1.5;
  const maxX = Math.max(...allX) + 2.2;
  const maxY = Math.max(5.5, Math.max(...allY) + 1.5);

  const rangeX = maxX - minX;
  const usableHeight = canvas.height - 105;

  scale = Math.min(44, Math.max(26, Math.min((canvas.width - 50) / rangeX, usableHeight / maxY)));

  const centerX = (minX + maxX) / 2;
  originX = (canvas.width / 2) - centerX * scale;
  originY = canvas.height - 65;
}

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

  platforms = (lvl.platforms || []).map(p => ({ ...p }));

  updateCameraForLevel(lvl);
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

function updatePreview() {
  const expr = formulaInput.value.trim();
  if (!expr) {
    previewPoints = [];
    draw();
    return;
  }

  try {
    const testY = evaluateFormula(expr, 0);
    if (isNaN(testY)) {
      previewPoints = [];
      draw();
      return;
    }

    const lvl = LEVELS[currentLevelIndex];
    const startX = lvl.startX !== undefined ? lvl.startX : 0;
    const lastCoinX = coins.length > 0 ? coins[coins.length - 1].x : 0;
    const minX = Math.min(0, startX, lastCoinX) - 1;
    const maxX = Math.max(0, startX, lastCoinX) + 1;

    const points = [];
    for (let x = minX; x <= maxX; x += 0.1) {
      const y = evaluateFormula(expr, x);
      if (!isNaN(y)) {
        points.push({ x: x, y: Math.max(groundY, y) });
      }
    }
    previewPoints = points;
  } catch {
    previewPoints = [];
  }
  draw();
}

formulaInput.addEventListener("input", updatePreview);

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

  const jumpStartX = lvl.startX !== undefined ? lvl.startX : 0;
  const lastCoinX = coins[coins.length - 1].x;
  const jumpEndX = lastCoinX + 0.35;
  const entryY = Math.max(groundY, evaluateFormula(expr, jumpStartX));

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
      if (Math.abs(entryY - groundY) < 0.08) {
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
      const rawY = evaluateFormula(expr, player.x);

      player.y = Math.max(groundY, rawY);
      pathPoints.push({ x: player.x, y: player.y });

      coins.forEach(coin => {
        const dist = Math.hypot(player.x - coin.x, player.y - coin.y);
        if (dist < 0.55) coin.collected = true;
      });

      // Plattform-Landung prüfen (Figur darf auf Plattformen landen)
      const plat = platforms.find(p =>
        player.x >= p.x && player.x <= p.x + p.w &&
        player.y >= p.y - 0.15 && player.y <= p.y + 0.15
      );

      if (plat) {
        player.y = plat.y;
        vx = 0.07;
        vy = 0;
        phase = "land";
      } else if (player.x >= jumpEndX) {
        if (player.y <= groundY + 0.05) {
          player.y = groundY;
          vx = 0.07;
          vy = 0;
        } else {
          const prevY = evaluateFormula(expr, player.x - 0.07);
          vy = Math.max(-0.04, Math.min(0.1, (player.y - prevY) * 0.5));
        }
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

  const minGridX = Math.floor(-originX / scale) - 1;
  const maxGridX = Math.ceil((canvas.width - originX) / scale) + 1;
  const maxGridY = Math.ceil(originY / scale) + 1;

  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  for (let x = minGridX; x <= maxGridX; x++) {
    for (let y = 0; y <= maxGridY; y++) {
      ctx.beginPath();
      ctx.arc(toPixelX(x), toPixelY(y), 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "#4caf50";
  ctx.fillRect(0, grassTop, canvas.width, canvas.height - grassTop);
  ctx.fillStyle = "#388e3c";
  ctx.fillRect(0, grassTop, canvas.width, 6);

  // Plattformen zeichnen
  platforms.forEach(p => {
    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(toPixelX(p.x), toPixelY(p.y) - p.h * scale, p.w * scale, p.h * scale);
    ctx.strokeStyle = "#5d4037";
    ctx.lineWidth = 2;
    ctx.strokeRect(toPixelX(p.x), toPixelY(p.y) - p.h * scale, p.w * scale, p.h * scale);
    ctx.lineWidth = 1;
  });

  ctx.fillStyle = "#1b4332";
  ctx.font = "bold 11px sans-serif";
  for (let x = minGridX; x <= maxGridX; x++) {
    if (x % 2 === 0 || scale >= 36) {
      ctx.fillText(x, toPixelX(x) - 4, grassTop + 18);
    }
  }

  ctx.fillStyle = "rgba(27, 67, 50, 0.75)";
  for (let y = 1; y <= maxGridY; y += 2) {
    ctx.fillText("y=" + y, 8, toPixelY(y) + 4);
  }

  if (!isAnimating && previewPoints.length > 1) {
    ctx.strokeStyle = "rgba(160, 160, 170, 0.55)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(toPixelX(previewPoints[0].x), toPixelY(previewPoints[0].y));
    for (let p of previewPoints) {
      ctx.lineTo(toPixelX(p.x), toPixelY(p.y));
    }
    ctx.stroke();
    ctx.setLineDash([]);
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
loadPlayerProgress(currentPlayerName);