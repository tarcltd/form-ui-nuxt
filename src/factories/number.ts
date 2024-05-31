import type { Schema } from '@tarcltd/form-vue'
import {
  hint,
  help,
  placeholder,
  autocomplete,
  min,
  max,
  multipleOf,
  defaultValue,
  step,
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
        min,
        max,
        step,
        multipleOf,
      },
    },
    {
      'field:type': 'Number',
      'type': 'number',
      'autocomplete': 'off',
      'elementInput': {
        type: 'number',
      },
    },
  ]
}
