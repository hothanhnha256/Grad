# Thiệp mời tốt nghiệp · Hồ Thanh Nhã

Thiệp mời online làm bằng Next.js, deploy trên Vercel. Mỗi khách nhận một link riêng, mở ra thấy lời mời có tên của mình, ví dụ "Thân mời Bạn Thịnh".

---

## 1. Thêm khách mời và gửi link (việc hay làm nhất)

### Bước 1: Mở file `lib/guests.ts` và thêm một dòng cho mỗi người

```ts
export const GUESTS: Record<string, string> = {
  // Có xưng hô:  "<xưng-hô>/<tên-không-dấu>": "<Tên có dấu>"
  "ban/thinh": "Thịnh",        // → /ban/thinh   → "Thân mời Bạn Thịnh"
  "chi/mai": "Mai",            // → /chi/mai     → "Thân mời Chị Mai"
  "thay/hung": "Hùng",         // → /thay/hung   → "Kính mời Thầy Hùng"

  // Không xưng hô:  "<tên-không-dấu>": "<Tên có dấu>"
  "khanh-linh": "Khánh Linh",  // → /khanh-linh  → "Thân mời Khánh Linh"
  king: "King",                // → /king        → "Thân mời King"
};
```

**Quy tắc viết phần bên trái (phần nằm trên link):**
- Viết thường, **bỏ dấu**, đổi `đ` thành `d`, dùng dấu `-` thay cho khoảng trắng. Ví dụ "Đức Anh" thành `duc-anh`.
- Hai người trùng tên và cùng xưng hô thì thêm hậu tố để phân biệt: `"ban/minh-k22": "Minh"`, `"ban/minh-cntt": "Minh"`. Cả hai thiệp vẫn chỉ hiện "Bạn Minh".
- Tên không xưng hô không được trùng với các chữ dành cho xưng hô: `ban`, `anh`, `chi`, `em`, `thay`, `co`.

**Phần bên phải** là tên hiển thị trên thiệp. Viết **có dấu**, đúng như bạn muốn khách đọc thấy.

**Xưng hô hỗ trợ và cách thiệp tự đổi lời:**

| Key trên link | Thiệp ghi | Thiệp gọi khách là | Thiệp tự xưng |
|---|---|---|---|
| `ban` | Thân mời **Bạn** … | bạn | Nhã |
| `anh` | Thân mời **Anh** … | anh | em Nhã |
| `chi` | Thân mời **Chị** … | chị | em Nhã |
| `em` | Thân mời **Em** … | em | anh Nhã |
| `thay` | Kính mời **Thầy** … | Thầy | em |
| `co` | Kính mời **Cô** … | Cô | em |
| *(không có)* | Thân mời **Khánh Linh** | Khánh Linh | Nhã |

Muốn thêm kiểu xưng hô mới (ví dụ "Cô chú") thì sửa `lib/honorifics.ts`.

### Bước 2: Kiểm tra rồi đưa lên mạng

```bash
npm test                 # báo lỗi nếu key sai (còn dấu, viết hoa, xưng hô lạ, trùng chữ xưng hô)
git add lib/guests.ts
git commit -m "thêm khách mời"
git push origin main     # Vercel tự build và deploy sau khoảng 1 phút
```

### Bước 3: In danh sách link để copy gửi Zalo

```bash
SITE_URL=https://<ten-mien-cua-ban>.vercel.app npm run links
```

Kết quả, mỗi dòng gồm tên và link (cách nhau bằng tab, dán thẳng vào Google Sheets được):

```
Bạn Thịnh   https://<ten-mien>.vercel.app/ban/thinh
Chị Mai     https://<ten-mien>.vercel.app/chi/mai
Khánh Linh  https://<ten-mien>.vercel.app/khanh-linh
```

Tên miền xem ở trang project trên vercel.com, mục **Domains**.

### Gửi nhanh cho khách chưa có trong danh sách (không cần sửa code)

| Link | Thiệp ghi |
|---|---|
| `/anh/Tuấn` | Thân mời Anh Tuấn |
| `/?x=chi&t=Lan` | Thân mời Chị Lan |
| `/?t=Ngọc` | Thân mời Ngọc (không xưng hô) |
| `/` | Trân trọng kính mời bạn (thiệp chung) |

Cách này gõ thẳng tên có dấu vào link. Khi gửi qua Zalo, link sẽ tự mã hoá thành dạng `%E1%BA…`, trông hơi xấu nhưng vẫn mở đúng. Muốn link gọn thì thêm khách vào `lib/guests.ts`.

---

## 2. Chạy trên máy

```bash
npm install          # chỉ cần lần đầu
npm run dev          # chế độ sửa code, tự tải lại → http://localhost:3000
```

Chạy bản production giống trên Vercel:

```bash
npm run build
npm start            # http://localhost:3000  (đổi port: npm start -- -p 3100)
```

Hai lỗi hay gặp:
- **Trang mất CSS, chỉ còn chữ trắng đen:** do chạy `npm run build` khi `npm start` vẫn đang chạy. Tắt server (Ctrl+C), build lại, rồi start lại.
- **`EADDRINUSE`:** port đã có server khác dùng. Tắt nó bằng `kill $(lsof -ti tcp:3000)` (thay 3000 bằng port đang bị chiếm).

Thử thiệp ở máy: mở `http://localhost:3000/ban/thinh`. Phong bì chỉ hiện một lần cho mỗi tab; muốn xem lại hiệu ứng mở thiệp thì mở tab mới.

---

## 3. Sửa nội dung khác

| Muốn sửa | File |
|---|---|
| Ngày giờ, địa điểm, SĐT/Zalo | `lib/event.ts` |
| Câu chữ, thứ tự các phần | `components/Invitation.tsx` |
| Phần đầu trang (ảnh collage, tiêu đề) | `components/Hero.tsx` |
| Màu sắc, font | `app/globals.css`, `app/layout.tsx` |
| Vị trí ghim điểm hẹn trên bản đồ | `PIN` trong `components/CampusMap.tsx` (tính theo % ảnh `map/image.png`) |
| Giai điệu nhạc hộp | `MELODY` trong `lib/audio.ts` |

## 4. Thay ảnh

Bỏ ảnh gốc vào `photo/` (thư mục này không đưa lên git). Cần có các ảnh chân dung, `logohcmut.png` và `backgroundhcmut.png`. Nếu đổi tên file thì sửa danh sách trong `scripts/optimize_images.py`, rồi chạy:

```bash
python3 scripts/optimize_images.py   # cần Pillow: pip install pillow
npm test                             # kiểm tra ảnh đủ và đủ nhẹ
```

Ảnh đã nén sẽ nằm ở `public/img/`.

## 5. Deploy lên Vercel (làm một lần)

1. Vào vercel.com, chọn **Add New → Project**, rồi **Import** repo `hothanhnha256/Grad`. Framework sẽ tự nhận là Next.js.
2. Bấm **Deploy**. Từ đó về sau, mỗi lần `git push origin main` thì Vercel tự deploy bản mới.
3. (Tuỳ chọn) Nếu dùng tên miền riêng, vào **Settings → Environment Variables** và thêm `NEXT_PUBLIC_SITE_URL=https://ten-mien-rieng`, để ảnh xem trước khi gửi link qua Zalo/Facebook trỏ đúng địa chỉ.
