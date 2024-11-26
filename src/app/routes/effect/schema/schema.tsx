import { Schema as S, Either, ParseResult } from 'effect'

const TrimmedString = S.transform(S.String, S.String, {
  decode: (s) => s.trim(),
  encode: (s) => s,
})

const SimpleSchema = S.Struct({
  id: S.String,
  title: TrimmedString.pipe(
    S.filter((s) => (s.trim() !== s ? 'Value must be trimmed' : undefined)),
    S.minLength(4, {
      message: (parseIssue) =>
        `Value must be at least 4 characters long, get ${parseIssue.actual}`,
    }),
  ),
  isActive: S.Boolean,
})

const StringNumber = S.transform(S.String, S.NonNaN, {
  decode: (s) => Number(s),
  encode: (n) => n.toString(),
})

const JsonSchema = S.transformOrFail(S.String, S.Unknown, {
  decode: (s, _options, ast) =>
    ParseResult.try({
      try: (): unknown => JSON.parse(s),
      catch: (error) =>
        new ParseResult.Type(
          ast,
          s,
          error instanceof Error ? error.message : 'Failed to parse JSON',
        ),
    }),
  encode: (u, _options, ast) =>
    ParseResult.try({
      try: (): string => JSON.stringify(u),
      catch: (error) =>
        new ParseResult.Type(
          ast,
          u,
          error instanceof Error ? error.message : 'Failed to parse JSON',
        ),
    }),
})

const MetadataSchema = S.Struct({
  width: S.NonNaN.pipe(S.compose(S.Int), S.positive()),
  height: S.NonNaN.pipe(S.compose(S.Int), S.positive()),
})

const ComposedSchema = JsonSchema.pipe(S.compose(MetadataSchema))

const MetadataSchemaV1 = S.Struct({
  version: S.Literal(1),
  width: S.NonNaN.pipe(S.compose(S.Int), S.positive()),
  height: S.NonNaN.pipe(S.compose(S.Int), S.positive()),
})

const MetadataSchemaV2 = S.Struct({
  version: S.Literal(2),
  width: S.NonNaN.pipe(S.compose(S.Int), S.positive()),
  height: S.NonNaN.pipe(S.compose(S.Int), S.positive()),
  depth: S.NonNaN.pipe(S.compose(S.Int), S.positive()),
})

const ComposedSchema2 = JsonSchema.pipe(
  S.compose(S.Union(MetadataSchemaV1, MetadataSchemaV2)),
)

// const TableItemSchema = S.Struct({
//   id: S.Number,
//   title: S.String,
//   completed: S.Boolean,
//   created_at: S.String,
//   updated_at: S.String,
// }).pipe(
//   S.rename({
//     created_at: 'createdAt',
//     updated_at: 'updatedAt',
//   }),
// )

// const ResponseSchema = S.transform(
//   S.Struct({
//     items: S.Array(TableItemSchema),
//   }),
//   S.typeSchema(S.Array(TableItemSchema)),
//   {
//     strict: true,
//     decode: (response) => response.items,
//     encode: (items) => ({ items }),
//   },
// )

const a = S.decodeSync(SimpleSchema)({
  id: '1',
  title: 'My first schema',
  isActive: true,
})
console.log(a)

const c = S.decodeUnknownEither(SimpleSchema)({
  id: '1',
  title: 'My first schema',
})
if (Either.isRight(c)) {
  console.log(c.right.title)
} else {
  console.log(c.left.message)
}

const d = S.decodeUnknownSync(SimpleSchema)({
  id: '1',
  title: 'abcd',
  isActive: true,
})
console.log(d)

console.log(S.decodeUnknownSync(StringNumber)('123'))
console.log(S.encodeUnknownSync(StringNumber)(123))

const obj = S.decodeUnknownSync(JsonSchema)('{"foo":"bar"}')
console.log(S.encodeUnknownSync(JsonSchema)(obj))

const e = S.decodeEither(ComposedSchema)('{"width":100,"height":200}')
if (Either.isRight(e)) {
  console.log(e.right)
} else {
  console.log(e.left.message)
}

const f = S.decodeEither(ComposedSchema2)(
  '{"version":2,"width":100,"height":200,"depth":10}',
)
if (Either.isRight(f)) {
  console.log(f.right)
} else {
  console.log(f.left.message)
}

export const SchemaRoute = () => {
  return <div>asdfsaf</div>
}
