import {
  IntersectionObserverEntry as IntersectionObserverEntryType,
  IntersectionsSubscriber,
} from './types'

interface IntersectionObserverOpts {
  rootMargin?: string
}

export function createIntersectionObserver(opts: IntersectionObserverOpts = {}) {
  console.log('IntersectionObserver', opts)

  const {rootMargin} = opts
  const subscribers: IntersectionsSubscriber[] = []
  const observedElements: (HTMLElement | SVGElement)[] = []
  const payloadMap = new WeakMap<HTMLElement | SVGElement, unknown | undefined>()

  let io: IntersectionObserver
  let rootElement: Element | null = null
  let regions: IntersectionObserverEntryType[] = []

  return {observe, setRootElement, subscribe, unobserve}

  function setRootElement(el: HTMLElement | null) {
    rootElement = el
  }

  function observe(el: HTMLElement | SVGElement, payload?: unknown) {
    observedElements.push(el)
    payloadMap.set(el, payload)

    // @todo: handle situation when observer is already subscribed
  }

  function unobserve(el: HTMLElement | SVGElement) {
    const idx = observedElements.indexOf(el)

    if (idx > -1) {
      observedElements.splice(idx, 1)
    }

    payloadMap.delete(el)

    // @todo: handle situation when observer is already subscribed
  }

  function subscribe(subscriber: IntersectionsSubscriber) {
    console.log('subscribe')

    subscribers.push(subscriber)

    _setup()

    return () => {
      const idx = subscribers.indexOf(subscriber)

      if (idx > -1) {
        subscribers.splice(idx, 1)
      }

      _tearDown()
    }
  }

  function _setup() {
    if (subscribers.length > 1) return

    regions = observedElements.map((el) => {
      return {
        payload: payloadMap.get(el),
        intersection: {
          isAbove: false,
          isBelow: true,
          isVisible: false,
        },
      }
      // const entryRect = getRect(el)

      // return {
      //   payload: payloadMap.get(el),
      //   rect: {
      //     top: entryRect.top - rootRect.top,
      //     left: entryRect.left - rootRect.left,
      //     bottom: entryRect.bottom - rootRect.top,
      //     right: entryRect.right - rootRect.left,
      //     width: entryRect.width,
      //     height: entryRect.height,
      //   },
      // }
    })

    io = new IntersectionObserver(_updateIntersections, {
      root: rootElement || undefined,
      rootMargin: rootMargin || '0px',
      threshold: [0, 1],
    })

    observedElements.forEach((el) => io.observe(el))
  }

  function _tearDown() {
    if (subscribers.length) return

    observedElements.forEach((el) => io.unobserve(el))

    io.disconnect()
  }

  function _updateIntersections(entries: IntersectionObserverEntry[]) {
    console.log(entries)

    regions = regions.slice(0)

    for (const entry of entries) {
      const idx = observedElements.indexOf(entry.target as HTMLElement | SVGElement)

      if (entry.rootBounds) {
        const isAbove = entry.boundingClientRect.top < entry.rootBounds.top
        const isBelow = entry.boundingClientRect.bottom > entry.rootBounds.bottom
        const isVisible = !(
          entry.boundingClientRect.bottom < entry.rootBounds.top ||
          entry.boundingClientRect.top > entry.rootBounds.bottom
        )

        regions[idx].intersection = {isAbove, isBelow, isVisible}
      }
    }

    subscribers.forEach((subscriber) => subscriber(regions))
  }
}
