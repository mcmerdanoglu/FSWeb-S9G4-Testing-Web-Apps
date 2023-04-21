import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const header = screen.getByRole("heading", { name: /İletişim Formu/i });
  expect(header).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const input = screen.getByLabelText("Ad*");
  userEvent.type(input, "Cem");
  const errorMessage = screen.getByTestId("error");
  expect(errorMessage).toHaveTextContent(
    "Hata: ad en az 5 karakter olmalıdır."
  );
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const button = screen.getByRole("button", { name: /Gönder/i });
  userEvent.click(button);
  await waitFor(() => {
    const errorMessages = screen.getAllByTestId("error");
    expect(errorMessages.length).toBe(3);
  });
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText("Ad*");
  const soyadInput = screen.getByLabelText("Soyad*");
  userEvent.type(adInput, "Ferman");
  userEvent.type(soyadInput, "Joker");
  const btn = screen.getByText("Gönder");
  userEvent.click(btn);
  const errors = screen.getAllByTestId("error");
  expect(errors).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const input = screen.getByLabelText(/Email\*/i);
  userEvent.type(input, "abc-test.com");
  const errorMessage = screen.getByTestId("error");
  expect(errorMessage).toHaveTextContent(
    "Hata: email geçerli bir email adresi olmalıdır."
  );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText("Ad*");
  userEvent.type(adInput, "Casım");
  const email = screen.getByLabelText(/Email\*/i);
  userEvent.type(email, "abc@test.com");
  const button = screen.getByRole("button", { name: /Gönder/i });
  userEvent.click(button);
  const errorMessage = await screen.findByTestId("error");
  expect(errorMessage).toHaveTextContent("Hata: soyad gereklidir.");
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const isimInput = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(isimInput, "Babangida");
  const soyİsimInput = screen.getByPlaceholderText(/Mansız/i);
  userEvent.type(soyİsimInput, "Ukechukwu");
  const mailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(mailInput, "abc@test.com");
  const submitButton = screen.getByText(/Gönder/);
  userEvent.click(submitButton);
  await waitFor(() => {
    const errorDiv = screen.queryAllByTestId("error");
    expect(errorDiv.length).toBe(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("İlhan"), "Babangida");
  userEvent.type(screen.getByPlaceholderText("Mansız"), "Ukechukwu");
  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "abc@test.com"
  );
  userEvent.type(screen.getByText("Mesaj"), "Sweet Home Chicago");
  userEvent.click(screen.getByRole("button"));
  expect(await screen.findByTestId("firstnameDisplay")).toHaveTextContent(
    "Babangida"
  );
  expect(await screen.findByTestId("lastnameDisplay")).toHaveTextContent(
    "Ukechukwu"
  );
  expect(await screen.findByTestId("emailDisplay")).toHaveTextContent(
    "abc@test.com"
  );
  expect(await screen.findByTestId("messageDisplay")).toHaveTextContent(
    "Sweet Home Chicago"
  );
});
