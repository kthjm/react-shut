import createShut from './createShut.jsx'
import {
  seedFromBottom,
  seedFromLeft,
  seedFromRight,
  seedFromTop
} from './seeds'

export const ShutFromBottom = createShut(seedFromBottom)
export const ShutFromLeft = createShut(seedFromLeft)
export const ShutFromRight = createShut(seedFromRight)
export const ShutFromTop = createShut(seedFromTop)
