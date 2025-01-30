export default function (overlayDropzone, zIndexOfOverlayDropzone) {
  overlayDropzone.element.classList.remove(
    'textae-editor__load-dialog__overlay-dropzone--maximized'
  )
  overlayDropzone.element.style.zIndex = zIndexOfOverlayDropzone
}
