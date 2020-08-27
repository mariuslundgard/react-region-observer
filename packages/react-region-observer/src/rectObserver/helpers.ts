export function getRect(element: HTMLElement | SVGElement) {
  const rect = element.getBoundingClientRect()

  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  }
}

export function getElementScroll(element: HTMLElement) {
  return {
    left: element.scrollLeft,
    top: element.scrollTop,
  }
}

export function getWindowScroll() {
  return {
    left: window.scrollX,
    top: window.scrollY,
  }
}
