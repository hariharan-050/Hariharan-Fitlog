package com.example.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    /*
     * These field names are required by the test.
     */
    @Value("${app.jwt.secret:${jwt.secret:mySuperSecretKeyThatIsAtLeast32BytesLongForHS256}}")
    private String secretKey;

    @Value("${app.jwt.expiration-ms:${jwt.expiration:3600000}}")
    private long jwtExpirationMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8));
    }

    /*
     * Generate JWT token.
     */
    public String generateToken(
            String username,
            String role) {

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis()
                                + jwtExpirationMs))
                .signWith(
                        getSigningKey(),
                        SignatureAlgorithm.HS256)
                .compact();
    }

    /*
     * Extract username.
     */
    public String extractUsername(String token) {
        return extractClaim(
                token,
                Claims::getSubject);
    }

    /*
     * Extract role.
     */
    public String extractRole(String token) {
        return extractAllClaims(token)
                .get("role", String.class);
    }

    /*
     * Extract expiration date.
     */
    public Date extractExpiration(String token) {
        return extractClaim(
                token,
                Claims::getExpiration);
    }

    /*
     * Generic claim extractor.
     */
    public <T> T extractClaim(
            String token,
            Function<Claims, T> resolver) {

        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    /*
     * Read all JWT claims.
     */
    private Claims extractAllClaims(
            String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /*
     * Check whether token has expired.
     */
    private boolean isTokenExpired(
            String token) {

        return extractExpiration(token)
                .before(new Date());
    }

    /*
     * Required by the test.
     */
    public boolean isTokenValid(
            String token,
            String username) {

        try {

            String extractedUsername =
                    extractUsername(token);

            return extractedUsername.equals(username)
                    && !isTokenExpired(token);

        } catch (Exception exception) {

            return false;
        }
    }

    /*
     * Optional compatibility method.
     */
    public boolean validateToken(
            String token,
            String username) {

        return isTokenValid(token, username);
    }
}
