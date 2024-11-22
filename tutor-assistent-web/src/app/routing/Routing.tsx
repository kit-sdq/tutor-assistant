import { Navigate, Route, Routes } from 'react-router-dom'
import { ChatPage } from '../../modules/chat/ChatPage.tsx'
import { Authenticated } from '../auth/Authenticated.tsx'
import { DocumentsPage } from '../../modules/documents/DocumentsPage.tsx'
import { HelperPage } from '../../modules/helper/HelperPage.tsx'
import { ChatProvider } from '../../modules/chat/ChatProvider.tsx'

interface Props {

}

export function Routing({}: Props) {

    return (
        <Routes>

            <Route index element={<Navigate to='/chats' replace={true} />} />

            <Route
                path='/chats/:chatId?' element={
                <Authenticated>
                    <ChatProvider>
                        <ChatPage />
                    </ChatProvider>
                </Authenticated>
            }
            />

            <Route
                path='/documents' element={
                <Authenticated>
                    <DocumentsPage />
                </Authenticated>
            }
            />

            <Route
                path='/helper/*' element={
                <Authenticated roles={['document-manager']}>
                    <HelperPage />
                </Authenticated>
            }
            />

        </Routes>
    )
}
