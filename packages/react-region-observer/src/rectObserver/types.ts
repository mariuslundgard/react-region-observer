export interface Rect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

export interface RectObserverEntry<Payload = any> {
  payload: Payload
  rect: Rect
}

export type RectsSubscriber = (regions: RectObserverEntry[]) => void
