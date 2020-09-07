export default function(data, opt) {
  return (
    opt.dictionary.filter((entry) => entry.id === data[opt.property]).length ===
    1
  )
}
