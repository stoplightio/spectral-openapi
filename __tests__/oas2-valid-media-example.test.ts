import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("oas2-valid-media-example", [
  {
    name: "valid examples in responses",
    document: {
      swagger: "2.0",
      responses: {
        200: {
          schema: {
            type: "string",
          },
          examples: {
            "application/json": "test",
            "application/yaml": "",
          },
        },
      },
    },
    errors: [],
  },

  {
    name: "invalid example in responses",
    document: {
      swagger: "2.0",
      responses: {
        200: {
          schema: {
            type: "string",
          },
          examples: {
            "application/json": "test",
            "application/yaml": 2,
          },
        },
      },
    },
    errors: [
      {
        message: '"application/yaml" property type must be string',
        path: ["responses", "200", "examples", "application/yaml"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
]);
