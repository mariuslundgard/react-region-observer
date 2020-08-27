import React, {useEffect, useMemo, useState} from 'react'
import {IntersectionObserverContext} from './context'
import {createIntersectionObserver} from './observer'
import {IntersectionObserverEntry} from './types'

interface IntersectionObserverProps {
  children: (ref: (el: HTMLElement | null) => void) => React.ReactNode
  onChange?: (entries: IntersectionObserverEntry<any>[]) => void
  rootMargin?: string
}

export function IntersectionObserver(props: IntersectionObserverProps) {
  const {children, onChange, rootMargin} = props
  const observer = useMemo(() => createIntersectionObserver({rootMargin}), [rootMargin])
  // const [entries, setEntries] = useState<IntersectionObserverEntry[]>([])

  useEffect(
    () =>
      observer.subscribe((entries) => {
        if (onChange) onChange(entries)
        // setEntries
      }),
    [observer]
  )

  return (
    <IntersectionObserverContext.Provider
      value={{
        // entries,
        observe: observer.observe,
        unobserve: observer.unobserve,
      }}
    >
      {children(observer.setRootElement)}
    </IntersectionObserverContext.Provider>
  )
}
