import type z from "zod";
import type { ConversationSchema } from "../types/conversation.schema";

const conversations: z.infer<typeof ConversationSchema>[] = [
    {
        conversationId: "c1a8b6f2-7c4e-4d1a-9f3a-1e2d9b8c0a11",
        createdAt: "2026-04-20T10:15:30.000Z",
        updatedAt: "2026-04-20T10:18:12.000Z",
        title: "Gun count and watproofing comparison...",
        messages: [
            {
                id: "m1",
                conversationId: "c1a8b6f2-7c4e-4d1a-9f3a-1e2d9b8c0a11",
                role: "user",
                content: "Why does my login keep failing?",
                createdAt: "2026-04-20T10:15:30.000Z",
                status: "delivered",
            },
            {
                id: "m2",
                conversationId: "c1a8b6f2-7c4e-4d1a-9f3a-1e2d9b8c0a11",
                role: "assistant",
                content: "It might be due to an expired session token.",
                createdAt: "2026-04-20T10:16:02.000Z",
                status: "delivered",
            },
        ],
    },
    {
        conversationId: "d2b9c7a1-3f5e-4a2b-8c1d-2f3e4a5b6c22",
        createdAt: "2026-04-19T08:05:10.000Z",
        updatedAt: null,
        title: "Temperature of a house fire",
        messages: [
        {
            id: "m3",
            conversationId: "d2b9c7a1-3f5e-4a2b-8c1d-2f3e4a5b6c22",
            role: "user",
            content: "The API just hangs on request.",
            createdAt: "2026-04-19T08:05:10.000Z",
            status: "delivered",
        },
        {
            id: "m4",
            conversationId: "d2b9c7a1-3f5e-4a2b-8c1d-2f3e4a5b6c22",
            role: "assistant",
            content: "Check if the server is running or blocked by CORS.",
            createdAt: "2026-04-19T08:06:45.000Z",
            status: "delivered",
        },
        ],
    },
    {
        conversationId: "e3c1d8f4-6a7b-4c2d-9e1f-3a4b5c6d7e33",
        createdAt: "2026-04-18T14:22:55.000Z",
        updatedAt: "2026-04-18T14:30:01.000Z",
        title: "Fire rating and internal volume of...",
        messages: [
        {
            id: "m5",
            conversationId: "e3c1d8f4-6a7b-4c2d-9e1f-3a4b5c6d7e33",
            role: "user",
            content: "The layout breaks on smaller screens.",
            createdAt: "2026-04-18T14:22:55.000Z",
            status: "delivered",
        },
        {
            id: "m6",
            conversationId: "e3c1d8f4-6a7b-4c2d-9e1f-3a4b5c6d7e33",
            role: "assistant",
            content: "You might need to adjust your flex or grid settings.",
            createdAt: "2026-04-18T14:24:10.000Z",
            status: "delivered",
        },
        {
            id: "m7",
            conversationId: "e3c1d8f4-6a7b-4c2d-9e1f-3a4b5c6d7e33",
            role: "user",
            content: "Yeah its overflowing horizontally.",
            createdAt: "2026-04-18T14:25:00.000Z",
            status: "sending",
        },
        ],
    },
];

export default {
    conversations,
}