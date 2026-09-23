package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.demoapp.demo.model.User;
import com.demoapp.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserServiceMockitoTest {

  @Mock
  private UserRepository userRepository;

  private UserService userService;

  @BeforeEach
  void setUp() {
    userService = new UserService(userRepository);
  }

  @Test
  void shouldCreateAndSaveUser() {
    User savedUser = new User();
    savedUser.setId(1L);
    savedUser.setEmail("usuario@email.com");
    savedUser.setPassword("Aa1!aaaa");

    when(userRepository.save(any(User.class))).thenReturn(savedUser);

    User result = userService.createUser("usuario@email.com", "Aa1!aaaa");

    ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
    verify(userRepository).save(userCaptor.capture());
    assertEquals("usuario@email.com", userCaptor.getValue().getEmail());
    assertEquals("Aa1!aaaa", userCaptor.getValue().getPassword());
    assertSame(savedUser, result);
  }
}
