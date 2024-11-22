import { Row, Spacer } from '../../lib/components/flex-layout.tsx'
import { Divider, Typography } from '@mui/joy'
import React, { ReactNode } from 'react'
import { isPresent } from '../../lib/utils/utils.ts'

interface Props {
    title: ReactNode | string
    leftNode?: ReactNode
    rightNode?: ReactNode
}

export function Header({ title, leftNode, rightNode }: Props) {
    return (
        <>
            <Row alignItems='center' height={36}>
                <Spacer>{isPresent(leftNode) && leftNode}</Spacer>
                {
                    typeof title === 'string'
                        ? <Typography level='title-lg'>{title}</Typography>
                        : title
                }

                <Spacer sx={{ textAlign: 'end' }}>{isPresent(rightNode) && rightNode}</Spacer>
            </Row>
            <Divider />
        </>
    )
}
