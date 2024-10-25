import { useEffect } from "react";
import { RecoilState, useRecoilState } from "recoil";

import { DefaultError, QueryClient, UseMutationOptions, useMutation } from "@tanstack/react-query";

export function useRecoilMutation<TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>(
  atom: RecoilState<TData>,
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
  queryClient?: QueryClient
) {
  const [recoilState, setRecoilState] = useRecoilState(atom);
  const mutation = useMutation(options, queryClient);

  useEffect(() => {
    if (mutation.data) {
      setRecoilState(mutation.data);
    }
  }, [mutation.data]);

  return { ...mutation, data: recoilState };
}
