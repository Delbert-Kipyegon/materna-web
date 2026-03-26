export interface Character {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  description: string;
  replica_id: string;
}

export interface IConversation {
  conversation_id: string;
  conversation_url?: string;
  status: string;
  created_at?: string;
}
