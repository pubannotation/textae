---
layout: docs_with_textae
title: Configuration
permalink: /docs/configure/
---

# Configuring TextAE

A configuration of TextAE can be written inside an annotation JSON file, or in a separate JSON file.
The latter is more convenient if you want to share a configuration across multiple annotation JSON files.

In case you have prepared a configuration in a separate JSON file,
you can put it in any location which is accessible through the net (a github repository would be a good idea, because you can manage revision history of your configuration).

An example of TextAE configuration can be found at:
http://textae.pubannotation.org/examples/config-example.json 

Then, when you open an instance of TextAE, the configuration can be specified using the parameter, _configure_, e.g.,

```
http://textae.pubannotation.org/editor.html?config=http://textae.pubannotation.org/examples/config-example.json...
```

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


