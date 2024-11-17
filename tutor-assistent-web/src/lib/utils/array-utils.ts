import { isNotPresent } from './utils'
import { isBetweenExcluded, isBetweenIncluded } from './math-utils'

export function append<T>(item: T, array: T[]) {
    return [...array, item]
}

export function update<T extends { id?: string }>(item: T, array: T[]) {
    if (isNotPresent(item.id)) return array
    return array.map(item => item.id === item.id ? item : item)
}

export function remove<T extends { id?: string }>(item: T | string, array: T[]) {
    const id = typeof item === 'string' ? item : item.id
    return array.filter(it => it.id !== id)
}

export function lastIndex(array: any[]) {
    return array.length - 1
}

export function last<T>(array: T[]) {
    if (empty(array)) return undefined
    return array[lastIndex(array)]
}

export function empty(array: unknown[]) {
    return array.length === 0
}

export function notEmpty(array: unknown[]) {
    return !empty(array)
}

export function partition<T>(predicate: (item: T) => boolean, array: T[]) {
    const result = [[], []] as [T[], T[]]
    array.forEach(item => predicate(item) ? result[0].push(item) : result[1].push(item))
    return result
}

export function haveCommonElements<T>(array1: T[], array2: T[]): boolean {
    const set1 = new Set(array1)
    for (const item of array2) {
        if (set1.has(item)) {
            return true
        }
    }
    return false
}

export function pairwise<T>(array: T[], func: (current: T, next: T) => T) {
    const result = []
    for (let i = 0; i < array.length - 1; i++) {
        result.push(func(array[i], array[i + 1]))
    }
    return result
}

export function pairwiseKeepingFirst<T>(array: T[], func: (current: T, next: T) => T) {
    if (array.length === 0) return []
    const result = [array[0]]

    return result.push(...pairwise(array, func))
}

export function pairwiseKeepingFirstInstantlyApplied<T>(
    array: T[], func: (current: T, next: T) => T) {

    const arrayCopy = [...array]

    if (arrayCopy.length === 0) return []

    for (let i = 0; i < arrayCopy.length - 1; i++) {
        arrayCopy[i] = (func(arrayCopy[i], arrayCopy[i + 1]))
    }
    return arrayCopy
}

export function convertN<T, R>(array: T[], n: number, func: (nItems: T[]) => R) {
    const result: R[] = []

    if (array.length % n !== 0) return result

    let nItems: T[] = []
    for (let i = 0; i < array.length; i++) {
        nItems.push(array[i])

        if (nItems.length % n === 0) {
            result.push(func(nItems))
            nItems = []
        }
    }
    return result
}

export function range(start: number, end: number) {
    let result = []
    for (let i = start; i < end; i++) {
        result.push(i)
    }
    return result
}

export function getBestFit<T>(value: number, array: T[], mapToNumber: (item: T) => number) {
    function continueSearchIndex(index: number) {
        return isBetweenExcluded(0, index, length - 1) &&
            !isBetweenIncluded(mapToNumber(array[index - 1]), value, mapToNumber(array[index]))
    }

    function calculateNextIndex(a: number, b: number) {
        return Math.floor((a + b) / 2)
    }

    const length = array.length

    if (length === 0) throw Error('Array length must not be 0')
    if (length === 1) return array[0]

    let lowerBound = 0
    let upperBound = length - 1
    let index = calculateNextIndex(upperBound, lowerBound)
    let prevIndex = Infinity

    while (isBetweenExcluded(0, index, length - 1) && prevIndex !== index) {

        const current = mapToNumber(array[index])
        if (value < current) {
            upperBound = index
        } else if (value > current) {
            lowerBound = index
        } else {
            return array[index]
        }

        prevIndex = index
        index = calculateNextIndex(lowerBound, upperBound)
    }

    const nextIndex = index + 1
    const nextIndexValueDiff = mapToNumber(array[nextIndex]) - value
    const indexValueDiff = value - mapToNumber(array[index])

    return nextIndexValueDiff < indexValueDiff ? array[nextIndex] : array[index]
}
