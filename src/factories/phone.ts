import type { Schema } from '@tarcltd/form-vue'
import {
  hint,
  help,
  placeholder,
  autocomplete,
  mask,
  pattern,
  defaultValue,
} from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        hint,
        help,
        placeholder,
        autocomplete,
        default: defaultValue,
        mask,
        pattern,
      },
    },
    {
      'field:type': 'Phone',
      'autocomplete': 'phone',
      'mask': '\\+1 \\(999\\) 999-9999',
      'elementInput': {
        type: 'tel',
      },
    },
  ]
}
