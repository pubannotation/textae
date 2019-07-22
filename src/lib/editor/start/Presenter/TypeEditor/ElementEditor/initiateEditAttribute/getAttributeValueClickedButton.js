export default function(e) {
  const attributeDomElemen = e.target.closest('.textae-editor__attribute')

  return {
    pred: attributeDomElemen.dataset.pred,
    obj: attributeDomElemen.dataset.obj
  }
}
