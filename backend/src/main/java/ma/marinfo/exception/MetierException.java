package ma.marinfo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class MetierException extends RuntimeException {
    public MetierException(String msg) { super(msg); }
}
