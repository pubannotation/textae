---
layout: docs_with_textae
title: Embedding
permalink: /docs/embed/
---

# Embedding TextAE in HTML documents

You can embed TextAE in a HTML document as much as you like, in various styles you like.

Here is an example page which has multiple instances of TextAE.
<a href="http://www.pubannotation.org">this page</a>

## Step 1. To load necessary lib's and css's

In the _head_ area of a HTML document, put

```HTML
<link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/smoothness/jquery-ui.css" />
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" />
<link rel="stylesheet" href="http://textae.pubannotation.org/lib/css/textae.min.css" />
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>
<script src="http://textae.pubannotation.org/vender/jquery.jsPlumb-1.5.2-min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
<script src="https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.closest"></script>
<script src="https://cdn.jsdelivr.net/jquery.sticky-kit/1.1.2/jquery.sticky-kit.min.js"></script>
<script src="http://textae.pubannotation.org/lib/textae.min.js"></script>
```

## Step 2. To put a TextAE instance.

Wherever in the _body_ of a HTML document, put
```HTML
<div class="textae-editor"></div>
```

It will insert an empty TextAE instance in the HTML document.


## Step 3. To load annotation in TextAE.

There are three ways as described below.


### Step 3-1. To put annotation inside the TextAE instance.

```HTML
<div class="textae-editor>
	{
		"text":"Hello World!",
		"denotations":[
			{"span":{"begin":0,"end":5},"obj":"Greet"},
			{"span":{"begin":6,"end":11},"obj":"Object"}
		]
	}
</div>
```

### Step 3-2. To put annotation in a separate file, and specify the location.

```HTML
<div class="textae-editor" target="your_annotation.json"></div>
```

### Step 3-3. To get annotation from a web location.

```HTML
<div class="textae-editor" target="http://example.org/your_annotation.json"></div>
```



### Then, you will get this rendering in your browser

<div class="textae-editor">
{
"text":"Hello World!",
"denotations":[
	{"span":{"begin":0,"end":5},"obj":"Greet"},
	{"span":{"begin":6,"end":11},"obj":"Object"}
]
}
</div>


### Tip) Note that a TextAE rendering is a normal _div_ element, and you can freely style it using CSS.

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

### Tip) You can embed TextAE instances as many as you like in one HTML document, like <a href="http://www.pubannotation.org">this page

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
