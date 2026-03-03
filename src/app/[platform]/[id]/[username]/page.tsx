import { ChatWindow } from "../../../../components/ChatWindow";

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ platform: string; id: string; username: string }>;
}) {
  const { id } = await params;

  return <ChatWindow psid={id} />;
}
