import { X } from 'lucide-react'
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form'

import { Button } from '@/components/cn/button'

type Child = {
  name: string
}

type Field = {
  name: string
  scrim: Child[]
}

type FormValues = {
  rounds: Field[]
}

const Children = ({ fieldIndex }: { fieldIndex: number }) => {
  const { register } = useFormContext()
  const {
    fields: children,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray<FormValues>({
    name: `rounds.${fieldIndex}.scrim` as const,
  })

  return (
    <fieldset className="mt-2 border-2 p-4">
      <legend>Children</legend>
      {/* Level 2 */}
      {children.map((child, index) => (
        <section
          key={child.id}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}
        >
          <input
            className="border"
            {...register(`rounds.${fieldIndex}.scrim.${index}.name` as const)}
          />
          <button type="button" onClick={() => removeChild(index)}>
            Remove
          </button>
        </section>
      ))}
      <button type="button" onClick={() => appendChild({ name: '' })}>
        Append Child
      </button>
    </fieldset>
  )
}

export const NestedArrayRoute = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      rounds: [{ name: 'One', scrim: [{ name: 'Child' }] }],
    },
  })
  const { control, handleSubmit, register } = form
  const {
    fields,
    append: appendField,
    remove: removeField,
  } = useFieldArray({
    control,
    name: 'rounds',
  })

  return (
    <FormProvider {...form}>
      <form
        className="space-y-4 p-8"
        onSubmit={handleSubmit((values) => console.log(values))}
      >
        <Button onClick={() => appendField({ name: '', scrim: [] })}>
          Append Field
        </Button>
        {/* Level 1 */}
        {fields.map((field, index) => (
          <fieldset key={field.id} className="border-2 p-4">
            <legend>Field {index}</legend>
            <div className="flex justify-between">
              <input
                className="border"
                {...register(`rounds.${index}.name` as const)}
              />
              {index !== 0 && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeField(index)}
                >
                  <X />
                </Button>
              )}
            </div>
            <Children fieldIndex={index} />
          </fieldset>
        ))}
        <div className="flex justify-center">
          <Button>Submit</Button>
        </div>
      </form>
    </FormProvider>
  )
}
