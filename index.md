---
layout: docs_with_textae
title: Intro
---

<div class="textae-example">
  <div class="textae-editor">
    {
      "text":"Elon Musk is a member of the PayPal Mafia.",
      "denotations":[
        {"id":"T1", "span":{"begin":0,"end":9},"obj":"Person"},
        {"id":"T2", "span":{"begin":29,"end":41},"obj":"Group"}
      ],
      "relations": [
        {"pred": "member", "subj":"T1", "obj":"T2"}
      ],
      "config": {
        "entity types": [
          {
            "id": "Person",
            "color": "#8888FF"
          },
          {
            "id": "Group",
            "color": "#FF8888"
          }
        ]
      }
    }
  </div>
  <div class="caption">
    Term annotation and relation annotation
  </div>
</div>

<div class="textae-example">
  <div class="textae-editor">
    {
      "text":"Elon Musk is a member of the PayPal Mafia.",
      "denotations":[
        {"id":"T1", "span":{"begin":0,"end":9},"obj":"Person"},
        {"id":"T2", "span":{"begin":29,"end":41},"obj":"Group"}
      ],
      "attributes": [
        {"pred": "wikipage", "subj":"T1", "obj":"https://en.wikipedia.org/wiki/Elon_Musk"},
        {"pred": "wikipage", "subj":"T2", "obj":"https://en.wikipedia.org/wiki/PayPal_Mafia"}
      ],
      "config": {
        "entity types": [
          {
            "id": "Person",
            "color": "#8888FF"
          },
          {
            "id": "Group",
            "color": "#FF8888"
          }
        ]
      }
    }
  </div>
  <div class="caption">
    Attribute of annotation
  </div>
</div>

<div class="textae-example">
  <div class="textae-editor" style="line-height: 10px;">
  {
    "text":"How are you?\nI am doing well\nWhat is the mission of the company OpenAI?",
    "blocks":[
      {"id":"B2","span":{"begin":0,"end":12},"obj":"Message"},
      {"id":"B3","span":{"begin":13,"end":28},"obj":"Message"},
      {"id":"B4","span":{"begin":29,"end":71},"obj":"Message"}
    ],
    "attributes":[
      {"id":"A2","pred":"role","subj":"B2","obj":"User"},
      {"id":"A3","pred":"role","subj":"B3","obj":"Assistant"},
      {"id":"A4","pred":"role","subj":"B4","obj":"User"}
    ],
    "config": {
      "attribute types": [
        {
          "pred": "role",
          "value type": "selection",
          "values": [
            {
              "id": "Assistant",
              "color": "#FF8888"
            },
            {
              "id": "User",
              "color": "#8888FF"
            }
          ]
        }
      ]
    }
  }
  </div>
  <div class="caption">
    Block annotation
  </div>
</div>

<div class="textae-example">
  <div class="textae-editor">
    {
      "text":"今回私達は、腎不全を伴った大理石骨病の1例を経験したので報告する。",
      "denotations":[
        {"id":"T2","span":{"begin":6,"end":9},"obj":"phenotype"},
        {"id":"T1","span":{"begin":13,"end":18},"obj":"disease"}
      ],
      "attributes":[
        {"id":"A10","pred":"meaning","subj":"T1","obj":"骨の異常な増殖"},
        {"id":"A9","pred":"image","subj":"T1","obj":"https://www.igenomix.co.uk/wp-content/uploads/sites/7/2021/09/osteology-1.png"},
        {"id":"A8","pred":"meaning","subj":"T2","obj":"腎機能の低下"},
        {"id":"A7","pred":"image","subj":"T2","obj":"https://www.morishita.or.jp/renal/symptoms/img/img01.png"}
      ],
      "config": {
        "attribute types": [
          {
            "pred": "image",
            "value type": "string",
            "media height": "40px"
          }
        ]
      }
    }
  </div>
  <div class="caption">
    Multilingual support, and annotation with images
  </div>
</div>

<br/>

## <i class="fa fa-check" aria-hidden="true"></i> A fully-featured GUI editor
* You can create or edit various types of annotation.
  * term annotation, e.g., named-entities
  * block annotation, e.g., paragraphs
  * relation annotation
  * ...

## <i class="fa fa-check" aria-hidden="true"></i> works in your browser

* TextAE may take the entire working area of a browser, or
* can be embedded (as a *div* element) in an HTML document as below

```HTML
<div class="textae-editor" style="width:300px">
  {
    "text":"Hello World!",
    "denotations":[
      {"span":{"begin":0,"end":5},"obj":"Greet"},
      {"span":{"begin":6,"end":11},"obj":"Object"}
    ]
  }
</div>
```
<div class="textae-editor" style="width:300px">
{
"text":"Hello World!",
"denotations":[
  {"span":{"begin":0,"end":5},"obj":"Greet"},
  {"span":{"begin":6,"end":11},"obj":"Object"}
]
}
</div>

* See other pages with embedded TextAE instances
  * [The PubAnnotation intro page](http://www.pubannotation.org/)
  * [The result page of a search in PubAnnotation](http://pubannotation.org/projects/GlyCosmos600-GlycoEpitope/search?query=PREFIX+pubann%3A%3Chttp%3A%2F%2Fpubannotation.org%2Fontology%2F%3E%0D%0ASELECT+%3Fs1+%3Fs2%0D%0AWHERE+%7B%0D%0A++GRAPH+prj%3AGlyCosmos600-GlycoEpitope+%7B%0D%0A++++%3Fo1+tao%3Adenoted_by+%3Fs1+.%0D%0A++%7D%0D%0A%0D%0A++GRAPH+prj%3AGlyCosmos600-MAT+%7B%0D%0A++++%3Fo2+tao%3Adenoted_by+%3Fs2+.%0D%0A++%7D%0D%0A%0D%0A++%3Fo3+tao%3Adenoted_by+%3Fs3+.%0D%0A++%3Fo3+a+pubann%3ASentence+.%0D%0A++%3Fs3+tao%3Acontains+%3Fs1+.%0D%0A++%3Fs3+tao%3Acontains+%3Fs2+.%0D%0A%7D%0D%0A&template_select=18&show_mode=textae&project_name=&projects=GlyCosmos600-GlycoEpitope%2CGlyCosmos600-MAT)


## <i class="fa fa-check" aria-hidden="true"></i> Standard
* TextAE is written in standard HTML5 + CSS3
* It is tested and should work in standard web browsers, e.g., *Chrome*, *FireFox*, *Safari*, *Edge*, ... (but not in *IE*)

## <i class="fa fa-check" aria-hidden="true"></i> Unicode support
* It supports any language which is supported by *UTF8*.
<br/>(However, we could test the feature only with a limited number of languages. If you find a problem with your language, please let us know, so that we can fix it for your language.)

## <i class="fa fa-check" aria-hidden="true"></i> Open source
* TextAE is developed as an open source project.
* Released under the <a href="https://opensource.org/licenses/MIT">MIT License</a>.

## <i class="fa fa-check" aria-hidden="true"></i> Zero installation
* You can use a <a href="{{site.baseurl}}/editor.html?mode=edit">ready-for-use TextAE editor</a> immediately without any installation process.

## <i class="fa fa-check" aria-hidden="true"></i> REST client
* TextAE works as a REST client, which means
  * it can _GET_ an annotation file from a URL, and
  * it can _POST_ an annotation file to a URL.

## <i class="fa fa-check" aria-hidden="true"></i> a default viewer/editor of PubAnnotation
* TextAE is developed as a default viewer/editor of [PubAnnotation](http://pubannotation.org).
