package isep.engreq.hapibeebackend.controllers;

import isep.engreq.hapibeebackend.dtos.AuthRequestDto;
import isep.engreq.hapibeebackend.dtos.CreateUserDto;
import isep.engreq.hapibeebackend.dtos.UserDto;
import isep.engreq.hapibeebackend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.security.SecureRandom;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;

@RestController
@RequestMapping(path = "auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    private final AuthenticationManager authenticationManager;

    private final JwtEncoder jwtEncoder;

    private final PasswordEncoder encoder;

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody final CreateUserDto request) {
        try {
            if (userService.findByEmail(request.getEmail()).getEmail() != null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Email already exists.");
            }

            String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            int STRING_LENGTH = 10;

            StringBuilder tenantId = new StringBuilder(STRING_LENGTH);
            SecureRandom random = new SecureRandom();

            for (int i = 0; i < STRING_LENGTH; i++) {
                int randomIndex = random.nextInt(CHARACTERS.length());
                char randomChar = CHARACTERS.charAt(randomIndex);
                tenantId.append(randomChar);
            }

            CreateUserDto user = new CreateUserDto(tenantId.toString(), request.getEmail(),
                    encoder.encode(request.getPassword()), request.getName(), request.getRole(), request.getNif(),
                    request.getAddress());

            userService.create(user);

            return ResponseEntity.ok().body("User created successfully");

        } catch (final BadCredentialsException ex) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering user.");
        }
    }

    @PostMapping("registerMember")
    public ResponseEntity<String> registerMember(@RequestBody final CreateUserDto request) {
        try {
            if (userService.findByEmail(request.getEmail()).getEmail() != null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Email already exists.");
            }

            CreateUserDto user = new CreateUserDto(request.getTenantId(), request.getEmail(),
                    encoder.encode(request.getPassword()), request.getName(), request.getRole(), request.getNif(),
                    request.getAddress());

            userService.create(user);

            return ResponseEntity.ok().body("User created successfully");

        } catch (final BadCredentialsException ex) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering user.");
        }
    }

    @PostMapping("login")
    public ResponseEntity<UserDto> login(@RequestBody final AuthRequestDto request) {
        try {
            final Authentication authentication = this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            User user = (User) authentication.getPrincipal();

            final Instant now = Instant.now();
            final long expiry = 30L * 24L * 3600L; //30 dias

            final String scope = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(joining(" "));

            final JwtClaimsSet claims = JwtClaimsSet.builder().issuer("example.io").issuedAt(now).expiresAt(now.plusSeconds(expiry)).subject(format("%s,%s", user.getUsername(), user.getPassword())).claim("roles", scope).build();

            final String token = this.jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

            UserDto userToReturn = userService.findByEmail(request.getEmail());

            return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, token).body(userToReturn);

        } catch (final BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
