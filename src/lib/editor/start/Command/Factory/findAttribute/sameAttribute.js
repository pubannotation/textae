export default function(oldPred, oldObj) {
  return (a) => a.pred === oldPred && a.obj === oldObj
}
