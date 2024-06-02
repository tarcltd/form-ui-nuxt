import type useForm from '@tarcltd/form-vue'
import type { Schema } from '@tarcltd/form-vue'

export default function (
  input?: ReturnType<typeof useForm>['input'],
): () => [Partial<Schema>, Record<string, unknown>] {
  // TODO: Specify trigger type
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const triggers = (input?.metadata?.triggers ?? []).map((_: any, index: number) => `Trigger ${index + 1}`)
  const groups = new Set<string>()

  for (const key in input?.properties) {
    if (typeof input?.properties[key]?.attrs?.group === 'string') {
      groups.add(input.properties[key].attrs.group)
    }
  }

  return () => [
    {
      properties: {
        trigger: {
          type: 'string',
          name: 'Trigger',
          enum: triggers,
        },
        group: {
          type: 'string',
          name: 'Group',
          enum: groups,
          attrs: {
            help: 'Combine two trigger conditions using "And" or "Or". "And results in a trigger only firing if both conditions are met. "Or" results in a trigger firing if either condition is met.',
          },
        },
        action: {
          type: 'string',
          name: 'Action',
          enum: [
            'Toggle visibility',
            'Toggle required',
          ],
        },
      },
      required: ['trigger', 'group', 'action'],
    },
    {
      'field:type': 'Action',
      'trigger': triggers[0],
      'group': Array.from(groups.values())[0],
      'action': 'Toggle visibility',
    },
  ]
}
