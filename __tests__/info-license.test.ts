import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("info-license", [
  {
    name: "valid case",
    document: {
      swagger: "2.0",
      paths: {},
      info: {
        contact: { name: "stoplight.io" },
        license: { name: "MIT" },
      },
    },
    errors: [],
  },
  {
    name: "info missing license",
    document: {
      swagger: "2.0",
      paths: {},
      info: {
        contact: { name: "stoplight.io" },
      },
    },
    errors: [
      {
        message: 'Info object must have "license" object.',
        path: ["info"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
