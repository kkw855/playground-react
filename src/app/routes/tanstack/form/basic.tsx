import { useForm } from '@tanstack/react-form'

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

export const BasicRoute = () => {
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Creating a form</CardDescription>
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
            name="username"
            validators={{
              // 0.5 초 후에 유효성 검사
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: ({ value }) => {
                return (
                  value.length < 3 &&
                  'Username must be at least 3 characters long'
                )
              },
            }}
            children={(field) => (
              <div>
                <Label htmlFor={field.name}>Username</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors && (
                  <div
                    className="mt-1 text-sm text-destructive"
                    role="alert"
                    aria-label={field.state.meta.errors.join(',')}
                  >
                    {field.state.meta.errors.join(',')}
                  </div>
                )}
              </div>
            )}
          />
          <form.Field
            name="password"
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: ({ value }) => {
                if (value.length < 6) {
                  return 'Password must be at least 6 characters long'
                }
                if (!/[A-Z]/.test(value)) {
                  return 'Passwords must contain at least one uppercase letter'
                }
                if (!/[a-z]/.test(value)) {
                  return 'Passwords must contain at least one lowercase letter'
                }
                if (!/[0-9]/.test(value)) {
                  return 'Passwords must contain at least one number'
                }
              },
            }}
            children={(field) => (
              <div>
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors && (
                  <div
                    className="mt-1 text-sm text-destructive"
                    role="alert"
                    aria-label={field.state.meta.errors.join(',')}
                  >
                    {field.state.meta.errors.join(',')}
                  </div>
                )}
              </div>
            )}
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button onClick={form.handleSubmit}>Sign Up</Button>
      </CardFooter>
    </Card>
  )
}
