const grid = document.querySelector("#game-grid");
const board = document.querySelector("#game-board");
const message = document.querySelector("#game-message");
const resetButton = document.querySelector("#game-reset");
const progressItems = Array.from(document.querySelectorAll(".game-progress li"));

const width = 7;
const height = 5;
const start = "0,4";
const discoveryDetails = [
  { id: "story", message: "Story & expression — writing and making with artistic people taught me to notice how people create meaning together." },
  { id: "discernment", message: "Art & discernment — music, paintings, design, and other art forms became a way of paying close attention." },
  { id: "synthesis", message: "Collaboration & scale — digital media showed me how fulfilling it is to gather skills and people into a larger project." },
  { id: "making", message: "Learning by making — game design, 3D tools, furniture, and manufacturing made unfamiliar worlds feel buildable." },
  { id: "research", message: "A new language: STEM — computer science and nanoscience gave me a foundation for questions that once felt far away." }
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

  const [firstFind, secondFind, thirdFind, fourthFind, fifthFind, newRobot] = shuffle(cells.filter((cell) => cell !== start)).slice(0, 6);
  robot = newRobot;
  discoveries = {
    [firstFind]: discoveryDetails[0],
    [secondFind]: discoveryDetails[1],
    [thirdFind]: discoveryDetails[2],
    [fourthFind]: discoveryDetails[3],
    [fifthFind]: discoveryDetails[4]
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
  message.textContent = "The first step is a question. Follow what makes you curious.";
  progressItems.forEach((item) => item.classList.remove("is-found"));
  render();
  if (shouldFocus) board.focus();
}

function discoverySprite(id) {
  const sprites = {
    story: '<span class="discovery-sprite discovery-story" aria-hidden="true"><span class="book-cover"></span><span class="book-pages book-page-left"><span class="book-lines"></span></span><span class="book-pages book-page-right"><span class="book-lines"></span></span><span class="book-spine"></span><span class="book-bookmark"></span></span>',
    discernment: '<span class="discovery-sprite discovery-discernment" aria-hidden="true"><span class="palette-shape"><span class="palette-hole"></span><span class="paint-dot paint-dot-one"></span><span class="paint-dot paint-dot-two"></span><span class="paint-dot paint-dot-three"></span></span><span class="paint-brush"><span class="brush-tip"></span></span></span>',
    synthesis: '<span class="discovery-sprite discovery-synthesis" aria-hidden="true"><span class="collaboration-link collaboration-link-one"></span><span class="collaboration-link collaboration-link-two"></span><span class="collaboration-link collaboration-link-three"></span><span class="collaboration-hub"></span><span class="collaboration-face collaboration-face-one"><span class="face-eye face-eye-left"></span><span class="face-eye face-eye-right"></span><span class="face-smile"></span></span><span class="collaboration-face collaboration-face-two"><span class="face-eye face-eye-left"></span><span class="face-eye face-eye-right"></span><span class="face-smile"></span></span><span class="collaboration-face collaboration-face-three"><span class="face-eye face-eye-left"></span><span class="face-eye face-eye-right"></span><span class="face-smile"></span></span></span>',
    making: '<span class="discovery-sprite discovery-making" aria-hidden="true"><span class="factory-building"><span class="factory-roof"></span><span class="factory-window factory-window-one"></span><span class="factory-window factory-window-two"></span><span class="factory-door"></span></span><span class="factory-chimney"></span><span class="smoke smoke-one"></span><span class="smoke smoke-two"></span></span>',
    research: '<span class="discovery-sprite discovery-research" aria-hidden="true"><span class="atom-orbit atom-orbit-one"></span><span class="atom-orbit atom-orbit-two"></span><span class="atom-orbit atom-orbit-three"></span><span class="atom-nucleus"></span><span class="atom-electron atom-electron-one"></span><span class="atom-electron atom-electron-two"></span></span>'
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
        if (discoveryDetails.indexOf(discoveries[position]) > found.size) cell.classList.add("is-locked");
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
      const discoveryIndex = discoveryDetails.indexOf(discovery);
      if (discoveryIndex === found.size) {
        found.add(discovery.id);
        document.querySelector(`[data-find="${discovery.id}"]`).classList.add("is-found");
        message.textContent = discovery.message;
      } else {
        const nextDiscovery = discoveryDetails[found.size];
        message.textContent = `This is chapter ${String(discoveryIndex + 1).padStart(2, "0")}. Find chapter ${String(found.size + 1).padStart(2, "0")} first: ${nextDiscovery.id === "story" ? "Story & expression" : nextDiscovery.id === "discernment" ? "Art & discernment" : nextDiscovery.id === "synthesis" ? "Collaboration & scale" : nextDiscovery.id === "making" ? "Learning by making" : "A new language: STEM"}.`;
      }
    }
  }
  if (nextKey === robot) {
    if (found.size === Object.keys(discoveries).length) {
      completed = true;
      message.textContent = "The robot blinks awake. It was never a sudden destination: story, attention, collaboration, making, and research all led here. There is still more to explore.";
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
