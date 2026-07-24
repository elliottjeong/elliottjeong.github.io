const grid = document.querySelector("#game-grid");
const board = document.querySelector("#game-board");
const message = document.querySelector("#game-message");
const resetButton = document.querySelector("#game-reset");
const progressItems = Array.from(document.querySelectorAll(".game-progress li"));

const width = 7;
const height = 5;
const start = "0,4";
const discoveryDetails = [
  { id: "feather", message: "A feather points toward a place you have not seen yet." },
  { id: "map", message: "A small map: curiosity is a way of moving forward." },
  { id: "spark", message: "A quiet spark hums with the possibility of making." }
];
let walls;
let discoveries;
let robot;
let bird;
let found;
let completed;

function keyFor(position) {
  return `${position.x},${position.y}`;
}

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function canReachEverywhere(testWalls, targets) {
  const visited = new Set([start]);
  const queue = [{ x: 0, y: 4 }];
  while (queue.length) {
    const current = queue.shift();
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => {
      const next = { x: current.x + dx, y: current.y + dy };
      const nextKey = keyFor(next);
      if (next.x >= 0 && next.x < width && next.y >= 0 && next.y < height && !testWalls.has(nextKey) && !visited.has(nextKey)) {
        visited.add(nextKey);
        queue.push(next);
      }
    });
  }
  return targets.every((target) => visited.has(target));
}

function generateMap() {
  const cells = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) cells.push(`${x},${y}`);
  }

  const [firstFind, secondFind, thirdFind, newRobot] = shuffle(cells.filter((cell) => cell !== start)).slice(0, 4);
  robot = newRobot;
  discoveries = {
    [firstFind]: discoveryDetails[0],
    [secondFind]: discoveryDetails[1],
    [thirdFind]: discoveryDetails[2]
  };

  walls = new Set();
  const protectedCells = new Set([start, robot, ...Object.keys(discoveries)]);
  const wallCount = 7 + Math.floor(Math.random() * 5);
  shuffle(cells.filter((cell) => !protectedCells.has(cell))).some((cell) => {
    if (walls.size === wallCount) return true;
    walls.add(cell);
    if (!canReachEverywhere(walls, [robot, ...Object.keys(discoveries)])) walls.delete(cell);
    return false;
  });
}

function resetGame(shouldFocus = false) {
  generateMap();
  bird = { x: 0, y: 4 };
  found = new Set();
  completed = false;
  message.textContent = "The first step is a question.";
  progressItems.forEach((item) => item.classList.remove("is-found"));
  render();
  if (shouldFocus) board.focus();
}

function discoverySprite(id) {
  const sprites = {
    feather: '<span class="discovery-sprite discovery-feather" aria-hidden="true"><span class="feather-shaft"></span><span class="feather-vane feather-vane-left"></span><span class="feather-vane feather-vane-right"></span><span class="feather-tip"></span></span>',
    map: '<span class="discovery-sprite discovery-map" aria-hidden="true"><span class="map-sheet"><span class="map-fold map-fold-one"></span><span class="map-fold map-fold-two"></span><span class="map-route"></span><span class="map-marker"></span></span></span>',
    spark: '<span class="discovery-sprite discovery-spark" aria-hidden="true"><span class="spark-core"></span><span class="spark-ray spark-ray-one"></span><span class="spark-ray spark-ray-two"></span><span class="spark-ray spark-ray-three"></span><span class="spark-ray spark-ray-four"></span></span>'
  };
  return sprites[id];
}

function render() {
  grid.innerHTML = "";
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cell = document.createElement("div");
      const position = `${x},${y}`;
      cell.className = "game-cell";
      if (walls.has(position)) cell.classList.add("is-wall");
      if (discoveries[position] && !found.has(discoveries[position].id)) {
        cell.classList.add("has-find", `find-${discoveries[position].id}`);
        cell.setAttribute("aria-hidden", "true");
        cell.insertAdjacentHTML("beforeend", discoverySprite(discoveries[position].id));
      }
      if (position === robot) {
        cell.classList.add("has-robot");
        if (!completed && found.size < Object.keys(discoveries).length) cell.classList.add("is-waiting");
        cell.insertAdjacentHTML(
          "beforeend",
          '<span class="robot-sprite" aria-hidden="true"><span class="robot-antenna"></span><span class="robot-head"><span class="robot-face"><span class="robot-eye robot-eye-left"></span><span class="robot-eye robot-eye-right"></span><span class="robot-cheek robot-cheek-left"></span><span class="robot-cheek robot-cheek-right"></span></span></span><span class="robot-arm robot-arm-left"></span><span class="robot-arm robot-arm-right"></span><span class="robot-body"><span class="robot-heart">✦</span></span><span class="robot-foot robot-foot-left"></span><span class="robot-foot robot-foot-right"></span></span>'
        );
      }
      if (position === keyFor(bird)) {
        cell.classList.add("has-bird");
        cell.insertAdjacentHTML(
          "beforeend",
          '<span class="bird-sprite" aria-hidden="true"><span class="bird-leg bird-leg-left"></span><span class="bird-leg bird-leg-right"></span><span class="bird-body"><span class="bird-wing bird-wing-left"></span><span class="bird-wing bird-wing-right"></span><span class="bird-face"><span class="bird-eye bird-eye-left"></span><span class="bird-eye bird-eye-right"></span><span class="bird-beak"></span></span></span></span>'
        );
      }
      grid.append(cell);
    }
  }
}

function move(direction) {
  if (completed) return;
  const steps = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const [dx, dy] = steps[direction];
  const next = { x: bird.x + dx, y: bird.y + dy };
  const nextKey = keyFor(next);
  if (next.x < 0 || next.x >= width || next.y < 0 || next.y >= height || walls.has(nextKey)) return;
  bird = next;
  if (discoveries[nextKey]) {
    const discovery = discoveries[nextKey];
    if (!found.has(discovery.id)) {
      found.add(discovery.id);
      document.querySelector(`[data-find="${discovery.id}"]`).classList.add("is-found");
      message.textContent = discovery.message;
    }
  }
  if (nextKey === robot) {
    if (found.size === Object.keys(discoveries).length) {
      completed = true;
      message.textContent = "The robot blinks awake. Curiosity led you here — now there is more to explore, together.";
    } else {
      message.textContent = "The robot is here, but the trail still has something to show you.";
    }
  }
  render();
}

document.addEventListener("keydown", (event) => {
  const directions = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", W: "up", s: "down", S: "down", a: "left", A: "left", d: "right", D: "right" };
  if (!directions[event.key]) return;
  event.preventDefault();
  move(directions[event.key]);
});

document.querySelectorAll("[data-move]").forEach((button) => {
  button.addEventListener("click", () => move(button.dataset.move));
});
resetButton.addEventListener("click", () => resetGame(true));
resetGame();
