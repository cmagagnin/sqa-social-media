package com.demoapp.demo.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private UserService userService;

  @Test
  void shouldReturnRegisteredEmailMessageWhenSignupEmailAlreadyExists() throws Exception {
    User existingUser = new User();

    when(userService.isEmailValid("usuario@email.com")).thenReturn(true);
    when(userService.isPasswordValid("Aa1!aaaa")).thenReturn(true);
    when(userService.findByEmail("usuario@email.com")).thenReturn(existingUser);

    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "usuario@email.com",
              "password": "Aa1!aaaa"
            }
            """))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.message").value("E-mail já cadastrado"))
        .andExpect(jsonPath("$.status").value(409));
  }

  @Test
  void shouldReturnInvalidCredentialsWhenSigninFails() throws Exception {
    when(userService.isEmailValid("usuario@email.com")).thenReturn(true);
    when(userService.isPasswordValid("Aa1!aaaa")).thenReturn(true);
    when(userService.findByEmail("usuario@email.com")).thenReturn(null);

    mockMvc.perform(post("/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "usuario@email.com",
              "password": "Aa1!aaaa"
            }
            """))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Credenciais inválidas"))
        .andExpect(jsonPath("$.status").value(401));
  }
}
