export type Coord = [number, number]

export type PieceType = 'king' | 'pawn'

export type PieceRecord = {
  type: PieceType
  location: Coord
}
