interface UseRecoilQueryBaseReturnType<TData> {
  rawData: TData;
}

export type UseRecoilQueryReturn<TData, TBaseReturnType> = TBaseReturnType & UseRecoilQueryBaseReturnType<TData>;
