import type useForm from '@tarcltd/form-vue'
import { type Schema } from '@tarcltd/form-vue'
import { defu } from 'defu'
import { description, group, label, required } from '../builder'
import text from './text'
import textarea from './textarea'
import number from './number'
import email from './email'
import phone from './phone'
import password from './password'
import date from './date'
import time from './time'
import datetime from './datetime'
import yesNo from './yesNo'
import boolean from './boolean'
import checkbox from './checkbox'
import file from './file'
import image from './image'
import url from './url'
import uuid from './uuid'
import trigger from './trigger'
import radio from './radio'
import quantity from './quantity'
import select from './select'

export const factoryDefaults = {
  type: 'object',
  properties: {
    label,
    required,
    group,
    description,
  },
  required: ['inputType', 'label', 'required', 'group'],
} satisfies Schema

export function generateFactories(
  input?: ReturnType<typeof useForm>['input'],
): Record<string, () => [Partial<Schema>, Record<string, unknown>]> {
  return {
    'Text': text,
    'Textarea': textarea,
    'Number': number,
    'Email': email,
    'Phone': phone,
    'Password': password,
    'Select': select,
    'Quantity': quantity,
    'Radio': radio,
    'Date': date,
    'Time': time,
    'Datetime': datetime,
    'Yes / No': yesNo,
    'Boolean': boolean,
    'Checkbox': checkbox,
    'File': file,
    'Image': image,
    'Trigger': trigger(
      Object.values(input?.properties ?? {}).map(field => field.name),
    ),
    'URL': url,
    'UUID': uuid,
  }
}

export function generateSchema(
  inputType: keyof ReturnType<typeof generateFactories> | string | null,
  input?: ReturnType<typeof useForm>['input'],
): [Schema, Record<string, unknown>] | null {
  if (typeof inputType !== 'string') {
    return null
  }

  const schemaFactory
    = generateFactories(input)[
      inputType as keyof ReturnType<typeof generateFactories>
    ]

  if (typeof schemaFactory !== 'function') {
    return null
  }

  const subschema = schemaFactory()

  if (subschema[1]['field:type'] === 'trigger') {
    return [
      defu(subschema[0], {
        type: 'object',
        properties: {},
        required: [],
      } satisfies Schema),
      defu(subschema[1], {
        order: -1,
        group: 'trigger',
      }),
    ]
  }

  return [
    defu(subschema[0], factoryDefaults),
    defu(subschema[1], {
      required: true,
      order: Object.keys(input?.properties ?? {}).length + 1,
      group: 'main',
    }),
  ]
}

export default generateSchema
