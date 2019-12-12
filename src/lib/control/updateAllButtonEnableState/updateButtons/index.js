import setButtonApearanceAndEventHandler from './setButtonApearanceAndEventHandler'

// A parameter can be spesified by object like { 'buttonType1': true, 'buttonType2': false }.
export default function(el, buttonList, buttonEnables) {
  Object.keys(buttonEnables)
    .filter((buttonType) => buttonList[buttonType])
    .forEach((buttonType) =>
      setButtonApearanceAndEventHandler(
        el,
        buttonType,
        buttonEnables[buttonType]
      )
    )
}
