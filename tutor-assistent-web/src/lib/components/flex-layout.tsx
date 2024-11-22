import { Box, Stack, styled } from '@mui/joy'

export const VStack = styled(Stack)`
    margin: 0 !important;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
`

export const HStack = styled(Stack)`
    margin: 0 !important;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
`

export const Column = styled(Stack)`
    margin: 0 !important;
    flex-direction: column;
    height: 100%;
    overflow-y: hidden;
`

export const Row = styled(Stack)`
    margin: 0 !important;
    flex-direction: row;
    width: 100%;
`

export const MainContent = styled(Box)`
    width: 100%;
    height: 100%;
    flex: 1;
    overflow: hidden;
`

export const Spacer = styled('span')`
    flex: 1;
`
