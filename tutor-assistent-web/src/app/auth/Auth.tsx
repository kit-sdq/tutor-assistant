import { createContext } from 'react'
import axios, { AxiosInstance } from 'axios'
import { chill, isNotPresent } from '../../lib/utils/utils.ts'
import { ChildrenProps } from '../../lib/types.ts'
import { useKeycloak } from '@react-keycloak/web'

type AuthContextType = {
    getAuthHttp: () => AxiosInstance,
    isLoggedIn: () => boolean,
    openLogin: () => void,
    logout: () => void,
    getRoles: () => string[]
}

export const AuthContext = createContext<AuthContextType>({
    getAuthHttp: () => axios,
    isLoggedIn: () => false,
    openLogin: chill,
    logout: chill,
    getRoles: () => [],
})


export function Auth({ children }: ChildrenProps) {

    const { keycloak, initialized } = useKeycloak()


    function isLoggedIn() {
        return keycloak.authenticated ?? false
    }

    if (!initialized) return <></>

    function getAuthHttp() {
        if (!keycloak.authenticated || isNotPresent(keycloak.token)) {
            keycloak.login()
            return axios
        }

        return axios.create({
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
            },
        })
    }

    return (
        <AuthContext.Provider
            value={{
                getAuthHttp,
                isLoggedIn,
                openLogin: keycloak.login,
                logout: keycloak.logout,
                getRoles: () => keycloak.tokenParsed?.realm_access?.roles ?? [],
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}



