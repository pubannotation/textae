import anemone from '../anemone'

export default function (referencedEntitiesDoNotExist) {
  return referencedEntitiesDoNotExist.length
    ? anemone`
      <table>
        <caption>Referenced entities do not exist.</caption>
        <thead>
          <tr>
            <th class="id">id</th>
            <th class="sourceProperty">source property</th>
            <th class="referencedItem">subj</th>
            <th>pred</th>
            <th class="referencedItem">obj</th>
          </tr>
        </thead>
        <tbody>
          ${() =>
            referencedEntitiesDoNotExist.map(
              ({
                id,
                sourceProperty,
                alertSubj,
                subj,
                pred,
                alertObj,
                obj
              }) => anemone`
          <tr>
            <td>${id || ''}</td>
            <td>${sourceProperty}</td>
            <td${alertSubj ? ' class="alert"' : ''}>${subj}</td>
            <td>${pred}</td>
            <td${alertObj ? ' class="alert"' : ''}>${obj}</td>
          </tr>
          `
            )}
        </tbody>
      </table>
      `
    : ''
}
