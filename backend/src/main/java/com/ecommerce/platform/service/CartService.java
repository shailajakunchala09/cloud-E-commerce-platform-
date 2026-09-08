package com.ecommerce.platform.service;

import com.ecommerce.platform.dto.request.CartItemRequest;
import com.ecommerce.platform.dto.response.CartResponse;
import com.ecommerce.platform.entity.Cart;
import com.ecommerce.platform.entity.CartItem;
import com.ecommerce.platform.entity.Product;
import com.ecommerce.platform.entity.User;
import com.ecommerce.platform.exception.InsufficientStockException;
import com.ecommerce.platform.exception.ResourceNotFoundException;
import com.ecommerce.platform.repository.CartItemRepository;
import com.ecommerce.platform.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    @Transactional
    public CartResponse getOrCreateCart(User user) {
        return toResponse(getOrCreateCartEntity(user));
    }

    @Transactional
    public CartResponse addItem(User user, CartItemRequest request) {
        Cart cart = getOrCreateCartEntity(user);
        Product product = productService.findProductOrThrow(request.getProductId());

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new InsufficientStockException(
                    "Only " + product.getStockQuantity() + " unit(s) of '" + product.getName() + "' available");
        }

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(CartItem.builder().cart(cart).product(product).quantity(0).build());

        int newQuantity = item.getQuantity() + request.getQuantity();
        if (product.getStockQuantity() < newQuantity) {
            throw new InsufficientStockException("Cannot add more than available stock for '" + product.getName() + "'");
        }

        item.setQuantity(newQuantity);
        cartItemRepository.save(item);

        return toResponse(cartRepository.findByUserId(user.getId()).orElseThrow());
    }

    @Transactional
    public CartResponse updateItemQuantity(User user, Long cartItemId, int quantity) {
        Cart cart = getOrCreateCartEntity(user);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + cartItemId));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            if (item.getProduct().getStockQuantity() < quantity) {
                throw new InsufficientStockException("Insufficient stock for '" + item.getProduct().getName() + "'");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return toResponse(cartRepository.findByUserId(user.getId()).orElseThrow());
    }

    @Transactional
    public void removeItem(User user, Long cartItemId) {
        Cart cart = getOrCreateCartEntity(user);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + cartItemId));
        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(User user) {
        Cart cart = getOrCreateCartEntity(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    Cart getOrCreateCartEntity(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    private CartResponse toResponse(Cart cart) {
        List<CartResponse.CartItemResponse> items = cart.getItems().stream()
                .map(i -> CartResponse.CartItemResponse.builder()
                        .cartItemId(i.getId())
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .unitPrice(i.getProduct().getPrice())
                        .quantity(i.getQuantity())
                        .lineTotal(i.getProduct().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                        .build())
                .toList();

        BigDecimal subtotal = items.stream()
                .map(CartResponse.CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .subtotal(subtotal)
                .build();
    }
}
