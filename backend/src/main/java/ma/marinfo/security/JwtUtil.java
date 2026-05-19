package ma.marinfo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtUtil {

    @Value("${marinfo.jwt.secret}")
    private String secretBase64;

    @Value("${marinfo.jwt.expiration-ms}")
    private long expirationMs;

    private SecretKey signingKey;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Base64.getDecoder().decode(secretBase64);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generer(String email, String role, Long userId) {
        Date now = new Date();
        return Jwts.builder()
                .subject(email)
                .claims(Map.of("role", role, "userId", userId))
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(signingKey)
                .compact();
    }

    public Claims extraire(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean estValide(String token) {
        try { extraire(token); return true; }
        catch (JwtException | IllegalArgumentException e) {
            log.warn("Token JWT invalide : {}", e.getMessage());
            return false;
        }
    }
}
