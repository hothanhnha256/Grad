# Thiệp mời tốt nghiệp · Hồ Thanh Nhã

Next.js (App Router), deploy trên Vercel.

## Chạy thử

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest
npm run build      # kiểm tra build production
```

## Gửi thiệp riêng cho từng người

Có 3 kiểu link:

| Link | Hiển thị |
|---|---|
| `/ban/thinh` | "Thân mời Bạn Thịnh" (tên có dấu lấy từ `lib/guests.ts`) |
| `/anh/Tuấn` | "Thân mời Anh Tuấn" (tên lấy thẳng từ link, không cần khai báo) |
| `/?x=chi&t=Lan` | "Thân mời Chị Lan" |
| `/khanh-linh` | "Thân mời Khánh Linh" (khách không xưng hô, tên lấy từ `lib/guests.ts`) |
| `/?t=Ngọc` | "Thân mời Ngọc" (không xưng hô, không cần khai báo) |

Xưng hô hỗ trợ: `ban` (Bạn), `anh` (Anh), `chi` (Chị), `em` (Em), `thay` (Thầy), `co` (Cô).
Thiệp tự đổi cách xưng: với Anh/Chị là "em Nhã", với Em là "anh Nhã", với Thầy/Cô là "em".
Muốn thêm kiểu xưng hô thì sửa `lib/honorifics.ts`.

Danh sách khách có link đẹp (không dấu) nằm ở `lib/guests.ts`:

```ts
export const GUESTS = {
  "ban/thinh": "Thịnh",   // có xưng hô  → /ban/thinh
  "khanh-linh": "Khánh Linh", // không xưng hô → /khanh-linh
};
```

In toàn bộ link để copy gửi Zalo:

```bash
SITE_URL=https://<ten-mien>.vercel.app npm run links
```

## Sửa nội dung

- Ngày giờ, địa điểm, SĐT, dòng bằng cấp: `lib/event.ts`
- Bố cục và câu chữ: `components/Invitation.tsx` (hero collage: `components/Hero.tsx`)
- Màu sắc, font: `app/globals.css`
- Vị trí ghim điểm hẹn trên bản đồ: `PIN` trong `components/CampusMap.tsx` (tính theo % ảnh `map/image.png`)

## Thay ảnh

Bỏ ảnh gốc vào `photo/` (thư mục này không đưa lên git; cần cả `logohcmut.png` và `backgroundhcmut.png`), sửa danh sách trong
`scripts/optimize_images.py` nếu đổi tên file, rồi chạy:

```bash
python3 scripts/optimize_images.py   # cần Pillow
```

Ảnh đã nén sẽ nằm ở `public/img/`.

## Deploy lên Vercel

1. Push repo lên GitHub.
2. Vào vercel.com, chọn **Add New → Project**, import repo này. Framework được nhận diện tự động là Next.js.
3. (Tuỳ chọn) Nếu dùng tên miền riêng thì đặt biến môi trường `NEXT_PUBLIC_SITE_URL`, để ảnh preview khi gửi link qua Zalo/Facebook trỏ đúng địa chỉ.
