import type { Schema } from '@tarcltd/form-vue'
import { hint, help, placeholder, defaultValue } from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        hint,
        help,
        placeholder,
        default: {
          ...defaultValue,
          enum: ['Yes', 'No'],
        },
      },
    },
    {
      default: 'No',
      ui: 'USelectMenu',
    },
  ]
}
