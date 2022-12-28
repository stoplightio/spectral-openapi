import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("no-script-tags-in-markdown", [
  {
    name: "valid case",
    document: {
      swagger: "2.0",
      paths: {},
      info: {
        description: "some description text",
      },
    },
    errors: [],
  },

  {
    name: "descriptions include <script",
    document: {
      swagger: "2.0",
      paths: {},
      info: {
        description: "some description contains <script",
      },
    },
    errors: [
      {
        message: 'Markdown descriptions must not have "<script>" tags.',
        path: ["info", "description"],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
]);
