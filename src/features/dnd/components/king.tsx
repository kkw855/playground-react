import king from '../assets/king.png'
import type { Coord } from '../types'

import { Piece } from './piece'

export const King = ({ location }: { location: Coord }) => {
  return <Piece location={location} pieceType="king" image={king} alt="King" />
}
