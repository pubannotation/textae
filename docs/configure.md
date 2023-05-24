---
layout: docs_with_textae
title: Configuration
toc: true
permalink: /docs/configure/
---

{:toc}

# Configuring TextAE

A configuration of TextAE can be written inside an annotation JSON file,

```HTML
<div class="textae-editor">
  {
    "text":"Elon Musk is a member of the PayPal Mafia.",
    "denotations":[
      {"span":{"begin":0,"end":9},"obj":"Person"},
      {"span":{"begin":29,"end":41},"obj":"Group"}
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
```

<div class="textae-editor" style="width:500px; background-color:lightyellow">
  {
    "text":"Elon Musk is a member of the PayPal Mafia.",
    "denotations":[
      {"span":{"begin":0,"end":9},"obj":"Person"},
      {"span":{"begin":29,"end":41},"obj":"Group"}
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

or it can be written in a separate JSON file, then loaded through the 'config' parameter.

```HTML
<div class="textae-editor" config="URL-to-the-config-file">
  {
    "text":"Elon Musk is a member of the PayPal Mafia.",
    "denotations":[
      {"span":{"begin":0,"end":9},"obj":"Person"},
      {"span":{"begin":29,"end":41},"obj":"Group"}
    ]
  }
</div>
```

As shown in the example above, for a configuration file to be loaded by TextAE instance, it needs to be located at a place which is reachable from the net, e.g., the TextAE configuration database, or a github repository.

Maintaining a configuration in a separate file is generally a recommended way because it is easily reusable.

The elements of a TextAE configuration is described below:

## Entity types
You can predefine entity types to be assigned to spans through denotation-type of annotations.
In following example, two entity types, _Protein_ and _Regulation_, are defined with their color specification to be _#0000FF_ (blue) and _#FF0000_ (red):

```JSON
"entity types": [
  {
    "id": "Protein",
    "color": "#0000FF",
    "default": true
  },
  {
    "id": "Regulation",
    "color": "#FF0000",
  }
]
```

Optionally, you can specify a dominant type to be a default type (_Protein_ in above example).
Then, the type will be preselected when you create a denotation-type annotation.

Sometimes, you may want to assign a URI as the identifier of an entity type,
e.g. _https://en.wikipedia.org/wiki/NF-κB_ (The wikipedia page of _NF-κB_).
```JSON
"entity types": [
  {
    "id": "https://en.wikipedia.org/wiki/NF-κB",
    "color": "#0000FF",
  }
]
```
In such a case, as a URI is usually too long to be comfortably displayed,
TextAE shows only the last element of the URI, e.g., _NF-κB_, in the visualization,
rather than showing the whole long URI.

Sometimes, the last element of a URI is not very human-readable. For example,
Below is the URI of the UniProt entry for _Thy-1 membrane glycoprotein_:
_https://www.uniprot.org/uniprot/P04216_

In such a case, you can specify the label to be displayed for the entity type.
```JSON
"entity types": [
  {
    "id": "https://www.uniprot.org/uniprot/P04216",
    "color": "#FF0000",
    "label": "Thy-1"
  }
]
```
Then, TextAE will show the label in the editor screen instead of the URI.


## Relation types
You can predefine relation types to be used for relation-type of annotations.
In following example, two relation types, "themeOf" and "causeOf", are defined with their color specification to be _#0000FF_ (blue) and _#FF0000_ (red):

```JSON
"relation types": [
  {
    "id": "themeOf",
    "color": "#0000FF",
    "default": true
  },
  {
    "id": "causeOf",
    "color": "#FF0000"
  }
]
```

## Attribute types
Attribute types you want to use have to be predefined.
An Attirubute type can be defined using one of four different value types.

### "selection" value type
The example below shows the definition of an attribute to have "selection"-type values.
```JSON
{
  "pred": "classification",
  "value type": "selection",
  "values": [
    {
      "id": "http://uniprot.org/uniprot/",
      "color": "#0000FF",
      "label": "Protein",
      "default": true
    },
    {
      "id": "https://www.ncbi.nlm.nih.gov/gene/",
      "color": "#00FF00",
      "label": "Gene"
    }
  ]
}
 ```
The value of an attribute of this type can choose one of the predefined values as it s value.

### "numeric" value type
The example below shows the definition of an attribute to have "numeric"-type values.
```JSON
{
  "pred": "score",
  "value type": "numeric",
  "default": 0.8,
  "min": 0,
  "max": 1,
  "step": 0.1,
  "values": [
    {
      "range": "default",
      "color": "#00FF00",
      "label": "Fair"
    },
    {
      "range": "[0.9",
      "color": "#FF0000",
      "label": "High"
    },
    {
      "range": "0.7)",
      "color": "#0000FF",
      "label": "Low"
    }
  ]
}
```
The value of an attribute of this type can be set with a numeric value within the "min" and "max" values.
By defining ranges in the "values" array, you can define show the values to be presented using colors and labels.

### "flag" value type
The example below shows the definition of an attribute to have "flag"-type values.
```JSON
{
  "pred": "uncertain",
  "value type": "flag",
  "color": "#FF0000"
},
 ```

An attribute of this type can have either _true_ or _false_ as its value.

### "string" value type
The example below shows the definition of an attribute to have "string" type values.
```JSON
{
  "pred": "disease",
  "value type": "string",
  "default": "disease name",
  "values": [
    {
      "pattern": "default",
      "color": "#00FFFF"
    },
    {
      "pattern": "[Cc]ancer",
      "color": "#FF0000",
      "label": "Cancer"
    }
  ],
  "autocompletion_ws":"https://pubdictionaries.org/dictionaries/MONDO/prefix_completion"
}
```

An attribute of this type can have any string as its value. 
By defining patterns in the "values" array, you can define show the values to be presented using colors and labels.

Optionally, an autocompletion web service can be speficied to assisst the entry of the value.


## Delimiter characters
TextAE features the function, _Boundary Detection_ (![Boundary Detection](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_boundary_detection_16.png)). When the feature is on, word boundaries are automatically detected to help selecting spans to be annotated.

The set of _Delimiter characters_ defines the characters to be regarded as word boundaries. Following is the default set of delimiter characters:

```JSON
"delimiter characters": [
  " ", ".", "!", "?", ",", ":", ";", "-", "/", "&",
  "(", ")", "{", "}", "[", "]",
  "\\", "\"", "'", "\n", "–"
]
```
If necessary, you can re-defined it in your configuration file.

## Non-edge characters

The set of non-edge characters defines the characters which cannot appear at the edge of any span.
Following is the default set of non-edge characters: 

```JSON
"non-edge characters": [
  " ",
  "\n"
],
```

## Function availability
Individual functions of TextAE can be turned on or off.
Below is an example:
```
{
  "function availability": {
    "term": false,
    "relation": false,
    "block": false,
    "simple": false,
    "replicate": false,
    "replicate-auto": false,
    "undo": false,
    "redo": false,
    "setting": false,
    "help": false
  }
}
```
