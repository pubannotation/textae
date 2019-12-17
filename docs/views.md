---
layout: docs_with_textae
title: View Modes
permalink: /docs/views/
---

# View Modes


TextAE shows annotations either in

1. Full View mode, or
1. Simple View mode.

The view mode can be switched by toggling the _Simple View_ button:
![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_simple_16.png)

In the Simple View mode, an instance of denotation is represented just by a label:

<img src="{{site.baseurl}}/img/simple-view-1.png" width="150px">

However, in the Full View mode, an instance of denotation is represented by a round handle which is attached to a label:

<img src="{{site.baseurl}}/img/full-view-1.png" width="150px">

Handles are used for relation annotation.

<img src="{{site.baseurl}}/img/full-view-rel.png" width="150px">

Therefore, relation annotation must be performed in the Full View mode.

Handles are also necessary to represent *multiple denotations made to the same span with the same tag*.

<img src="{{site.baseurl}}/img/full-view-2.png" width="150px">

The above example shows that the same tag _Tag1_ is annotated to the span, _sample_, twice.

Therefore, if your annotation needs to have multiple instances of identical denotation,
you have to work in the Full View mode.

However, different tags can be annotated to the same span in the Simple View mode.

<img src="{{site.baseurl}}/img/simple-view-2.png" width="150px">
