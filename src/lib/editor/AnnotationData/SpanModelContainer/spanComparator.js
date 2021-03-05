export default function (a, b) {
  return a.begin - b.begin || b.end - a.end
}
