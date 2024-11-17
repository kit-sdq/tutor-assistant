package de.niklaskerkhoff.tutorassistantappservice.lib.security

import org.springframework.core.convert.converter.Converter
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter


class KeycloakJwtAuthenticationConverter : Converter<Jwt, AbstractAuthenticationToken> {

    override fun convert(jwt: Jwt): AbstractAuthenticationToken? {
        val converter = JwtAuthenticationConverter()

        converter.setJwtGrantedAuthoritiesConverter {
            jwt.claims["realm_access"]
                ?.let {
                    val realmAccess = it as? Map<*, *>
                    realmAccess?.get("roles") as? List<*>
                }
                ?.map { SimpleGrantedAuthority("ROLE_$it") }
                ?: emptyList()
        }

        return converter.convert(jwt)
    }
}
