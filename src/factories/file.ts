import type { Schema } from '@tarcltd/form-vue'
import {
  hint,
  help,
  placeholder,
  multiple,
  accept,
  defaultValue,
  visible,
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
        visible,
      },
    },
    {
      'field:type': 'File',
      'multiple': false,
      'minLength': 1,
      'elementInput': {
        type: 'file',
      },
    },
  ]
}
