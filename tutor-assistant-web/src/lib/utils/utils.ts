export function isNotPresent(value: any): value is null | undefined {
    return value === undefined || value === null
}

export function isPresent<T>(value: T | undefined | null): value is T {
    return !isNotPresent(value)
}

export const postDecode = (object: any) => {
    const mutObject = { ...object }
    for (const key in mutObject) {
        if (typeof mutObject[key] === object) {
            mutObject[key] = postDecode(mutObject[key])
        }
        if (key.endsWith('Date')) {
            mutObject[key] = new Date(key)
        }
    }
    return mutObject
}

export function getNavigationLocation() {
    return window.location.href.substring(window.location.origin.length)
}

export function byNumber(a: number, b: number) {
    return a - b
}

export function byNumberReverse(a: number, b: number) {
    return b - a
}

export function stringToNumber(s: string) {
    return +s
}

export function isAppleMobile() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function getCurrentBaseUrl() {
    const { protocol, host } = window.location
    return `${protocol}//${host}`
}

export const chill = () => undefined
