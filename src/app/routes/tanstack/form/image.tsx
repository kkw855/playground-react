import { FieldMeta, useForm } from '@tanstack/react-form'
import { zodValidator, ZodValidator } from '@tanstack/zod-form-adapter'
import axios from 'axios'
import { z } from 'zod'

import { Button } from '@/components/cn/button'
import { Input } from '@/components/cn/input'
import { Label } from '@/components/cn/label'

import DefaultImage from './upload-photo-here.png'

const schema = z.object({
  image: z.custom<FileList>().superRefine((val, ctx) => {
    if (val && val.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'image is required',
        fatal: true,
      })

      return z.NEVER
    }

    if (val[0].size > 1024 * 300) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Max image size is 300KB',
        fatal: true,
      })
    }
  }),
  imageUrl: z.string(),
})

type Schema = z.infer<typeof schema>

export const ImageRoute = () => {
  console.log(DefaultImage, DefaultImage.toString())

  const form = useForm<Schema, ZodValidator>({
    defaultValues: {
      image: new DataTransfer().files,
      imageUrl: DefaultImage,
    },
    validatorAdapter: zodValidator(),
    validators: {
      onMount: schema,
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      console.log('onSubmit', value)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(1)
        }, 5000)
      })
    },
  })

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    // TODO: Try exception
    const response = await axios.post<{
      originalName: string
      filename: string
      location: string
    }>('https://api.escuelajs.co/api/v1/files/upload', formData)
    console.log('response', response)

    if (response.status === 201) {
      console.log('Upload success')
      form.setFieldValue('imageUrl', response.data.location)
    } else {
      console.log('Upload failure')
      form.setFieldValue('imageUrl', DefaultImage)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.Field
        name="imageUrl"
        children={(field) => (
          <img
            src={field.state.value}
            alt="upload"
            className="size-96 rounded-full"
          />
        )}
      />
      <form.Field
        name="image"
        children={(field) => (
          <div>
            <Input
              className="hidden"
              id={field.name}
              type="file"
              accept=".jpg, .jpeg, .png"
              onBlur={field.handleBlur}
              onChange={async (e) => {
                const fileList: FileList = e.target.files!

                field.handleChange(fileList)
                const errors = await field.validate('change')

                console.log('onChange', fileList, errors)

                if (fileList?.[0] && errors.length === 0) {
                  await handleImageUpload(fileList[0])
                }
              }}
            />
            <Button type="button" className="cursor-pointer">
              <Label htmlFor={field.name}>choose your image</Label>
            </Button>
            <FieldInfo fieldMeta={field.state.meta} />
          </div>
        )}
      />
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" isLoading={isSubmitting} disabled={!canSubmit}>
            Submit
          </Button>
        )}
      />
    </form>
  )
}

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
