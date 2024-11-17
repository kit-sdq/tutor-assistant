import { isNotPresent, isPresent } from './utils'

export function scrollDown(element: HTMLElement | null) {
  const content = getScrollContainer(element)
  if (isNotPresent(content)) return
  content.scroll({
    top: content.scrollHeight,
    behavior: 'smooth'
  })
}

export function getScrollContainer(element: HTMLElement | null) {
  let currentElement = element

  while (isPresent(currentElement)) {
    if (currentElement.classList.contains('content-scroller')) {
      return currentElement
    }

    currentElement = currentElement.parentElement
  }
}
