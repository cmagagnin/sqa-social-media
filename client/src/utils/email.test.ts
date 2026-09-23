import { isEmailValid } from "./email";

describe("isEmailValid", () => {
  it("shouldValidateEmailCorrectly", () => {
    expect(isEmailValid("usuario@email.com")).toBe(true);
    expect(isEmailValid("usuarioemail.com")).toBe(false);
  });
});
