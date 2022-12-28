import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("no-eval-in-markdown", [
  {
    name: "valid case",
    document: {
      swagger: "2.0",
      paths: {},
      info: {
        title: "some title text",
        description: "some description text",
      },
    },
    errors: [],
  },

  {
    name: "titles include eval",
    document: {
      swagger: "2.0",
      paths: {},
      info: {
        title: "some title contains eval(",
        description: "some description text",
      },
    },
    errors: [
      {
        message: 'Markdown description contains "eval(".',
        path: ["info", "title"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },

  {
    name: "descriptions include eval",
    document: {
      swagger: "2.0",
      paths: {},
      info: {
        title: "some title text",
        description: "some description contains eval(",
      },
    },
    errors: [
      {
        message: 'Markdown description contains "eval(".',
        path: ["info", "description"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
