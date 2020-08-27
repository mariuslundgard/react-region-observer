import {createContext} from 'react'
// import {RectObserverEntry} from './types'

export interface RectObserverContextInterface<Payload> {
  // entries: RectObserverEntry<Payload>[]
  observe: (el: HTMLElement | SVGElement, payload?: Payload) => void
  unobserve: (el: HTMLElement | SVGElement) => void
}

export const RectObserverContext = createContext<RectObserverContextInterface<unknown> | null>(null)
