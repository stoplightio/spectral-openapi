import {
  IRuleResult,
  Spectral,
  Document,
  Ruleset,
} from "@stoplight/spectral-core";
import { httpAndFileResolver } from "@stoplight/spectral-ref-resolver";
import sourceRuleset from "../../src/ruleset";

export type RuleName = keyof Ruleset["rules"];

type Scenario = ReadonlyArray<
  Readonly<{
    name: string;
    document: Record<string, unknown> | Document<unknown, any>;
    errors: ReadonlyArray<Partial<IRuleResult>>;
    mocks?: Record<string, Record<string, unknown>>;
  }>
>;

export default (ruleName: RuleName, tests: Scenario): void => {
  describe(`Rule ${ruleName}`, () => {
    const concurrent = tests.every(
      (test) => test.mocks === void 0 || Object.keys(test.mocks).length === 0
    );
    for (const testCase of tests) {
      (concurrent ? it.concurrent : it)(testCase.name, async () => {
        if (testCase.mocks !== void 0) {
          serveAssets(testCase.mocks);
        }

        const s = createWithRules([ruleName]);
        const doc =
          testCase.document instanceof Document
            ? testCase.document
            : JSON.stringify(testCase.document);
        const errors = await s.run(doc);
        expect(errors.filter(({ code }) => code === ruleName)).toEqual(
          testCase.errors.map(
            (error) => expect.objectContaining(error) as unknown
          )
        );
      });
    }
  });
};

export function createWithRules(rules: (keyof Ruleset["rules"])[]): Spectral {
  const s = new Spectral({ resolver: httpAndFileResolver });

  s.setRuleset({
    extends: [[sourceRuleset, "off"]],
    rules: rules.reduce((obj: any, name) => {
      obj[name] = true;
      return obj;
    }, {}),
  });

  return s;
}

// TODO(ps): Everything below copied and pasted from https://raw.githubusercontent.com/stoplightio/spectral/3f47abc3897372aaa076de1067c83613f67dbb0c/test-utils/node/index.ts

import nock from "nock";
import * as nodeFs from "fs";
import { URL } from "url";
import { dirname, isURL } from "@stoplight/path";
import { fs as memFs } from "memfs";

const fs = new Proxy(nodeFs, {
  get(target, key) {
    if (target[key] !== memFs[key]) {
      throw new Error(
        "jest.mock is not correctly hooked up and memfs is not in use. Aborting for security reasons"
      );
    }

    return Reflect.get(target, key, target);
  },
});

afterEach(() => {
  nock.cleanAll();
  try {
    fs.rmdirSync(__dirname, { recursive: true });
  } catch {
    //
  }
});

type Body = string | Record<string, unknown>;

export function serveAssets(mocks: Record<string, Body>): void {
  for (const [uri, body] of Object.entries(mocks)) {
    if (!isURL(uri)) {
      fs.mkdirSync(dirname(uri), { recursive: true });
      fs.writeFileSync(
        uri,
        typeof body === "string" ? body : JSON.stringify(body)
      );
      continue;
    }

    mockResponse(uri, 200, body);
  }
}

function mockResponse(uri: string, code: number, body: Body): void {
  const { origin, pathname, searchParams } = new URL(uri);

  const query = {};
  for (const [key, val] of searchParams.entries()) {
    query[key] = val;
  }

  const scope = nock(origin).persist(true);

  if (Object.keys(query).length > 0) {
    scope
      .get(
        RegExp(
          pathname.replace(/\/$/, "").replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") +
            "\\/?$"
        )
      )
      .query(query)
      .reply(code, body);
  } else {
    scope.get(pathname).reply(code, body);
  }
}

export function mockResponses(
  mocks: Record<string, Record<number, Body>>
): void {
  for (const [uri, responses] of Object.entries(mocks)) {
    for (const [code, body] of Object.entries(responses)) {
      mockResponse(uri, Number(code), body);
    }
  }
}
