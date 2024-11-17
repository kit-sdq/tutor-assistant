import * as React from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import { ChildrenProps } from '../lib/types.ts'

export function JoyTheme({ children }: ChildrenProps) {
    return (
        <CssVarsProvider defaultMode='system' disableNestedContext>
            {children}
        </CssVarsProvider>
    )
}
