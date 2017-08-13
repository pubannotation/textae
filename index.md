---
layout: docs_with_textae
title: Intro
---

## <i class="fa fa-check" aria-hidden="true"></i> Javascript app for text annotation

* TextAE can be embedded in any HTML document, in any place, in any style.
* <span style="background-color:#F00; color:#FFF">Caveat</span> <span style="color:#F00; font-style:italic">TextAE may not work properly in Microsoft IE. Please use FireFox, Chrome, Safari, or Opera which better support standard HTML5 + CSS3.</span>

```HTML
<div class="textae-editor style="width:300px; background-color:lavender; position:relative; top:-70px; left:300px"">
  {
    "text":"Hello World!",
    "denotations":[
      {"span":{"begin":0,"end":5},"obj":"Greet"},
      {"span":{"begin":6,"end":11},"obj":"Object"}
    ]
  }
</div>
```

<div class="textae-editor" style="width:300px; background-color:lavender; position:relative; top:-70px; left:300px">
{
"text":"Hello World!",
"denotations":[
	{"span":{"begin":0,"end":5},"obj":"Greet"},
	{"span":{"begin":6,"end":11},"obj":"Object"}
]
}
</div>

<h2 style="margin-top:-30px"><i class="fa fa-check" aria-hidden="true"></i> Open source</h2>
* TextAE is developed as an open source project.
* Released under the <a href="https://opensource.org/licenses/MIT">MIT License</a>.

## <i class="fa fa-check" aria-hidden="true"></i> Unicode support
* It supports any language which is supported by UTF8.
<br/>(However, we could test the feature only with a limited number of languages. If you find a problem with your language, pleast let us know, so that we can fix it.)


## <i class="fa fa-check" aria-hidden="true"></i> Zero installation
* You can use a <a href="{{site.baseurl}}/editor.html?mode=edit">ready-for-use TextAE editor</a> immediately without any installation process.

## <i class="fa fa-check" aria-hidden="true"></i> Fully-featured GUI editor
* You can create or edit various types of annotation.
  * named entity annotation
  * relation annotation
  * syntactic annotations
  * ...

## <i class="fa fa-check" aria-hidden="true"></i> a default viewer/editor of PubAnnotation
* TextAE is developed as a default viewer/editor of [PubAnnotation](http://pubannotation.org).

## <i class="fa fa-check" aria-hidden="true"></i> REST client
* TextAE works as a REST client, which means
  * it can _get_ an annotation file from the net, and
  * it can _post_ an annotation file to the net.
