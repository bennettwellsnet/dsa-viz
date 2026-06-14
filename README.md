# DSA Viz

**Interactive Data Structures & Algorithms Visualizer**

A self-contained static web app for learning and experimenting with classic DSA concepts through beautiful, real-time visualizations.

Built in the same style as previous demos (spacexdemo, patio, paintcalc, doorwasm, teslastreak): pure HTML + Tailwind + modular vanilla JS, no build step, easy to publish.

## Features
- **Sorting Visualizer**: Watch Bubble, Selection, Insertion, Merge, and Quick sort in action on a live bar chart. Control speed, step through, shuffle, or use custom sizes.
- **Pathfinding Visualizer**: Draw walls on a grid and run BFS, DFS, Dijkstra, or A* to find the shortest path. Place start/end points, animate the search.
- Real-time metrics (comparisons, swaps, nodes visited, path length).
- Educational panels with time/space complexity and when to use each.
- Fully interactive controls and reset.
- Dark, modern UI consistent with other bennettwellsnet demos.

## Live Demo
- GitHub Pages: https://bennettwellsnet.github.io/dsa-viz/
- Custom domain (via dedicated Cloudflare Pages + Worker): https://bennettwells.net/dsa-viz/

## Why This Demo?
DSA is foundational for software engineering. Visualizing how algorithms actually work helps build intuition far better than reading pseudocode. This app lets you "play" with them like a productivity/learning tool.

## Tech
- 100% static (no backend, no bundler)
- Tailwind CSS via CDN
- Modular ES6 JavaScript (separate modules for sorting, pathfinding, UI, main)
- HTML5 Canvas for smooth visualizations
- Vanilla JS animations (requestAnimationFrame + step-by-step generators)

## Local Development
Just open `index.html` in a browser. No install, no server.

Edit the JS modules in `js/` for new algorithms or tweaks.

## Publishing (Dedicated Setup)
Follow the established pattern for clean isolation from the main bennettwells.net site:

1. Enable GitHub Pages on this repo (Settings > Pages > Source: main / root).
2. In Cloudflare:
   - Create a **new dedicated Pages project** connected to this GitHub repo.
     - Name: `dsa-viz`
     - Framework: None
     - Build command: (blank)
     - Output directory: `.`
   - Deploy.
3. Create a **dedicated Worker** (`dsa-viz-proxy`):
   - Use path-stripping + CSP cleaning logic (see previous demos for the exact pattern).
   - Proxy `/dsa-viz*` requests to your new `*.pages.dev` origin (strip the prefix so the Pages project sees clean paths).
4. Add the route: `bennettwells.net/dsa-viz*` → `dsa-viz-proxy` Worker.
5. Purge cache.

This gives you a completely separate Pages project + Worker, just like spacexdemo, patio, paintcalc, doorwasm, and teslastreak.

## Extending
- Add more algorithms (e.g., Heap Sort, Binary Search, Graph traversals).
- Add data structure editors (Linked List, Stack/Queue, Hash Table).
- Integrate real X data for "DSA tips from engineers" (like teslastreak).
- Export visualizations as GIFs (canvas recording).

All code is clean, commented, and ready for learning or teaching.

Built with ❤️ for practical, visual learning.
