import { Box } from '@mui/joy'
import { ReactNode, useEffect, useRef } from 'react'
import { isNotPresent } from '../utils/utils.ts'
import { empty } from '../utils/array-utils.ts'

interface Props {
    children: ReactNode
    padding?: number
    scrollToBottomOnChange?: unknown[]
}

export function Scroller({ children, padding, scrollToBottomOnChange }: Props) {
    if (isNotPresent(scrollToBottomOnChange)) scrollToBottomOnChange = []

    const scrollerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isNotPresent(scrollToBottomOnChange) || empty(scrollToBottomOnChange)) return

        const scroller = scrollerRef.current
        if (isNotPresent(scroller)) return
        scroller.scrollTop = scroller.scrollHeight
    }, scrollToBottomOnChange)


    return (
        <Box
            ref={scrollerRef}
            padding={padding}
            sx={{ width: '100%', height: '100%', overflowY: 'auto', scrollBehavior: 'smooth' }}
        >
            <Box sx={{ width: '100%', minHeight: '100%' }}>
                {children}
            </Box>
        </Box>
    )
}
