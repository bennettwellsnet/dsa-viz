/**
 * ui.js
 * Shared UI helpers, tab switching, metrics.
 */
export function switchTab(tab) {
  document.querySelectorAll('.viz-section').forEach(s => s.classList.add('hidden'));
  document.getElementById(tab).classList.remove('hidden');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('bg-white/10', 'border-white/30'));
  document.getElementById(`tab-${tab}`).classList.add('bg-white/10', 'border-white/30');
}

export function updateMetrics(el, data) {
  if (!el) return;
  el.innerHTML = Object.entries(data).map(([k,v]) => `<div><span class="text-zinc-400">${k}:</span> <span class="font-semibold">${v}</span></div>`).join('');
}
