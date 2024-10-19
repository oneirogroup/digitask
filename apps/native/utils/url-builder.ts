import isNil from "lodash/isNil";

export const urlBuilder = (url: string, params: Record<string, undefined | null | string | number | boolean>) => {
  const paramsStrings: string[] = [];
  Object.entries(params).forEach(([param, value]) => {
    if (!isNil(value)) {
      paramsStrings.push(`${param}=${value}`);
    }
  });
  return `${url}${paramsStrings.length ? `?${paramsStrings.join("&")}` : ""}`;
};
