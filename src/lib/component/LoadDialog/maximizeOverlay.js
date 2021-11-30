export default function (overlayDropzone) {
  const { element } = overlayDropzone
  element.classList.add(
    'textae-editor__load-dialog__overlay-dropzone--maximized'
  )
  element.style.zIndex = parseInt(element.style.zIndex) + 1
}
