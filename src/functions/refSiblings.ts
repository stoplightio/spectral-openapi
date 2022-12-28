import type { JsonPath } from "@stoplight/types";
import type { IFunction, IFunctionResult } from "@stoplight/spectral-core";
import { isObject } from "./utils/isObject";

function getParentValue(document: unknown, fullPath: JsonPath): unknown {
  if (fullPath.length === 0) {
    return null;
  }

  let piece = document;

  for (const path of fullPath) {
    if (!isObject(piece)) {
      return null;
    }
    piece = piece[path];
  }

  return piece;
}

const refSiblings: IFunction = (_targetVal, _opts, { document, path }) => {
  const value = getParentValue(document.data, path);

  if (!isObject(value)) {
    return;
  }

  const keys = Object.keys(value);
  if (keys.length === 1) {
    return;
  }

  const results: IFunctionResult[] = [];
  const actualObjPath = path.slice(0, -1);

  for (const key of keys) {
    if (key === "$ref") {
      continue;
    }
    results.push({
      message: "$ref must not be placed next to any other properties",
      path: [...actualObjPath, key],
    });
  }

  return results;
};

export default refSiblings;
