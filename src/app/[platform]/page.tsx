import { MessageCircle } from "lucide-react";

export default function PlatformPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-gray-50 h-full">
      <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-xl font-medium text-gray-600">Chưa chọn hội thoại nào</h2>
      <p className="text-gray-500 mt-2">Chọn một khách hàng từ danh sách bên trái để bắt đầu chat</p>
    </div>
  );
}
