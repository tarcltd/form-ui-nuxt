import type useForm from '@tarcltd/form-vue'
import type { SchemaField } from '@tarcltd/form-vue'

/**
 * Sorts the fields in the form input schema definition.
 *
 * @param input - The form input schema definition.
 * @returns A sorted array of fields.
 */
export default function useFieldSort(
  input: ReturnType<typeof useForm>['input'],
): [string, SchemaField][] {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  })

  return Object.entries(input.properties ?? {}).sort(
    ([_, a], [__, b]) =>
      collator.compare(a.attrs?.group, b.attrs?.group)
      + a.attrs?.order
      - b.attrs?.order,
  ) as [string, SchemaField][]
}
