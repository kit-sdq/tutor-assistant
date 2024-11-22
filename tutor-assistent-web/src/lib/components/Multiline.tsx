import { Typography, TypographyProps } from '@mui/joy'
import React from 'react'

interface Props {
    text: string
}

export function Multiline({ text, ...props }: Props & TypographyProps) {
    const lines = text.split('\n')
    const maxIndex = lines.length - 1

    return (
        <Typography {...props}>
            {lines.map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    {index !== maxIndex && <br />}
                </React.Fragment>
            ))}

        </Typography>
    )
}