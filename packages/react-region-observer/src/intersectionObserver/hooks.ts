import {useContext} from 'react'
import {IntersectionObserverContext, IntersectionObserverContextInterface} from './context'

export function useIntersectionObserver<Payload = unknown>() {
  const ctx = useContext(IntersectionObserverContext) as IntersectionObserverContextInterface<
    Payload
  > | null

  if (!ctx) {
    throw new Error('IntersectionObserver: missing context')
  }

  // ctx.entries

  return ctx
}
