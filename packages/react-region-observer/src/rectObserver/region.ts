import React, {createElement, useEffect, useRef} from 'react'
import {useRectObserver} from './hooks'

interface RectObserverRegionProps {
  as?: React.ElementType | keyof JSX.IntrinsicElements
  children: React.ReactNode
  payload?: unknown
}

export function RectObserverRegion(
  props: RectObserverRegionProps & React.HTMLProps<HTMLDivElement>
) {
  const {as = 'div', children, payload, ...restProps} = props
  const ref = useRef<HTMLElement | null>(null)
  const {observe, unobserve} = useRectObserver()

  useEffect(() => {
    if (ref.current) observe(ref.current, payload)

    return () => {
      if (ref.current) unobserve(ref.current)
    }
  }, [])

  return createElement(as, {...restProps, ref: ref as any}, children)
}
