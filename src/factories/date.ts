import type { Schema } from '@tarcltd/form-vue'
import {
  hint,
  help,
  placeholder,
  autocomplete,
  pattern,
  mask,
} from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        hint,
        help,
        placeholder,
        autocomplete,
        mask,
        pattern,
      },
    },
    {
      'autocomplete': 'off',
      'mask': 'mm/dd/yyyy',
      'field:type': 'date',
    },
  ]
}
