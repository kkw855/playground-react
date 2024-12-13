import { FieldMeta, useForm } from '@tanstack/react-form'
import { ZodValidator, zodValidator } from '@tanstack/zod-form-adapter'
import { X } from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/components/cn/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/cn/card'
import { Input } from '@/components/cn/input'
import { Label } from '@/components/cn/label'

const createUserInputSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .regex(/^[A-Z]/, 'Name must start with a capital letter'),
  surname: z.string().min(3, 'Surname must be at least 3 characters'),
  interests: z
    .array(
      z.object({
        name: z.string().min(1, 'Skill name is required'),
        score: z
          .number()
          .int()
          .min(0, 'Score must be a positive number')
          .max(10, "Score can't be higher than 10"),
      }),
    )
    .min(1, 'At least one skill is required'),
})
type CreateUserInput = z.infer<typeof createUserInputSchema>

// TODO: tanstack form Effect Schema 지원 기능 추가 확인
// const createUserInputSchema = S.Struct({
//   name: S.String,
//   surname: S.String,
//   interests: S.Array(
//     S.Struct({
//       name: S.String,
//       score: S.Number,
//     }),
//   ),
// })
// type CreateUserInput = S.Schema.Type<typeof createUserInputSchema>

const FieldInfo = ({ fieldMeta }: { fieldMeta: FieldMeta }) => {
  if (!fieldMeta || !fieldMeta.errors.length) return null

  return (
    <div
      className="mt-1 text-sm text-destructive"
      role="alert"
      aria-label={fieldMeta.errors.toString()}
    >
      {fieldMeta.errors}
    </div>
  )
}

export const Basic2Route = () => {
  const form = useForm<CreateUserInput, ZodValidator>({
    defaultValues: {
      name: '',
      surname: '',
      interests: [],
    },
    validatorAdapter: zodValidator({
      transformErrors: (errors) => {
        return errors[0].message
      },
    }),
    validators: {
      onChange: createUserInputSchema,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Hello!</CardTitle>
        <CardDescription>Validating a form</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <form.Field
            name="name"
            children={(field) => (
              <div>
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo fieldMeta={field.state.meta} />
              </div>
            )}
          />
          <form.Field
            name="surname"
            children={(field) => (
              <div>
                <Label htmlFor={field.name}>Surname</Label>
                <Input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo fieldMeta={field.state.meta} />
              </div>
            )}
          />
          <form.Field
            name="interests"
            mode="array"
            children={(field) => (
              <div className="flex flex-col gap-2">
                <Label>Skills</Label>
                {field.state.value.map((_, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex gap-2">
                      <form.Field
                        name={`interests[${index}].name`}
                        children={(subField) => (
                          <Input
                            type="text"
                            value={subField.state.value}
                            onChange={(e) =>
                              subField.handleChange(e.target.value)
                            }
                          />
                        )}
                      />
                      <form.Field
                        name={`interests[${index}].score`}
                        children={(subField) => (
                          <Input
                            className="w-16"
                            type="number"
                            min={0}
                            max={10}
                            value={subField.state.value}
                            onChange={(e) =>
                              subField.handleChange(e.target.valueAsNumber)
                            }
                          />
                        )}
                      />
                      <Button
                        variant="destructive"
                        onClick={() => field.removeValue(index)}
                      >
                        <X />
                      </Button>
                    </div>
                    <form.Subscribe
                      selector={(state) =>
                        state.fieldMeta[`interests[${index}].name`]
                      }
                      children={(fieldMeta) => (
                        <FieldInfo fieldMeta={fieldMeta} />
                      )}
                    />
                  </div>
                ))}
                <FieldInfo fieldMeta={field.state.meta} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => field.pushValue({ name: '', score: 0 })}
                >
                  Add
                </Button>
              </div>
            )}
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => form.reset()} variant="destructive">
          Reset
        </Button>
        <Button onClick={form.handleSubmit}>Save</Button>
      </CardFooter>
    </Card>
  )
}
