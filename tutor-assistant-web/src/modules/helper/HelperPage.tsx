import { Route, Routes } from 'react-router-dom'
import { AllInfos } from './components/AllInfos.tsx'

interface Props {

}

export function HelperPage({}: Props) {
    return (
        <Routes>
            <Route index element={<></>} />
            <Route path='/all-infos' element={<AllInfos />} />
        </Routes>
    )
}
