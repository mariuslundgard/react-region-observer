import React, {useEffect, useState} from 'react'
import {ScrollObserverContext} from './context'

export interface ScrollState {
  x: number
  y: number
}

interface ScrollObserverProviderProps {
  children?: React.ReactNode
  onChange?: (state: ScrollState) => void
}

function getWindowScroll() {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  }
}

export function ScrollObserverProvider({children, onChange}: ScrollObserverProviderProps) {
  const [state, setState] = useState<ScrollState>(
    typeof window === 'undefined' ? getWindowScroll() : {x: window.scrollX, y: window.scrollX}
  )

  useEffect(() => {
    const handleWindowScroll = () => {
      const state = getWindowScroll()
      console.log('scroll', state)

      setState(state)
      if (onChange) onChange(state)
    }

    window.addEventListener('scroll', handleWindowScroll)

    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [onChange])

  return <ScrollObserverContext.Provider value={state}>{children}</ScrollObserverContext.Provider>
}
