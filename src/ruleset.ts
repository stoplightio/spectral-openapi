import { DiagnosticSeverity } from "@stoplight/types";
import { oas2, oas3, oas3_0, oas3_1 } from "@stoplight/spectral-formats";
import {
  pattern,
  schema,
  truthy,
  undefined,
  unreferencedReusableObject,
  xor,
} from "@stoplight/spectral-functions";
import {
  oasDiscriminator,
  oasDocumentSchema,
  oasExample,
  oasOpFormDataConsumeCheck,
  oasOpIdUnique,
  oasOpParams,
  oasOpSecurityDefined,
  oasPathParam,
  oasSchema,
  oasTagDefined,
  oasUnusedComponent,
  refSiblings,
  typedEnum,
  uniquenessTags, // TODO(ps) copied from rulesets/shared, could be moved into core?
} from "./functions";

export default {
  documentationUrl:
    "https://docs.stoplight.io/docs/spectral/docs/reference/openapi-rules.md",
  formats: [oas2, oas3, oas3_0, oas3_1],
  aliases: {
    PathItem: ["$.paths[*]"],
    OperationObject: [
      "#PathItem[get,put,post,delete,options,head,patch,trace]",
    ],
  },
  rules: {
    "oas2-operation-formData-consume-check": {
      // messsage: ".",
      description:
        'Operations with "in: formData" parameter must include "application/x-www-form-urlencoded" or "multipart/form-data" in their "consumes" property.',
      recommended: true,
      formats: [oas2],
      given: "#OperationObject",
      then: {
        function: oasOpFormDataConsumeCheck,
      },
    },
    "operation-operationId-unique": {
      // messsage: "",
      description: 'Every operation must have unique "operationId".',
      recommended: true,
      severity: DiagnosticSeverity.Error,
      given: "$",
      then: {
        function: oasOpIdUnique,
      },
    },
    "operation-parameters": {
      message: "{{error}}.",
      description: "Operation parameters are unique and non-repeating.",
      recommended: true,
      given: "#OperationObject.parameters",
      then: {
        function: oasOpParams,
      },
    },
    "operation-tag-defined": {
      message: "Operation tags must be defined in global tags.",
      // description: ".",
      recommended: true,
      given: "$",
      then: {
        function: oasTagDefined,
      },
    },
    "path-params": {
      message: "{{error}}.",
      description: "Path parameters must be defined and valid.",
      severity: DiagnosticSeverity.Error,
      recommended: true,
      given: "$",
      then: {
        function: oasPathParam,
      },
    },
    "duplicated-entry-in-enum": {
      message: "{{error}}.",
      description: "Enum values must not have duplicate entry.",
      severity: DiagnosticSeverity.Warning,
      recommended: true,
      given: ["$..[?(@property !== 'properties' && @ && @.enum)]"],
      then: {
        field: "enum",
        function: oasSchema,
        functionOptions: {
          schema: {
            type: "array",
            uniqueItems: true,
          },
        },
      },
    },
    "no-eval-in-markdown": {
      message: 'Markdown descriptions must not have "eval(".',
      // description: "",
      recommended: true,
      given: "$..[description,title]",
      then: {
        function: pattern,
        functionOptions: {
          notMatch: "eval\\(",
        },
      },
    },
    "no-script-tags-in-markdown": {
      message: 'Markdown descriptions must not have "<script>" tags.',
      // description: "",
      recommended: true,
      given: "$..[description,title]",
      then: {
        function: pattern,
        functionOptions: {
          notMatch: "<script",
        },
      },
    },
    "openapi-tags-uniqueness": {
      message: "{{error}}.",
      description: "Each tag must have a unique name.",
      severity: DiagnosticSeverity.Error,
      recommended: true,
      given: "$.tags",
      then: {
        function: uniquenessTags,
      },
    },
    "operation-operationId": {
      message: 'Operation must have "operationId".',
      // description: "",
      recommended: true,
      given: "#OperationObject",
      then: {
        field: "operationId",
        function: truthy,
      },
    },
    "path-declarations-must-exist": {
      message:
        'Path parameter declarations must not be empty, ex."/given/{}" is invalid.',
      // description: "",
      recommended: true,
      given: "$.paths",
      then: {
        field: "@key",
        function: pattern,
        functionOptions: {
          notMatch: "{}",
        },
      },
    },
    "path-keys-no-trailing-slash": {
      message: "Path must not end with slash.",
      // description: "",
      recommended: true,
      given: "$.paths",
      then: {
        field: "@key",
        function: pattern,
        functionOptions: {
          notMatch: ".+\\/$",
        },
      },
    },
    "path-not-include-query": {
      message: "Path must not include query string.",
      // description: "",
      recommended: true,
      given: "$.paths",
      then: {
        field: "@key",
        function: pattern,
        functionOptions: {
          notMatch: "\\?",
        },
      },
    },
    "no-ref-siblings": {
      message: "{{error}}.",
      description: "Property must not be placed among $ref",
      formats: [oas2, oas3_0],
      severity: DiagnosticSeverity.Error,
      recommended: true,
      resolved: false,
      given: "$..[?(@property === '$ref')]",
      then: {
        function: refSiblings,
      },
    },
    "typed-enum": {
      message: "{{error}}.",
      description: "Enum values must respect the specified type.",
      recommended: true,
      given: "$..[?(@ && @.enum && @.type)]",
      then: {
        function: typedEnum,
      },
    },
    "oas2-api-host": {
      message: 'OpenAPI "host" must be present and non-empty string.',
      // description: "",
      recommended: true,
      formats: [oas2],
      given: "$",
      then: {
        field: "host",
        function: truthy,
      },
    },
    "oas2-api-schemes": {
      message: 'OpenAPI host "schemes" must be present and non-empty array.',
      // description: "",
      recommended: true,
      formats: [oas2],
      given: "$",
      then: {
        field: "schemes",
        function: schema,
        functionOptions: {
          dialect: "draft7",
          schema: {
            items: {
              type: "string",
            },
            minItems: 1,
            type: "array",
          },
        },
      },
    },
    "oas2-discriminator": {
      message: "{{error}}.",
      description: "discriminator property must be defined and required",
      recommended: true,
      formats: [oas2],
      severity: DiagnosticSeverity.Error,
      given: "$.definitions[?(@.discriminator)]",
      then: {
        function: oasDiscriminator,
      },
    },
    "oas2-host-not-example": {
      message: "Host URL must not point at example.com.",
      // description: "",
      recommended: false,
      formats: [oas2],
      given: "$",
      then: {
        field: "host",
        function: pattern,
        functionOptions: {
          notMatch: "example\\.com",
        },
      },
    },
    "oas2-host-trailing-slash": {
      message: "Server URL must not have trailing slash.",
      // description: "",
      recommended: true,
      formats: [oas2],
      given: "$",
      then: {
        field: "host",
        function: pattern,
        functionOptions: {
          notMatch: "/$",
        },
      },
    },
    "oas2-operation-security-defined": {
      message: "{{error}}.",
      description:
        'Operation "security" values must match a scheme defined in the "securityDefinitions" object.',
      recommended: true,
      formats: [oas2],
      given: "$",
      then: {
        function: oasOpSecurityDefined,
        functionOptions: {
          schemesPath: ["securityDefinitions"],
        },
      },
    },
    "oas2-valid-schema-example": {
      message: "{{error}}.",
      description: "Examples must be valid against their defined schema.",
      recommended: true,
      formats: [oas2],
      severity: DiagnosticSeverity.Error,
      given: [
        "$..definitions..[?(@property !== 'properties' && @ && (@.example !== void 0 || @['x-example'] !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
        "$..parameters..[?(@property !== 'properties' && @ && (@.example !== void 0 || @['x-example'] !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
        "$..responses..[?(@property !== 'properties' && @ && (@.example !== void 0 || @['x-example'] !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
      ],
      then: {
        function: oasExample,
        functionOptions: {
          schemaField: "$",
          oasVersion: 2,
          type: "schema",
        },
      },
    },
    "oas2-valid-media-example": {
      message: "{{error}}.",
      description: "Examples must be valid against their defined schema.",
      recommended: true,
      formats: [oas2],
      severity: DiagnosticSeverity.Error,
      given: "$..responses..[?(@ && @.schema && @.examples)]",
      then: {
        function: oasExample,
        functionOptions: {
          schemaField: "schema",
          oasVersion: 2,
          type: "media",
        },
      },
    },
    "oas2-anyOf": {
      message: '"anyOf" keyword must not be used in OpenAPI v2 document.',
      description:
        "anyOf is not available in OpenAPI v2, it was added in OpenAPI v3",
      recommended: true,
      formats: [oas2],
      given: "$..anyOf",
      then: {
        function: undefined,
      },
    },
    "oas2-oneOf": {
      message: '"oneOf" keyword must not be used in OpenAPI v2 document.',
      description:
        "oneOf is not available in OpenAPI v2, it was added in OpenAPI v3",
      recommended: true,
      formats: [oas2],
      given: "$..oneOf",
      then: {
        function: undefined,
      },
    },
    "oas2-schema": {
      message: "{{error}}.",
      description: "Validate structure of OpenAPI v2 specification.",
      recommended: true,
      formats: [oas2],
      severity: DiagnosticSeverity.Error,
      given: "$",
      then: {
        function: oasDocumentSchema,
      },
    },
    "oas2-unused-definition": {
      message: "Potentially unused definition has been detected.",
      // description: "",
      recommended: true,
      resolved: false,
      formats: [oas2],
      given: "$.definitions",
      then: {
        function: unreferencedReusableObject,
        functionOptions: {
          reusableObjectsLocation: "#/definitions",
        },
      },
    },
    "oas3-api-servers": {
      message: 'OpenAPI "servers" must be present and non-empty array.',
      // description: "",
      recommended: true,
      formats: [oas3],
      given: "$",
      then: {
        field: "servers",
        function: schema,
        functionOptions: {
          dialect: "draft7",
          schema: {
            items: {
              type: "object",
            },
            minItems: 1,
            type: "array",
          },
        },
      },
    },
    "oas3-examples-value-or-externalValue": {
      message: 'Examples must have either "value" or "externalValue" field.',
      // description: "",
      recommended: true,
      formats: [oas3],
      given: [
        "$.components.examples[*]",
        "$.paths[*][*]..content[*].examples[*]",
        "$.paths[*][*]..parameters[*].examples[*]",
        "$.components.parameters[*].examples[*]",
        "$.paths[*][*]..headers[*].examples[*]",
        "$.components.headers[*].examples[*]",
      ],
      then: {
        function: xor,
        functionOptions: {
          properties: ["externalValue", "value"],
        },
      },
    },
    "oas3-operation-security-defined": {
      message: "{{error}}.",
      description:
        'Operation "security" values must match a scheme defined in the "components.securitySchemes" object.',
      recommended: true,
      formats: [oas3],
      given: "$",
      then: {
        function: oasOpSecurityDefined,
        functionOptions: {
          schemesPath: ["components", "securitySchemes"],
        },
      },
    },
    "oas3-server-not-example.com": {
      message: "Server URL must not point at example.com.",
      // description: "",
      recommended: false,
      formats: [oas3],
      given: "$.servers[*].url",
      then: {
        function: pattern,
        functionOptions: {
          notMatch: "example\\.com",
        },
      },
    },
    "oas3-server-trailing-slash": {
      message: "Server URL must not have trailing slash.",
      // description: "",
      recommended: true,
      formats: [oas3],
      given: "$.servers[*].url",
      then: {
        function: pattern,
        functionOptions: {
          notMatch: "./$",
        },
      },
    },
    "oas3-valid-media-example": {
      message: "{{error}}.",
      description: "Examples must be valid against their defined schema.",
      recommended: true,
      severity: DiagnosticSeverity.Error,
      formats: [oas3],
      given: [
        "$..content..[?(@ && @.schema && (@.example !== void 0 || @.examples))]",
        "$..headers..[?(@ && @.schema && (@.example !== void 0 || @.examples))]",
        "$..parameters..[?(@ && @.schema && (@.example !== void 0 || @.examples))]",
      ],
      then: {
        function: oasExample,
        functionOptions: {
          schemaField: "schema",
          oasVersion: 3,
          type: "media",
        },
      },
    },
    "oas3-valid-schema-example": {
      message: "{{error}}.",
      description: "Examples must be valid against their defined schema.",
      severity: DiagnosticSeverity.Error,
      formats: [oas3],
      recommended: true,
      given: [
        "$.components.schemas..[?(@property !== 'properties' && @ && (@ && @.example !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
        "$..content..[?(@property !== 'properties' && @ && (@ && @.example !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
        "$..headers..[?(@property !== 'properties' && @ && (@ && @.example !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
        "$..parameters..[?(@property !== 'properties' && @ && (@ && @.example !== void 0 || @.default !== void 0) && (@.enum || @.type || @.format || @.$ref || @.properties || @.items))]",
      ],
      then: {
        function: oasExample,
        functionOptions: {
          schemaField: "$",
          oasVersion: 3,
          type: "schema",
        },
      },
    },
    "oas3-schema": {
      message: "{{error}}.",
      description:
        "Validate the document against the OpenAPI v3 specification using the official JSON Schema version of the specification.",
      severity: DiagnosticSeverity.Error,
      formats: [oas3],
      recommended: true,
      given: "$",
      then: {
        function: oasDocumentSchema,
      },
    },
    "oas3-unused-component": {
      message: "Potentially unused component has been detected.",
      recommended: true,
      formats: [oas3],
      resolved: false,
      given: "$",
      then: {
        function: oasUnusedComponent,
      },
    },
  },
};
