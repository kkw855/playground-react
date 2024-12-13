import { useMemo } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const createAppRouter = () =>
  createBrowserRouter(
    [
      {
        path: '/',
        lazy: async () => {
          const { HomeRoute } = await import('./routes/home')
          return { Component: HomeRoute }
        },
      },
      {
        path: '/tanstack/form/image',
        lazy: async () => {
          const { ImageRoute } = await import('./routes/tanstack/form/image')
          return { Component: ImageRoute }
        },
      },
      {
        path: '/form2',
        lazy: async () => {
          const { Basic2Route } = await import('./routes/tanstack/form/basic2')
          return { Component: Basic2Route }
        },
      },
      {
        path: '/form',
        lazy: async () => {
          const { BasicRoute } = await import('./routes/tanstack/form/basic')
          return { Component: BasicRoute }
        },
      },
      {
        path: '/rhf',
        lazy: async () => {
          const { NestedArrayRoute } = await import('./routes/rhf/nested-array')
          return { Component: NestedArrayRoute }
        },
      },
      {
        path: '/schema',
        lazy: async () => {
          const { SchemaRoute } = await import('./routes/effect/schema/schema')
          return { Component: SchemaRoute }
        },
      },
      {
        path: '/dnd',
        lazy: async () => {
          const { DndRoute } = await import('./routes/dnd/dnd')
          return { Component: DndRoute }
        },
      },
    ],
    {
      future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
      },
    },
  )

export const AppRouter = () => {
  const router = useMemo(() => {
    return createAppRouter()
  }, [])

  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  )
}
