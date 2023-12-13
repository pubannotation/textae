export default function addNewAttributeTabTemplate(
  isLock,
  lastAttributeSelected,
  isEnableToAddAttribute
) {
  return () =>
    isLock
      ? ''
      : `
        ${
          lastAttributeSelected
            ? ''
            : '<span class="textae-editor__pallet__drop-target" data-index="-1"></span>'
        }
        ${
          isEnableToAddAttribute
            ? `
            <p class="textae-editor__pallet__attribute textae-editor__pallet__create-predicate">
              <span class="textae-editor__pallet__create-predicate__button" title="Add a new attribute"></span>
            </p>
            `
            : ''
        }`
}
