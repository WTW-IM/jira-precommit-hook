export function getDate() {
  return new Date().getTime();
}

export function compareDates(dateOne, dateTwo) {
  if(dateOne < dateTwo) {
    return -1;
  } else if(dateOne > dateTwo) {
    return 1;
  }
  return 0;
}
