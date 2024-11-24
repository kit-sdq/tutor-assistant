import Keycloak from 'keycloak-js'
import { keycloakBaseUrl } from '../base.ts'

export const keycloak = new Keycloak({
    url: keycloakBaseUrl,
    realm: 'tutor-assistant',
    clientId: 'tutor-assistant-web',
})
