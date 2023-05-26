---
layout: docs_with_textae
title: How to begin
permalink: /docs/begin/
---

# How to begin

There are two ways of using TextAE.
1. using a ready-to-use editor on the web
2. putting TextAE in a web document

## Using a ready-to-use editor on the web

The easiest way of using TextAE is to use the editor on the web, by choosing [EDITOR](http://textae.pubannotation.org/editor.html?mode=edit) from the top menu of this site.

## Putting TextAE in a HTML document

You can also insert a TextAE box, or multiple TextAE boxes, in a web page.
You can do it in the following two steps. 

### Step 1. Preparation

To insert TextAE boxes in a HTML document, first, you need to load necessary library in the document as follows:


(In the _head_ section)
```HTML
<meta charset="utf-8" />
<link rel="stylesheet" href="https://textae.pubannotation.org/lib/css/textae.min.css" />
<script src="https://textae.pubannotation.org/lib/textae.min.js"></script>
```

As an alternative way, if you want to use TextAE in an environment without internect connection, you can download the two files, *textae.min.js* and *textae.min.css*, and __load them from your local storage__ as follows:

(In the _head_ section)
```HTML
<meta charset="utf-8" />
<link rel="stylesheet" href="path_to_textae.min.css" />
<script src="path_to_textae.min.js"></script>
```


### Step 2. Putting a TextAE div element.

Wherever in the _body_ section of the HTML document, you can put a TextAE box in the following way:
```HTML
<div class="textae-editor"></div>
```
In a web browser, it will appear as below:
<div class="textae-editor"></div>
As the TextAE box is inserted without a text, it will appear with a defult text as appear above. If you press the key 'i', a dialog to import a text (with or without annotation) will appear.

By default, TextAE opens in the *View* mode in which edition of annotation is disabled.
You can insert a TextAE box to open in the *Edit* mode by specifying *mode* in the following way:

```HTML
<div class="textae-editor" mode="edit"></div>
```
It will appear as below:
<div class="textae-editor" mode="edit"></div>
<br/>

### Step 3. Loading initial text (with or without annotation) in TextAE. (optional)

You can insert a TextAE box with a initial piece of text (with or without annotation), in either of the following ways:


#### Step 3-1. Direct inclusion

A piece of text can be directly included in the _div_ element, as below:

```HTML
<div class="textae-editor">
	{
		"text":"Hello World!"
	}
</div>
```

It will appear as below:
<div class="textae-editor" mode="view">
	{
		"text":"Hello World!"
	}
</div>

A piece of text with some annotation also can be directly included in the _div_ element, as below:

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

It will appear as below:
<div class="textae-editor" mode="view">
	{
		"text":"Hello World!",
		"denotations":[
			{"span":{"begin":0,"end":5},"obj":"Greet"},
			{"span":{"begin":6,"end":11},"obj":"Object"}
		]
	}
</div>
<br/>

#### Step 3-2. Getting text (with or without annotation) from a web location.

The location (URL) of a piece of text (with or without annotation) can be specified through the _target_ or _source_ argument of the _div_ element, as below:

```HTML
<div class="textae-editor" target="https://example.org/your_annotation.json"></div>
```

Note that however that TextAE is a Javascript implementation and that accessibility to the file is subject to the [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) setting of the server which serves the file.

*Github* has a relatively inclusive CORS setting, which makes it a good storage for annotation files for TextAE. Below is an example HTML code for insering a TextAE box with annotation from Github:

```HTML
<div class="textae-editor" target="https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/demo/bionlp-st-ge/demo-annotations.json"></div>
```
<div class="textae-editor" target="https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/demo/bionlp-st-ge/demo-annotations.json"></div>


#### Tip) The style of a TextAE instance can be freely customized using CSS.

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
