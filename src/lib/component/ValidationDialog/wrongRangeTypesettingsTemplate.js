export default function (wrongRangeTypesettings) {
  return wrongRangeTypesettings.length
    ? `
      <table>
        <caption>Wrong range typesettings.</caption>
        <thead>
          <tr>
            <th class="id">id</th>
            <th class="range">begin</th>
            <th class="range">end</th>
            <th>style</th>
          </tr>
        </thead>
        <tbody>
          ${wrongRangeTypesettings
            .map(
              ({ id, span, style }) => `
          <tr>
            <td>${id || ''}</td>
            <td class="alert">${span.begin}</td>
            <td class="alert">${span.end}</td>
            <td>${style}</td>
          </tr>
          `
            )
            .join('\n')}
        </tbody>
      </table>
      `
    : ''
}
