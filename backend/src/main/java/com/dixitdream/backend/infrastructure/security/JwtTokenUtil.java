package com.dixitdream.backend.infrastructure.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtTokenUtil {

    private static final String ACCESS_TYPE = "ACCESS_TOKEN";
    private static final String REFRESH_TYPE = "REFRESH_TOKEN";

    @Value("${security.issuer}")
    private String issuer;
    @Value("${security.secret-key}")
    private String secretKey;
    @Value("${security.access-token-expiration-time}")
    private long accessTokenExpirationTime;
    @Value("${security.refresh-token-expiration-time}")
    private long refreshTokenExpirationTime;

    public String generateAccessToken(String email, Long userId) {
        Map<String, Object> claims = prepareClaims(ACCESS_TYPE, userId);
        return Jwts.builder()
                .setSubject(email)
                .setIssuer(issuer)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpirationTime))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .addClaims(claims)
                .compact();
    }

    public String generateRefreshToken(String email, Long userId) {
        Map<String, Object> claims = prepareClaims(REFRESH_TYPE, userId);
        return Jwts.builder()
                .setSubject(email)
                .setIssuer(issuer)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpirationTime))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .addClaims(claims)
                .compact();
    }

    private Map<String, Object> prepareClaims(String type, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", type);
        claims.put("userId", userId);
        return claims;
    }

    public String getEmail(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public String getType(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
        return claims.get("type", String.class);
    }

    public Long getUserId(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
        return claims.get("userId", Long.class);
    }

    public Date getExpirationDate(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();

        return claims.getExpiration();
    }

    public boolean validateAccessToken(String token) {
        return validate(token) && ACCESS_TYPE.equals(getType(token));
    }

    public boolean validateRefreshToken(String token) {
        return validate(token) && REFRESH_TYPE.equals(getType(token));
    }

    private boolean validate(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (SignatureException ex) {
            ex.printStackTrace();
            return false;
        } catch (MalformedJwtException ex) {
            ex.printStackTrace();
            return false;
        } catch (ExpiredJwtException ex) {
            ex.printStackTrace();
            return false;
        } catch (UnsupportedJwtException ex) {
            ex.printStackTrace();
            return false;
        } catch (IllegalArgumentException ex) {
            ex.printStackTrace();
            return false;
        }

    }

}