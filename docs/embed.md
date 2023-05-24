---
layout: docs_with_textae
title: Usage
permalink: /docs/embed/
---

# Putting TextAE in a HTML document

A TextAE instance is encapsulated in a _div_ element,
thus you can embed TextAE instances as many as you like in a HTML document.

## Step 1. Necessary setting in the _head_ section

Following is the necessary setting in the _head_ section of the HTML document in which you want to embed TextAE instances:

```HTML
<meta charset="utf-8" />
<link rel="stylesheet" href="https://textae.pubannotation.org/lib/css/textae.min.css" />
<script src="https://textae.pubannotation.org/lib/textae.min.js"></script>
```

## Step 2. Putting a TextAE instance.

Wherever in the _body_ section of the HTML document, you can put a TextAE instance in the following way:
```HTML
<div class="textae-editor"></div>
```

## Step 3. Loading text/annotation in TextAE.

There are two ways to load text/annotation in TextAE

### Step 3-1. Direct inclusion

A piece of text with or without annotation can be directly included in the _div_ element, as below:

```HTML
<div class="textae-editor">
	{
		"text":"Hello World!",
		"denotations":[
			{"span":{"begin":0,"end":5},"obj":"Greet"},
			{"span":{"begin":6,"end":11},"obj":"Object"}
		]
	}
</div>
```

Below is the resulted rendering of the above HTML code:

<div class="textae-editor" mode="view">
	{
		"text":"Hello World!",
		"denotations":[
			{"span":{"begin":0,"end":5},"obj":"Greet"},
			{"span":{"begin":6,"end":11},"obj":"Object"}
		]
	}
</div>


### Step 3-2. Getting text/annotation from a web location.

The location (URL) of a piece of text with or without annotation can be specified through the _target_ argument of the _div_ element, as below:

```HTML
<div class="textae-editor" target="https://example.org/your_annotation.json"></div>
```

Note that however you have to open the HTML document through a web server.
If you open it from you local storage, TextAE will complain about a [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) problem.

### Tip) The style of a TextAE instance can be freely customized using CSS.

<div class="textae-editor" style="color:yellow; width:400px; padding:5px; background:
radial-gradient(black 15%, transparent 16%) 0 0,
radial-gradient(black 15%, transparent 16%) 8px 8px,
radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px,
radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px;
background-color:#282828;
background-size:16px 16px;">
{
"text":"Hello World!",
"denotations":[
	{"span":{"begin":0,"end":5},"obj":"Greet"},
	{"span":{"begin":6,"end":11},"obj":"Object"}
]
}
</div>

### Tip) You can embed TextAE instances as many as you like in one HTML document, like [this page](https://www.pubannotation.org).

### Tip) By default, an instance of TextAE works as a visualizer. You can turn it into the editor mode by setting its _mode_ to be _edit_.

```HTML
<div class="textae-editor" mode="edit">
	{
		"text":"Press [h] to see 'help'",
		"denotations":[
			{"span":{"begin":6,"end":9},"obj":"Key"},
			{"span":{"begin":17,"end":23},"obj":"Page"}
		]
	}
</div>
```

<div class="textae-editor" mode="edit" style="color: #111111">
{
"text":"Press [h] to see 'help'\nIf you click this editor box, TextAE toolbar will be activated.",
"denotations":[
	{"span":{"begin":6,"end":9},"obj":"Key"},
	{"span":{"begin":17,"end":23},"obj":"Page"}
]
}
</div>
