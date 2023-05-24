---
layout: docs_with_textae
title: Editing Modes
permalink: /docs/modes/
---

# Editing Modes

TextAE works in one of the four modes described below:

## View mode (![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_view_mode_16.png))
* The content (text and annotations) cannot be changed, but only viewed.
* When a label is a URL (or associated with a URL), it will become a link to the URL.
* A span of the text in TextAE can be selected for copy & paste.

## Term edit mode (![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_term_edit_mode_16.png))

* Term annotations can be created and edited.
* A term annotation involves selection of a text span (by a mouse drag-and-drop operation) and specification of the type of the term represented by the text span.
* The text span for a term annotation is relatively short, e.g., a word or a number of words.

## Block edit mode (![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_block_edit_mode_16.png))

* Block annotations can be created and edited.
* Similarly to term annotation, a block annotation involves selection of a text span (by a mouse drag-and-drop operation) and specification of the type of the block represented by selected text span.
* The text span for a block is relatively long, e.g., a sentence or a phrase.


## Relation edit mode (![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_relation_edit_mode_16.png))

* Relation annotations can be created and edited.
* The view mode will be automatically changed to the [Full View mode](/docs/views).