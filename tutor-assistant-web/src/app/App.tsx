import React from 'react'
import { Routing } from './routing/Routing'
import { Auth } from './auth/Auth.tsx'
import texts from '../texts/texts.json'
import { BrowserRouter } from 'react-router-dom'
import { JoyTheme } from './JoyTheme'
import { configureI18n } from './config/i18n-config.ts'
import { Main } from './MainStyle.tsx'
import { HStack, MainContent } from '../lib/components/flex-layout.tsx'
import { CalendarBar } from '../modules/calendar/components/CalendarBar.tsx'

configureI18n(texts)


const App = () => {
    return (
        <JoyTheme>
            <BrowserRouter>
                <Main>
                    <Auth>
                        <HStack>
                            <CalendarBar />
                            <MainContent>
                                <Routing />
                            </MainContent>
                        </HStack>
                    </Auth>
                </Main>
            </BrowserRouter>
        </JoyTheme>
    )
}

export default App
