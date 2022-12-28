import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("operation-singular-tag", [
  {
    name: "valid case",
    document: {
      swagger: "2.0",
      paths: {
        "/todos": {
          get: {
            tags: ["todos"],
          },
        },
      },
    },
    errors: [],
  },

  {
    name: "tags has more than 1",
    document: {
      swagger: "2.0",
      paths: {
        "/todos": {
          get: {
            tags: ["todos", "private"],
          },
        },
      },
    },
    errors: [
      {
        message: "Operation must not have more than a single tag.",
        path: ["paths", "/todos", "get", "tags"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
