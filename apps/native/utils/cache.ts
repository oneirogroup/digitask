const extendedCacheKey = <TKey extends string, TExtension extends object>(key: TKey, extension: TExtension) => ({
  $value: key,
  ...extension
});

export const cache = {
  user: {
    profile: extendedCacheKey("digitask.native:user:profile", {
      data: 1243
    })
  }
} as const;
