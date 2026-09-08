package com.ecommerce.platform.controller;

import com.ecommerce.platform.dto.request.CartItemRequest;
import com.ecommerce.platform.dto.response.CartResponse;
import com.ecommerce.platform.entity.User;
import com.ecommerce.platform.service.CartService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart operations (requires authentication)")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getOrCreateCart(user));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(@AuthenticationPrincipal User user,
                                                 @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(user, request));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateQuantity(@AuthenticationPrincipal User user,
                                                         @PathVariable Long cartItemId,
                                                         @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateItemQuantity(user, cartItemId, quantity));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeItem(@AuthenticationPrincipal User user, @PathVariable Long cartItemId) {
        cartService.removeItem(user, cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }
}
