import { ValidationError } from '@tanstack/react-form'
import {
  ParseResult,
  Schema,
  Effect,
  Either,
  Exit,
  ManagedRuntime,
  Layer,
} from 'effect'

// TODO: 아직 Tanstack form 에서 Effect schema 지원 안 함 (https://gist.github.com/jessekelly881/382b13e9f2de83f051e0421c22930e91)
export const createValidator = <R, E>(layer: Layer.Layer<R, E, never>) => {
  const runtime = ManagedRuntime.make(layer)

  return {
    effectValidator: () => () => ({
      validate(
        { value }: { value: unknown },
        schema: Schema.Schema<any, any>,
      ): ValidationError {
        const result = Schema.decodeUnknownEither(schema)(value)
        if (Either.isLeft(result)) {
          return ParseResult.ArrayFormatter.formatErrorSync(result.left)
            .map((e) => e.message)
            .join('\n') // must be joined into 1 string
        }
        return
      },
      async validateAsync(
        { value }: { value: unknown },
        schema: Schema.Schema<any, any, R>,
      ): Promise<ValidationError> {
        const exit = await Schema.decodeUnknown(schema)(value).pipe(
          Effect.flip,
          Effect.flatMap(ParseResult.ArrayFormatter.formatError),
          Effect.map((es) => es.map((e) => e.message).join('\n')), // must be joined into 1 string
          runtime.runPromiseExit,
        )

        return Exit.getOrElse(exit, () => undefined)
      },
    }),
  }
}

export type EffectValidator = ReturnType<typeof effectValidator>

export const { effectValidator } = createValidator(Layer.empty)
