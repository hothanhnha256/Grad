// In ra link thiệp cho từng khách trong lib/guests.ts.
// Dùng: SITE_URL=https://<ten-mien> npm run links
import { guestLinks } from "../lib/guests";

const base = process.env.SITE_URL ?? "http://localhost:3000";
console.log(guestLinks(base).join("\n"));
