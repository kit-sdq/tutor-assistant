import { useRef } from 'react'

export function useOnChange(callback: () => void, values: any[]) {
  const prevRef = useRef<any[]>([])

  function hasChanged() {
    const prev = prevRef.current

    if (prev.length !== values.length) {
      return true
    }

    for (let i = 0; i < prev.length; i++) {
      if (values[i] !== prev[i]) {
        return true
      }
    }

    return false
  }

  if (hasChanged()) {
    prevRef.current = values
    callback()
  }
}
