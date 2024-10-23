export const eck = <TKey extends string, TExtension extends object>(
  key: TKey,
  extension: (cb: (...keys: (TemplateStringsArray | string)[]) => string) => TExtension
) =>
  Object.assign(
    key,
    extension((...keys) => `${key}:${keys.join(":")}`)
  );

eck.c = (
  c: (...keys: (TemplateStringsArray | string)[]) => string,
  key: string,
  extension: (cb: (...keys: (TemplateStringsArray | string)[]) => string) => object
) => eck(c(key), extension);
