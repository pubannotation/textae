import createEditor from '../createEditor'

export default function toEditor(tool, element) {
  // Create an editor
  const editor = createEditor(element, tool)
  // Register an editor
  tool.registerEditor(element, editor)

  // Mark as initiated.
  element.dataset.textaeInitialized = true

  return editor
}
