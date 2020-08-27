import {useContext} from 'react'
import {RectObserverContext, RectObserverContextInterface} from './context'

export function useRectObserver<Payload = unknown>() {
  const ctx = useContext(RectObserverContext) as RectObserverContextInterface<Payload> | null

  if (!ctx) {
    throw new Error('RectObserver: missing context')
  }

  return ctx
}
