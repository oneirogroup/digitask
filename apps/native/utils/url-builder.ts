import isNil from "lodash/isNil";

export const urlBuilder = <TParams extends object>(url: string, params?: TParams) => {
  const paramsStrings: string[] = [];
  Object.entries(params || {}).forEach(([param, value]) => {
    if (!isNil(value)) {
      paramsStrings.push(`${param}=${value}`);
    }
  });
  return `${url}${paramsStrings.length ? `?${paramsStrings.join("&")}` : ""}`;
};
