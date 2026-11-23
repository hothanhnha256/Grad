# Thiệp mời tốt nghiệp · Hồ Thanh Nhã — Implementation Plan (Next.js / Vercel)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Làm thiệp mời tốt nghiệp cho Hồ Thanh Nhã bằng Next.js, deploy lên Vercel từ GitHub repo `hothanhnha256/Grad`. Nội dung dựa trên https://nhancse.github.io/thiep-tot-nghiep/ nhưng đẹp hơn, và cá nhân hóa được theo người nhận qua `/<xưng-hô>/<tên>`.

**Architecture:** Next.js App Router, TypeScript, CSS thuần (`globals.css`). Một server component `<Invitation recipient>` render toàn bộ nội dung, nên khi tắt JS vẫn đọc được. Các phần tương tác (mở thiệp, đếm ngược, lightbox, copy SĐT, bản đồ, reveal) là các client component nhỏ. Logic thuần nằm trong `lib/` và được test bằng Vitest. Ảnh được nén trước bằng script Pillow vào `public/img/`.

**Tech Stack:** Next.js 16.4 (App Router), React 19, TypeScript, `next/font/google` (Be Vietnam Pro, Playfair Display, subset `vietnamese`), Vitest 5, Python 3 + Pillow (chỉ dùng cho bước xử lý ảnh), Node 20.19.

**Spec:** Chưa có file spec riêng. Các yêu cầu lấy từ hội thoại ngày 2026-11-23 và được ghi lại ở *Global Constraints*. Trang mẫu dùng để tham chiếu màu sắc, chữ và bố cục; bản HTML gốc đã lưu ở scratchpad.

## Global Constraints

- Tên **Hồ Thanh Nhã**, trong câu gọi là "Nhã".
- SĐT/Zalo **0386467955**: link gọi là `tel:+84386467955`, link Zalo là `https://zalo.me/0386467955`.
- Ngày giờ: **Thứ Bảy, 28/11/2026, 12:00–14:00 giờ TP.HCM**, tức `2026-11-28T12:00:00+07:00` đến `2026-11-28T14:00:00+07:00`. User đã xác nhận giữ như mẫu.
- Bằng cấp: **"Cử nhân Khoa học Máy tính · Niên khóa 2022"**. User đã xác nhận giữ như mẫu.
- Địa điểm: **Trường Đại học Bách khoa – ĐHQG TP.HCM, 268 Lý Thường Kiệt, phường Diên Hồng (quận 10 cũ), TP.HCM**.
- Điểm hẹn: **giữa tòa A2 và sân bóng đá**. Ghim đặt trên ảnh `map/image.png` (2048×974) ở `left: 43%; top: 47.7%`.
- Ảnh: hero dùng `QN801080.jpg`. Gallery dùng cả 5 ảnh theo thứ tự `QN801080, QN800648, QN801025, QN800641, QN800848`. Ảnh gốc trong `photo/` không được deploy (đưa vào `.gitignore`).
- Màu: `--navy-deep #071d31`, `--ink #123866`, `--ink-dark #0c1822`, `--blue #16558e`, `--ice #d2ecff`, `--paper #fffdf6`, `--cream #fff9ef`, `--gold #c9a24a`.
- Bảng xưng hô (key trên URL → nhãn hiển thị, cách tự xưng):

  | key | nhãn | tự xưng |
  |---|---|---|
  | `ban` | Bạn | "Nhã" |
  | `anh` | Anh | "em Nhã" |
  | `chi` | Chị | "em Nhã" |
  | `em` | Em | "anh Nhã" |
  | `thay` | Thầy | "em" |
  | `co` | Cô | "em" |

  Khi không có người nhận: lời chào "Trân trọng kính mời bạn", tự xưng "Nhã".
- URL người nhận có ba dạng: `/ban/thinh` (tra tên trong `lib/guests.ts`), `/ban/Thịnh` (tên lấy thẳng từ URL), và `/?x=ban&t=Thịnh`.
- Tiếng Việt, `lang="vi"`. Không cuộn ngang ở bề rộng 360px. Mọi nút tối thiểu 44px. Tôn trọng `prefers-reduced-motion`.

## Review Focus

1. **Tắt JS:** toàn bộ nội dung vẫn hiện, lớp phủ mở thiệp không che trang. Lớp phủ chỉ hiện khi `html.js`, class này do một inline script trong `<head>` thêm vào. Kiểm tra ở Task 4, step 3 (curl HTML có đủ nội dung).
2. **Múi giờ khác / sau giờ hẹn:** đếm ngược tính theo thời điểm tuyệt đối, không bao giờ âm. Đang trong giờ hẹn thì hiện "Đang diễn ra — Nhã đang chờ bạn!", sau giờ hẹn thì hiện "Cảm ơn bạn đã đến chung vui!". Test ở Task 2.
3. **Tên lạ trên URL** (có `<script>`, quá dài, viết thường, khoảng trắng thừa, sai mã `%`): React tự escape, tên bị cắt còn 40 ký tự và được viết hoa đầu từ. `decodeURIComponent` lỗi thì quay về lời chào mặc định. Key xưng hô lạ ở path thì trả 404, ở query thì dùng lời chào mặc định. Test ở Task 3.
4. **Lỗi hydration do thời gian:** đếm ngược render server không được lệch với client. Ô số render `--` cho tới khi component mount. Kiểm tra ở Task 4: console không có lỗi hydration.
5. **Bản đồ ở 360px:** khung cuộn ngang riêng và tự cuộn tới ghim. Kiểm tra thủ công ở Task 4.

---

## File Structure

```
app/layout.tsx                 # fonts, metadataBase, inline script thêm html.js
app/globals.css                # tokens + toàn bộ style
app/page.tsx                   # trang mặc định, đọc searchParams x/t
app/[xungHo]/[ten]/page.tsx    # trang người nhận + generateMetadata
components/Invitation.tsx      # server: toàn bộ các section
components/Cover.tsx           # client: phong bì mở thiệp
components/Countdown.tsx       # client
components/CampusMap.tsx       # client: bản đồ + ghim + tự cuộn
components/Gallery.tsx         # client: lưới ảnh + <dialog> lightbox
components/CopyPhone.tsx       # client
components/Reveal.tsx          # client: IntersectionObserver
lib/event.ts                   # EVENT
lib/invite.ts                  # countdown + URL builders
lib/recipient.ts               # bảng xưng hô, slugify, resolve
lib/guests.ts                  # GUESTS: "ban/thinh" -> "Thịnh"
scripts/optimize_images.py     # photo/, map/ -> public/img/
scripts/links.ts               # in link cho từng khách (npm run links)
tests/*.test.ts                # vitest
```

---

### Task 1: Scaffold Next.js + ảnh

**Files:** tạo project bằng `create-next-app`. Tạo thêm `scripts/optimize_images.py`, `tests/images.test.ts`, `public/img/*`, `vitest.config.ts` và cập nhật `.gitignore`.

**Produces:**
- `public/img/hero-1600.webp`, `hero-800.webp`
- `gallery-{1..5}-1200.webp`, `gallery-{1..5}-600.webp`
- `campus-map.webp`
- `og.jpg` (1200×630)

- [ ] **Step 1:** Chạy `npx create-next-app@16.4.6 . --ts --app --eslint --no-tailwind --no-src-dir --import-alias "@/*" --use-npm`. Repo đã có `README.md`, `photo/`, `map/` nên có thể phải tạo project ở thư mục tạm rồi chuyển file sang. Sau đó cài `vitest`, thêm script `"test": "vitest run"`, và thêm `photo/` vào `.gitignore`.
- [ ] **Step 2: Failing test** `tests/images.test.ts`:
  - mọi file ở mục Produces đều tồn tại;
  - giới hạn dung lượng: `hero-800` ≤ 150KB, `hero-1600` ≤ 350KB, mỗi `gallery-*-600` ≤ 120KB, `campus-map` ≤ 400KB, `og.jpg` ≤ 200KB;
  - các file webp có magic bytes `RIFF....WEBP`.
  
  Chạy `npm test`, kỳ vọng FAIL.
- [ ] **Step 3:** Viết `scripts/optimize_images.py`: gọi `exif_transpose` trước, resize bằng LANCZOS, xuất WebP `quality=80, method=6`. Nếu file vượt giới hạn thì giảm quality mỗi lần 5. Ảnh `og.jpg` crop vùng nửa trên của hero.
- [ ] **Step 4:** Chạy `python3 scripts/optimize_images.py && npm test`, kỳ vọng PASS. Chạy thêm `npm run build`, kỳ vọng build OK.
- [ ] **Step 5:** Commit `feat: scaffold Next.js app and optimized images`.

### Task 2: `lib/event.ts` + `lib/invite.ts`

**Produces:**
- `EVENT = { name, shortName, degree, start, end, venue, address, meetPoint, phone }`, với giá trị lấy từ Global Constraints.
- `getCountdown(nowMs: number, event = EVENT): { state: "before" | "during" | "after"; days; hours; minutes; seconds }`
- `buildCalendarUrl(event): string`
- `buildDirectionsUrl(event): string`
- `zaloUrl(phone): string`
- `telUrl(phone): string`

- [ ] **Step 1: Failing tests** `tests/invite.test.ts`. Mỗi dòng dưới đây là một test case, kèm kết quả mong đợi:
  - `27/11 10:30:15+07` → `{before, 1, 1, 29, 45}`
  - `2026-11-28T04:59:59Z` → `before`, `seconds` = 1
  - `05:00:00Z` → `during`
  - `13:00+07` → `during`, các số đều = 0
  - `14:00:01+07` → `after`, không có số nào âm
  - Calendar URL: chứa `action=TEMPLATE` và `ctz=Asia/Ho_Chi_Minh`, có `dates` bằng `20261128T050000Z/20261128T070000Z`, có `text` bằng `Gặp mặt mừng tốt nghiệp cùng Hồ Thanh Nhã`, và `details` chứa `giữa tòa A2 và sân bóng đá` cùng `0386467955`.
  - `zaloUrl` và `telUrl` cho ra đúng hai link ở Global Constraints.
- [ ] **Step 2:** Chạy `npm test`, kỳ vọng FAIL. **Step 3:** implement. **Step 4:** chạy lại, kỳ vọng PASS. **Step 5:** commit `feat: event data, countdown, link builders`.

### Task 3: `lib/recipient.ts` + `lib/guests.ts`

**Produces:**
- `HONORIFICS: Record<string, { label: string; self: string }>`
- `slugify(s): string`: bỏ dấu, chuyển `đ` thành `d`, viết thường, dùng `-` làm dấu nối.
- `normalizeName(s): string`: bỏ khoảng trắng thừa, viết hoa đầu từ, tối đa 40 ký tự.
- `type Recipient = { key: string; label: string; name: string; self: string }`
- `resolveRecipient(key?: string, rawName?: string): Recipient | null`: dùng cho cả path lẫn query. Đầu tiên tra `GUESTS[`${key}/${rawName}`]`, không có thì `normalizeName(safeDecode(rawName))`. Key lạ thì trả `null`. Thiếu tên thì `name` là `""`.
- `greetingFor(r: Recipient | null): { greeting: string; self: string }`
- `GUESTS: Record<string, string>`, ban đầu có `{ "ban/thinh": "Thịnh", "anh/tuan": "Tuấn", "thay/hung": "Hùng" }` để user thay bằng danh sách thật.
- `guestLinks(baseUrl): string[]` cho ra các dòng dạng `"Bạn Thịnh\thttps://.../ban/thinh"`.

- [ ] **Step 1: Failing tests** `tests/recipient.test.ts`:
  - `slugify`: `"Thịnh"` → `"thinh"`, `"Đức Anh"` → `"duc-anh"`.
  - `resolveRecipient("ban", "thinh")` → name `"Thịnh"` (lấy từ GUESTS).
  - `resolveRecipient("anh", "Tu%E1%BA%A5n")` → `{ label: "Anh", name: "Tuấn", self: "em Nhã" }`.
  - `resolveRecipient("ban", "  th%E1%BB%8Bnh ")` → name `"Thịnh"`.
  - Tên dài 60 ký tự bị cắt còn 40.
  - `resolveRecipient("ban", "%E0%A4%A")` (mã `%` hỏng) không throw và trả name `""`.
  - `resolveRecipient("sep", "A")` → `null`.
  - `greetingFor(resolveRecipient("thay"))` → `{ greeting: "Thân mời Thầy", self: "em" }`.
  - `greetingFor(resolveRecipient("ban", "Thịnh"))` → `"Thân mời Bạn Thịnh"`.
  - `greetingFor(null)` → `{ greeting: "Trân trọng kính mời bạn", self: "Nhã" }`.
  - Mọi key trong GUESTS có key xưng hô hợp lệ và có tên khác rỗng.
- [ ] **Step 2:** FAIL. **Step 3:** implement, và viết `scripts/links.ts` chạy bằng `npm run links` (dùng `node --experimental-strip-types`). Base URL lấy từ `SITE_URL`, mặc định `http://localhost:3000`. **Step 4:** PASS. **Step 5:** commit `feat: recipient resolution and guest list`.

### Task 4: Giao diện thiệp

**Files:** tạo `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/[xungHo]/[ten]/page.tsx` và toàn bộ `components/*`.

**Interfaces:**
- `<Invitation recipient={Recipient | null} />`.
- `app/page.tsx` nhận `searchParams` (kiểu Promise trong Next 16), rồi gọi `resolveRecipient(x, t)`.
- `[xungHo]/[ten]/page.tsx`: nếu `HONORIFICS[xungHo]` không tồn tại thì gọi `notFound()`. `generateMetadata` trả `title: "Thân mời Bạn Thịnh · Thiệp tốt nghiệp Hồ Thanh Nhã"` và `openGraph.images: ["/img/og.jpg"]`. Thêm `generateStaticParams` từ GUESTS và để `dynamicParams = true`.
- `metadataBase` lấy `process.env.NEXT_PUBLIC_SITE_URL`, không có thì dùng `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`, không có nữa thì `http://localhost:3000`.

**Các section, theo thứ tự:**
1. **Cover** (client): phong bì navy, viền vàng. Trên đó là dòng lời chào lấy từ `greetingFor`, tên "Hồ Thanh Nhã" và nút "Mở thiệp". Bấm nút thì hai nắp mở trong 900ms, rồi fade, rồi focus vào h1. Phím Esc cũng mở được. Cover hiện khi selector `html.js` khớp, trừ khi `sessionStorage['invite-opened']` đã được đặt.
2. **Hero:** dùng `next/image` cho `hero-1600.webp`, đặt `priority`, phủ lớp scrim navy. Nội dung:
   - eyebrow "Thiệp mời lễ tốt nghiệp";
   - dòng lời chào;
   - h1 "Hồ Thanh Nhã" (Playfair Display);
   - dòng bằng cấp;
   - "Thứ Bảy, 28/11/2026";
   - hai nút pill: "Lưu vào Google Calendar" và "Nhắn {self} qua Zalo".
3. **Lời mời + Countdown:** tiêu đề "Hẹn gặp bạn lúc 12:00", lời mời "Trân trọng mời bạn đến chung vui cùng {self} trong ngày tốt nghiệp…". Countdown có 4 ô; server render `--`, client tick mỗi giây.
4. **Thời gian & Địa điểm:** chia 2 cột, dưới 720px thì gộp thành 1 cột.
5. **Điểm hẹn** (CampusMap): tiêu đề "Điểm hẹn: giữa tòa A2 và sân bóng đá".
   - `.map-canvas` có `min-width: 760px` và nằm trong khung `overflow-x: auto`.
   - Ghim vàng ở 43% / 47.7%, có pulse, kèm nhãn "Điểm hẹn 🎓".
   - Khi mount thì tự cuộn tới ghim.
   - Chú thích bên dưới: "Vào cổng 268 Lý Thường Kiệt (Entrance 1), đi về phía sân bóng đá; điểm hẹn nằm giữa sân bóng và tòa A2."
   - Thêm `<details>` "Xem trên Google Maps" chứa iframe `loading="lazy"`, cùng nút "Chỉ đường đến trường".
6. **Gallery "Khoảnh khắc":** desktop 3 cột, mobile 2 cột, ảnh `-600` lazy và có alt mô tả. Bấm vào ảnh mở `<dialog>` hiển thị bản `-1200`, có nút trước/sau, phím ←/→/Esc và vuốt được trên mobile.
7. **Liên hệ:** tiêu đề "Đến trường, liên hệ {self} nhé", ba nút "Nhắn Zalo", "Gọi 0386467955" và CopyPhone. CopyPhone hiện "Đã sao chép ✓" trong 2 giây; nếu lỗi thì select số để người dùng tự copy.
8. **Footer:** "Thiệp mời lễ tốt nghiệp · Hồ Thanh Nhã · 2026".
- **Reveal:** dùng `.reveal` và `.is-visible`. Nếu bật reduced-motion hoặc trình duyệt không có IntersectionObserver thì hiện luôn.

- [ ] **Step 1:** Implement layout, CSS và các component theo danh sách section ở trên.
- [ ] **Step 2:** Chạy `npm test && npm run build`, kỳ vọng PASS và build OK. Route `/ban/thinh` phải được prerender.
- [ ] **Step 3:** Chạy `npm start`, rồi dùng curl kiểm tra:
  - `/` chứa `Hồ Thanh Nhã`, `zalo.me/0386467955`, `tel:+84386467955`, `giữa tòa A2 và sân bóng đá`, `Trân trọng kính mời bạn`.
  - `/ban/thinh` chứa `Thân mời Bạn Thịnh`, và `<title>` chứa `Thân mời Bạn Thịnh`.
  - `/anh/Tu%E1%BA%A5n` chứa `Thân mời Anh Tuấn` và `em Nhã`.
  - `/?x=chi&t=Lan` chứa `Thân mời Chị Lan`.
  - `/sep/a` trả status 404.
  - `/?x=ban&t=%3Cscript%3E` chứa `&lt;script&gt;` và không có tag `<script>` thô.
- [ ] **Step 4:** Mở trình duyệt ở 360px và 1440px, kiểm tra:
  - cover mở được;
  - countdown chạy;
  - ghim nằm giữa sân bóng và A2, không đè ghim A1;
  - bản đồ tự cuộn tới ghim;
  - lightbox chạy được;
  - nút copy chạy được;
  - không có cuộn ngang;
  - console không có lỗi hydration.
- [ ] **Step 5:** Commit `feat: invitation UI with personalization`.

### Task 5: README + deploy Vercel

- [ ] **Step 1:** Viết README gồm:
  - cách sửa `lib/event.ts` và `lib/guests.ts`;
  - cách chạy `npm run links`;
  - link nhanh dạng `/anh/Tên` hoặc `/?x=anh&t=Tên`;
  - cách thay ảnh (`python3 scripts/optimize_images.py`);
  - `npm test` và `npm run dev`.
- [ ] **Step 2:** Chạy `npm test && npm run build`, kỳ vọng PASS. Sau đó commit.
- [ ] **Step 3 (cần user đồng ý):**
  - `git push origin main`.
  - Trên vercel.com, chọn Add New Project → Import `hothanhnha256/Grad`. Framework sẽ tự nhận là Next.js.
  - Kiểm tra URL production và preview khi gửi link `/ban/thinh` qua Zalo.
