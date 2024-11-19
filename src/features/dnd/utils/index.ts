import { Array, Data, Equal } from 'effect'

import type { Coord, PieceRecord, PieceType } from '@/features/dnd/types'

export function isEqualCoord(c1: Coord, c2: Coord): boolean {
  return Equal.equals(Data.array(c1), Data.array(c2))
}

export function isCoord(token: unknown): token is Coord {
  return (
    Array.isArray(token) &&
    token.length === 2 &&
    token.every((val) => typeof val === 'number')
  )
}

const pieceTypes: PieceType[] = ['king', 'pawn']

export function isPieceType(value: unknown): value is PieceType {
  return typeof value === 'string' && pieceTypes.includes(value as PieceType)
}

export function canMove(
  start: Coord,
  destination: Coord,
  pieceType: PieceType,
  pieces: PieceRecord[],
) {
  const rowDist = Math.abs(start[0] - destination[0])
  const colDist = Math.abs(start[1] - destination[1])

  if (pieces.find((piece) => isEqualCoord(piece.location, destination))) {
    return false
  }

  switch (pieceType) {
    case 'king':
      return [0, 1].includes(rowDist) && [0, 1].includes(colDist)
    case 'pawn':
      return colDist === 0 && start[0] - destination[0] === -1
    default:
      return false
  }
}
