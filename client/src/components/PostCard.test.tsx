import { fireEvent, render, screen } from "@testing-library/react";
import PostCard from "./PostCard";

describe("PostCard", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shouldShowAlertWhenUnauthenticatedUserLikesPost", () => {
    const alertMock = jest
      .spyOn(window, "alert")
      .mockImplementation(() => undefined);

    render(
      <PostCard
        post={{
          id: 42,
          title: "Título do post",
          body: "Corpo do post",
          reactions: { likes: 192, dislikes: 25 },
          liked: false,
        }}
        isAuthenticated={false}
        onLike={async () => undefined}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Curtir/ }));

    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock).toHaveBeenCalledWith(
      "Você precisa estar autenticado para curtir posts!"
    );
  });

  it("shouldDisplayLikeAndDislikeCounts", () => {
    render(
      <PostCard
        post={{
          id: 1,
          title: "Post com reações",
          body: "Conteúdo",
          reactions: { likes: 192, dislikes: 25 },
          liked: false,
        }}
        isAuthenticated={false}
        onLike={async () => undefined}
      />
    );

    expect(screen.getByText("👍 192 likes")).toBeTruthy();
    expect(screen.getByText("👎 25 dislikes")).toBeTruthy();
  });

  it("shouldKeepLikeAndDislikeCountsIndependent", () => {
    render(
      <PostCard
        post={{
          id: 2,
          title: "Post com contadores diferentes",
          body: "Conteúdo",
          reactions: { likes: 7, dislikes: 103 },
          liked: false,
        }}
        isAuthenticated={false}
        onLike={async () => undefined}
      />
    );

    expect(screen.getByText("👍 7 likes")).toBeTruthy();
    expect(screen.getByText("👎 103 dislikes")).toBeTruthy();
    expect(screen.queryByText("👍 103 likes")).toBeNull();
    expect(screen.queryByText("👎 7 dislikes")).toBeNull();
  });
});
