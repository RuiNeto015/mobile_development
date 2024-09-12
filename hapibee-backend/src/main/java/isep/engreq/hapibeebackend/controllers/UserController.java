package isep.engreq.hapibeebackend.controllers;

import isep.engreq.hapibeebackend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/getAll/{tenantId}")
    public ResponseEntity<?> getAll(@PathVariable final String tenantId) {
        var users = this.userService.getAllByTenant(tenantId);

        return ResponseEntity.ok().body(users);
    }

    @DeleteMapping("/delete/{tenantId}/{email}")
    public ResponseEntity<?> delete(@PathVariable String tenantId, @PathVariable String email) {
        this.userService.delete(tenantId, email);

        return ResponseEntity.ok().body("Uitilizador eliminado com sucesso.");
    }
}
