import { EffectCallback, useEffect, useRef } from 'react'

export function useCallOnce(callback: EffectCallback) {
    const called = useRef(false)
    useEffect(() => {
        if (called.current) return
        called.current = true
        return callback()
    }, [])
}
