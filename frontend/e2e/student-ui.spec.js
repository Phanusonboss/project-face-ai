import { test, expect } from "@playwright/test";
import { STUDENT, loginAs } from "./helpers";

// โครงหน้า + การตั้งค่าธีม/ภาษา/ขนาดตัวอักษรของฝั่งนักศึกษา (หน้าตาเดียวกับฝั่งอาจารย์)
test.describe("ฝั่งนักศึกษา: ปุ่มและการตั้งค่า", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, STUDENT, /\/dashboard$/);
  });

  test("หัวข้อหน้าอยู่บนแถบหัวเหมือนฝั่งอาจารย์", async ({ page }) => {
    await page.goto("/history");
    await expect(page.locator("header h1")).toHaveText("ประวัติการเช็คชื่อ");
    await expect(page.getByRole("link", { name: "แดชบอร์ด" })).toBeVisible();
    await expect(page.getByText("ระบบปลอดภัย 100%")).toBeVisible();
  });

  test("หน้าการตั้งค่า: ธีม ขนาดตัวอักษร ภาษา และรีเซ็ต", async ({ page }) => {
    await page.goto("/settings");
    await page.getByRole("button", { name: "โหมดมืด" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    const bg = await page.locator(".student-shell").evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe("rgb(2, 6, 23)");

    await page.getByRole("button", { name: "ใหญ่", exact: true }).click();
    await expect(page.locator("html")).toHaveCSS("font-size", "18px");

    await page.getByLabel("ภาษา").selectOption("en");
    await expect(page.locator("header h1")).toHaveText("Settings");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page.goto("/history");
    await expect(page.locator("header h1")).toHaveText("Check-in History");

    await page.goto("/settings");
    await page.getByRole("button", { name: "Restore defaults" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect(page.locator("html")).toHaveCSS("font-size", "16px");
    await expect(page.locator("header h1")).toHaveText("การตั้งค่า");
  });

  test("การ์ดสถิติบนแดชบอร์ดกดไปหน้ารายละเอียดได้", async ({ page }) => {
    const cards = [
      ["เช็คชื่อวันนี้", /\/checkin$/],
      ["เช็คชื่อทั้งหมด", /\/history$/],
      ["อัตราการเข้าเรียน", /\/courses$/],
      ["ขาดเรียน", /\/history\?status=absent$/],
    ];
    for (const [label, url] of cards) {
      await page.goto("/dashboard");
      await page.getByRole("link", { name: new RegExp(label) }).first().click();
      await expect(page).toHaveURL(url);
    }
    // การ์ดขาดเรียนเปิดหน้าประวัติโดยเลือกแท็บ "ขาดเรียน" ไว้แล้ว
    await expect(page.getByRole("button", { name: "ขาดเรียน" })).toHaveClass(/bg-red-50/);
  });

  test("ประวัติ: ปฏิทินเลือกวันที่เป็นภาษาไทยและกรองตามวันที่", async ({ page }) => {
    await page.goto("/history");
    await page.getByRole("button", { name: "ตั้งแต่วันที่" }).click();
    const dialog = page.getByRole("dialog", { name: "ตั้งแต่วันที่" });
    // หัวปฏิทินเป็นชื่อเดือนไทย + ปี พ.ศ.
    await expect(dialog).toContainText(/(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม) 25\d\d/);
    await dialog.getByRole("button", { name: "วันนี้" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "ตั้งแต่วันที่" })).toContainText(/25\d\d/);
  });

  test("ประวัติ: กรองตามแท็บสถานะ", async ({ page }) => {
    await page.goto("/history");
    await page.getByRole("button", { name: "ขาดเรียน" }).click();
    const statuses = page.locator("tbody tr td:nth-child(5)");
    await expect(statuses.first()).toBeVisible();
    for (const text of await statuses.allTextContents()) expect(text).toContain("ขาดเรียน");
  });

  test("กระดิ่งเปิดรายการประกาศ และเมนูผู้ใช้ไปหน้าโปรไฟล์", async ({ page }) => {
    await page.getByRole("button", { name: "ประกาศล่าสุด" }).click();
    await page.getByRole("link", { name: "ดูประกาศทั้งหมด" }).click();
    await expect(page).toHaveURL(/\/announcements$/);

    await page.locator("header button").filter({ hasText: STUDENT.firstName }).click();
    await page.locator("header").getByRole("link", { name: "โปรไฟล์" }).click();
    await expect(page).toHaveURL(/\/profile$/);
  });

  test("ลิงก์เปลี่ยนรหัสผ่านในโปรไฟล์เปิดฟอร์มในหน้าการตั้งค่า", async ({ page }) => {
    await page.goto("/profile");
    await page.getByRole("link", { name: /เปลี่ยนรหัสผ่าน/ }).click();
    await expect(page).toHaveURL(/\/settings\?tab=security$/);
    await expect(page.getByPlaceholder("รหัสผ่านปัจจุบัน")).toBeVisible();
  });
});

// ใช้งานบนมือถือ: เมนูเป็นลิ้นชัก และหน้าไม่กว้างเกินจอ
test.describe("ฝั่งนักศึกษา: มือถือ", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("เปิดเมนูจากปุ่ม ☰ แล้วไปหน้าอื่นได้ และไม่มีหน้าไหนล้นจอ", async ({ page }) => {
    await loginAs(page, STUDENT, /\/dashboard$/);
    const nav = page.getByRole("link", { name: "ประวัติการเช็คชื่อ" });
    await expect(nav).not.toBeInViewport();

    await page.getByRole("button", { name: "เปิดเมนู" }).click();
    await expect(nav).toBeInViewport();
    await nav.click();
    await expect(page).toHaveURL(/\/history$/);
    await expect(page.getByRole("link", { name: "ประวัติการเช็คชื่อ" })).not.toBeInViewport();

    for (const path of ["/dashboard", "/checkin", "/history", "/courses", "/schedule", "/announcements", "/profile", "/settings"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const [docWidth, viewWidth] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
      expect(docWidth, path).toBeLessThanOrEqual(viewWidth);
    }
  });
});
