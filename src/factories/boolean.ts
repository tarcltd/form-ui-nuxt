import type { Schema } from '@tarcltd/form-vue'
import { hint, help, placeholder, defaultValue, visible } from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        hint,
        help,
        placeholder,
        default: {
          ...defaultValue,
          enum: ['True', 'False'],
        },
        visible,
      },
      required: ['defaultValue'],
    },
    {
      'field:type': 'Boolean',
      'type': 'boolean',
      'default': 'False',
    },
  ]
}
