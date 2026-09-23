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
});
