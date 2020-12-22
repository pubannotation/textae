export function outOfTextTypesettingsTemplate(outOfTextTypesettings) {
  return outOfTextTypesettings.length
    ? `
      <table>
        <caption>Out of text typesettings.</caption>
        <thead>
          <tr>
            <th class="id">id</th>
            <th class="range">begin</th>
            <th class="range">end</th>
            <th>style</th>
          </tr>
        </thead>
        <tbody>
          ${outOfTextTypesettings
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
