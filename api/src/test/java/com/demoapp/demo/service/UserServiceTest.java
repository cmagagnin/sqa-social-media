package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class UserServiceTest {

  private final UserService userService = new UserService(null);

  @Test
  void shouldAcceptStrongPasswordWithExactlyEightCharacters() {
    assertTrue(userService.isPasswordValid("Aa1!aaaa"));
  }

  @Test
  void shouldRejectEmailWithoutValidDomain() {
    assertFalse(userService.isEmailValid("abc@"));
  }
}
