/**
 * @jest-environment jsdom
 */

import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore);

const onNavigate = (pathname) => {
  window.location.innerHTML = ROUTES({ pathname });
};

beforeEach(() => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock }); //Set localStorage
  window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "employe@test.ltd" })); //Set user as Employee in localStorage
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.append(root);
  router();
});

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can upload a file with extension jpg, jpeg, or png", () => {
      document.body.innerHTML = NewBillUI();
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const input = screen.getByTestId("file");
      const file = new File(["image"], "image.jpg", { type: "image/jpg" });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);

      input.addEventListener("change", handleChangeFile);
      userEvent.upload(input, file);

      expect(handleChangeFile).toHaveBeenCalled();
      expect(input.files[0]).toStrictEqual(file);
      expect(input.files[0].name).toBe("image.jpg");
    });
  });
});