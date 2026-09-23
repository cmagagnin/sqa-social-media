import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("shouldShowLoadingStateAndDisableButton", () => {
    render(<Button isLoading>Entrar</Button>);

    const button = screen.getByRole("button", { name: "Carregando..." });

    expect(button).toBeTruthy();
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });
});
