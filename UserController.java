package com.ecommerce.platform.controller;

import com.ecommerce.platform.entity.User;
import com.ecommerce.platform.repository.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<User> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    @Transactional
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal User user,
                                               @RequestBody Map<String, String> updates) {
        if (updates.containsKey("fullName")) user.setFullName(updates.get("fullName"));
        if (updates.containsKey("phoneNumber")) user.setPhoneNumber(updates.get("phoneNumber"));
        if (updates.containsKey("address")) user.setAddress(updates.get("address"));
        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }
}
