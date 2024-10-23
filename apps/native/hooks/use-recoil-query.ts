import { useEffect } from "react";
import { RecoilState, useRecoilState } from "recoil";

import {
  DefaultError,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult,
  useQuery
} from "@tanstack/react-query";

import { UseRecoilQueryReturn } from "./use-recoil-query.types";

export function useRecoilQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  recoilState: RecoilState<NoInfer<TQueryFnData>>,
  options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient
): UseRecoilQueryReturn<TData, DefinedUseQueryResult<TData, TError>>;

export function useRecoilQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  recoilState: RecoilState<NoInfer<TQueryFnData> | null>,
  options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient
): UseRecoilQueryReturn<TData, DefinedUseQueryResult<TData | null, TError>>;

export function useRecoilQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  recoilState: RecoilState<NoInfer<TQueryFnData>>,
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient
): UseRecoilQueryReturn<TData, UseQueryResult<TData, TError>>;

export function useRecoilQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  recoilState: RecoilState<NoInfer<TQueryFnData> | null>,
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient
): UseRecoilQueryReturn<TData, UseQueryResult<TData | null, TError>>;

export function useRecoilQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  recoilState: RecoilState<NoInfer<TQueryFnData>>,
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient
): UseRecoilQueryReturn<TData, UseQueryResult<TData, TError>>;

export function useRecoilQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  recoilState: RecoilState<NoInfer<TQueryFnData> | null>,
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient
): UseRecoilQueryReturn<TData, UseQueryResult<TData | null, TError>>;

export function useRecoilQuery(
  atom: RecoilState<any>,
  { select, ...options }: UseQueryOptions,
  queryClient?: QueryClient
) {
  const [recoilState, setRecoilState] = useRecoilState(atom);
  const query = useQuery(options, queryClient);

  useEffect(() => {
    if (query.data) {
      setRecoilState(query.data);
    }
  }, [query.data]);

  return {
    ...query,
    data: recoilState ? select?.(recoilState) || recoilState : recoilState,
    rawData: query.data ? select?.(query.data) || query.data : query.data
  };
}
