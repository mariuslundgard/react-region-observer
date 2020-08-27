export interface Intersection {
  isAbove: boolean
  isBelow: boolean
  isVisible: boolean
}

export interface IntersectionObserverEntry<Payload = unknown> {
  intersection: Intersection
  payload: Payload
}

export type IntersectionsSubscriber = (regions: IntersectionObserverEntry[]) => void
