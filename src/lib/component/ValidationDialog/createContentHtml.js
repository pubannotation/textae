import Handlebars from 'handlebars'

// See: https://stackoverflow.com/questions/24334639/handlebars-if-statement-with-index-some-value
Handlebars.registerHelper('ifSecond', function (index, options) {
  if (index == 1) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})

function template(context) {
  return context
    .map(
      (
        {
          name,
          wrongRangeDenotations,
          outOfTextDenotations,
          wrongRangeBlocks,
          outOfTextBlocks,
          duplicatedRangeBlocks,
          wrongRangeTypesettings,
          outOfTextTypesettings,
          duplicatedIDs,
          boundaryCrossingSpans,
          referencedEntitiesDoNotExist,
          duplicatedAttributes
        },
        index
      ) => {
        return `
    ${
      index === 1
        ? `
      <div class="textae-editor__valiondate-dialog__content">
        <h1>Track annatations will be merged to the root anntations.</h1>
      </div>`
        : ''
    }
    <div class="textae-editor__valiondate-dialog__content">
      <h2>${name}</h2>
  
      ${
        wrongRangeDenotations.length
          ? `
        <table>
          <caption>Wrong range denotations.</caption>
          <thead>
            <tr>
              <th class="id">id</th>
              <th class="range">begin</th>
              <th class="range">end</th>
              <th>obj</th>
            </tr>
          </thead>
          <tbody>
            ${wrongRangeDenotations
              .map(
                ({ id, span, obj }) => `
            <tr>
              <td>${id || ''}</td>
              <td class="alert">${span.begin}</td>
              <td class="alert">${span.end}</td>
              <td>${obj}</td>
            </tr>
          `
              )
              .join('\n')}
          </tbody>
        </table>`
          : ''
      }
  
      ${
        outOfTextDenotations.length
          ? `
        <table>
          <caption>Out of text denotations.</caption>
          <thead>
            <tr>
              <th class="id">id</th>
              <th class="range">begin</th>
              <th class="range">end</th>
              <th>obj</th>
            </tr>
          </thead>
          <tbody>
            ${outOfTextDenotations
              .map(
                ({ id, span, obj }) => `
            <tr>
              <td>${id || ''}</td>
              <td class="alert">${span.begin}</td>
              <td class="alert">${span.end}</td>
              <td>${obj}</td>
            </tr>
            `
              )
              .join('\n')}
          </tbody>
        </table>`
          : ''
      }
  
      ${
        wrongRangeBlocks.length
          ? `
        <table>
          <caption>Wrong range blocks.</caption>
          <thead>
            <tr>
              <th class="id">id</th>
              <th class="range">begin</th>
              <th class="range">end</th>
              <th>obj</th>
            </tr>
          </thead>
          <tbody>
            ${wrongRangeBlocks
              .map(
                ({ id, span, obj }) => `
            <tr>
              <td>${id || ''}</td>
              <td class="alert">${span.begin}</td>
              <td class="alert">${span.end}</td>
              <td>${obj}</td>
            </tr>
            `
              )
              .join('\n')}
          </tbody>
        </table>
  `
          : ''
      }
  
      ${
        outOfTextBlocks.length
          ? `
      <table>
        <caption>Out of text blokcs.</caption>
        <thead>
          <tr>
            <th class="id">id</th>
            <th class="range">begin</th>
            <th class="range">end</th>
            <th>obj</th>
          </tr>
        </thead>
        <tbody>
          ${outOfTextBlocks
            .map(
              ({ id, span, obj }) => `
          <tr>
            <td>${id || ''}</td>
            <td class="alert">${span.begin}</td>
            <td class="alert">${span.end}</td>
            <td>${obj}</td>
          </tr>
          `
            )
            .join('\n')}
        </tbody>
      </table>
      `
          : ''
      }
  
      ${
        duplicatedRangeBlocks.length
          ? `
      <table>
        <caption>Duplicated range blocks.</caption>
        <thead>
          <tr>
            <th class="id">id</th>
            <th class="range">begin</th>
            <th class="range">end</th>
            <th>obj</th>
          </tr>
        </thead>
        <tbody>
          ${duplicatedRangeBlocks
            .map(
              ({ id, span, obj }) => `
          <tr>
            <td>${id || ''}</td>
            <td class="alert">${span.begin}</td>
            <td class="alert">${span.end}</td>
            <td>${obj}</td>
          </tr>
          `
            )
            .join('\n')}
        </tbody>
      </table>
      `
          : ''
      }
  
      ${
        wrongRangeTypesettings.length
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
  
      ${
        outOfTextTypesettings.length
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
  
      ${
        duplicatedIDs.length
          ? `
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
          ${duplicatedIDs
            .map(
              ({ id, sourceProperty, span, obj }) => `
          <tr>
            <td>${id || ''}</td>
            <td>${sourceProperty}</td>
            <td class="alert">${span.begin}</td>
            <td class="alert">${span.end}</td>
            <td>${obj}</td>
          </tr>
          `
            )
            .join('\n')}
        </tbody>
      </table>
      `
          : ''
      }
  
      ${
        boundaryCrossingSpans.length
          ? `
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
          ${boundaryCrossingSpans
            .map(
              ({ id, sourceProperty, span, style, obj }) => `
          <tr>
            <td>${id || ''}</td>
            <td>${sourceProperty}</td>
            <td class="alert">${span.begin}</td>
            <td class="alert">${span.end}</td>
            <td>${style || obj}</td>
          </tr>
          `
            )
            .join('\n')}
        </tbody>
      </table>
      `
          : ''
      }
  
      ${
        referencedEntitiesDoNotExist.length
          ? `
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
          ${referencedEntitiesDoNotExist
            .map(
              ({
                id,
                sourceProperty,
                alertSubj,
                subj,
                pred,
                alertObj,
                obj
              }) => `
          <tr>
            <td>${id || ''}</td>
            <td>${sourceProperty}</td>
            <td${alertSubj ? ' class="alert"' : ''}>${subj}</td>
            <td>${pred}</td>
            <td${alertObj ? ' class="alert"' : ''}>${obj}</td>
          </tr>
          `
            )
            .join('\n')}
        </tbody>
      </table>
      `
          : ''
      }
  
      ${
        duplicatedAttributes.length
          ? `
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
          ${duplicatedAttributes
            .map(
              ({ id, subj, pred, obj }) => `
          <tr>
            <td>${id || ''}</td>
            <td class="alert">${subj}</td>
            <td>${pred}</td>
            <td class="alert">${obj}</td>
          </tr>
          `
            )
            .join('\n')}
        </tbody>
      </table>
      `
          : ''
      }
    </div>
    `
      }
    )
    .join('\n')
}

export default function (rejects) {
  return template(rejects)
}
