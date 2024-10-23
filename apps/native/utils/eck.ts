export const eck = <TKey extends string, TExtension extends object>(
  key: TKey,
  extension: (cb: (...keys: (TemplateStringsArray | string)[]) => string) => TExtension
) =>
  Object.assign(
    key,
    extension((...keys) => `${key}:${keys.join(":")}`)
  );

eck.c = <TKey extends string, TExtension extends object>(
  c: (...keys: (TemplateStringsArray | string)[]) => TKey,
  key: TKey,
  extension: (cb: (...keys: (TemplateStringsArray | string)[]) => string) => TExtension
) => eck<TKey, TExtension>(c(key), extension);
