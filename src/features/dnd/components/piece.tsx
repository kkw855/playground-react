import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useEffect, useRef, useState } from 'react'
import invariant from 'tiny-invariant'

import { cn } from '@/utils/cn'

import type { Coord, PieceType } from '../types'

export const Piece = ({
  location,
  pieceType,
  image,
  alt,
}: {
  location: Coord
  pieceType: PieceType
  image: string
  alt: string
}) => {
  const ref = useRef(null)
  const [dragging, setDragging] = useState<boolean>(false)

  useEffect(() => {
    const el = ref.current
    invariant(el)

    // register an HTMLElement as being draggable
    return draggable({
      element: el,
      getInitialData: () => ({ location, pieceType }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    })
  }, [location, pieceType])

  return (
    <img
      ref={ref}
      draggable={false}
      className={cn(
        { 'opacity-40': dragging },
        'size-11 rounded-md p-1 shadow-md hover:bg-[rgba(168,168,168,0.25)]',
      )}
      src={image}
      alt={alt}
    />
  )
}
