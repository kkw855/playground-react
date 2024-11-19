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

  return <RouterProvider router={router} />
}
