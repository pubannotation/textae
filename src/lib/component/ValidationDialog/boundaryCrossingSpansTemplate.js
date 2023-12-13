import anemone from '../anemone'

export default function (boundaryCrossingSpans) {
  return boundaryCrossingSpans.length
    ? anemone`
      <table>
        <caption>Denotations or Blocks or Typesettings with boundary-cross.</caption>
        <thead>
          <tr>
            <th class="id">id</th>
            <th class="sourceProperty">source property</th>
            <th class="range">begin</th>
            <th class="range">end</th>
            <th>style/obj</th>
          </tr>
        </thead>
        <tbody>
          ${() =>
            boundaryCrossingSpans.map(
              ({ id, sourceProperty, span, style, obj }) => anemone`
          <tr>
            <td>${id || ''}</td>
            <td>${sourceProperty}</td>
            <td class="alert">${span.begin}</td>
            <td class="alert">${span.end}</td>
            <td>${style || obj}</td>
          </tr>
          `
            )}
        </tbody>
      </table>
      `
    : ''
}
