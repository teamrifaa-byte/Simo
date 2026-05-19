package ma.marinfo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MetierException.class)
    public ResponseEntity<Map<String, Object>> metier(MetierException e) {
        return build(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, Object>> notFound(NoSuchElementException e) {
        return build(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> badCreds(BadCredentialsException e) {
        return build(HttpStatus.UNAUTHORIZED, "Identifiants invalides");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> denied(AccessDeniedException e) {
        return build(HttpStatus.FORBIDDEN, "Accès refusé");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validation(MethodArgumentNotValidException e) {
        Map<String, String> erreurs = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(f ->
                erreurs.put(f.getField(), f.getDefaultMessage()));
        Map<String, Object> body = base(HttpStatus.BAD_REQUEST, "Erreur de validation");
        body.put("erreurs", erreurs);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> generic(Exception e) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    private ResponseEntity<Map<String, Object>> build(HttpStatus s, String msg) {
        return ResponseEntity.status(s).body(base(s, msg));
    }

    private Map<String, Object> base(HttpStatus s, String msg) {
        Map<String, Object> m = new HashMap<>();
        m.put("timestamp", LocalDateTime.now());
        m.put("status",    s.value());
        m.put("error",     s.getReasonPhrase());
        m.put("message",   msg);
        return m;
    }
}
