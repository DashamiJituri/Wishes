const puzzle = document.getElementById("puzzle");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let tiles = [0,1,2,3,4,5,6,7,8];
let confettiPieces = [];

// Render puzzle
function render() {
  puzzle.innerHTML = "";
  tiles.forEach((pos, i) => {
    const tile = document.createElement("div");
    tile.className = "tile";

    if (pos !== 8) {
      const x = (pos % 3) * -100;
      const y = Math.floor(pos / 3) * -100;
      tile.style.backgroundPosition = `${x}px ${y}px`;
    } else {
      tile.style.background = "none";
    }

    tile.onclick = () => move(i);
    puzzle.appendChild(tile);
  });
}

// Move logic
function move(i) {
  const empty = tiles.indexOf(8);
  const valid = [empty - 1, empty + 1, empty - 3, empty + 3];

  if (valid.includes(i)) {
    [tiles[i], tiles[empty]] = [tiles[empty], tiles[i]];
    render();

    if (isSolved()) {
      showLove();
      startConfetti();
      createHearts();
    }
  }
}

// Easy shuffle (few moves only)
function shuffle() {
  let moves = [1, -1, 3, -3];
  let empty = 8;

  for (let i = 0; i < 15; i++) {   // 👈 INTERMEDIATE LEVEL
    let possibleMoves = moves
      .map(m => empty + m)
      .filter(t => t >= 0 && t < 9);

    let target = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    [tiles[empty], tiles[target]] = [tiles[target], tiles[empty]];
    empty = target;
  }
  render();
}


// Check solved
function isSolved() {
  return tiles.every((v, i) => v === i);
}

// Show love note
function showLove() {
  document.getElementById("envelope-container").style.display = "flex";
}

// Confetti 🎊
function startConfetti() {
  for (let i = 0; i < 150; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      c: `hsl(${Math.random() * 360}, 100%, 70%)`,
      s: Math.random() * 3 + 2
    });
  }
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.c;
    ctx.fill();
    p.y += p.s;
  });
  requestAnimationFrame(animateConfetti);
}
function openEnvelope() {
  const envelope = document.getElementById("envelope");
  envelope.classList.add("open");
  createHearts();
}

function createHearts() {
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerText = "💖";
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.bottom = "100px";
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 2000);
  }
}

function startCelebration() {
  createHearts();
  document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
}


// Start
shuffle();