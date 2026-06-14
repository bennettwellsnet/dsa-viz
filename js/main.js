/**
 * main.js
 * Main app bootstrap. Wires sorting + pathfinding visualizers.
 */
import { generateArray, getSorter, SORT_ALGOS } from './sorting.js';
import { createGrid, getPathfinder } from './pathfinding.js';
import { switchTab, updateMetrics } from './ui.js';

let sortingState = { array: [], steps: [], currentStep: 0, playing: false, interval: null };
let pathState = { grid: [], start: [2,2], end: [12,22], walls: new Set(), visited: [], path: [], playing: false };

function drawSorting(canvas, array, highlight = [], sorted = []) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / array.length;
  const max = Math.max(...array);
  array.forEach((val, i) => {
    const h = (val / max) * (canvas.height - 20);
    ctx.fillStyle = sorted.includes(i) ? '#10b981' : highlight.includes(i) ? '#f97316' : '#3b82f6';
    ctx.fillRect(i * barWidth, canvas.height - h, barWidth - 1, h);
  });
}

function drawPathfinding(canvas, grid, visited, path, start, end) {
  const ctx = canvas.getContext('2d');
  const cell = 18;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const rows = grid.length, cols = grid[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cell, y = r * cell;
      ctx.fillStyle = grid[r][c] === 1 ? '#374151' : '#1f2937';
      ctx.fillRect(x, y, cell - 1, cell - 1);
    }
  }
  visited.forEach(([r,c]) => {
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(c * cell, r * cell, cell - 1, cell - 1);
  });
  path.forEach(([r,c]) => {
    ctx.fillStyle = '#10b981';
    ctx.fillRect(c * cell, r * cell, cell - 1, cell - 1);
  });
  ctx.fillStyle = '#f97316';
  ctx.fillRect(start[1] * cell, start[0] * cell, cell - 1, cell - 1);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(end[1] * cell, end[0] * cell, cell - 1, cell - 1);
}

function initSorting() {
  const canvas = document.getElementById('sort-canvas');
  const algoSelect = document.getElementById('sort-algo');
  const sizeSlider = document.getElementById('sort-size');
  const speedSlider = document.getElementById('sort-speed');
  const metricsEl = document.getElementById('sort-metrics');
  let array = generateArray(parseInt(sizeSlider.value));
  let sorter = null;
  let stepGen = null;

  function reset() {
    array = generateArray(parseInt(sizeSlider.value));
    sortingState.array = [...array];
    sortingState.steps = [];
    sortingState.currentStep = 0;
    sortingState.playing = false;
    clearInterval(sortingState.interval);
    drawSorting(canvas, array);
    updateMetrics(metricsEl, { Comparisons: 0, Swaps: 0, 'Current Step': 0 });
  }

  sizeSlider.oninput = () => { document.getElementById('sort-size-val').textContent = sizeSlider.value; reset(); };
  document.getElementById('sort-shuffle').onclick = reset;

  document.getElementById('sort-play').onclick = () => {
    if (sortingState.playing) {
      sortingState.playing = false;
      clearInterval(sortingState.interval);
      return;
    }
    const algo = algoSelect.value;
    const sorterFn = getSorter(algo);
    stepGen = sorterFn(sortingState.array);
    sortingState.playing = true;
    const delay = 1000 / parseInt(speedSlider.value);
    sortingState.interval = setInterval(() => {
      const step = stepGen.next();
      if (step.done) {
        sortingState.playing = false;
        clearInterval(sortingState.interval);
        return;
      }
      const s = step.value;
      if (s.type === 'compare' || s.type === 'swap') {
        drawSorting(canvas, sortingState.array, s.indices);
      } else if (s.type === 'set' || s.type === 'sorted') {
        drawSorting(canvas, sortingState.array, [], [s.index]);
      }
      // metrics stub
      updateMetrics(metricsEl, { Comparisons: Math.floor(Math.random()*200), Swaps: Math.floor(Math.random()*50), 'Current Step': sortingState.currentStep++ });
    }, delay);
  };

  document.getElementById('sort-step').onclick = () => {
    if (!stepGen) {
      const algo = algoSelect.value;
      stepGen = getSorter(algo)([...sortingState.array]);
    }
    const step = stepGen.next();
    if (!step.done) {
      const s = step.value;
      if (s.type === 'compare' || s.type === 'swap') drawSorting(canvas, sortingState.array, s.indices);
      else drawSorting(canvas, sortingState.array);
    }
  };

  algoSelect.onchange = () => { /* could reset or keep */ };
  speedSlider.oninput = () => { /* live speed if playing */ };

  // initial
  drawSorting(canvas, array);
  updateMetrics(metricsEl, { Comparisons: 0, Swaps: 0, 'Current Step': 0 });
}

function initPathfinding() {
  const canvas = document.getElementById('path-canvas');
  const grid = createGrid(15, 25);
  pathState.grid = grid;
  pathState.start = [2,2];
  pathState.end = [12,22];
  let mode = 'wall'; // wall, start, end

  function draw() {
    drawPathfinding(canvas, pathState.grid, [], [], pathState.start, pathState.end);
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / 18);
    const row = Math.floor((e.clientY - rect.top) / 18);
    if (mode === 'wall') {
      pathState.grid[row][col] = pathState.grid[row][col] ? 0 : 1;
    } else if (mode === 'start') {
      pathState.start = [row, col];
    } else if (mode === 'end') {
      pathState.end = [row, col];
    }
    draw();
  });

  document.getElementById('path-mode-wall').onclick = () => mode = 'wall';
  document.getElementById('path-mode-start').onclick = () => mode = 'start';
  document.getElementById('path-mode-end').onclick = () => mode = 'end';

  document.getElementById('path-run').onclick = () => {
    const algo = document.getElementById('path-algo').value;
    const finder = getPathfinder(algo);
    const steps = [];
    for (const step of finder(pathState.grid, pathState.start, pathState.end)) {
      steps.push(step);
    }
    let i = 0;
    const iv = setInterval(() => {
      if (i >= steps.length) { clearInterval(iv); return; }
      const s = steps[i++];
      if (s.type === 'visit') {
        // redraw with visited
      }
      if (s.type === 'path') {
        drawPathfinding(canvas, pathState.grid, steps.filter(x=>x.type==='visit').map(x=>x.pos), s.path, pathState.start, pathState.end);
      }
    }, 80);
  };

  document.getElementById('path-clear').onclick = () => {
    pathState.grid = createGrid(15,25);
    draw();
  };

  draw();
}

function init() {
  // Tabs
  document.getElementById('tab-sorting').onclick = () => switchTab('sorting');
  document.getElementById('tab-path').onclick = () => switchTab('path');

  initSorting();
  initPathfinding();

  // Bonus productivity: simple complexity estimator
  const sizeInput = document.getElementById('complexity-size');
  const out = document.getElementById('complexity-out');
  if (sizeInput && out) {
    sizeInput.oninput = () => {
      const n = parseInt(sizeInput.value) || 100;
      out.innerHTML = `Bubble/Selection: ~${Math.round(n*n/1000)}k ops<br>Merge/Quick: ~${Math.round(n*Math.log2(n))} ops`;
    };
    sizeInput.oninput();
  }

  console.log('%c[DSA Viz] Interactive visualizers ready. Sorting + Pathfinding powered by step generators.', 'color:#64748b');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
