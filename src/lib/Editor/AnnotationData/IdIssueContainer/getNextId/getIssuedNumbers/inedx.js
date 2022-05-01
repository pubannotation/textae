export default function (ids, prefix) {
  // The format of id is a prefix and a number, for exapmle 'T1'.
  return ids
    .filter((id) => new RegExp(`^${prefix}\\d+$`).test(id))
    .map((id) => id.slice(1))
}
