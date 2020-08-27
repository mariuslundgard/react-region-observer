import React, {createElement, useEffect, useRef} from 'react'
import {useIntersectionObserver} from './hooks'

interface IntersectionObserverRegionProps {
  as?: React.ElementType | keyof JSX.IntrinsicElements
  children: React.ReactNode
  payload?: unknown
}

export function IntersectionObserverRegion(
  props: IntersectionObserverRegionProps & React.HTMLProps<HTMLDivElement>
) {
  const {as = 'div', children, payload, ...restProps} = props
  const ref = useRef<HTMLElement | null>(null)
  const {observe, unobserve} = useIntersectionObserver()

  useEffect(() => {
    if (ref.current) observe(ref.current, payload)

    return () => {
      if (ref.current) unobserve(ref.current)
    }
  }, [])

  return createElement(as, {...restProps, ref: ref as any}, children)
}
