import { styled } from '@mui/joy'
import { VStack } from '../../lib/components/flex-layout.tsx'

const barWidth = '420px'
export const Bar = styled(VStack)`
    min-width: ${barWidth};
    width: ${barWidth};
    max-width: ${barWidth};
    background: ${props => props.theme.palette.background.surface};
    border-right: 1px solid ${props => props.theme.palette.divider};

    &.right {
        border-right: none;
        border-left: 1px solid ${props => props.theme.palette.divider};
    }
`
