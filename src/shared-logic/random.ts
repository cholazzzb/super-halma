export function getRandomArrEl<T extends unknown>(arr: Array<T>): T {
  const len = arr.length;
  const randomIdx = Math.floor(Math.random() * len);

  return arr[randomIdx];
}

export function shuffleArr<T extends unknown>(arr: Array<T>): Array<T> {
  const newArr = [...arr];

  for (
    let idx = arr.length - 1, pickEl = Math.floor(Math.random() * (idx + 1));
    idx > 0;
    idx--
  ) {
    [newArr[idx], newArr[pickEl]] = [newArr[pickEl], newArr[idx]];
  }

  return newArr;
}
