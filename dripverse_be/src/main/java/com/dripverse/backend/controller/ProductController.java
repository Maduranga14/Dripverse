package com.dripverse.backend.controller;

import com.dripverse.backend.model.Product;
import com.dripverse.backend.repository.CategoryRepository;
import com.dripverse.backend.repository.ProductRepository;
import jakarta.persistence.PrePersist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestBody Product productRequest) {
        if (productRequest.getCategory() != null) {
            Object catIdObj = productRequest.getCategory().getId();
            if (catIdObj != null) {
                Long categoryId = Long.valueOf(catIdObj.toString());
                if (categoryId > 0) {
                    categoryRepository.findById(categoryId).ifPresent(productRequest::setCategory);
                }
            }
        }
        return ResponseEntity.ok(productRepository.save(productRequest));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setDescription(productDetails.getDescription());
                    product.setPrice(productDetails.getPrice());
                    product.setStock(productDetails.getStock());
                    product.setImageUrl(productDetails.getImageUrl());

                    if (productDetails.getCategory() != null) {
                        Object catIdObj = productDetails.getCategory().getId();
                        if (catIdObj != null) {
                            Long categoryId = Long.valueOf(catIdObj.toString());
                            if (categoryId > 0) {
                                categoryRepository.findById(categoryId)
                                        .ifPresent(product::setCategory);
                            }
                        }
                    }
                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProuct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return  ResponseEntity.notFound().build();
    }
}
