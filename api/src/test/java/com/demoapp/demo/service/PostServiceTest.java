package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.demoapp.demo.model.UserPostReaction;
import com.demoapp.demo.repository.UserPostReactionRepository;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

  @Mock
  private UserPostReactionRepository reactionRepository;

  private PostService postService;

  @BeforeEach
  void setUp() {
    postService = new PostService(reactionRepository);
  }

  @Test
  void shouldLikePostWhenReactionDoesNotExist() {
    Long userId = 1L;
    Long postId = 42L;

    when(reactionRepository.findByUserIdAndPostId(userId, postId))
        .thenReturn(Optional.empty());

    Map<String, Object> result = postService.toggleLike(postId, userId);

    ArgumentCaptor<UserPostReaction> reactionCaptor =
        ArgumentCaptor.forClass(UserPostReaction.class);
    verify(reactionRepository).save(reactionCaptor.capture());
    assertEquals(userId, reactionCaptor.getValue().getUserId());
    assertEquals(postId, reactionCaptor.getValue().getPostId());
    assertEquals(postId, result.get("postId"));
    assertEquals(true, result.get("liked"));
  }
}
