/**
 * sorting.js
 * Sorting algorithm visualizations with step generators for smooth animation.
 * Algorithms: Bubble, Selection, Insertion, Merge, Quick
 */

export const SORT_ALGOS = {
  bubble: { name: 'Bubble Sort', complexity: 'O(n²)' },
  selection: { name: 'Selection Sort', complexity: 'O(n²)' },
  insertion: { name: 'Insertion Sort', complexity: 'O(n²)' },
  merge: { name: 'Merge Sort', complexity: 'O(n log n)' },
  quick: { name: 'Quick Sort', complexity: 'O(n log n) avg' }
};

export function generateArray(size = 50) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
}

function* bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      yield { type: 'compare', indices: [j, j + 1] };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { type: 'swap', indices: [j, j + 1] };
      }
    }
    yield { type: 'sorted', index: a.length - i - 1 };
  }
}

function* selectionSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      yield { type: 'compare', indices: [minIdx, j] };
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { type: 'swap', indices: [i, minIdx] };
    }
    yield { type: 'sorted', index: i };
  }
  yield { type: 'sorted', index: a.length - 1 };
}

function* insertionSort(arr) {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;
    yield { type: 'compare', indices: [i, j] };
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      yield { type: 'swap', indices: [j, j + 1] };
      j--;
      if (j >= 0) yield { type: 'compare', indices: [i, j] };
    }
    a[j + 1] = key;
  }
  for (let i = 0; i < a.length; i++) yield { type: 'sorted', index: i };
}

function* mergeSort(arr, start = 0, end = arr.length - 1) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  yield* mergeSort(arr, start, mid);
  yield* mergeSort(arr, mid + 1, end);
  yield* merge(arr, start, mid, end);
}

function* merge(arr, start, mid, end) {
  const left = arr.slice(start, mid + 1);
  const right = arr.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;
  while (i < left.length && j < right.length) {
    yield { type: 'compare', indices: [start + i, mid + 1 + j] };
    if (left[i] <= right[j]) {
      arr[k] = left[i++];
    } else {
      arr[k] = right[j++];
    }
    yield { type: 'set', index: k, value: arr[k] };
    k++;
  }
  while (i < left.length) {
    arr[k] = left[i++];
    yield { type: 'set', index: k, value: arr[k] };
    k++;
  }
  while (j < right.length) {
    arr[k] = right[j++];
    yield { type: 'set', index: k, value: arr[k] };
    k++;
  }
}

function* quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = yield* partition(arr, low, high);
    yield* quickSort(arr, low, pi - 1);
    yield* quickSort(arr, pi + 1, high);
  }
}

function* partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    yield { type: 'compare', indices: [j, high] };
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield { type: 'swap', indices: [i, j] };
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  yield { type: 'swap', indices: [i + 1, high] };
  return i + 1;
}

export function getSorter(algoName) {
  switch (algoName) {
    case 'bubble': return bubbleSort;
    case 'selection': return selectionSort;
    case 'insertion': return insertionSort;
    case 'merge': return (arr) => mergeSort(arr, 0, arr.length - 1);
    case 'quick': return (arr) => quickSort(arr, 0, arr.length - 1);
    default: return bubbleSort;
  }
}
