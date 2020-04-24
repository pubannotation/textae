---
layout: docs_with_textae
title: Term Edit Mode
permalink: /docs/term-edit-mode/
---

# Term Edit Mode

You can enter the Term Edit mode by clicking the *Term Edit Mode* icon
![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_term_16.png)

In the mode, you can edit denotation- and attribute-type of annotations.

To learn about the annotation types supported by TextAE, please see this page of PubAnnotation manual:
[PubAnnotation JSON Format](http://www.pubannotation.org/docs/annotation-format/).

# Creating a denotation

To create a denotation, select a text span using the mouse drag and drop, and it will create a denotation annotation with the default label.

To change the label, click
the *Change Label* icon ![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_change_label_16.png),
to directly type in a label, or click
the *Label List Editor* icon ![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_pallet_16.png),
to select one from the list of predefined labels.

# Adding an attribute to a denotation

To add an attribute to a denotation,
select a denotation and click
the *Label List Editor* icon ![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_pallet_16.png),
to open the Label List Editor,
where you can choose a predefined attribute type or define a new attribute type as you like.

Choose the attribute type and the value you want to add to the selected denotation(s).

# Shortcut keys for attribute annotation

Note that each attribute type gets its shortcut key among 1 through 9, in the order they appear in the Label List Editor:
in the Label List Editor, the first tab is always 'Type', and following tabs correspond to attribute types.
The leftmost attribute type gets the shortcut key '1',
the next one gets the shortcut key '2', and so on.

Pressing the shortcut key of an attribute type will **create** an attribute of the type, to the selected denotation(s).
If the selected denotation(s) already has an attribute of the type, it will let you **modify** the attribute.
Pressing the shortcut key together with the *shift* key will **remove** the attribute from the selected denotation(s).
