import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { Array } from 'effect'
import { ReactElement, useEffect, useState } from 'react'

import { King } from '@/features/dnd/components/king'
import { Pawn } from '@/features/dnd/components/pawn'
import { Square } from '@/features/dnd/components/square'
import {
  canMove,
  isCoord,
  isEqualCoord,
  isPieceType,
} from '@/features/dnd/utils'

import type { Coord, PieceRecord, PieceType } from '../types'

const pieceLookup: {
  [Key in PieceType]: (location: Coord) => ReactElement
} = {
  king: (location) => <King location={location} />,
  pawn: (location) => <Pawn location={location} />,
}

const renderSquares = (pieces: PieceRecord[]) =>
  Array.range(0, 7).flatMap((row) =>
    Array.range(0, 7).map((col) => {
      const squareCoord: Coord = [row, col]

      const piece = pieces.find((piece) =>
        isEqualCoord(piece.location, squareCoord),
      )

      return (
        <Square key={`${row}-${col}`} pieces={pieces} location={squareCoord}>
          {piece && pieceLookup[piece.type](squareCoord)}
        </Square>
      )
    }),
  )

export const ChessBoard = () => {
  const [pieces, setPieces] = useState<PieceRecord[]>([
    { type: 'king', location: [3, 2] },
    { type: 'pawn', location: [1, 6] },
  ])

  useEffect(() => {
    // allow you to observe drag and drop interactions from anywhere in your codebase
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0]
        if (!destination) {
          // if dropped outside any drop targets
          return
        }
        const destinationLocation = destination.data.location
        const sourceLocation = source.data.location
        const pieceType = source.data.pieceType

        if (
          // type guarding
          !isCoord(destinationLocation) ||
          !isCoord(sourceLocation) ||
          !isPieceType(pieceType)
        ) {
          return
        }

        const piece = pieces.find((p) =>
          isEqualCoord(p.location, sourceLocation),
        )
        const restOfPieces = pieces.filter((p) => p !== piece)

        if (
          canMove(sourceLocation, destinationLocation, pieceType, pieces) &&
          piece !== undefined
        ) {
          setPieces([
            { type: piece.type, location: destinationLocation },
            ...restOfPieces,
          ])
        }
      },
    })
  }, [pieces])

  return (
    <div className="grid size-[500px] grid-cols-8 grid-rows-8 border-2 border-gray-300">
      {renderSquares(pieces)}
    </div>
  )
}
