export function formatLocalTime(dateInput?: string | Date | null) {
  if (!dateInput) return "";

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const formatDateSeparator = (dateString: string) => {
  const msgDate = new Date(dateString);
  const today = new Date();

  msgDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - msgDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";

  return msgDate.toLocaleDateString("vi-VN");
};

export function createSlug(text?: string, maxLength = 80): string {
  if (!text) return "khach-hang";

  let slug = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) slug = "khach-hang";

  return slug.slice(0, maxLength);
}
