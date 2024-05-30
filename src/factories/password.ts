import type { Schema } from '@tarcltd/form-vue'
import {
  hint,
  help,
  placeholder,
  autocomplete,
  minLength,
  pattern,
} from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        hint,
        help,
        placeholder,
        autocomplete,
        minLength,
        pattern,
      },
    },
    {
      'autocomplete': 'current-password',
      'field:type': 'password',
    },
  ]
}
