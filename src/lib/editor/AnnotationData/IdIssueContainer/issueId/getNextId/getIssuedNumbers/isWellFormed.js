export default function (prefix, id) {
  // The format of id is a prefix and a number, for exapmle 'T1'.
  return new RegExp(`^${prefix}\\d+$`).test(id)
}
