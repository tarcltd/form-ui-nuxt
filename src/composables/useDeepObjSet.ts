/**
 * Sets a value in an object using a path. This will mutate the object passed
 * in.
 *
 * @param obj - The object to set a value in.
 * @param path - The path to the value.
 * @param val - The value to set.
 * @returns The updated object.
 */
export default function useDeepObjSet(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  obj: Record<string, any>,
  path: string,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  val: any,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
): Record<string, any> {
  path = path.replaceAll('[', '.[')
  const keys = path.split('.')

  for (let i = 0; i < keys.length; i++) {
    let currentKey: string | number = keys[i]
    let nextKey: string | number = keys[i + 1]

    if (currentKey.includes('[')) {
      currentKey = Number.parseInt(
        currentKey.substring(1, currentKey.length - 1),
      )
    }

    if (nextKey && nextKey.includes('[')) {
      nextKey = Number.parseInt(nextKey.substring(1, nextKey.length - 1))
    }

    if (typeof nextKey !== 'undefined') {
      obj[currentKey] = obj[currentKey]
        ? obj[currentKey]
        /* eslint-disable-next-line unicorn/prefer-number-properties */
        : isNaN(nextKey as number)
          ? {}
          : []
    }
    else {
      obj[currentKey] = val
    }

    obj = obj[currentKey]
  }

  return obj
}
