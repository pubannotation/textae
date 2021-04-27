# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
