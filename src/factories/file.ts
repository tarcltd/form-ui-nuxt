import type { Schema } from '@tarcltd/form-vue'
import {
  hint,
  help,
  placeholder,
  multiple,
  accept,
  defaultValue,
} from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        hint,
        help,
        placeholder,
        default: defaultValue,
        multiple,
        accept,
      },
    },
    {
      'field:type': 'File',
      'multiple': false,
      'elementInput': {
        type: 'file',
      },
    },
  ]
}
