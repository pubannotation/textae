# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [8.7.0](https://github.com/pubannotation/textae/compare/v8.6.0...v8.7.0) (2022-01-27)


### Features

* Draws the entities of the blockspan that have entered the visible range by resizing the window ([2dfa953](https://github.com/pubannotation/textae/commit/2dfa953d797f78b77d4cb0e8fe1d89ea3513fd24))
* Draws the entities of the blockspan that have entered the visible range by scrolling ([ed8d455](https://github.com/pubannotation/textae/commit/ed8d455af2bca1450fd69c6a651e88b7b1584be4))

## [8.6.0](https://github.com/pubannotation/textae/compare/v8.5.0...v8.6.0) (2022-01-20)


### Features

* Apply media height to the img element ([e0f29e4](https://github.com/pubannotation/textae/commit/e0f29e4876abfc624f461fee7873b245773f7f6c))


### Bug Fixes

* Copying the input element string while editing an entity will copy the entity ([6294505](https://github.com/pubannotation/textae/commit/629450519be390bb810f9c3ff0c9e8e29721e0de))

## [8.5.0](https://github.com/pubannotation/textae/compare/v8.4.0...v8.5.0) (2022-01-20)


### Features

* Apply media height only when the value of the string attribute is an image ([732c2ef](https://github.com/pubannotation/textae/commit/732c2ef6e1dd7b298ca81dba2aa3053e13b79128))
* Create and edit string attribute definitions with the media height property ([7f86574](https://github.com/pubannotation/textae/commit/7f865740677c7b54f421ce2777f3d6169bd7471c))
* Delete tool bar icons for copy and paste in the help dialog ([dcceeef](https://github.com/pubannotation/textae/commit/dcceeef59409a5a7b2fd8af4e533258917cf7a97))
* Detect iPad safari on iPadOS 14 or later ([a8db9b6](https://github.com/pubannotation/textae/commit/a8db9b6b4bdc996b609f41195a7e302c31d712cc))
* Display "" when there is no value set in the attribute definition ([c53c24a](https://github.com/pubannotation/textae/commit/c53c24aaa63ed7d456634bbaf34ae1f8fe04b523))
* Display meida height value of the strng attribute definition in the pallet ([32b3aac](https://github.com/pubannotation/textae/commit/32b3aacde637e8404d93efe28617eb955317c1a6))
* Renders the image if the string attribute value is a URL and the extension is an image ([c72e46e](https://github.com/pubannotation/textae/commit/c72e46e70da7323f0e70efdcce5d388bf8ee9edd))
* The height of string attributes to be rendered will reflect the media height value of the attribute definition ([45c427d](https://github.com/pubannotation/textae/commit/45c427daedab39cde5a6ec1f278d25c917033a50))
* Update the position of the grid when the media height attribute of the string attribute definition is changed ([68be99a](https://github.com/pubannotation/textae/commit/68be99aabfd5b4cc497826f75a8fe4f84f9351c4))


### Bug Fixes

* Cannot extend the block span ([1e1405b](https://github.com/pubannotation/textae/commit/1e1405be3f2645bf08218f81f5be1becd1ad58bc))
* Unable to create, extend, and reduce spans on iPad ([d551b03](https://github.com/pubannotation/textae/commit/d551b037d9413e9ff17ab3ac52268612170708e0))

## [8.4.0](https://github.com/pubannotation/textae/compare/v8.3.0...v8.4.0) (2022-01-13)


### Features

* Change the default value of the step property of the Numeric attribute to 1 ([a3e19d6](https://github.com/pubannotation/textae/commit/a3e19d62c3a1dd4eb3d982ba39e9433ce749b8b2))
* Eliminate the ability to fill in numeric attribute definitions with 0 when min and max are missing ([085a4ba](https://github.com/pubannotation/textae/commit/085a4bab0ab0b91e7cedc65daa6821f0e01110f7))
* Min and max in the Numeric attribute definition are no longer required ([4421474](https://github.com/pubannotation/textae/commit/4421474bb0309a2b98930e6c3556d840fcddfc7e))
* When min and max are not specified in the Numeric attribute definition, the min and max attributes of the input element in the Numeric attribute edit dialog are not rendered ([af839e3](https://github.com/pubannotation/textae/commit/af839e355032b6157c180cc05e21a0b6af06c313))
* You can create Numeric attribute definitions without min and max ([09847de](https://github.com/pubannotation/textae/commit/09847de8822c78662c6c5acfc34d5dcde8a40404))

## [8.3.0](https://github.com/pubannotation/textae/compare/v8.2.0...v8.3.0) (2022-01-06)


### Features

* Change the group of the delete button on the toolbar to the same group as the add entity button ([b9832bd](https://github.com/pubannotation/textae/commit/b9832bd9b5f7d381515b904c4bd2a0a6d11b8fef))
* The Copy, Cut, and Paste buttons appear only on smartphones or tablets ([0521275](https://github.com/pubannotation/textae/commit/05212757f8a1e37e51d919ace285445ce1a70611))


### Bug Fixes

* When I cut an entity in one editor, copy it in another editor, and then paste it in the first editor, the decoration of the entity being cut remains ([aa61147](https://github.com/pubannotation/textae/commit/aa61147bb2c03ceb63d299418f77804b07d4c58c))
* When the width of the browser is narrowed on a touch-enabled computer, icons for smartphones and tablets will be displayed ([e55a0ed](https://github.com/pubannotation/textae/commit/e55a0eddb087be52129d937c8c3c052fb71ce572))

## [8.2.0](https://github.com/pubannotation/textae/compare/v8.1.0...v8.2.0) (2022-01-06)


### Features

* Entities that are cut to the system clipboard in one editor can be pasted into another editor ([84c9b49](https://github.com/pubannotation/textae/commit/84c9b49b71e1031e8ac8d1dc65f704e41317da98))
* If the cut and paste editors are the same, the cut entity can be moved ([852d66d](https://github.com/pubannotation/textae/commit/852d66d0f3c9c06b9c55afc38d42f1f8aea38f58))
* If there is an attribute definition for the selection attribute to be added but the value definition is missing, add the value definition ([8140591](https://github.com/pubannotation/textae/commit/81405911c600125943afe14eeefc80389af05655))


### Bug Fixes

* An error occurs when I press the copy button on the toolbar ([8a8c589](https://github.com/pubannotation/textae/commit/8a8c58933f01442c28f63bb675e7daf50eab718c))
* An error occurs when I press the paste button on the toolbar ([8b98d26](https://github.com/pubannotation/textae/commit/8b98d26c73006fbd3161d4687d072c2afcc20a3d))

## [8.1.0](https://github.com/pubannotation/textae/compare/v8.0.0...v8.1.0) (2021-12-23)


### Features

* Copy and paste between editors via the system clipboard ([8480413](https://github.com/pubannotation/textae/commit/84804137464426cc3e9e547d6d2ef716d529d128))
* Do not add entity and attribute type definitions when the configuration is locked ([8b48e7b](https://github.com/pubannotation/textae/commit/8b48e7b473dda28a35c47c6a080d935dac03f5c2))
* If the attribute definition is missing when copied and pasted between editors, it will be generated ([c24f639](https://github.com/pubannotation/textae/commit/c24f6396c610081facf283421e6294631ebf86b7))
* If the type definition is missing when copied and pasted between editors, it will be generated ([f1c40b5](https://github.com/pubannotation/textae/commit/f1c40b5983779fe47a0112709c770abe3eb054c3))
* Write the Attribute definition to the clipboard ([92d4aab](https://github.com/pubannotation/textae/commit/92d4aab155c98b7a8e29de625a2bf46f10ae6acb))
* Write the Denotation definition to the clipboard ([4196446](https://github.com/pubannotation/textae/commit/419644661d520d8bbb9914d3ad72895dc9da1283))
* Write the serialized representation of TypeValues to the system clipboard when copying ([0406e2d](https://github.com/pubannotation/textae/commit/0406e2dbdcfb11251bcd8914b5efd29b7e8dfaab))


### Bug Fixes

* Even if you have copied an entity to the system clipboard in another editor, you cannot paste it unless you have copied the entity at least once in the editor ([2abb233](https://github.com/pubannotation/textae/commit/2abb233d9bba776d69370c503e7f406d3940cb59))
* Pressing the C key while holding down Ctrl will also display the tips dialog ([59ac0ea](https://github.com/pubannotation/textae/commit/59ac0eaf2413f2be6578c32b053098dce6938299))
* Unable to cut and paste when TypeValues are copied to the system clipboard ([f5dec2f](https://github.com/pubannotation/textae/commit/f5dec2f6a2361cd121deaf917ca554f31611ceb4))
* When copying and pasting in the same editor, a type definition is added when there is no type definition for the entity ([21d6392](https://github.com/pubannotation/textae/commit/21d6392ac0cede62890798c1961d07553c8d34f4))

## [8.0.0](https://github.com/pubannotation/textae/compare/v7.32.1...v8.0.0) (2021-12-16)


### ⚠ BREAKING CHANGES

* We will use the system clipboard to realize copy and paste between multiple editors. In order to access the system clipboard while keeping browser security in mind, we will handle copy and paste events for standard OS operations. In Chrome and Safafi, copy and paste events for elements other than EditableContent are fired for the Body element, so we use EditorContainer to handle events instead of individual editors.

### Features

* Applying Styles to the Tips Dialog ([f497dcf](https://github.com/pubannotation/textae/commit/f497dcf1ff73882da374f467160f017c9458d9a8))
* Change the keystrokes for copy and paste to match the standard OS operation ([2578d16](https://github.com/pubannotation/textae/commit/2578d164f5297b9ca04ed04329b96352745654fe))
* Changed the short key for copy and paste. When an old keystroke is performed, a dialog will be displayed to inform the user of the change ([962ebd6](https://github.com/pubannotation/textae/commit/962ebd6517e6facd43ccd6930490ad25934d9941))
* Hide the control bar by default when the view mode is specified in the startup parameter ([5a74a15](https://github.com/pubannotation/textae/commit/5a74a15953e88e366bed121e6ff3d852c23d354e))
* Update the contents of the help dialog to reflect the change in the copy and paste shortcut key ([e325e60](https://github.com/pubannotation/textae/commit/e325e60adfcfb6cdb228b667cdde7fea932281a0))


### Bug Fixes

* Pressing the H key in the Type values edit dialog opens the help dialog ([c4a94b1](https://github.com/pubannotation/textae/commit/c4a94b13457bc1a3bfbd4bcc15a6d76e4b475f52))
* Pressing the shift and numeric keys, which are shortcut keys for deleting attributes when the attribute definition does not exist, will cause an error ([53b47a1](https://github.com/pubannotation/textae/commit/53b47a1ae59f6523ed9302c7850159c456b1cd65))
* The "add to" and "remove from" buttons in the palette are not immediately toggled when attributes are added to or removed from selected entities ([695addc](https://github.com/pubannotation/textae/commit/695addc7d1a738efacfe6baba9ea39099eeb7587))

### [7.32.1](https://github.com/pubannotation/textae/compare/v7.32.0...v7.32.1) (2021-12-09)


### Bug Fixes

* PCs with touch devices such as surface will also show the confirm dialog when reloading ([44f373b](https://github.com/pubannotation/textae/commit/44f373b90a05add91773833c89f7f9ce208e4cd0))

## [7.32.0](https://github.com/pubannotation/textae/compare/v7.31.0...v7.32.0) (2021-12-02)


### Features

* Add the delete button to the Edit String Dialog ([de43aff](https://github.com/pubannotation/textae/commit/de43affb2ed5a5e1ce803abed35edb03355006a5))
* Allow deletion when the Edit Numeric Attributes dialog is opened from the palette ([87a9c84](https://github.com/pubannotation/textae/commit/87a9c847b94fd6350e61ecc8b49c8ff29d9bca79))
* Change label of the open pallet button in the Edit Numeric Attribute Dialog ([b8e9aca](https://github.com/pubannotation/textae/commit/b8e9acab9cbcc5d6bf9c60327ecf1e34cce09ef1))
* Change label of the open pallet button in the Edit String Attribute Dialog ([2b85b69](https://github.com/pubannotation/textae/commit/2b85b6981b54851c202b46c23cfae6d051b2cbea))
* Move change label button to the subject row in the Edit Numeric Attribute Dialog ([bd3260b](https://github.com/pubannotation/textae/commit/bd3260b870787c1479cc69546c4814b5690a1ebb))
* Move change label button to the subject row in the Edit String Attribute Dialog ([52939ec](https://github.com/pubannotation/textae/commit/52939ec1b211b4a46b1715643f0e31958820c441))
* Move the Delete button in the Edit Numerical Attributes dialog to the left of the OK button ([4b7f3a9](https://github.com/pubannotation/textae/commit/4b7f3a95ce2130ee52e5c808aeef8b00b00ce7bb))
* Opon the attribute tab of the pallet from Edit Numeric Attribute Dialog ([5edefa7](https://github.com/pubannotation/textae/commit/5edefa70b3eafa7ae5200fab57010d92783fa220))
* Opon the attribute tab of the pallet from Edit String Attribute Dialog ([476989f](https://github.com/pubannotation/textae/commit/476989fd876ebe933314be0b8221004bf5f1f540))
* Remove the Cancel button from the Load or Save Dialogs ([0536648](https://github.com/pubannotation/textae/commit/0536648c8bd0d152e99be0c719b52646d0b97a0b))
* Remove the OK button from the Setting Dialog ([a33774a](https://github.com/pubannotation/textae/commit/a33774a775b4619a80ef1fcf81290c3b6c782670))
* Show editing target attributes in the title bar of the Edit String Attribute Dialog ([014ae37](https://github.com/pubannotation/textae/commit/014ae3780b9a5d95bd8ddb76e097fa7f10005f53))
* Show the subject in the Edit Numeric Attribute Dialog ([5ee8ec9](https://github.com/pubannotation/textae/commit/5ee8ec98b69f19ececa77441b9b129a3721fa153))
* Show the subject in the Edit String Attribute Dialog ([9c09e5a](https://github.com/pubannotation/textae/commit/9c09e5aa13df1167e9134e801329fa508309feed))


### Bug Fixes

* HTML string in flag attribute label breaks the display of the edit dialog ([e148986](https://github.com/pubannotation/textae/commit/e14898688df07fefa2026ad39d3b9aec9395d57c))
* HTML string in flag attribute label breaks the display of the pallet ([c935524](https://github.com/pubannotation/textae/commit/c935524a651868706aec309678a50f052cd287a6))
* HTML string in string attribute default value breaks the display of the edit dialog ([22947ba](https://github.com/pubannotation/textae/commit/22947baffb09da6bf7c517691959b72ed859533b))
* HTML string in string attribute default value breaks the display of the pallet ([f6f0a59](https://github.com/pubannotation/textae/commit/f6f0a591a6737e518699e96c4e2322b51b6f8356))
* HTML string in the label of value of numeric attribute breaks the display of the pallet ([f02e0e4](https://github.com/pubannotation/textae/commit/f02e0e4f3520a3536b39be3d021e81277849bff7))
* HTML string in the label of value of selection attribute breaks the display of the pallet ([8fed62e](https://github.com/pubannotation/textae/commit/8fed62eb55fa1312a74aed7e0dc5771040d4f1e8))
* HTML string in the label of value of string attribute breaks the display of the edit dialog ([a2d5f31](https://github.com/pubannotation/textae/commit/a2d5f319316b542e2c6c74b27fd9bbd327fa4d8a))
* HTML string in the label of value of string attribute breaks the display of the pallet ([0cdf938](https://github.com/pubannotation/textae/commit/0cdf938c74dc9766a8c266fc9c0d6022c630fa1b))
* HTML string in type ID breaks the display of the edit dialog ([2dc07ae](https://github.com/pubannotation/textae/commit/2dc07aecbab9f202af2b12a5a16d386fd3896b7c))
* HTML string in type ID breaks the display of the pallet ([4793b5a](https://github.com/pubannotation/textae/commit/4793b5a17f74cc940162574f55825ab8e1969649))
* HTML string in type label breaks the display of the pallet ([b96723a](https://github.com/pubannotation/textae/commit/b96723a9d14670fa82592cf0c794b55916d0312a))
* Overlays do not disappear when dragging and dropping a configuration file in Firefox ([8c65ae0](https://github.com/pubannotation/textae/commit/8c65ae0f38cef968f59d2506399c3d7422ef38ed))
* Single quotes in type ID breaks the display of the edit dialog ([6664a9f](https://github.com/pubannotation/textae/commit/6664a9f9ee4ac96fc9d6357a61028aa264f4df7d))
* Single quotes in type ID breaks the display of the pallet ([d30bf13](https://github.com/pubannotation/textae/commit/d30bf13f1b92498dd0beb75ec7f8ece1de6482a1))
* When an input validation error occurs in the Edit Attribute Value dialog, the OK button cannot be pressed, but the appearance remains the same ([ae631b2](https://github.com/pubannotation/textae/commit/ae631b26e3b976ac9cc046981634e36c27cfe815))

## [7.31.0](https://github.com/pubannotation/textae/compare/v7.30.0...v7.31.0) (2021-11-25)


### Features

* Change the default value of TypeGap to 1 ([ef02256](https://github.com/pubannotation/textae/commit/ef02256f9f65ade631e8794351819936cb9f350f))
* Preserve the order of type definitions ([3f188dd](https://github.com/pubannotation/textae/commit/3f188ddc723ac3b089c1d37ea0be7c0248596233))
* Set the initial color randomly when adding values to attribute definitions ([de95be1](https://github.com/pubannotation/textae/commit/de95be1a5596048dd7249ae12794ad228be055f7))
* Set the initial color to random when adding a new flag attribute definition ([4d494f3](https://github.com/pubannotation/textae/commit/4d494f320b4015b3ddc98f2d18e3b09b9a13091f))
* When switching from the relation mode to the next with the shortcut key, if there is no relation, the transition will be to simple view mode ([09c106c](https://github.com/pubannotation/textae/commit/09c106ce27a58ed735418bfde865e2d72ec75755))
* When the view button on the control bar is pressed, it transitions to simple view mode when there is no relation ([15c0935](https://github.com/pubannotation/textae/commit/15c093533d7e448102320b97917083f9a0b164a4))


### Bug Fixes

* When I cut and paste an entity, the save icon in the control bar does not show a star ([2202fa9](https://github.com/pubannotation/textae/commit/2202fa979577cd16ee1ae679cd7655c73aea699f))

## [7.30.0](https://github.com/pubannotation/textae/compare/v7.29.0...v7.30.0) (2021-11-18)


### Features

* Show a star on the palette icon in the control bar when there is a change in the configuration ([23aa94d](https://github.com/pubannotation/textae/commit/23aa94d624c8d0233533e347aa1fcbf89671f5a0))
* Stop judging the mark to save annotations based on the existence of operation history, and instead judge whether there are differences in annotations ([4c87cdb](https://github.com/pubannotation/textae/commit/4c87cdb646946a10871f06a7f083b15254e369a7))
* Stop judging the showing alert to leave page based on the existence of operation history, and instead judge whether there are differences in annotations ([60f2a6d](https://github.com/pubannotation/textae/commit/60f2a6df5be8383d1a5e04e91f6a66bea288fbf5))
* Stop judging the showing alert to load annotations based on the existence of operation history, and instead judge whether there are differences in annotations ([eeaa1e0](https://github.com/pubannotation/textae/commit/eeaa1e027eceb65fcca02a2aa13aba56a8bee4e6))


### Bug Fixes

* An error occurs when loading a configuration with no attribute definition when attributes are opened in the palette ([52bdb2e](https://github.com/pubannotation/textae/commit/52bdb2eb468d99c0c19552b82e1744b8fbf8bf74))
* No alerts are displayed when loading the configuration ([5d66f32](https://github.com/pubannotation/textae/commit/5d66f3201ccdb8547f00c659c47483620cf0738f))
* Palette does not update when entity default type is changed ([052b048](https://github.com/pubannotation/textae/commit/052b048cdcd35839ec1f097c1d85974e9546315e))

## [7.29.0](https://github.com/pubannotation/textae/compare/v7.28.0...v7.29.0) (2021-11-11)


### Features

* Don't scroll out the span when you create a new span and recalculate the line height ([b50e8b7](https://github.com/pubannotation/textae/commit/b50e8b725c086f6e7d8c230108b77a6657471fb2))
* Don't scroll out the span when you delete a new span and recalculate the line height ([395d2da](https://github.com/pubannotation/textae/commit/395d2da62db9bc3656e36123750c571bce96e6d4))
* Show shortcut key number of attributes in the edit type values dialog ([4088efc](https://github.com/pubannotation/textae/commit/4088efc4777ef315c19ec203f2cd55f36cbe6a3a))


### Bug Fixes

* Palette does not update when redoing entity and relationship definition additions that include default type changes ([49bd056](https://github.com/pubannotation/textae/commit/49bd0561f3473494692daa2233a1e0fd1fc5e6bb))
* Palette does not update when undoing add entity and relationship definitions that contain default type changes ([830e94a](https://github.com/pubannotation/textae/commit/830e94a3fa1f0005113c3b83974a5b13cc86fb52))
* Palette does not update when undoing or redoing default type changes for entity and relationship definitions ([5fcd51d](https://github.com/pubannotation/textae/commit/5fcd51d3a3ee89b613c56ab71978a5d28e714e5b))
* Palette is not updated when redoing add entity and relation definition ([859795e](https://github.com/pubannotation/textae/commit/859795e24a05598f0c60eb7ac97e63ba728bb4dc))
* Palette is not updated when undoing add entity definition ([69eb40f](https://github.com/pubannotation/textae/commit/69eb40fee723e8e52cd093ddc5c8b8091bbb4d47))
* Palette is not updated when undoing add relation definition ([3f96fa1](https://github.com/pubannotation/textae/commit/3f96fa1262b77197336ea15df082613ac5e204e0))
* Save button does not show a star when loading an annotation file with errors ([4afbc15](https://github.com/pubannotation/textae/commit/4afbc15acb4250a0aaf2ec1bf9614dbf48e7b35a))

## [7.28.0](https://github.com/pubannotation/textae/compare/v7.27.0...v7.28.0) (2021-11-05)


### Features

* In view mode, make relation labels translucent to make overlapping text easier to read ([a9e2209](https://github.com/pubannotation/textae/commit/a9e2209e1997d53a154afde240e8302053a4f8c0))
* Reduce the height of the relation by about half ([4cc016b](https://github.com/pubannotation/textae/commit/4cc016bca98b22f1b6dd85c67b78060dc06b29e0))


### Bug Fixes

* When there is no type definition, but there are instances, the default is to automatically calculate from the most instances. In this case, if you define a default type and UNDO, the default type will be set even though there is no type definition. ([79a13c4](https://github.com/pubannotation/textae/commit/79a13c44e8ffe81151ff19a9bc81bc7139cced54))

## [7.27.0](https://github.com/pubannotation/textae/compare/v7.26.3...v7.27.0) (2021-11-04)


### Features

* In view mode, the labels of the relations are displayed behind the text ([68deb13](https://github.com/pubannotation/textae/commit/68deb132e5ede57c176beb745e9c3df7d1265088))
* Show left and right borders in view mode to make it easier to distinguish labels of adjacent entities ([704e03e](https://github.com/pubannotation/textae/commit/704e03e086898e5528af77265abbacb1d05fa924))
* To avoid hiding the relationship of neighboring entities with the entity's label, show the entity's label behind the relationship ([8ae78c5](https://github.com/pubannotation/textae/commit/8ae78c5a12b1955d54fa47254e4fd44e49cb4dbf))


### Bug Fixes

* Extra borders are displayed in the context menu ([e156fa9](https://github.com/pubannotation/textae/commit/e156fa9166afd3e54965e099a797bff00e0d2fb1))
* The title of the palette button in the context menu is broken ([d2ce32f](https://github.com/pubannotation/textae/commit/d2ce32f43d5af190cf0222f2de5805d34563c164))

### [7.26.3](https://github.com/pubannotation/textae/compare/v7.26.2...v7.26.3) (2021-10-29)


### Bug Fixes

* Validation error when IDs are duplicated in different tracks ([6cc68b6](https://github.com/pubannotation/textae/commit/6cc68b6126f67a0e9f5829122c85e49d01d75f07))

### [7.26.2](https://github.com/pubannotation/textae/compare/v7.26.1...v7.26.2) (2021-09-30)


### Bug Fixes

* More event handlers to bind each time the selection attribute palette is opened ([1b8ce70](https://github.com/pubannotation/textae/commit/1b8ce7026e628854d03272441675eb5737a09e29))

### [7.26.1](https://github.com/pubannotation/textae/compare/v7.26.0...v7.26.1) (2021-09-30)


### Bug Fixes

* Display an attribute type in the tool tip of the add attribute button in the edit type values dialog when it is disabled ([82d3e61](https://github.com/pubannotation/textae/commit/82d3e6147ccec2ab0b44e8cd32a87fee18f7e1f6))

## [7.26.0](https://github.com/pubannotation/textae/compare/v7.25.0...v7.26.0) (2021-09-30)


### Features

* Added a tooltip to the Add Attribute button in the Edit TypeValue dialog ([6253e64](https://github.com/pubannotation/textae/commit/6253e64140a260d1a43e7768088324ebfcea1cd0))
* Added tooltips to the palette icons in the TypeValue Edit dialog ([419ba18](https://github.com/pubannotation/textae/commit/419ba18bed51bd4cba5e2adbd457a043e30961fc))
* Automatically set the required parameters for numeric attribute definitions ([66e70c3](https://github.com/pubannotation/textae/commit/66e70c3675c849180ea460128971cbca50fdc5b5))
* Automatically set the required parameters for string attribute definitions ([41c662e](https://github.com/pubannotation/textae/commit/41c662ef2e285099a6c2aa8235e3ec66be2e6026))
* Change the tooltip of the palette button on the control bar to match the editing mode ([4dbe515](https://github.com/pubannotation/textae/commit/4dbe5152b62e7a3a6d357acfd331f68ffc845530))
* Compare the anchor of the upper entity with the center of the lower entity to decide which of the left and right anchors of the lower entity to use ([4d3eb66](https://github.com/pubannotation/textae/commit/4d3eb66987e23cbfbc269e80a6a44f74ce8cf2a8))
* Decide whether to bend to the left or right depending on the anchor position of the entity above when making large bends in the relation ([6810456](https://github.com/pubannotation/textae/commit/68104563ff0d283fc2f46c7ba5a187fbcb5bb572))
* Fixed wording in tooltips when attributes cannot be added from the Edit TypeValue dialog ([a449ae3](https://github.com/pubannotation/textae/commit/a449ae3170dd868eb9fdd39238bb39eeee8bb9e7))


### Bug Fixes

* Can't drag and drop tabs in the palette to be the first and second attributes ([365047f](https://github.com/pubannotation/textae/commit/365047f22f73b31327309c38a02f0174a4488d51))
* If you try to create a child span that shares an end with an existing span on a touch device, the existing span will be deleted ([451966c](https://github.com/pubannotation/textae/commit/451966c18e606ddaf549efc8a260bcc888bfff6c))
* On touch devices, the Create Span button is now enabled when selecting text in a block span in block mode ([43a417e](https://github.com/pubannotation/textae/commit/43a417eae740763117ccf9da44a90d39427dd4ae))
* Paste button is not disabled when cut and paste is completed ([a5af44f](https://github.com/pubannotation/textae/commit/a5af44f03669427a1c228a7ddac0a97cd75ed68f))
* When switching to view mode, there is no applyTextSelection method and an error occurs ([2b8cc51](https://github.com/pubannotation/textae/commit/2b8cc5184d434ed15e8a493c09ad232db5d64e19))
* When you create a relation, it is automatically selected, but the edit and delete buttons are not enabled ([247e81d](https://github.com/pubannotation/textae/commit/247e81d8a87fb9e972c535995593db7486ea2dcf))

## [7.25.0](https://github.com/pubannotation/textae/compare/v7.24.0...v7.25.0) (2021-09-22)


### Features

* Change the order of the arrows in the relations going in and out of the entity to up, down, down, up ([d2bc7fe](https://github.com/pubannotation/textae/commit/d2bc7fea4e78c0b69e9ded11dd29350d6ae80f5c))
* Enable/disable status of context menu buttons depending on the selected text ([1372a05](https://github.com/pubannotation/textae/commit/1372a05127d1f731a5a3da23bcea5dd85ecf3dd3))
* For touch devices, show disabled button in context menu ([c6a2a8f](https://github.com/pubannotation/textae/commit/c6a2a8fc4e9f37b5ece1fa0391de898798e0bd24))
* In relation mode, span operation buttons in context menu are always disabled ([fe0aafa](https://github.com/pubannotation/textae/commit/fe0aafaec9d267e470178e68a0d46dc80c2538ab))
* Make an error when there is no span to delete ([c992583](https://github.com/pubannotation/textae/commit/c992583a289d3515a39607f0a98fb9a8d290539a))
* Make the disabled button in the context menu stop working when it is pressed ([07fab7f](https://github.com/pubannotation/textae/commit/07fab7fd1094af990a9e6e8da40abfb751461101))
* On mobile devices, do not shrink the block span when the selected text fits into one block span ([f1025d4](https://github.com/pubannotation/textae/commit/f1025d4c0e0b861f783aade300f7c477553fe4e6))
* On mobile devices, do not shrink the denotation span when the selected text fits into one denotation span ([341bf47](https://github.com/pubannotation/textae/commit/341bf470e489edd59f49356b74ae80ab11519a51))
* Stop showing icons for mobile devices on PCs with touch devices such as Surface ([c09f358](https://github.com/pubannotation/textae/commit/c09f3586c97094d7f3c791d911f764775ed62c9f))


### Bug Fixes

* Changing the value of an attribute definition will cause an error ([ff71559](https://github.com/pubannotation/textae/commit/ff71559d1d485bff0adfdac961d8b056ae14ff32))
* Checking whether the block span after shrinking becomes a child span includes itself before shrinking. The block span cannot be shrunk. ([784b5e5](https://github.com/pubannotation/textae/commit/784b5e59a21bb54ec4dad63432bc3b020c909935))
* Max assets size ([31b5f19](https://github.com/pubannotation/textae/commit/31b5f196b72bbf734a2e8cbd9d6fb8f851435a0f))
* On a mobile device, when there is a style span on top of a denotation span, the extension operation selects the style span as the operation target ([3468552](https://github.com/pubannotation/textae/commit/3468552fa4cc1ed740800aedd58401e136430a8f))
* When there is a style span on top of the denotation span, the style span is mistakenly targeted when shrinking the denotation span on mobile devices ([d80aeae](https://github.com/pubannotation/textae/commit/d80aeaee65b3559e65e76b9954ba752282f4ddea))
* When you select an entity, the relation is highlighted. However, when the window is resized, the relationship highlighting disappears even though the entity selection has not changed ([10ffba9](https://github.com/pubannotation/textae/commit/10ffba9a7cd3da90ac619d178c18514365ac3d1b))

## [7.24.0](https://github.com/pubannotation/textae/compare/v7.23.0...v7.24.0) (2021-09-08)


### Features

* Dynamically switch the buttons displayed in the context menu ([fba40d9](https://github.com/pubannotation/textae/commit/fba40d95f8b4ae44b981b72b6336b36340141a53))
* Make sure the range is in the text box ([cf0fae8](https://github.com/pubannotation/textae/commit/cf0fae8a0015c7a52281b668840328e007fcf36a))
* Show enable buttons only in the context menu ([67aac0d](https://github.com/pubannotation/textae/commit/67aac0da193d791284c26dee82ef9e2a9e797e6f))
* Show transit status in context menu ([3b72245](https://github.com/pubannotation/textae/commit/3b72245af250a9c7ef3ce4a7ab88904172ef5706))


### Bug Fixes

* Context menu button presses and enable/disable statuses are not reflected in the appearance ([b4cfd80](https://github.com/pubannotation/textae/commit/b4cfd8060a39838933ef6f98d53d350004c00aa7))
* Context menu buttons do not work ([d1a3cc6](https://github.com/pubannotation/textae/commit/d1a3cc64f36eaf355e236b427f7eabd6712e0c3f))
* Deselected relations are not thinned ([c7092df](https://github.com/pubannotation/textae/commit/c7092df8c49cbf493fb308a24cb93e5ddec26629))
* Give classes that are not needed ([759f78d](https://github.com/pubannotation/textae/commit/759f78dbc94166e19121b902e41776aef13abfda))

## [7.23.0](https://github.com/pubannotation/textae/compare/v7.22.0...v7.23.0) (2021-09-01)


### Features

* Clarify label of entities in the View Mode ([bbb0f1d](https://github.com/pubannotation/textae/commit/bbb0f1d93d7f4ff370f0982d429259db2e6af477))
* Open the pallet from the EditTypeValues dialog ([4d2b41c](https://github.com/pubannotation/textae/commit/4d2b41cd0856214a468ea447024b56fafd38236f))
* Reloading when trying to scroll further when you are at the top on an Android device. Show a confirmation dialog to prevent this. ([e5edc6f](https://github.com/pubannotation/textae/commit/e5edc6f9414ee125560f385407e0b101969fcc25))
* Show tooltip on the attribute type icons in the EditTypeValues dialog ([87a00cb](https://github.com/pubannotation/textae/commit/87a00cb874d70a3e67d1a6cc6b658cede46cb686))
* Stop making disable buttons trasparent ([e81489d](https://github.com/pubannotation/textae/commit/e81489d1c5228bfe14b44206469217d1d8638e4a))


### Bug Fixes

* An error occurs when reading annotations with spans that cross the boundary across tracks ([fff84ec](https://github.com/pubannotation/textae/commit/fff84ecc8206a488914f32eaad2980d76cf37d39))
* Width of highlighted relation ([d4eb941](https://github.com/pubannotation/textae/commit/d4eb941df15b5ca30e4fdc6eea38c95751b14e35))

## [7.22.0](https://github.com/pubannotation/textae/compare/v7.21.0...v7.22.0) (2021-08-25)


### Features

* Deselect a relation by holding down the control key and clicking on the relation ([33ac537](https://github.com/pubannotation/textae/commit/33ac537a9fbdf4b08981fe630625c10e98f57773))
* Highlight the relations of the selected Entity ([71c40a6](https://github.com/pubannotation/textae/commit/71c40a6a2624f09048b70a023196f31a3cb9955d))
* Set the transparency of the label's background color to 0 when the Entity's label is hovered ([a9ce228](https://github.com/pubannotation/textae/commit/a9ce2289e717d3cef9c1376841557d0f71839307))


### Bug Fixes

* Changing Relation labels is not reflected in the appearance ([7645101](https://github.com/pubannotation/textae/commit/76451016fafac31dad163dfdf1a2ee959db4b9fd))
* Labels do not update their appearance when the relationship selection changes ([9ce9f76](https://github.com/pubannotation/textae/commit/9ce9f7683d92526a40a5e7747ff06fcec01041ff))
* Lines and labels are misaligned when hovering over a relation ([867fe2c](https://github.com/pubannotation/textae/commit/867fe2c9789b54a588bb23ef28caacf352e6fb83))
* Relation labels do not revert to their original positions when Entity mouse-leaves ([61cc19e](https://github.com/pubannotation/textae/commit/61cc19e3300dbbf1b340f79f2c7010506ad9ad0f))
* Relation remains highlighted when moving the mouse from below to outside of the relation label ([2195264](https://github.com/pubannotation/textae/commit/21952644013e4415dfba6c96156085c0f80eac45))
* The triangle of Relation intersects with the vertical line of Entity ([26cbd45](https://github.com/pubannotation/textae/commit/26cbd4568a6efb1990fda54332fee8a18ca7aaa1))

## [7.21.0](https://github.com/pubannotation/textae/compare/v7.20.0...v7.21.0) (2021-08-18)


### Features

* Deselects the currently selected text when a BlockSpan cannot be created ([71ba99b](https://github.com/pubannotation/textae/commit/71ba99b3c399562ae0fb52602706a448b72ec4c6))
* Don't reset the row height when changing modes ([f30876b](https://github.com/pubannotation/textae/commit/f30876b33cc53c6b9b899fa8100cbe4d4344b172))
* Expand Block spans ([fcb7be2](https://github.com/pubannotation/textae/commit/fcb7be2ca1c9e59571037482e8228e1470cec240))
* Prohibit expanding DenotationSpan to make it a parent of BlockSpan ([e789849](https://github.com/pubannotation/textae/commit/e7898491e92718ab383a899efd9ae08289671e92))
* Show alert message when creating a boundary crossing span is failed ([e024d7e](https://github.com/pubannotation/textae/commit/e024d7ef5fb6eb4341e3b3edfa59d4c3b64fc949))
* Show alert message when creating a boundary crossing span is failed ([31cad86](https://github.com/pubannotation/textae/commit/31cad867b535f36a3133ab25a803b203fbedec36))
* Show message by alertify instead of the window.alert ([47bdac2](https://github.com/pubannotation/textae/commit/47bdac29e97a72d3871aff4416beb72cc66f8aa0))
* Show message by alertify instead of the window.alert ([cb5bddb](https://github.com/pubannotation/textae/commit/cb5bddbe7223b02a63ad596f51ddaf36dcd828a7))
* Shrink Block spans ([4233959](https://github.com/pubannotation/textae/commit/4233959326bab4f417953a615f5119cc95016d07))


### Bug Fixes

* BlockSpan's parent BlockSpan can be created ([28df43f](https://github.com/pubannotation/textae/commit/28df43f5dc327d0f9ea249a748e5f1710c371c0b))
* Button style in the Edit Type Values dialog ([7fd551e](https://github.com/pubannotation/textae/commit/7fd551e251c6d50906d5c98a4535b5d8af4f0384))
* Changing the Type Gap causes an error ([046a543](https://github.com/pubannotation/textae/commit/046a5434472313ea44e6dc4189a5cc1e8297308c))
* Error occurs when replicating Span with attributes ([7100c8f](https://github.com/pubannotation/textae/commit/7100c8fe89da6819b9e4c4be59f9920ddcc2cc14))
* Layout of the object input in the Edit Numeric Attribute dialog ([582a26e](https://github.com/pubannotation/textae/commit/582a26e6bc17d19acedf5ca13162d4867e91ab2f))
* The Reset Hidden Message Boxes is not used already ([1a1e04b](https://github.com/pubannotation/textae/commit/1a1e04b57359871d2134c379cf4c0ad206cb8eca))
* When each of them share an end, a BlockSpan can be created for the children of the DenotationSpan ([61163bf](https://github.com/pubannotation/textae/commit/61163bff902db87830dc068c33a2cb2e9eae108b))
* When you mouse-leave from a label in a relation, that label will be displayed in the forefront ([550d9ca](https://github.com/pubannotation/textae/commit/550d9ca1c0846e9b32c0a800c6c294850ce9ed68))

## [7.20.0](https://github.com/pubannotation/textae/compare/v7.19.0...v7.20.0) (2021-08-11)


### Features

* Change to a vertical form in the Create and Edit Attribute Definition dialog to make it easier to use on mobile devices ([a15cc63](https://github.com/pubannotation/textae/commit/a15cc638cdc24dd9f4e1a077d328ed2101a21f56))
* Change to a vertical form in the Edit Numeric and String Attribute dialog to make it easier to use on mobile devices ([c3d9437](https://github.com/pubannotation/textae/commit/c3d9437e49d3817bf06e655c63251ef281714d1c))
* Change to a vertical form in the Edit Value of Attribute Definition dialog to make it easier to use on mobile devices ([40b8b19](https://github.com/pubannotation/textae/commit/40b8b191de3e8086dfffc00af4818ea88de47111))
* Change to a vertical form in the Load dialog to make it easier to use on mobile devices ([21c2310](https://github.com/pubannotation/textae/commit/21c2310c3cc6e2462495183185f55b094800491b))
* Change to a vertical form in the Save Annotation and Configuration dialog to make it easier to use on mobile devices ([1d993f8](https://github.com/pubannotation/textae/commit/1d993f853f03b54a790014de2258a3991d5dac09))
* Change to a vertical form in the Settig dialog to make it easier to use on mobile devices ([a7da6ac](https://github.com/pubannotation/textae/commit/a7da6ac8350ec69e7bb2404ee5b2d28d61af3f9d))
* Change to a vertical form in the Type Definition dialog to make it easier to use on mobile devices ([7772764](https://github.com/pubannotation/textae/commit/7772764c2106018950c42b1d5a53001ac8b379ba))
* Do not show keyboard shortcut help for touch devices ([17ed4a0](https://github.com/pubannotation/textae/commit/17ed4a096b867891e499996ad9066c8899f0fabe))
* In the Save Configuration dialog, press Enter to save ([dae77bf](https://github.com/pubannotation/textae/commit/dae77bf8826f3de37d9eaa8154456d2d24ca7b5e))
* Unify the style of dialog buttons with jQuery UI ([b9bdb93](https://github.com/pubannotation/textae/commit/b9bdb9367e4862973fd16a2f90386a9a88cec61b))
* Wrap the type palette labels to fit the window width ([c2d9d68](https://github.com/pubannotation/textae/commit/c2d9d680e625ae62bfa5fc79c3ccb942bd341399))


### Bug Fixes

* Button style in the pallet ([c0b6067](https://github.com/pubannotation/textae/commit/c0b6067a7b18634c6381911b55e40beb5fb9cae7))
* Dependency to the terser-webpack-plugin ([98f507a](https://github.com/pubannotation/textae/commit/98f507ab59af88a10deb62519e9fa51810344d1d))
* Layout of input elements to select local files ([89eb672](https://github.com/pubannotation/textae/commit/89eb6720d5ca18d8212d8b20e5b4200a2863a301))
* Limit the width of the extended Load dialog ([c483932](https://github.com/pubannotation/textae/commit/c483932036c8b4e26168474e086a60a8572c7811))
* The default checkbox in the Type Definition dialog looks like a radio button ([c96a6d0](https://github.com/pubannotation/textae/commit/c96a6d03637e5856d1dc19c696e79f03dffbc367))
* The label of the flag attribute is not displayed in the Edit Type Values dialog ([e9c7600](https://github.com/pubannotation/textae/commit/e9c76007364e85a89f84de53487c094ebe5fb6a4))
* Webpack version specification format ([b1ec8a5](https://github.com/pubannotation/textae/commit/b1ec8a5d5a00d8fbe0ae39d01c902e24108775ab))
* Width of the candidates of auto completion in the Edit Type Values dialog ([2c2f406](https://github.com/pubannotation/textae/commit/2c2f406a58837b2bc2e5ec9cb7f4107dd22c1b75))
* Width of the candidates of the auto-completion in the Edit String Attribute dialog ([353687c](https://github.com/pubannotation/textae/commit/353687c1613660e22bfe1fac899178c50b0906aa))
* Width of the candidates of the auto-completion in the Edit Type Definition dialog ([bcd2665](https://github.com/pubannotation/textae/commit/bcd266527605b43734c41338705da08b58d1fde5))

## [7.19.0](https://github.com/pubannotation/textae/compare/v7.18.0...v7.19.0) (2021-08-04)


### Features

* Display a border on the table in the Edit Type Value dialog ([a027aea](https://github.com/pubannotation/textae/commit/a027aeaf6d0add77caf243abd74d39fefa6a4150))
* Display label of numeric attribute in the Edit Type Value dialog ([1ab3dd6](https://github.com/pubannotation/textae/commit/1ab3dd6b1264c6e63f670d1247d677b22deb8da1))
* Either the value of the attribute or the label will be displayed. Move the button to the right column ([1202c30](https://github.com/pubannotation/textae/commit/1202c3057802406ec8bded659366509f5c30be8d))
* Make the header of the type value palette two lines ([77ef8d6](https://github.com/pubannotation/textae/commit/77ef8d60349b12617154024888ceb37b8ecf7c71))
* Make the table in the Edit Type Value dialog a two-column table ([735fdf3](https://github.com/pubannotation/textae/commit/735fdf3100a46165f7b12e84fabac9d7f6e23669))
* Responsive Dialogs ([2edd543](https://github.com/pubannotation/textae/commit/2edd5432c073edda791a256e7b57360ebc545ecd))


### Bug Fixes

* A value is added to the attribute definition even though the label of the stirng attribute has not been changed in the Edit Type Value dialog ([3cd8cf0](https://github.com/pubannotation/textae/commit/3cd8cf0c5c9b6acc8d9f7308afa22f9997cdf4ba))
* Missing cells in the type row of the Edit Type Value dialog ([8447f3a](https://github.com/pubannotation/textae/commit/8447f3a85d7900e2c98e48bab504e4fff4a0d76f))
* Selecting text and pressing the expand span button causes an error ([6ccad17](https://github.com/pubannotation/textae/commit/6ccad1711b7ec059aa7637a01c8e2d3ea3572d2d))
* Selecting text and pressing the shrink span button causes an error ([7476c47](https://github.com/pubannotation/textae/commit/7476c479aec62406d7f78bc451a65556e64464b1))
* The label on the Edit Type Value dialog does not disappear when the Selection attribute obj is changed from one with a label to one without a label ([da961f7](https://github.com/pubannotation/textae/commit/da961f73813b2f9c6e79dfa1a91343d4f1ce1e43))
* The leftmost border of the tabs in the Type Value palette is hidden ([533c5c9](https://github.com/pubannotation/textae/commit/533c5c9686601a33d5ce29eaeea45254fdfa9630))
* The right neighboring span may not be selected when the span is shrunk and erased by touch operation ([5a8d5ca](https://github.com/pubannotation/textae/commit/5a8d5ca8c9ac98a6f224b5bd5d54d47133559ac8))
* When changing an existing Attribute to a duplicate Attribute, it is ignored when no other changes are made ([1a23f0c](https://github.com/pubannotation/textae/commit/1a23f0cd5157badc8ad33908d04f4660135c2da4))

## [7.18.0](https://github.com/pubannotation/textae/compare/v7.17.0...v7.18.0) (2021-07-28)


### Features

*  Create a span when you mouse down on DenotationSpan and mouse up on StyleSpan ([0adc5cf](https://github.com/pubannotation/textae/commit/0adc5cfcf1d874940221fd0137c1267a82673ee4))
*  Create a span when you mouse down on StyleSpan and mouse up on DenotationSpan ([b1d522b](https://github.com/pubannotation/textae/commit/b1d522bab7a44886959b862b9d9e43dc194cf93e))
* Create DenotationSpan when mouse down on style span and mouse up on block span ([1196491](https://github.com/pubannotation/textae/commit/1196491d50ef42e078e62bd646a6154fcbf94abb))
* Enable to shrink spans in touch devices ([e73a8a2](https://github.com/pubannotation/textae/commit/e73a8a2d55adfcd38c354a9fbc372287e3244ed7))
* Find and shrink DenotationSpan when mousing down from the end of the style span and mousing up in the style span ([e34239d](https://github.com/pubannotation/textae/commit/e34239d4a93798ed048802ba76dcb73f911601fd))
* If the ancestor of an anchor node is a denotation span when moused down on a style span and moused up on a block span, it will be expanded ([46eff95](https://github.com/pubannotation/textae/commit/46eff9533cf5c5471c3723d00d2d3d02fce41b62))
* If the ancestor of an anchor node is a denotation span when moused down on a style span and moused up on a style span, it will be expanded ([b46a3f7](https://github.com/pubannotation/textae/commit/b46a3f71bf1d3ff5785ede8e5420a35471842d30))
* Mouse down on the child DenotationSpan and zoom in when mouse up on the sibling DenotationSpan of the parent DenotationSpan ([742b016](https://github.com/pubannotation/textae/commit/742b0169bc90844093e7ee46e11e88f6280ae275))
* Stop prioritizing the selected Span as the target for expansion ([565b3d5](https://github.com/pubannotation/textae/commit/565b3d5af6f1d95cf654cce3a4b61c21af541d9b))
* When mousing down with denotation span and mousing up with denotation span, if the parent element of the focus node is an ancestor of the parent element of the anchor node, always extend the denotation span of the focus node's parent ([6e724be](https://github.com/pubannotation/textae/commit/6e724be3fc4b498bbbdb727eb4fa0919f7c3c07f))
* When the parent element of the anchor node and the parent element of the focus node have a parent-child relationship of two or more levels, the parent element of the anchor node, DenotationSpan, is also extended ([72dbeb7](https://github.com/pubannotation/textae/commit/72dbeb7ce269f3d1eb68cbb1852bb1c9cc92ce48))
* When there is a difference in the number of attributes of adjacent Entities in the same row, the relationship will not be bent significantly ([fb5167d](https://github.com/pubannotation/textae/commit/fb5167dc95f220160cb4725fa3fa908d1f275b78))


### Bug Fixes

* Error occurs when trying to create a new DenotationSpan by selecting from the end of the style span ([67e4b4f](https://github.com/pubannotation/textae/commit/67e4b4f994f1355d530b6cee954806bbf09ee116))
* Error occurs when trying to create a new DenotationSpan in a style span ([96399d8](https://github.com/pubannotation/textae/commit/96399d82399ea27a1d82ff0abe84714338480a9b))
* Find and shrink DenotationSpan when mouse down from the edge of DenotationSpan and mouse up in StyleSpan ([756371a](https://github.com/pubannotation/textae/commit/756371a1386e14338e21a5dd6df5fa41933356df))
* Fix getting expandable span logic ([1853b97](https://github.com/pubannotation/textae/commit/1853b970666e8e30dc7d3422d799f85780848fa7))
* Fix getting expandable span logic ([a0f94d1](https://github.com/pubannotation/textae/commit/a0f94d1a0036fe4fd12a1a59560efd8ff4fa3ff0))
* Fix incorrect logic in the getShotenInFocusNodeToAnchorNodeDirection method ([8d08be7](https://github.com/pubannotation/textae/commit/8d08be7c87be91d48226f7355fc8b3632d26cfc0))
* Fix incorrect method names ([4b7ee39](https://github.com/pubannotation/textae/commit/4b7ee39a24d1f6af895c31b4c9218a1e31ccf195))
* Mousing down on the text and mousing up on the denotation span causes an error ([a5706a9](https://github.com/pubannotation/textae/commit/a5706a9b718fe5250526dea361f48110bb82ecb9))
* Shrink the span of the ends ([6cb4534](https://github.com/pubannotation/textae/commit/6cb4534244be7a3588413888155d3d7f6e2e4091))
* When mousing down on a style span in a child DenotationSpan and mousing up on the parent DenotationSpan, the child DenotationSpan is not expanded ([e182731](https://github.com/pubannotation/textae/commit/e182731e11784179346e116d9c2710bf81f8a19f))
* When mousing down with DenotationSpan and mousing up with StyleSpan, the span may not expand ([9011503](https://github.com/pubannotation/textae/commit/90115030669109a7dd82b83644c9c11f24017aa0))

## [7.17.0](https://github.com/pubannotation/textae/compare/v7.16.0...v7.17.0) (2021-07-14)


### Features

* When mousing down on text and mousing up on DenotationSpan, shrink the span closest to the moused-up node ([2f4cc0d](https://github.com/pubannotation/textae/commit/2f4cc0d933a47e28128eaf2871f8990fc98b8e3a))
* Within a block span, shrink a DenotationSpan when mouse down on text and mouse up on a style span within the DenotationSpan. ([e44c480](https://github.com/pubannotation/textae/commit/e44c4806407a7cf586cf07e08f1cd42bacb2ab8d))
* You cannot create a DenotationSpan that is the parent of a BlockSpan ([b090aea](https://github.com/pubannotation/textae/commit/b090aea6ed8eab8702887c40c72384899ce0e8e1))


### Bug Fixes

* When mousing down on a DenotationSpan child's style span and mousing up on the parent's DenotationSpan, the direction of shrinking is reversed ([ca2a6ee](https://github.com/pubannotation/textae/commit/ca2a6ee1839a36057ea08a4adb40f9baa51177ec))
* When mousing down on a style span within one of the sibling spans and mousing up on the other sibling span, the first sibling span is not expanded ([65c1049](https://github.com/pubannotation/textae/commit/65c104999e392ade28a07d338d32997e22133f23))

## [7.16.0](https://github.com/pubannotation/textae/compare/v7.15.0...v7.16.0) (2021-07-08)


### Features

* Expand the background as well as the text of the label when the Entity is hovered ([825b186](https://github.com/pubannotation/textae/commit/825b18672453f9f8601d50c87541066305985f04))
* Make the background color of Entity labels white ([b11768d](https://github.com/pubannotation/textae/commit/b11768d642970331279bfe45de0522877d1b1853))
* Save the annotation to the specified URL when you press Enter in the URL field of the Save Annotation dialog ([1fa6f43](https://github.com/pubannotation/textae/commit/1fa6f439e9418edbe605d99c77451cb2a7eaf154))


### Bug Fixes

* Hovered Entity's signboard does not appear in the foreground ([9c7ab9d](https://github.com/pubannotation/textae/commit/9c7ab9d55b62d6e8ff2ee63bb9431f2ac3991fc3))
* Hovering over a relationship between Entities in the same row will bend it significantly ([cd0023c](https://github.com/pubannotation/textae/commit/cd0023c7193b112fef0e2fce742baa525ab201b4))

## [7.15.0](https://github.com/pubannotation/textae/compare/v7.14.0...v7.15.0) (2021-07-07)


### Features

* Do not change the Y-coordinate of the text when changing the toolbar height using the hamburger menu button ([314f03e](https://github.com/pubannotation/textae/commit/314f03e491dfcf89ee8f919cfe0cea31e99ec160))
* Enable the automatic line height adjustment feature by default ([3d825ce](https://github.com/pubannotation/textae/commit/3d825ce2f832ef078bed0b5b9551df91c718404e))
* Enable the boundary detection function by default ([4c3eaa5](https://github.com/pubannotation/textae/commit/4c3eaa561bb39e94974fc999960741e1077481f0))
* Fix the title statement of the add attribute tab of the TypeValuesPallet ([28407e7](https://github.com/pubannotation/textae/commit/28407e7c222e38c1786ffa1508aa0a9304245e39))
* Fixed the wording of the label for the number of selected items when the attribute tab is displayed in the TypeValue palette ([639b52d](https://github.com/pubannotation/textae/commit/639b52d30b37cee340c63e28e56739f042174e5b))


### Bug Fixes

* When you mouse down on the DenotationSpan and mouse up on the style span to shrink the DenotationSpan, ignore the span to be selected and shrink the DenotationSpan of the nearest ancestor of the style span ([9fab90f](https://github.com/pubannotation/textae/commit/9fab90fa449d881c6e98824dccf46c5bd951c164))
* When you mouse down on the text and mouse up on the style span to shrink the DenotationSpan, ignore the span to be selected and shrink the DenotationSpan of the nearest ancestor of the style span ([975be79](https://github.com/pubannotation/textae/commit/975be7937ccf879f477de86c3d73b4398e491913))

## [7.14.0](https://github.com/pubannotation/textae/compare/v7.13.0...v7.14.0) (2021-06-30)


### Features

* Context menu separators should only appear between button groups ([3d3b2bf](https://github.com/pubannotation/textae/commit/3d3b2bfeae0c9175ba1726374fb0d7539cffd9fc))
* Delete link to the homepage from context menu for touch device ([b745bfa](https://github.com/pubannotation/textae/commit/b745bfa3963e64ec892cb1649bfee6b8f93a6dff))
* Evenly distribute the icons on the toolbar ([e5c6bff](https://github.com/pubannotation/textae/commit/e5c6bff2a1daf8edb60a0fe0f5d26c7596781ba0))
* On touch devices, display the context menu above the selection string ([76223d1](https://github.com/pubannotation/textae/commit/76223d1b98403094297eb6fc9c90e04c98bcf240))
* Set maximum width for toolbars for touch devices ([13c28c0](https://github.com/pubannotation/textae/commit/13c28c0c3bf4afce698967219f71587cdb619dcf))
* Show only span editing icons in the context menu for touch devices ([cc89c40](https://github.com/pubannotation/textae/commit/cc89c403b39570deaaef81dbb205dc4e3ca31858))
* Show the hamburger menu button and collapse the toolbar on narrow devices ([765c6f3](https://github.com/pubannotation/textae/commit/765c6f3f158ccb285959d14c7f58849019a0568e))


### Bug Fixes

* In the Chrome browser, when opening a palette from the toolbar, if the palette is displayed under the mouse pointer, the click event of the editor will fire and the palette will close when the mouse button is released ([a54a110](https://github.com/pubannotation/textae/commit/a54a1101883f8f6065a4a2c43e4e948beb9d2510))
* When I adjust the position of the end of the selected string within the span and click the expand span button, the span is not expanded. ([8744a81](https://github.com/pubannotation/textae/commit/8744a8116783b0a66a61acc819149cfda32e0c57))

## [7.13.0](https://github.com/pubannotation/textae/compare/v7.12.0...v7.13.0) (2021-06-23)


### Features

* Added a group of icons for span operations to the toolbar ([5b7ea22](https://github.com/pubannotation/textae/commit/5b7ea225c58e229990711967c575b5c8e176e943))
* The span can be extended with touch devices ([af9c269](https://github.com/pubannotation/textae/commit/af9c269044c40a1ae8bd09b8668cc018e61207ed))


### Bug Fixes

* Shrinking and deleting a span with relations will cause an error ([8475135](https://github.com/pubannotation/textae/commit/8475135f3598479d857c4a7fd58e81064d357317))
* The length of the control bar is too long when viewed in a PC browser ([7a6e223](https://github.com/pubannotation/textae/commit/7a6e223ad64cdf696b09d3c78c99db077a07191f))
* Toolbar flows when scrolling in Android chrome ([fb00f9f](https://github.com/pubannotation/textae/commit/fb00f9f415ce5ea2890e946ac2f23d4b7257da83))

## [7.12.0](https://github.com/pubannotation/textae/compare/v7.11.0...v7.12.0) (2021-06-16)


### Features

* Create a span with a touch device ([fc8a561](https://github.com/pubannotation/textae/commit/fc8a561fc3badeb1bdc486bf8c037a87f35bcb7d))
* Increase the icon size of the control bar for touch devices ([33cbe62](https://github.com/pubannotation/textae/commit/33cbe62168369aa9fc3bc8297903b0f503b50015))
* Set the viewport to prevent shrinking on mobile devices ([e4c2034](https://github.com/pubannotation/textae/commit/e4c2034599c384b04b5b250d8d7228fb704fc007))
* Set touch-device-specific styles for the control bar and context menu ([f9ef1ce](https://github.com/pubannotation/textae/commit/f9ef1cecfb05b38b7e600599e962093bdf02475a))
* Widen the gap between items in the context menu for touch devices ([e727bff](https://github.com/pubannotation/textae/commit/e727bff58f39eb643bb2d7bf6943a0d3e07d3536))

## [7.11.0](https://github.com/pubannotation/textae/compare/v7.10.0...v7.11.0) (2021-06-09)


### Features

* Added change label button to the Edit Numerical Attributes dialog ([24c0fd0](https://github.com/pubannotation/textae/commit/24c0fd03632bc7e10dc51761c78a32ff8293a70d))
* Added change label button to the Edit String Attributes dialog ([0617cdf](https://github.com/pubannotation/textae/commit/0617cdfc92271f071a8c24427e92858d3fa1a6c5))
* Change the title of the CreateAttributeDefinitionDialog ([ef566dd](https://github.com/pubannotation/textae/commit/ef566ddee4b460b9ec66d732041d1495ff2dcb79))
* Change the title of the CreateTypeDefinitionDialog ([964cb4a](https://github.com/pubannotation/textae/commit/964cb4a8f51a308f2aca19f4b4995a186015d163))
* Change the title of the EditAttributeDefinitionDialog ([435ec22](https://github.com/pubannotation/textae/commit/435ec22ef59056849f8185b0300cd72d286bc0e2))
* Change the title of the EditNumericAttributeDialog ([cbc8769](https://github.com/pubannotation/textae/commit/cbc87690fa23d4931242648adda9b81c8191501e))
* Change the title of the EditStringAttributeDialog ([1e3b80b](https://github.com/pubannotation/textae/commit/1e3b80bd9499a7776026656a5632f1ac339cc974))
* Change the title of the EditTypeDefinitionDialog ([b77e5eb](https://github.com/pubannotation/textae/commit/b77e5ebddabb3a4d6773e00d4ed55404db4374b6))
* Change the title of the EditTypeValuesDialog ([28ad874](https://github.com/pubannotation/textae/commit/28ad874c8e0406ceed9ef70e545e879cd5c2abc9))
* Change the title of the EditValueOfAttributeDefinitionDialog ([2f126ef](https://github.com/pubannotation/textae/commit/2f126ef37603cf4724fade141bc3f98a9ec51dfc))
* Change the title of the SelectionAttributePallet ([738cbea](https://github.com/pubannotation/textae/commit/738cbeac72909efc234fc9d0cb5b3c8ee0905f50))
* Maximize dropzone ([21ef235](https://github.com/pubannotation/textae/commit/21ef23525f065b1335409bee40a3dd5890074981))


### Bug Fixes

* The star on the Save button in the TypeValues palette does not disappear after saving the configuration ([3e09239](https://github.com/pubannotation/textae/commit/3e0923903477b09553c53f9cb3faa4ec4378b2b3))

## [7.10.0](https://github.com/pubannotation/textae/compare/v7.9.0...v7.10.0) (2021-06-07)


### Features

* Added Open Palette button to the Edit Numerical Attributes dialog ([fa58f36](https://github.com/pubannotation/textae/commit/fa58f36a094d0bd54d54ba055e51368e3fa7ec27))
* Added Open Palette button to the Edit String Attributes dialog ([bba6e3c](https://github.com/pubannotation/textae/commit/bba6e3c05ee87905b0e7ef2dda16d663dbe8eb91))
* Generate attribute definitions from the attributes in the annotation track ([c9f1ee9](https://github.com/pubannotation/textae/commit/c9f1ee90bf9fa821e88d90a58229a437642a4d53))
* Open the SelectionAttributePallet instead of the Palette from shortcut keys ([42232f1](https://github.com/pubannotation/textae/commit/42232f11898cd68cdec95d9e972f8a724b1321ac))
* Set the label of the string attribute completed by autocomplete from the Edit Entity dialog ([335001e](https://github.com/pubannotation/textae/commit/335001ec1bf6e9a880c16a43f5b054577230f448))


### Bug Fixes

* Changing the selection with the cursor keys while selecting an Entity is not working ([0ec5d84](https://github.com/pubannotation/textae/commit/0ec5d84571aadedd692d9e42627717e65c7b9b99))
* If you mouse down on a block span and mouse up on a denotation span in the block span, it will shrink from the other side ([04619ec](https://github.com/pubannotation/textae/commit/04619ec1eb4a75066ecbea6b06b74d5d44663eff))
* Leftward relations enter the target endpoint on the left side of the target entity ([4b3fd2d](https://github.com/pubannotation/textae/commit/4b3fd2d4a6db45a8b1528934af012bbb2760d233))

## [7.9.0](https://github.com/pubannotation/textae/compare/v7.8.0...v7.9.0) (2021-06-02)


### Features

* Allow deletion when editing numeric attributes from shortcut keys ([295d0b8](https://github.com/pubannotation/textae/commit/295d0b8cbb12e254248d9660261110845fca9c8a))
* Boundary detection can be stopped in block mode ([2eef982](https://github.com/pubannotation/textae/commit/2eef98231bf7086f2f61217098acfc6c41888535))
* Close the SelectionAttributePallet with the Esc key ([16aa2bc](https://github.com/pubannotation/textae/commit/16aa2bc3ebfbd327055a41ab33562cb7d7f2573f))
* When Enter is pressed in the label field of EditStringAttributeDialog, the behavior is the same as pressing the OK button ([0762238](https://github.com/pubannotation/textae/commit/07622384a3449dfd2db7039afb33ec29cad0a7d4))
* When Enter is pressed in the label field of EditValueOfAttributeDefinitionDialog, the behavior is the same as pressing the OK button ([176e906](https://github.com/pubannotation/textae/commit/176e9067194220a124d373e7fd1eb8e554cc965a))

## [7.8.0](https://github.com/pubannotation/textae/compare/v7.7.0...v7.8.0) (2021-05-26)


### Features

* Add left and right padding to the labels of the relations ([c23c5ec](https://github.com/pubannotation/textae/commit/c23c5ecc2231b980f9f874a63161e75966d8fb26))
* Add or remove attributes in relation mode from shortcut keys ([5ff1e51](https://github.com/pubannotation/textae/commit/5ff1e51650b296558e0890f62afae904097886bf))
* Adjust the position of the label when emphasizing the bollards of the relation ([9c29a05](https://github.com/pubannotation/textae/commit/9c29a054028e4678eeebc6970458e8b7bb7e34b1))
* Disable mouse events in unlabeled areas of the signboard ([7bfcab9](https://github.com/pubannotation/textae/commit/7bfcab92ca01a415acf8ddeb461ec2668eca17bf))
* Display the label of the hovered relation in the foreground ([51b234e](https://github.com/pubannotation/textae/commit/51b234ef739c8c77bb93174ec5a9f558bf12a11e))
* Emphasize all bollards in the same relation on both ends as the hovered relation ([118b54c](https://github.com/pubannotation/textae/commit/118b54cb4ef04ef44681474a8f8521fe988a8f75))
* Highlight the bollards of the source and target entities when hovering over a relation ([0f8e104](https://github.com/pubannotation/textae/commit/0f8e104fa660cab6d0d9dcc53525ed91dc25597e))
* If an entity has only one endpoint, it will not set up jetties ([0949747](https://github.com/pubannotation/textae/commit/0949747c3e18c5a4b088e0c01e8c1715cdb7fd72))
* Stop highlighting the bollards on the other side of the entity's relation when hovering over the entity ([649bb08](https://github.com/pubannotation/textae/commit/649bb085a23c4f966c5200c84ac538f1a8761933))


### Bug Fixes

* Attached attributes are not removed when deleting a relation ([d5f404f](https://github.com/pubannotation/textae/commit/d5f404f2c086eadd3e86a6602c25d02d98152c8e))
* Deleting a block entity will cause an error ([8d473aa](https://github.com/pubannotation/textae/commit/8d473aaf1c78e859c9ca56ccc2a795a8c6a4b9fa))
* Entity boundaries of selected relations do not turn red ([1ed23e7](https://github.com/pubannotation/textae/commit/1ed23e76490eb0ad8da5ec2aeb1277033bf8b370))
* Selecting and deleting a span and an entity at the same time will cause an error ([6d08918](https://github.com/pubannotation/textae/commit/6d08918cbf4707aa7299b94a2fabc2aadd66830f))
* Selecting and deleting a span and an relation at the same time will cause an error ([6629dbc](https://github.com/pubannotation/textae/commit/6629dbcb5493f570ef9de91e922d2c65f539afbc))
* When I select an entity, mouse over it, and then delete the attribute from the shortcut key, the jetty of the relation remains ([1bebf49](https://github.com/pubannotation/textae/commit/1bebf498ea19e1bbd65858f03c06f49e87211182))

## [7.7.0](https://github.com/pubannotation/textae/compare/v7.6.0...v7.7.0) (2021-05-19)


### Features

* Now that the rendering of the relations is synchronous, enable debounce when moving the span ([be6e4a1](https://github.com/pubannotation/textae/commit/be6e4a1f7f0c6d5a59e160dadc14bafac403af48))


### Bug Fixes

* Editor height is not recalculated when annotation files are loaded ([9ef8e7e](https://github.com/pubannotation/textae/commit/9ef8e7edf68021faa4ad0bf382da35b8afa97dea))
* Entity style specification in block mode is missing ([428d237](https://github.com/pubannotation/textae/commit/428d237a64efc890cf1c4f8707f9976cb246d20a))
* Labels of relations are displayed in simple mode ([c586a2f](https://github.com/pubannotation/textae/commit/c586a2f59a56ef8b5a5dd2e3d449916208273249))

## [7.6.0](https://github.com/pubannotation/textae/compare/v7.5.1...v7.6.0) (2021-05-12)


### Features

* Added margin left to palette predicate ([8064664](https://github.com/pubannotation/textae/commit/8064664f0f392c889196feb2d154690c53d7534f))
* Display an icon in the Attribute Type column of the Add Attribute Definition dialog ([eb7af8d](https://github.com/pubannotation/textae/commit/eb7af8d8f7ad22efb2e6bda9914dc84f0459b35f))
* Make the Attribute Type field in the Add Attribute Definition dialog a radio button ([e00308e](https://github.com/pubannotation/textae/commit/e00308ebdc4573e93641c145c4dee2e50525b212))
* Move the Edit and Delete Attribute Definitions buttons on the palette to the right of the attribute name ([cabcfae](https://github.com/pubannotation/textae/commit/cabcfae062add9277dd6f9aa7ae0052389d3f0f7))
* Move the Palette's Add, Edit, and Delete Attributes buttons to the left of the Attributes tab ([a6a5cbf](https://github.com/pubannotation/textae/commit/a6a5cbfe7ff6c1ff4e81a08d17850c63ccbec86b))
* Replace the position of the Edit and Delete Palette Attribute Definition buttons ([c7eb0a1](https://github.com/pubannotation/textae/commit/c7eb0a1983facfba00105697ddfc814578e0e581))
* Turn the color input field in the Add Attribute Definition dialog into a color picker ([8d5238f](https://github.com/pubannotation/textae/commit/8d5238fe6dc3a43e19ea720bd15a5b3b8a7a44a2))
* Turn the color input field in the Add Attribute Value dialog into a color picker ([dd571b6](https://github.com/pubannotation/textae/commit/dd571b6417d548539a62413c143f4caf539b6bb8))


### Bug Fixes

* When selecting an entity or relation from the palette, the currently selected entity or relation is deselected, but it still looks selected ([5b6fc3f](https://github.com/pubannotation/textae/commit/5b6fc3f3bdceebb26808553d6089fe1a93fc04b1))

### [7.5.1](https://github.com/pubannotation/textae/compare/v7.5.0...v7.5.1) (2021-05-07)


### Bug Fixes

* An error occurs when an invalid configuration is loaded ([c69a3ef](https://github.com/pubannotation/textae/commit/c69a3ef4afc7e80cd8120dc85ce86fc43f74ed7c))

## [7.5.0](https://github.com/pubannotation/textae/compare/v7.4.0...v7.5.0) (2021-04-27)


### Features

* In denotation mode and block mode, the labels of denotation and block entities are before the labels of relations ([392a1a3](https://github.com/pubannotation/textae/commit/392a1a35159fccc8a8aadd81f39405d59a0b2c76))
* In view mode, the labels of denotation and block entities are before the labels of relations ([1c38da8](https://github.com/pubannotation/textae/commit/1c38da8ceaf7ec825c01f7bb90edef638d9b8cb8))
* Sets the transparency of the attribute label background color to 80% ([78644f9](https://github.com/pubannotation/textae/commit/78644f9cb27f94d025c53ecc2edf6d6f02c59ad8))
* Sets the transparency of the entity label background color to 80% ([b942388](https://github.com/pubannotation/textae/commit/b9423883e0390bba25133e87e894af22dc5f6523))
* Sets the transparency of the span background color to 80% ([dfcc00e](https://github.com/pubannotation/textae/commit/dfcc00e9909ee7fdac357ced03ec7aebe38344d7))
* Show the label of the relationship of the hovered entity in denotation mode in front of the entity's label ([5837ca8](https://github.com/pubannotation/textae/commit/5837ca83871d0d8bd2a6bee57081dae080765e53))

## [7.4.0](https://github.com/pubannotation/textae/compare/v7.3.0...v7.4.0) (2021-04-20)


### Features

* Add an ID to the title attribute of the attribute ([319f789](https://github.com/pubannotation/textae/commit/319f7895ffe7a5f55cbe3ce25efbfe838bf0bfd7))
* Add pred and value to the title attribute of entities ([73f0d94](https://github.com/pubannotation/textae/commit/73f0d940c03860352823442438326f2709eeeab4))
* Change the format of the block span title attribute to begin-end ([7580ad9](https://github.com/pubannotation/textae/commit/7580ad975c5475118cacfde5e6a4d08577733dbb))
* Change the format of the denotation span title attribute to begin-end ([7e70b98](https://github.com/pubannotation/textae/commit/7e70b986f4bbb4fd79552eafec7e4b91ef45f6ab))
* Change the format of the hit area of the block span title attribute to begin-end ([5e6bb70](https://github.com/pubannotation/textae/commit/5e6bb70dc8917ba104cb08301ca149d08a1e30d2))
* Change the format of the style span title attribute to begin-end ([8e00863](https://github.com/pubannotation/textae/commit/8e00863d3ecb6eeca9f1a90353aa80c97c3c96df))
* Remove the title attribute of the block span because the position of the ID of the block span and the background are shifted ([4b207b2](https://github.com/pubannotation/textae/commit/4b207b272d03377bdeab187e4a64f58c2e878c68))
* Show tooltip of the connection of relations ([876583b](https://github.com/pubannotation/textae/commit/876583b8de40b60af62bd52576207011fc5bb1c9))
* To make the angle of incidence to the triangle a right angle, make the relation a combination of cubic and quadratic Bezier curves ([31e4253](https://github.com/pubannotation/textae/commit/31e4253b3f148330e88aad71384a50ad6cf2685a))

## [7.3.0](https://github.com/pubannotation/textae/compare/v7.2.1...v7.3.0) (2021-04-14)


### Features

* Display an area around the relation to receive mouse events ([1f2d215](https://github.com/pubannotation/textae/commit/1f2d2151926a30d05b9cb3e30e043d2c7799a016))
* Display relations behind text in term mode ([0e8e3c7](https://github.com/pubannotation/textae/commit/0e8e3c7d78cda9464f8d981752452c074c0881f4))
* Don't bend relations too much when endpoints are on the same row ([bcb7287](https://github.com/pubannotation/textae/commit/bcb7287a1f2ff4400577dd0c061bd6f69709f2fc))
* Highlight the relation when you mouse over the relation label ([740ea44](https://github.com/pubannotation/textae/commit/740ea44083e2112e2b075d9b271c8702bd53368d))
* Increase the threshold value used to determine whether or not to bend the relation significantly ([ef6f052](https://github.com/pubannotation/textae/commit/ef6f052db82fac8431821606e9697c6d5d61f86a))
* Make sure to stop the hover state when you mouse-leave the relation ([082dd24](https://github.com/pubannotation/textae/commit/082dd24ffc83493905c836bd813e15ffcbaba897))
* Make the endpoint triangle smaller ([e7b42f5](https://github.com/pubannotation/textae/commit/e7b42f530966273c9ac28049e55b618cf7f30f19))
* Make the lines of the relation transparent ([9a8a70a](https://github.com/pubannotation/textae/commit/9a8a70a1716cd1a273ca9195a0643c46857b2590))
* Reduce the upward movement of hovered relations ([0df575d](https://github.com/pubannotation/textae/commit/0df575d4131bd2a581e9bb5a8c441ae339b1c526))
* To make it easier to distinguish between a pier and an endpoint that is not hovering, reduce the amount of relation movement during hover ([8409295](https://github.com/pubannotation/textae/commit/8409295d35ac133819daab6c380478b3770225e8))
* When the entity width is small and the endpoint is displayed in the center of the entity and the entity has only one endpoint, hovering will not move the entity left or right ([09d6f05](https://github.com/pubannotation/textae/commit/09d6f05c98db72b31c2a194bde445990dcc26c71))
* When the source endpoint is within 16 pixels to the left of the target endpoint, the relation goes through the right side of the entity ([660a50a](https://github.com/pubannotation/textae/commit/660a50ab5f4b58f3cf84ee19fd291a70d25e0777))
* When the source entity is below the target entity, the control point on the source endpoint side is moved outward ([da50dd2](https://github.com/pubannotation/textae/commit/da50dd2ad1385897634fe1e41a09b70a1270742f))


### Bug Fixes

* When a relation is deselected, the relation line does not become thinner ([726d68e](https://github.com/pubannotation/textae/commit/726d68eb033e86917c0191715734bf8865a430e0))
* When the source endpoint on the left is to the right of the target endpoint, the target endpoint on the right is used ([f73db4c](https://github.com/pubannotation/textae/commit/f73db4cbf6db1b4a8c1a20e45ed9a81c876ce5fc))

### [7.2.1](https://github.com/pubannotation/textae/compare/v7.2.0...v7.2.1) (2021-04-06)


### Bug Fixes

* The x-coordinates of the labels of the relations are misaligned ([d696f2b](https://github.com/pubannotation/textae/commit/d696f2b976b8caaadb6abde8613dfaf78f107b80))

## [7.2.0](https://github.com/pubannotation/textae/compare/v7.1.0...v7.2.0) (2021-04-06)


### Features

* Shift the Y coordinate of the target endpoint up by 1 pixel ([abb5ef2](https://github.com/pubannotation/textae/commit/abb5ef266322828b1848928308fa49f1baf537d5))
* Stop using transparent colors for entity borders ([f9552e2](https://github.com/pubannotation/textae/commit/f9552e27e6b32124c8f2481a4a6297fdccbb9159))
* When a relation is hovered, the endpoints are separated from the entity and a line is drawn between them ([161675c](https://github.com/pubannotation/textae/commit/161675c2e43249ebda45f03dbdc910c0fe797389))
* When the target endpoint side of the relation is bent wide, the label is placed in the middle of the relation. ([be852f1](https://github.com/pubannotation/textae/commit/be852f1a0b71f8bb3e48b195cf6096086a546d87))

## [7.1.0](https://github.com/pubannotation/textae/compare/v7.0.1...v7.1.0) (2021-04-02)


### Features

* Always shift endpoints when hovering ([cac488f](https://github.com/pubannotation/textae/commit/cac488f6e7f43cf7914dae20bc3c321d3ee2a5fa))
* Determines the left and right positional relationship of the entity from the entity's center position ([ec61bd5](https://github.com/pubannotation/textae/commit/ec61bd5213d0327b7649f286f2307d8b48fb423e))
* When the left and right positions of the entities are close and the left and right positions of the endpoints are opposite to the left and right positions of the entities, move the endpoints to the source side ([43122b4](https://github.com/pubannotation/textae/commit/43122b40134c7f511e26555f50711ce1b5c3a4a2))
* When the source endpoint and target endpoint are close, bend the target endpoint side of the relationship significantly. ([ee81842](https://github.com/pubannotation/textae/commit/ee818420e888ad55f2f9d50500a2a55ab7024948))
