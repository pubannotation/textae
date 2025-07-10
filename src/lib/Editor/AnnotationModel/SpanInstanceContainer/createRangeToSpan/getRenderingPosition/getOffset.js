export default function getOffset(begin, end, beginOfParent) {
  return {
    start: begin - beginOfParent,
    end: end - beginOfParent
  }
}
