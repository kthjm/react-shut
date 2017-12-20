// @flow
import createShut from './createShut.jsx'
import {
  seedFromTop,
  seedFromBottom,
  seedFromLeft,
  seedFromRight
} from './seeds.js'
export const ShutFromTop = createShut(seedFromTop)
export const ShutFromBottom = createShut(seedFromBottom)
export const ShutFromLeft = createShut(seedFromLeft)
export const ShutFromRight = createShut(seedFromRight)
