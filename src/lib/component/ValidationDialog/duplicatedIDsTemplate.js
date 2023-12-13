import anemone from '../anemone'

export default function (duplicatedIDs) {
  return duplicatedIDs.length
    ? anemone`
      <table>
        <caption>Duplicated IDs in Denotations and Blocks.</caption>
        <thead>
          <tr>
            <th class="id">id</th>
            <th class="sourceProperty">source property</th>
            <th class="range">begin</th>
            <th class="range">end</th>
            <th>obj</th>
          </tr>
        </thead>
        <tbody>
          ${duplicatedIDs.map(({ id, sourceProperty, span, obj }) =>
            toBodyRow(id, sourceProperty, span, obj)
          )}
        </tbody>
      </table>
      `
    : ''
}

function toBodyRow(id, sourceProperty, span, obj) {
  return () => anemone`
    <tr>
      <td>${id || ''}</td>
      <td>${sourceProperty}</td>
      <td class="alert">${span.begin}</td>
      <td class="alert">${span.end}</td>
      <td>${obj}</td>
    </tr>
    `
}
