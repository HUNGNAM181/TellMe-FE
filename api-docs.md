# TellMe – Tài liệu API Backend

> **Base URL:** `http://localhost:<PORT>`  
> **Content-Type:** `application/json`

---

## 1. Xác thực Webhook Facebook

| Thông tin | Giá trị |
|-----------|---------|
| **Method** | `GET` |
| **Endpoint** | `/webhook` |
| **Mô tả** | Dùng để Facebook xác thực webhook khi thiết lập. FE **không cần** gọi endpoint này. |

---

## 2. Nhận tin nhắn từ Facebook (Facebook gọi tự động)

| Thông tin | Giá trị |
|-----------|---------|
| **Method** | `POST` |
| **Endpoint** | `/webhook` |
| **Mô tả** | Facebook tự động gọi khi có tin nhắn mới từ khách. FE **không cần** gọi endpoint này. |

---

## 3. Gửi tin nhắn tới khách hàng

| Thông tin | Giá trị |
|-----------|---------|
| **Method** | `POST` |
| **Endpoint** | `/webhook/send` |
| **Mô tả** | Gửi tin nhắn phản hồi tới khách hàng qua Facebook Messenger. |

### Request Body

```json
{
  "psid": "string",   // Page-Scoped ID của khách hàng
  "text": "string"    // Nội dung tin nhắn cần gửi
}
```

### Response

```json
// HTTP 200 OK
{
  // Kết quả trả về từ Facebook Graph API
}
```

---

## 4. Lấy danh sách cuộc hội thoại

| Thông tin | Giá trị |
|-----------|---------|
| **Method** | `GET` |
| **Endpoint** | `/webhook/conversations` |
| **Mô tả** | Lấy danh sách các cuộc hội thoại (phân trang). |

### Query Parameters

| Tham số | Kiểu | Mặc định | Mô tả |
|---------|------|----------|-------|
| `page` | `int` | `1` | Số trang |
| `limit` | `int` | `20` | Số bản ghi mỗi trang |

### Ví dụ Request

```
GET /webhook/conversations?page=1&limit=20
```

### Response

```json
// HTTP 200 OK
{
  // Danh sách cuộc hội thoại (cấu trúc tùy theo service trả về)
}
```

### Lỗi

```json
// HTTP 500
{
  "message": "Lỗi khi lấy danh sách chat",
  "error": "..."
}
```

---

## 5. Lấy lịch sử chat của một khách hàng

| Thông tin | Giá trị |
|-----------|---------|
| **Method** | `GET` |
| **Endpoint** | `/webhook/history/{psid}` |
| **Mô tả** | Lấy lịch sử tin nhắn của một khách hàng theo PSID (phân trang). |

### Path Parameter

| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `psid` | `string` | Page-Scoped ID của khách hàng |

### Query Parameters

| Tham số | Kiểu | Mặc định | Mô tả |
|---------|------|----------|-------|
| `page` | `int` | `1` | Số trang |
| `limit` | `int` | `20` | Số bản ghi mỗi trang |

### Ví dụ Request

```
GET /webhook/history/123456789?page=1&limit=20
```

### Response

```json
// HTTP 200 OK
{
  // Lịch sử tin nhắn của khách hàng (cấu trúc tùy theo service trả về)
}
```

### Lỗi

```json
// HTTP 500
{
  "message": "Lỗi khi lấy lịch sử chat",
  "error": "..."
}
```

---

## Tóm tắt nhanh

| Method | Endpoint | Dùng cho |
|--------|----------|----------|
| `GET` | `/webhook` | *(Facebook dùng – FE bỏ qua)* |
| `POST` | `/webhook` | *(Facebook dùng – FE bỏ qua)* |
| `POST` | `/webhook/send` | Gửi tin nhắn tới khách |
| `GET` | `/webhook/conversations` | Lấy danh sách hội thoại |
| `GET` | `/webhook/history/{psid}` | Lấy lịch sử chat |
