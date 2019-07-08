export default function(pallet) {
  if (window.innerHeight - 2 <= pallet.offsetHeight) {
    const height = window.innerHeight - 2
    console.log('hi',height)
    pallet.style.height = `${height}px`
  }
}
