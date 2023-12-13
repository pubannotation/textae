import anemone from '../anemone'

export default function (duplicatedAttributes) {
  return duplicatedAttributes.length
    ? anemone`
      <table>
        <caption>Duplicated attributes.</caption>
        <thead>
          <tr>
            <th class="id">id</th>
            <th class="referencedItem">subj</th>
            <th>pred</th>
            <th class="referencedItem">obj</th>
          </tr>
        </thead>
        <tbody>
          ${duplicatedAttributes.map(({ id, subj, pred, obj }) =>
            toBodyRow(id, subj, pred, obj)
          )}
        </tbody>
      </table>
      `
    : ''
}

function toBodyRow(id, subj, pred, obj) {
  return () => anemone`
          <tr>
            <td>${id || ''}</td>
            <td class="alert">${subj}</td>
            <td>${pred}</td>
            <td class="alert">${obj}</td>
          </tr>
          `
}
