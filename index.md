---
layout: docs_with_textae
title: Intro
---

<span style="background-color:#F00; color:#FFF">Caveat</span> <span style="color:#F00; font-style:italic">TextAE may not work properly in Microsoft IE. Please use FireFox, Chrome, Safari, or Edge which better support standard HTML5 + CSS3.</span>


## <i class="fa fa-check" aria-hidden="true"></i> An "embeddable" editor for text annotation

* TextAE can be embedded in a HTML document.
  * See other pages with embedded TextAE boxes
    * [The PubAnnotation intro page](http://www.pubannotation.org/)
    * [The result page of a search in PubAnnotation](http://pubannotation.org/projects/GlyCosmos600-GlycoEpitope/search?query=PREFIX+pubann%3A%3Chttp%3A%2F%2Fpubannotation.org%2Fontology%2F%3E%0D%0ASELECT+%3Fs1+%3Fs2%0D%0AWHERE+%7B%0D%0A++GRAPH+prj%3AGlyCosmos600-GlycoEpitope+%7B%0D%0A++++%3Fo1+tao%3Adenoted_by+%3Fs1+.%0D%0A++%7D%0D%0A%0D%0A++GRAPH+prj%3AGlyCosmos600-MAT+%7B%0D%0A++++%3Fo2+tao%3Adenoted_by+%3Fs2+.%0D%0A++%7D%0D%0A%0D%0A++%3Fo3+tao%3Adenoted_by+%3Fs3+.%0D%0A++%3Fo3+a+pubann%3ASentence+.%0D%0A++%3Fs3+tao%3Acontains+%3Fs1+.%0D%0A++%3Fs3+tao%3Acontains+%3Fs2+.%0D%0A%7D%0D%0A&template_select=18&show_mode=textae&project_name=&projects=GlyCosmos600-GlycoEpitope%2CGlyCosmos600-MAT)

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
