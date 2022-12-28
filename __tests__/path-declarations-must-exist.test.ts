import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("path-declarations-must-exist", [
  {
    name: "valid case",
    document: {
      swagger: "2.0",
      paths: { "/path/{parameter}": {} },
    },
    errors: [],
  },

  {
    name: "parameter is empty",
    document: {
      swagger: "2.0",
      paths: { "/path/{}": {} },
    },
    errors: [
      {
        message: "Path parameters need to contain a name.",
        path: ["paths", "/path/{}"],

        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
