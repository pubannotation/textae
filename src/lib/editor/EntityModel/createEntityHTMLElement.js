import dohtml from 'dohtml'

export default function (context) {
  const { id, title, color, href, label, attributes } = context

  // A Type element has an entity_pane elment that has a label and will have entities.
  // jsPlumb requires the id of the DOM which is the endpoint for drawing relationships.
  // If the endpoint doesn't have an id, jsPlumb will set it,
  // and the id will be lost when redrawing the Entity's DOM.
  // To prevent this from happening, set the id of the endpoint DOM.
  return dohtml.create(`
  <div class="textae-editor__entity" id="${id}" title="${title}">
    <div class="textae-editor__entity__type-values" id="jsPlumb_${id}" style="background-color: ${color}">
      <div class="textae-editor__entity__type-label" tabindex="0">
        ${
          href
            ? `
        <a target="_blank"/ href="${href}">${label}</a>
        `
            : label
        }
      </div>
      ${attributes
        .map(
          ({ title, pred, obj, color, href, label }) => `
      <div class="textae-editor__entity__attribute" title="${title}" data-pred="${pred}" data-obj="${obj}" ${
            color ? ` style="background-color: ${color}"` : ''
          }>
        <span class="textae-editor__entity__attribute-label">
          ${
            href
              ? `
          <a target="_blank"/ href="${href}">${label}</a>
          `
              : label
          }
        </span>
      </div>
      `
        )
        .join('\n')}
    </div>
  </div>
  `)
}
