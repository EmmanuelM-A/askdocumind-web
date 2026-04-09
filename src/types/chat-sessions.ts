import {UUID} from "@/types/api.ts";


export interface CreateChatSession {
    title: string;
}

export interface CreatedChatSession {
    chat_id: UUID;
}

export interface ChatSession {
    id: UUID;
    user_id: UUID;
    title: string;
    total_messages: number;
    created_at: string;
}

export interface UpdateChatSession {
    title: string;
}

export interface DeletedChatSession {
    chat_id: UUID;
}

export interface InitChatSession {
    user_id: UUID;
    title?: string;
}
