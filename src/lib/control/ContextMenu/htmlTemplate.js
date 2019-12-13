// Make a group of buttons that is headed by the separator.
export const htmlTemplate = `
<div class="textae-control textae-context-menu">
  <p class="textae-control__title">
    <a href="http://textae.pubannotation.org/" target="_blank">TextAE</a>
  </p>
  {{#buttonGroup}}
  <p class="textae-control__separator"></p>
    {{#list}}
  <p class="textae-control__icon textae-control__{{type}}-button" data-button-type="{{type}}">{{title}}</p>
    {{/list}}
  {{/buttonGroup}}
</div>
`
