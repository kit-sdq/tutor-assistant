import { useRef, useState } from 'react'


export function useInstantState<T>(initial: T): [() => T, (value: T) => void] {
  const [_, setState] = useState<T>(initial)
  const stateRef = useRef<T>(initial)

  function setInstantState(value: T) {
    stateRef.current = value
    setState(value)
  }

  function getInstantState() {
    return stateRef.current
  }

  return [getInstantState, setInstantState]
}
