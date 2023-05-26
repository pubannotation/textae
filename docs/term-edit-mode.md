---
layout: docs_with_textae
title: Term Edit Mode
permalink: /docs/term-edit-mode/
---

# Term Edit Mode

Below is an editable TextAE example in the *Term Edit* mode. You are recommended to use it to practice with what is described in this page.

<div class="textae-editor" mode="edit" style="width:550px; background-color:lightyellow">
	{
		"text":"Elon Musk is a member of the PayPal Mafia.",
		"denotations":[
			{"span":{"begin":0,"end":9},"obj":"Person"},
			{"span":{"begin":29,"end":41},"obj":"Group"}
		],
		"config": {
			"boundarydetection": false,
			"non-edge characters": [],
			"function availability": {
				"relation": false,
				"block": false,
				"simple": false,
				"replicate": false,
				"replicate-auto": false,
				"setting": false
			}
		}
	}
</div>

When you are in another mode in TextAE, this mode can be entered by clicking the *Term Edit Mode* icon
![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_term_edit_mode_16.png)
.

In this mode, you can select a span of text, to which a piece of information can be assigned. We call this type of annotation *denotation*.

To learn about the annotation types supported by TextAE, please refer to the manual of *PubAnnotation*:
[PubAnnotation JSON Format](https://www.pubannotation.org/docs/annotation-format/).

## Creating a term annotation (denotation)

To create a term annotation, which we call *denotation*, select a text span using the mouse drag and drop, then, a term annotation will be created with a default label.


![](/img/denotation-create-wo-boundary-detection.gif){: height="60" }

When the function *Boundary Detection* is turned on, however, the boundary of the span will be automatically adjusted as below:

![](/img/denotation-create-with-boundary-detection.gif){: height="60" }

A default label is often *Something*. It can be specified by a configuration, or automatically determined to be, e.g., the most frequent one.

## Changing the span of a term annotation

Sometimes, we want to change the span of an already existing term annotation, expanding or contracting the span.

To expand the span of a term annotation, one can use a mouse drag-and-drop operatin from inside to the outside of the span, then, the span will be expanded:

![](/img/denotation-expand-right-with-boundary-detection.gif){: height="60" }


Note that for the span expand operation, the beginning position of the drag-and-drop is not important as long as it is inside the span, however the ending position decides where the span expansion stops. In the above example, the drag-and-operation ends in the middle of the word *Mafia*, and the span is expanded to the end of the word because the function *Boundary Detection* is turned on.

To expand the span to the left direction, one can also use a mouse drag-and-drop operation to the left direction as below, as below:

![](/img/denotation-expand-left-with-boundary-detection.gif){: height="60" }


To contract the span of a term annoation, one can use a mouse drag-and-drop operation from outside to inside of the span as below:

![](/img/denotation-contract-left-with-boundary-detection.gif){: height="60" }


## Chaning the lable of a term annotation

To change the label, click
the *Edit Properties* icon ![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_edit_properties_16.png),
to directly type in a label, or click
the *Entity Configuration* icon ![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_pallet_16.png),
to select one from the list of predefined labels.

## Adding an attribute to a denotation

To add an attribute to a denotation,
select a denotation and click
the *Entity Configuration* icon ![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_pallet_16.png),
to open the Entity Configuration dialog,
where you can choose a predefined attribute type or define a new attribute type as you like.

Choose the attribute type and the value you want to add to the selected denotation(s).
