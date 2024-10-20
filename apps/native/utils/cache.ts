const extendedCacheKey = <TKey extends string, TExtension extends object>(key: TKey, extension: TExtension) => ({
  $value: key,
  ...extension
});

export const cache = {
  user: {
    profile: extendedCacheKey("digitask.native:user:profile", {
      tasks: "digitask.native:user:profile:tasks",
      chat: {
        rooms: "digitask.native:user:profile:chat:rooms",
        messages: "digitask.native:user:profile:chat:messages"
      }
    })
  }
} as const;
