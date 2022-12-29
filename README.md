# Spectral Documentation Ruleset

[![NPM Downloads](https://img.shields.io/npm/dw/@stoplight/spectral-openapi?color=blue)](https://www.npmjs.com/package/@stoplight/spectral-openapi) [![Stoplight Forest](https://img.shields.io/ecologi/trees/stoplightinc)][stoplight_forest]

This ruleset teaches Spectral how to validate an [OpenAPI](https://spec.openapis.org/oas/v3.1.0) description document. It focuses on the technical validity of the document, covering schema-based validations, and semantic validations, which is a fancy way of saying it will mke sure you've not messed up the YAML/JSON or entered parameters and schemas that are against the rules of the OpenAPI Specification. 

Supports OpenAPI v3.1., v3.0 and ye oldé v2.0.

## Installation

``` bash
npm install --save -D @stoplight/spectral-openapi
npm install --save -D @stoplight/spectral-cli
```

## Usage


Create a local ruleset that extends the OpenAPI ruleset. In its most basic form this just tells Spectral what ruleset you want to use, but it will allow you to customise things, add your own rules, turn bits off if its causing trouble.

```
cd ~/src/<your-api>

echo 'extends: ["@stoplight/spectral-openapi"]' > .spectral.yaml
```

_If you're using VS Code or Stoplight Studio then the NPM modules will not be available. Instead you can use the CDN hosted version:_

```
echo 'extends: ["https://unpkg.com/@stoplight/spectral-openapi@1.0.0/dist/ruleset.js"]' > .spectral.yaml
```

_**Note:** You need to use the full URL with CDN hosted rulesets because Spectral [cannot follow redirects through extends](https://github.com/stoplightio/spectral/issues/2266)._

Next, use Spectral CLI to lint against your OpenAPI description. Don't have any OpenAPI? [Record some HTTP traffic to make OpenAPI](https://apisyouwonthate.com/blog/creating-openapi-from-http-traffic) and then you can switch to API Design-First going forwards.

```
spectral lint api/openapi.yaml
```

For example, when running this on the GitHub OpenAPI, Spectral spots an invalid example.

```
https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/ghes-3.0/ghes-3.0.json
 48876:20  error  oas3-valid-schema-example  "example" property must match format "date-time".                       components.schemas.announcement-expiration.example
```

This example has slash escaped quotations marks in it, which looks like a JSON to JSON error:

```json
  "announcement-expiration": {
    "type": "string",
    "format": "date-time",
    "example": "\"2021-01-01T00:00:00.000-07:00\"",
    "nullable": true
  },
```

There are [a bunch of other rulesets](https://github.com/stoplightio/spectral-rulesets) you can install, or use for inspiration for your own rulesets and API Style Guides.

## 🎉 Thanks

- [Phil Sturgeon](https://github.com/philsturgeon) - Separated this package out from the `spectral:aas` ruleset bundled into the core of Spectral, ditching some less relevant rules and moving them over to [spectral-documentation](https://github.com/stoplightio/spectral-documentation).

## 📜 License

This repository is licensed under the MIT license.

## 🌲 Sponsor 

If you would like to thank us for creating Spectral, we ask that you [**buy the world a tree**][stoplight_forest].

[stoplight_forest]: https://ecologi.com/stoplightinc
