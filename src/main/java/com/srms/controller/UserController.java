package com.srms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.srms.dto.response.ApiResponse;
import com.srms.dto.response.UserResponse;
import com.srms.entity.User;
import com.srms.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // =====================================================
    // GET ALL
    // =====================================================

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers());
    }

    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUserById(id));
    }

    // =====================================================
    // ADD
    // =====================================================

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> addUser(
            @RequestBody User user) {

        return ResponseEntity.ok(
                userService.addUser(user));
    }

    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        return ResponseEntity.ok(
                userService.updateUser(
                        id,
                        user));
    }

    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.deleteUser(id));
    }

    // =====================================================
    // TOGGLE STATUS
    // =====================================================

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.toggleUserStatus(id));
    }
}