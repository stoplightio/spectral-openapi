import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("operation-operationId-unique", [
  {
    name: "validate a correct object",
    document: {
      swagger: "2.0",
      paths: {
        "/path1": {
          get: {
            operationId: "id1",
          },
        },
        "/path2": {
          get: {
            operationId: "id2",
          },
        },
      },
    },
    errors: [],
  },

  {
    name: "return errors on different path operations same id",
    document: {
      swagger: "2.0",
      paths: {
        "/path1": {
          get: {
            operationId: "id1",
          },
        },
        "/path2": {
          get: {
            operationId: "id1",
          },
        },
      },
    },
    errors: [
      {
        message: 'Multiple operations exist with operationId "id1".',
        path: ["paths", "/path2", "get", "operationId"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },

  {
    name: "return errors on same path operations same id",
    document: {
      swagger: "2.0",
      paths: {
        "/path1": {
          get: {
            operationId: "id1",
          },
          post: {
            operationId: "id1",
          },
        },
      },
    },
    errors: [
      {
        message: 'Multiple operations exist with operationId "id1".',
        path: ["paths", "/path1", "post", "operationId"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
]);
