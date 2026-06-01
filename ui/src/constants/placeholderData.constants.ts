import type z from "zod";
import type { ConversationSchema, DefinedConversationMetadataType } from "../types/conversation.schema";

const conversations: z.infer<typeof ConversationSchema>[] = [
    {
        conversationId: {
            temp:"c1a8b6f2-7c4e-4d1a-9f3a-1e2d9b8c0a11",
            storage: 1
        },
        // createdAt: "2026-04-20T10:15:30.000Z",
        // updatedAt: "2026-04-20T10:18:12.000Z",
        title: "Gun count and watproofing comparison...",
        messages: [
            {
                id: {
                    temp:"m1",
                    storage:1
                },
                role: "user",
                content: "What is the gun count and waterproofing of model A and B?",
            },
            {
                id:2,
                role: "assistant",                
                content: {
                    title: "",
                    type: "related",
                    text: "Model A can hold 50 guns, while model B only holds 48. Both are waterpoof to the same rating.",
                    data: null
                  },
            },
        ],
    },
    {
        conversationId: {
            temp:"d2b9c7a1-3f5e-4a2b-8c1d-2f3e4a5b6c22",
            storage:2
        },
        title: "Temperature of a house fire",
        messages: [
        {
            id: {
                temp:"m3",
                storage: 3},
            role: "user",
            content: "How hot does a house fire get?",
        },
        {
            id:4,
            role: "assistant",
            content:{
                title: "",
                type: "related",
                text: "A house fire typically reaches 1200°F, but it highly depends on the construction of the house along with its contents.",
                data: null
            }
        },
        ],
    },
    {
        conversationId: {
            temp: "e3c1d8f4-6a7b-4c2d-9e1f-3a4b5c6d7e33",
            storage:3
        },
        title: "Fire rating and internal volume of...",
        messages: [
        {
            id: {
                temp:"m5",
                storage: 5
            },
            // conversationId: "e3c1d8f4-6a7b-4c2d-9e1f-3a4b5c6d7e33",
            role: "user",
            content: "What are the specs of model C?",
            // createdAt: "2026-04-18T14:22:55.000Z",
            // status: "delivered",
            // title:""
        },
        {
            id: 6,
            // conversationId: "e3c1d8f4-6a7b-4c2d-9e1f-3a4b5c6d7e33",
            role: "assistant",
            content:{
                title: "",
                type: "related",
                text: "Model C has a high fire rating, moderate gun count, thick steel gauge, and a backup key.",
                data: null
            }

            // createdAt: "2026-04-18T14:24:10.000Z",
            // status: "delivered",
            // title:""
        },
        {
            id:{
                temp:"m7",
                storage: 7
            } ,
            role: "user",
            content: "Is it better than model D?",
        },
        ],
    },
];

const conversationIds = conversations.map(conv => conv.conversationId)
const index = Math.floor(Math.random()*(conversationIds.length - 1))

const activeId = conversationIds[index] ?? conversationIds[0]

const conversationMetadata: DefinedConversationMetadataType = conversations.map(conv => {
    return {
        conversationId:{
            ...conv.conversationId,
            storage: conv.conversationId.storage!
        },
        title:conv.title
    }
})

export default {
    conversations,
    activeId,
    conversationMetadata
}