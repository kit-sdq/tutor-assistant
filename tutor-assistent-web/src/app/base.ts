import { getCurrentBaseUrl } from '../lib/utils/utils.ts'

const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL as string
const envKeycloakBaseUrl = import.meta.env.VITE_KEYCLOAK_BASE_URL as string

const currentBaseUrl = getCurrentBaseUrl()

export const apiBaseUrl = envApiBaseUrl !== 'default' ? envApiBaseUrl : `${currentBaseUrl}/api`
export const keycloakBaseUrl = envKeycloakBaseUrl !== 'default' ? envKeycloakBaseUrl : `${currentBaseUrl}/auth`
