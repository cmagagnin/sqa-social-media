import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useRouter } from "next/navigation";
import SignIn from "./page";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/service/auth/auth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("SignIn page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shouldAuthenticateAndRedirectAfterSuccessfulLogin", async () => {
    const pushMock = jest.fn();
    const loginMock = jest.fn();
    const signInMock = jest
      .spyOn(authService, "signIn")
      .mockResolvedValue({ id: 1, email: "usuario@email.com" });

    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useAuth as jest.Mock).mockReturnValue({ login: loginMock });

    render(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "usuario@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "Aa1!aaaa" },
    });

    const form = screen.getByRole("main");
    fireEvent.click(within(form).getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith({
        email: "usuario@email.com",
        password: "Aa1!aaaa",
      });
      expect(loginMock).toHaveBeenCalledWith({
        id: 1,
        email: "usuario@email.com",
      });
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });
});
