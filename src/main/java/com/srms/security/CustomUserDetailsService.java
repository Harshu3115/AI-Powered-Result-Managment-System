package com.srms.security;

import com.srms.entity.User;
import com.srms.exception.ResourceNotFoundException;
import com.srms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return new CustomUserDetails(user);
    }
}