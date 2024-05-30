import type { Schema } from '@tarcltd/form-vue'
import {
  hint,
  help,
  placeholder,
  autocomplete,
  min,
  max,
  multipleOf,
} from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        hint,
        help,
        placeholder,
        autocomplete,
        min,
        max,
        multipleOf,
      },
    },
    {
      autocomplete: 'off',
    },
  ]
}
