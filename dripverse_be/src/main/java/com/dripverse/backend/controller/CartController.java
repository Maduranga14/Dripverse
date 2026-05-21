package com.dripverse.backend.controller;

import com.dripverse.backend.dto.AddToCartRequest;
import com.dripverse.backend.model.Cart;
import com.dripverse.backend.model.CartItem;
import com.dripverse.backend.model.Product;
import com.dripverse.backend.model.User;
import com.dripverse.backend.repository.CartItemRepository;
import com.dripverse.backend.repository.CartRepository;
import com.dripverse.backend.repository.ProductRepository;
import com.dripverse.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private CartItemRepository cartItemRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<Cart> getCart(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        Cart cart = cartRepo.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepo.save(newCart);
        });

        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addToCart(@RequestBody AddToCartRequest request, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        Cart cart = cartRepo.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepo.save(newCart);
        });

        Product product = productRepository.findById(request.getProductId()).orElse(null);
        if (product == null) return ResponseEntity.badRequest().build();


        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId() == (product.getId()) &&
                                         item.getSize().equals(request.getSize()) &&
                                        item.getColor().equals(request.getColor()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepo.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            newItem.setSize(request.getSize());
            newItem.setColor(request.getColor());
            cart.getItems().add(newItem);
            cartItemRepo.save(newItem);
        }

        return ResponseEntity.ok(cartRepo.save(cart));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<Cart> updateItemQuantity(@PathVariable Long itemId, @RequestParam int quantity, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return  ResponseEntity.notFound().build();

        CartItem item = cartItemRepo.findById(itemId).orElse(null);
        if (item == null || item.getCart().getUser().getId() != (user.getId())) {
            return ResponseEntity.notFound().build();
        }

        if (quantity <= 0) {
            cartItemRepo.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepo.save(item);
        }

        return ResponseEntity.ok(cartRepo.findByUser(user).get());
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Cart> removeItem(@PathVariable Long itemId, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        CartItem item = cartItemRepo.findById(itemId).orElse(null);
        if (item != null && item.getCart().getUser().getId() == user.getId()) {
            cartItemRepo.delete(item);
        }

        return ResponseEntity.ok(cartRepo.findByUser(user).get());
    }
}
