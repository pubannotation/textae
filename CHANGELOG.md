# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
