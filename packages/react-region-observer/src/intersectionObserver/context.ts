import {createContext} from 'react'
// import {IntersectionObserverEntry} from './types'

export interface IntersectionObserverContextInterface<Payload> {
  // entries: IntersectionObserverEntry<Payload>[]
  observe: (el: HTMLElement | SVGElement, payload?: Payload) => void
  unobserve: (el: HTMLElement | SVGElement) => void
}

export const IntersectionObserverContext = createContext<IntersectionObserverContextInterface<
  unknown
> | null>(null)
