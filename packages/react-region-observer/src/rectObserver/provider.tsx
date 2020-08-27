import React, {useEffect, useMemo, useState} from 'react'
import {RectObserverContext} from './context'
import {createRectObserver} from './observer'
import {RectObserverEntry} from './types'

interface RectObserverProps {
  children?: (ref: (el: HTMLElement | null) => void) => React.ReactNode
  onChange?: (entries: RectObserverEntry[]) => void
}

export function RectObserver({children: renderChildren, onChange}: RectObserverProps) {
  const observer = useMemo(() => createRectObserver(), [])
  // const [entries, setEntries] = useState<RectObserverEntry[]>([])

  useEffect(
    () =>
      observer.subscribe((entries) => {
        // setEntries(entries)
        if (onChange) onChange(entries)
      }),
    [observer]
  )

  return (
    <RectObserverContext.Provider
      value={{
        // entries,
        observe: observer.observe,
        unobserve: observer.unobserve,
      }}
    >
      {renderChildren && renderChildren(observer.setRootElement)}
    </RectObserverContext.Provider>
  )
}
