export interface Message {
  role: string;
  content: string;
  toolUseId?: string;
}

export function messageToString(message: Message): string {
  const idTag = message.toolUseId ? ` [${message.toolUseId}]` : "";
  return `#<Message role=${message.role}${idTag} content=${message.content.slice(0, 61)}...>`;
}
