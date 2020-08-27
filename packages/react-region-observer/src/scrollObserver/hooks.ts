import {useContext} from 'react'
import {ScrollObserverContext} from './context'

export function useScroll() {
  const scroll = useContext(ScrollObserverContext)

  if (!scroll) {
    throw new Error('ScrollObserver: missing context value')
  }

  return scroll
}
