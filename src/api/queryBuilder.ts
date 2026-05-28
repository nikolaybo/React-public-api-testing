import type {
  AlwaysSendRule,
  QueryBuildOptions,
} from "@/types/queryBuilder";

// Generic, convention-based URL query-param builder.
//
// Behavior:
//   - Iterate the input's own enumerable keys (order preserved).
//   - For each key, run an optional `transform` first (e.g., trim strings).
//   - Skip the key if its (transformed) value deep-equals the value at the
//     same key in `defaults` — this is what "send only non-default filters"
//     means in practice.
//   - `alwaysSend[key]` overrides the skip rule: `true` always sends,
//     a predicate `(input) => boolean` sends when it returns true.
//   - URL key = `keyMap[key]` if provided, otherwise camelCase → kebab-case.
//   - Default serializer: arrays join with ",", booleans → "true"/"false",
//     everything else → `String(value)`. Override per key via `serializers`.
//
// Consumers (API modules) supply only:
//   - the defaults object (usually the store's INITIAL_FILTERS),
//   - tiny overrides for renames, force-sends, transforms, custom serializers.
// They never enumerate the filters themselves.
const camelToKebab = (s: string): string =>
  s.replace(/([A-Z])/g, "-$1").toLowerCase();

const defaultSerialize = (value: unknown): string => {
  if (Array.isArray(value)) return value.join(",");
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
};

const equals = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
  return false;
};

const isForced = <T>(rule: AlwaysSendRule<T> | undefined, input: T): boolean =>
  rule === true || (typeof rule === "function" && rule(input));

export const buildQuery = <T extends object>(
  input: T,
  defaults: Partial<T>,
  options: QueryBuildOptions<T> = {},
): string => {
  const inputRec = input as Record<string, unknown>;
  const defaultsRec = defaults as Record<string, unknown>;
  const keyMap = (options.keyMap ?? {}) as Record<string, string>;
  const alwaysSend = (options.alwaysSend ?? {}) as Record<
    string,
    AlwaysSendRule<T> | undefined
  >;
  const transforms = (options.transforms ?? {}) as Record<
    string,
    ((value: unknown) => unknown) | undefined
  >;
  const serializers = (options.serializers ?? {}) as Record<
    string,
    ((value: unknown) => string) | undefined
  >;

  const q = new URLSearchParams();

  for (const key of Object.keys(inputRec)) {
    const transform = transforms[key];
    const value = transform ? transform(inputRec[key]) : inputRec[key];

    const matchesDefault = equals(value, defaultsRec[key]);
    const forced = isForced(alwaysSend[key], input);
    if (matchesDefault && !forced) continue;

    const urlKey = keyMap[key] ?? camelToKebab(key);
    const serializer = serializers[key];
    q.append(urlKey, serializer ? serializer(value) : defaultSerialize(value));
  }

  return q.toString();
};
