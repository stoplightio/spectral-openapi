import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("info-description", [
  {
    name: "valid case",
    document: {
      swagger: "2.0",
      paths: {},
      info: { contact: { name: "stoplight.io" }, description: "description" },
    },
    errors: [],
  },

  {
    name: "info missing description",
    document: {
      swagger: "2.0",
      paths: {},
      info: { contact: { name: "stoplight.io" } },
    },
    errors: [
      {
        message: 'Info "description" must be present and non-empty string.',
        path: ["info"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
