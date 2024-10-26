import { useEffect } from "react";
import { RecoilState, useSetRecoilState } from "recoil";

import { DefaultError, QueryClient, UseMutationOptions, useMutation } from "@tanstack/react-query";

export function useRecoilMutation<TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>(
  atom: RecoilState<NoInfer<TData> | null>,
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
  queryClient?: QueryClient
) {
  const setRecoilState = useSetRecoilState(atom);
  const mutation = useMutation(options, queryClient);

  useEffect(() => {
    if (mutation.data) {
      setRecoilState(mutation.data);
    }
  }, [mutation.data]);

  return mutation;
}
