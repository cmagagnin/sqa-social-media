import { isPasswordValid } from "./password";

describe("isPasswordValid", () => {
  it("shouldAcceptStrongPasswordWithExactlyEightCharacters", () => {
    expect(isPasswordValid("Aa1!aaaa")).toBe(true);
  });
});
