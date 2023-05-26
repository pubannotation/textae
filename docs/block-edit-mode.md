---
layout: docs_with_textae
title: Block Edit Mode
permalink: /docs/block-edit-mode/
---

# Block Edit Mode

Below is an editable TextAE example in the *Block Edit* mode. You are recommended to use it to practice with what is described in this page.

<div class="textae-editor" mode="block-edit" style="width:550px; background-color:lightyellow">

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
			],
			"boundarydetection": false,
			"non-edge characters": [],
			"function availability": {
				"term": false,
				"relation": false,
				"simple": false,
				"replicate": false,
				"replicate-auto": false,
				"entity": false,
				"setting": false
			}
		}
	}
</div>
<br/>

When you are in another mode in TextAE, this mode can be entered by clicking the *Block Edit Mode* icon
![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_block_edit_mode_16.png)
.

This mode is similar to the Term Edit mode in the sense that in both mode you will select a span of text and assign a piece of information to it.

In this mode however you are supposed to select longer spans, or text blocks, e.g., sentences, paragraphs, etc., than terms.
As the name implies, TextAE will render blocks as separate blocks of lines breaking lines in the beinning and end of blocks when necessary, and the labels to blocks will be displayed to the right side of the blocks.

To learn about the annotation types supported by TextAE, please refer to the PubAnnotation manual:
[PubAnnotation JSON Format](https://www.pubannotation.org/docs/annotation-format/).

# Creating a block

To create a block, select a text span using the mouse drag and drop, and it will create a block annotation with the default label.

To change the label, click
the *Edit Properties* icon ![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_edit_properties_16.png),
to directly type in a label, or click
the *Block Configuration* icon ![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_pallet_16.png),
to select one from the list of predefined labels.

# Adding an attribute to a denotation

To add an attribute to a denotation,
select a denotation and click
the *Entity Configuration* icon ![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_pallet_16.png),
to open the Entity Configuration dialog,
where you can choose a predefined attribute type or define a new attribute type as you like.

Choose the attribute type and the value you want to add to the selected denotation(s).
