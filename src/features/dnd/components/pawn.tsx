import { Piece } from '@/features/dnd/components/piece'

import pawn from '../assets/pawn.png'
import { type Coord } from '../types'

export const Pawn = ({ location }: { location: Coord }) => {
  return <Piece location={location} pieceType="pawn" image={pawn} alt="Pawn" />
}
