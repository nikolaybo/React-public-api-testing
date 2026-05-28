// Types for the generic URL query-param builder in `src/api/queryBuilder.ts`.
// Kept here (next to other domain types) so type definitions don't leak into
// implementation files.
export type AlwaysSendRule<T> = true | ((input: T) => boolean);

export interface QueryBuildOptions<T> {
  keyMap?: Partial<Record<keyof T & string, string>>;
  alwaysSend?: Partial<Record<keyof T & string, AlwaysSendRule<T>>>;
  transforms?: Partial<Record<keyof T & string, (value: never) => unknown>>;
  serializers?: Partial<Record<keyof T & string, (value: never) => string>>;
}
