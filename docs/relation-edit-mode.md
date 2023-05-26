---
layout: docs_with_textae
title: Relation Edit Mode
permalink: /docs/relation-edit-mode/
---

# Relation Edit Mode

Below is an editable TextAE example in the *Relation Edit* mode. You are recommended to use it to practice with what is described in this page.

<div class="textae-editor" mode="relation-edit" style="width:550px; background-color:lightyellow">
	{
		"text":"Elon Musk is a member of the PayPal Mafia.",
		"denotations":[
			{"id":"T1","span":{"begin":0,"end":9},"obj":"Person"},
			{"id":"T2","span":{"begin":29,"end":41},"obj":"Group"}
		],
		"relations":[
			{"pred":"member","subj":"T1","obj":"T2"}
		],
		"config": {
			"boundarydetection": false,
			"non-edge characters": [],
			"function availability": {
				"term": false,
				"block": false,
				"simple": false,
				"replicate": false,
				"replicate-auto": false,
				"boundary-detection": false,
				"entity": false
			}
		}
	}
</div>

When you are in another mode in TextAE, this mode can be entered by clicking the *Relation Edit Mode* icon
![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_relation_edit_mode_16.png)
.
