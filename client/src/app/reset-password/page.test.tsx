import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import ResetPassword from "./page";
import { authService } from "@/service/auth/auth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock("../../contexts/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    isAuthenticated: false,
    logout: jest.fn(),
  })),
}));

describe("ResetPassword page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shouldShowRequiredSuccessMessageAfterSuccessfulPasswordReset", async () => {
    const resetPasswordMock = jest
      .spyOn(authService, "resetPassword")
      .mockResolvedValue(undefined);

    render(<ResetPassword />);

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "usuario@email.com" },
    });

    const form = screen.getByRole("main");
    fireEvent.click(within(form).getByRole("button", { name: "Enviar Email" }));

    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith({
        email: "usuario@email.com",
      });
      expect(
        screen.getByText("E-mail enviado com sucesso", { exact: true })
      ).toBeTruthy();
    });
  });
});
