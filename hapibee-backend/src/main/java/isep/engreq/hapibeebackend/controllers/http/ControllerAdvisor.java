package isep.engreq.hapibeebackend.controllers.http;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Slf4j
public class ControllerAdvisor {

    @Data
    public static class ErrorPayloadMessage {
        private LocalDateTime timestamp;
        private int status;
        private String error;
        private String message;
        private String path;
    }

    private String getPath(WebRequest request) {
        if (request instanceof ServletWebRequest) {
            HttpServletRequest servletRequest = ((ServletWebRequest) request).getRequest();
            return servletRequest.getRequestURI();
        }
        return "";
    }

    private ErrorPayloadMessage createPayload(String message, WebRequest request) {
        ErrorPayloadMessage errorResponse = new ErrorPayloadMessage();
        errorResponse.setTimestamp(LocalDateTime.now());
        errorResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        errorResponse.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        errorResponse.setMessage(message);
        errorResponse.setPath(this.getPath(request));
        return errorResponse;
    }

    private ErrorPayloadMessage createPayload(Exception exception, WebRequest request) {
        return createPayload(exception.getMessage(), request);
    }

    private ErrorPayloadMessage createPayload(Exception exception, WebRequest request, String msg) {
        ErrorPayloadMessage errorResponse = this.createPayload(exception, request);
        errorResponse.setMessage(msg);
        return errorResponse;
    }

    private static String mapToString(Map<String, String> map) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");

        for (Map.Entry<String, String> entry : map.entrySet()) {
            sb.append(entry.getKey());
            sb.append("=");
            sb.append(entry.getValue());
            sb.append(", ");
        }

        if (!map.isEmpty()) {
            sb.setLength(sb.length() - 2);
        }

        sb.append("}");
        return sb.toString();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleInvalidsArguments(MethodArgumentNotValidException exception, WebRequest request) {
        exception.printStackTrace();
        Map<String, String> errorMap = new HashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error ->
                errorMap.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(this.createPayload(exception, request, mapToString(errorMap)));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentExceptions(IllegalArgumentException exception, WebRequest request) {
        exception.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(this.createPayload(exception, request));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericExceptions(Exception exception, WebRequest request) {
        exception.printStackTrace();
        String genericMsg = "Algum problema genérico aconteceu. Contacte a equipa de suporte Hapibee.";
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(this.createPayload(genericMsg, request));
    }


}
