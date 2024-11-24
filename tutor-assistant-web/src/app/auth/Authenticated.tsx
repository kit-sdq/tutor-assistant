import { ChildrenProps } from '../../lib/types.ts'
import { useAuth } from './useAuth.ts'
import { isPresent } from '../../lib/utils/utils.ts'
import { haveCommonElements } from '../../lib/utils/array-utils.ts'

interface Props extends ChildrenProps {
    roles?: string[]
}

export function Authenticated({ children, roles }: Props) {
    const { isLoggedIn, openLogin, getRoles } = useAuth()


    if (!isLoggedIn()) {
        openLogin()
        return <></>
    }

    if (isPresent(roles) && !haveCommonElements(roles, getRoles())) {
        return <></>
    }

    return children
}
