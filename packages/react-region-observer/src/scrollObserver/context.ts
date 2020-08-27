import {createContext} from 'react'

export interface ScrollObserverState {
  x: number
  y: number
}

export const ScrollObserverContext = createContext<ScrollObserverState | null>(null)
