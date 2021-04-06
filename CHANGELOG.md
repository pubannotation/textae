# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
