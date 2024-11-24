import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../app/auth/useAuth.ts'
import { apiBaseUrl } from '../../../app/base.ts'
import { HStack, MainContent, VStack } from '../../../lib/components/flex-layout.tsx'
import { Bar } from '../../../common/components/Bar.tsx'
import { Header } from '../../../common/components/Header.tsx'
import { IconButton } from '@mui/joy'
import { Cached } from '@mui/icons-material'
import { useCalendar } from '../../calendar/useCalendar.ts'
import { Scroller } from '../../../lib/components/Scroller.tsx'
import { range } from '../../../lib/utils/array-utils.ts'
import { StyledMarkdown } from '../../../common/components/StyledMarkdown.tsx'
import remarkGfm from 'remark-gfm'

interface Props {

}

export function AllInfos({}: Props) {

    return <></>
    /*const [infos, setInfos] = useState<any>([])
    const { info, loadNewInfo } = useCalendar()
    const { getAuthHttp } = useAuth()

    useEffect(() => {
        loadInfos()
    }, [info])

    async function loadInfos() {
        const { data } = await getAuthHttp().get<string[]>(`${apiBaseUrl}/info/all`)
        const transformedData = data.map(it => it.startsWith('"{') ? transformJson(it) : transformMarkdown(it))
        setInfos(transformedData)
    }

    function transformJson(json: string) {
        // @ts-ignore
        const replaced = json.slice(1, json.length - 1).replaceAll('\\n', '').replaceAll('\\"', '"')
        const value = JSON.parse(replaced).events.sort((a: { date: string }, b: { date: string }) => {
            const reversedA = a.date.split('').reverse().join('')
            const reversedB = b.date.split('').reverse().join('')
            return reversedA.localeCompare(reversedB)
        })
        return { type: 'json', value }
    }

    function transformMarkdown(markdown: string) {
        // @ts-ignore
        return { type: 'markdown', value: markdown.slice(1, markdown.length - 1).replaceAll('\\n', '\n') }
    }

    async function handleReload() {
        for (let _ of range(0, 5)) {
            await loadNewInfo()
        }
    }

    return (
        <VStack>
            <Header
                title='All Infos' rightNode={
                <IconButton onClick={handleReload}>
                    <Cached />
                </IconButton>
            }
            />
            <MainContent>
                <HStack gap={4}>
                    {infos.filter((_: any, index: number) => index >= 0 && index < 40).map((info: any, index: any) => (
                        info.type === 'json'
                            ? (
                                <Bar key={index}>
                                    <Scroller>
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>Nr.</th>
                                                <th>Datum</th>
                                                <th>Ereignis</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {info.value.map((entry: any, index: any) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{entry.date}</td>
                                                    <td>{entry.title} um {entry.time}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </Scroller>
                                </Bar>
                            )
                            : (
                                <StyledMarkdown className='noTableMargin' remarkPlugins={[remarkGfm]}>
                                    {info.value}
                                </StyledMarkdown>
                            )

                    ))}
                </HStack>
            </MainContent>
        </VStack>
    )*/
}
