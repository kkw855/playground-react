import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { ReactNode, useEffect, useRef, useState } from 'react'
import invariant from 'tiny-invariant'

import {
  canMove,
  isCoord,
  isEqualCoord,
  isPieceType,
} from '@/features/dnd/utils'
import { cn } from '@/lib/cn'

import type { Coord, PieceRecord } from '../types'

type HoveredState = 'idle' | 'validMove' | 'invalidMove'

export const Square = ({
  pieces,
  location,
  children,
}: {
  pieces: PieceRecord[]
  location: Coord
  children: ReactNode
}) => {
  const ref = useRef(null)
  const [state, setState] = useState<HoveredState>('idle')

  useEffect(() => {
    const el = ref.current
    invariant(el)

    // register drop target
    return dropTargetForElements({
      element: el,
      // send data to monitor
      getData: () => ({ location }),
      canDrop: ({ source }) => {
        if (!isCoord(source.data.location)) {
          return false
        }

        return !isEqualCoord(source.data.location, location)
      },
      onDragEnter: ({ source }) => {
        // the source is the piece being dragged over the drop target
        if (
          // type guards
          !isCoord(source.data.location) ||
          !isPieceType(source.data.pieceType)
        ) {
          return
        }

        if (
          canMove(source.data.location, location, source.data.pieceType, pieces)
        ) {
          setState('validMove')
        } else {
          setState('invalidMove')
        }
      },
      onDragLeave: () => setState('idle'),
      onDrop: () => setState('idle'),
    })
  }, [location, pieces])

  const isDark = (location[0] + location[1]) % 2 === 1

  return (
    <div
      ref={ref}
      className={cn(
        {
          'bg-green-400': state === 'validMove',
          'bg-rose-400': state === 'invalidMove',
          'bg-stone-200': state === 'idle' && isDark,
          'bg-white': state === 'idle' && !isDark,
        },
        'size-full flex justify-center items-center',
      )}
    >
      {children}
    </div>
  )
}
