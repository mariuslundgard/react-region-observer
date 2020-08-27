import {getRect} from './helpers'
import {RectObserverEntry, RectsSubscriber} from './types'

const MUTATION_OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
}

export function createRectObserver(opts: {root?: HTMLElement} = {}) {
  const observedElements: (HTMLElement | SVGElement)[] = []
  const subscribers: RectsSubscriber[] = []
  const payloadMap = new WeakMap<HTMLElement | SVGElement, unknown | undefined>()

  let ro: ResizeObserver
  let mo: MutationObserver
  let rootElement: HTMLElement | null = opts.root || null
  let regions: RectObserverEntry[] = []

  return {observe, unobserve, setRootElement, subscribe}

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

  function subscribe(subscriber: RectsSubscriber) {
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

  function _updateRects(entries: ResizeObserverEntry[] | MutationRecord[]) {
    if (!rootElement) return

    regions = regions.slice(0)

    const rootRect = getRect(rootElement)

    for (const entry of entries) {
      const idx = observedElements.indexOf(entry.target as any)
      const entryRect = getRect(entry.target as any)

      regions[idx].rect = {
        top: entryRect.top - rootRect.top,
        left: entryRect.left - rootRect.left,
        bottom: entryRect.bottom - rootRect.top,
        right: entryRect.right - rootRect.left,
        width: entryRect.width,
        height: entryRect.height,
      }
    }

    subscribers.forEach((subscriber) => subscriber(regions))
  }

  function _setup() {
    if (subscribers.length > 1) return
    if (!rootElement) return

    const rootRect = getRect(rootElement)

    regions = observedElements.map((el) => {
      const entryRect = getRect(el)

      return {
        payload: payloadMap.get(el),
        rect: {
          top: entryRect.top - rootRect.top,
          left: entryRect.left - rootRect.left,
          bottom: entryRect.bottom - rootRect.top,
          right: entryRect.right - rootRect.left,
          width: entryRect.width,
          height: entryRect.height,
        },
      }
    })

    // setup resize observer
    ro = new ResizeObserver(_updateRects)

    // setup mutation observer
    mo = new MutationObserver(_updateRects)

    for (const el of observedElements) {
      ro.observe(el)
      mo.observe(el, MUTATION_OBSERVER_CONFIG)
    }
  }

  function _tearDown() {
    if (subscribers.length) return

    for (const el of observedElements) {
      ro.unobserve(el)
    }

    ro.disconnect()
    mo.disconnect()

    // ro = undefined
    // mo = undefined
  }
}
