import { DefaultOptions, UseMutationOptions } from '@tanstack/react-query'

// @tanstack/react-query 전역 설정
export const queryConfig = {
  queries: {
    // 사용자가 애플리케이션을 떠났다가 돌아오고 쿼리 데이터가 오래된 경우 TanStack 쿼리는 백그라운드에서 자동으로 새로운 데이터를 요청합니다.
    refetchOnWindowFocus: false,
    // 쿼리가 실패하면(쿼리 함수에서 오류가 발생함) 해당 쿼리의 요청이 최대 연속 재시도 횟수(기본값은 3)에 도달하지 않았거나
    // 재시도가 가능한지 확인하는 함수가 제공되면 TanStack 쿼리는 자동으로 쿼리를 다시 시도합니다.
    retry: false,
    // staleTime 을 더 길게 지정하면 쿼리가 데이터를 자주 다시 가져오지 않음을 의미합니다.
    staleTime: 1000 * 60, // 1분 (milliseconds)
  },
} satisfies DefaultOptions

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>

// Generic T 함수가 리턴하는 타입에서 queryKey, queryFn 키를 제외한 타입
export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>

// extends MutationOptions
export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  // Mutation 함수 리턴 타입
  ApiFnReturnType<MutationFnType>,
  Error,
  // Mutation 함수의 첫 번째 파라미터(Object)
  Parameters<MutationFnType>[0]
>
