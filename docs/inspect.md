---
layout: docs_with_textae
title: Inspect
permalink: /docs/inspect/
---

The annotation being edited through a TextAE instance can be inspected by specifying the _inspect_ parameter for a TextAE instance.

The example below, the _inspect_ parameter of a TextAE instance is specified,
and a div element whose id the same as the value of the _inspect_ parameter is created:

```HTML
<div class="textae-editor" mode="edit" inspect="annotation">
	{
		"text":"Hello World!",
		"denotations":[
			{"span":{"begin":0,"end":5},"obj":"Greet"},
			{"span":{"begin":6,"end":11},"obj":"Object"}
		]
	}
</div>
<div id="annotation"></div>
```

The _div_ element then contains the annotation maintained by the TextAE instance, which is updated whenever a change is made to the annotation.

The _div_ element coded above will be rendered as below:

<div class="textae-editor" mode="edit" inspect="annotation">
	{
		"text":"Hello World!",
		"denotations":[
			{"span":{"begin":0,"end":5},"obj":"Greet"},
			{"span":{"begin":6,"end":11},"obj":"Object"}
		]
	}
</div>
<div id="annotation"></div>

You are suggested to use the developer tool of you browser to inspect the _div_ element whose _id_ is _annotation_ while you are editing the annotation.