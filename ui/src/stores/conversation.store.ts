// import { create } from "zustand"
// import type { UserMessageType } from "../types/message.schema"
// import {  ConversationMetadataSchemaArray, DefinedConversationMetadataSchema, type ActiveConversationType, type ConversationMetadataArrayType, type ConversationType, type DefinedConversationMetadataType } from "../types/conversation.schema"
// import { api } from "../api/apiClient"

// type State = {
//   activeConversation: ActiveConversationType,
//   activeConversationID: ActiveConversationType["conversationId"]["temp"] | Exclude<ActiveConversationType["conversationId"]["storage"],null>,
//   storedConversationMetadata: DefinedConversationMetadataType
//   // activeConversation: (UserMessageType["content"] | AssistantMessageType["content"])[],
//   // conversationsMetadata: ConversationMetadatataArrayType, 
//   // activeConversationId: string | number | null,
//   // activeTitle: string | null
// }

// type Action = {
//   getStoredConversationMetadata: () => Promise<void>,
//   setActiveConversation: () => Promise<void>,
//   updateActiveConversationMetadata: () => void,
//   addUserMessage: (newUserMessage: UserMessageType) => void,
//   updateUserMessage: (userMessageID: number | string) => void
  
//   // getConversationsMetadata: () => Promise<void>,
//   // addUserMessage: (content: string) => void,
//   // setActiveConversationID:(conversationId: string | number)=> void,
//   // setConversationTitle: (title: string, activeConversationId: number) => void
// }

// const createConversation = (initialMessage: UserMessageType): ConversationType => {
//   const conversation = {
//     conversationId:{
//       temp:`temp_${Math.floor(Math.random()*1000000) + 1}`,
//       storage: null
//     },
//     createdAt:null,
//     updatedAt:null,
//     messages:[initialMessage],
//     title:""
//   }
//   return conversation
// }

// const randomInt = (): number => {
//   const n = Math.floor((Math.random() * 10000) + 1)
//   return n
// }

// export const useMessageStore = create<State & Action>()(
//   (set,get) => ({

//     activeConversation: {
//       conversationId: {
//         temp: `temp_${randomInt}`,
//         storage: null
//       },
//       title: "",
//       messages:[]
//     },

//     activeConversationID: get().activeConversation.conversationId.temp,
    
//     storedConversationMetadata:[],
    
//     getStoredConversationMetadata: async() => {
//       try {
//         const res = await api.get("/api/getStoredConversations", DefinedConversationMetadataSchema)
//         set((state) => {
//           return {
//             storedConversationMetadata:[...res]
//           }
//         })
//       } catch (error) {
//         console.log("ERROR LOADING STORED CONVERSATIONS")
//       }
//     },
    
//     setActiveConversation:,
    
//     updateActiveConversationMetadata:,
    
//     addUserMessage:,
    
//     updateUserMessage:
  

//     // conversationsMetadata: [],
//     // activeConversation: [],
//     // activeConversationId: null,    
//     // activeTitle: null, 

//     // getConversationsMetadata: async() => {
//     //   const response = await api.get("/api/getConverstations", ConversationMetadataSchemaArray)
//     //   if(!response){
//     //     throw new Error("Failed to load conversations.")
//     //   }
//     //   set({
//     //     conversationsMetadata: [...response]
//     //   })
//     // },

//     // setActiveConversationID:(activeConversationId: string | number) => {
//     //   if(typeof(activeConversationId) === "string" ){
//     //     set({activeConversationId: activeConversationId})
//     //   }
//     //   // else if type = number, fetch the contents of the conversation and set 'conversation' equal to it.
//     // },

//     // addUserMessage: (message: UserMessageType["content"]) => {
//     //   set((state) => {
//     //     return {
//     //       activeConversation: [...state.activeConversation,message]
//     //     }
//       // })
//   //   },


//   //   setConversationTitle:(title: string, activeConversationId: number) => set((state)=> {
//   //     const convs = state.conversations
//   //     const updated = convs.map(conv => {
//   //       if(conv.conversationId === activeConversationId){
//   //         if(!conv["title"] || conv.title === "") conv["title"] === title 
//   //       }
//   //       return conv
//   //     })
//   //     return {
//   //       conversations: [...updated]
//   //     }
//   //   })

//   })
// )

import { create } from "zustand"
import type { AssistantMessageType, UserMessageType } from "../types/message.schema"
import { ConversationMetadataSchemaArray, ConversationSchema, DefinedConversationMetadataSchema, ResponseConversationMetadataSchema, type ActiveConversationType, type ConversationType, type DefinedConversationMetadataType } from "../types/conversation.schema"
import { api } from "../api/apiClient"

type State = {
  activeConversation: ActiveConversationType,
  // activeConversationID: ActiveConversationType["conversationId"]["temp"] | Exclude<ActiveConversationType["conversationId"]["storage"],null>,
  storedConversationMetadata: DefinedConversationMetadataType
}

type Action = {
  getStoredConversationMetadata: () => Promise<void>,
  setActiveConversation: (id?: number) => Promise<void>,
  updateActiveConversationID: (storedID: number) => void, 
  addToStoredConversation: (storedConversation: DefinedConversationMetadataType[number]) => void,
  addUserMessage: (newUserMessage: UserMessageType) => void,
  addAssistantMessage: (newAssistantMessage: AssistantMessageType) => void,
  updateUserMessageID: (tempID: string, storageID: number) => void
}

// const createConversation = (initialMessage: UserMessageType): ConversationType => {
//   const conversation = {
//     conversationId:{
//       temp:`temp_${Math.floor(Math.random()*1000000) + 1}`,
//       storage: null
//     },
//     createdAt:null,
//     updatedAt:null,
//     messages:[initialMessage],
//     title:""
//   }
//   return conversation
// }
const draftConversation = (): ConversationType => {
  const conversation = {
    conversationId:{
      temp:`temp_${Math.floor(Math.random()*1000000) + 1}`,
      storage: null
    },
    // createdAt:null,
    // updatedAt:null,
    messages:[],
    title:""
  }
  return conversation
}

const randomInt = (): number => {
  const n = Math.floor((Math.random() * 10000) + 1)
  return n
}

export const useConversationStore = create<State & Action>()(
  (set,get) => ({

    activeConversation: {
      conversationId: {
        temp: `temp_${randomInt()}`,
        storage: null
      },
      title: "",
      messages:[]
    },

    // activeConversationID: get().activeConversation.conversationId.storage ?? get().activeConversation.conversationId.temp,
    
    storedConversationMetadata:[],
    
    getStoredConversationMetadata: async() => {
      try {
        const res = await api.get("/chat/getStoredConversations", ResponseConversationMetadataSchema)
        if(res.error) throw new Error("Error from server.")
        const { data } = res
        set({
          storedConversationMetadata:[...data]
        })
      } catch (error) {
        console.log("ERROR LOADING STORED CONVERSATIONS")
      }
    },
    
    setActiveConversation: async(storedConversationID?: number) => {
      let conversation: ConversationType
      if(storedConversationID) {
        try {
          const res = await api.get(`/api/conversations/${storedConversationID}`,ConversationSchema)          
          conversation = {...res}
        } catch (error) {
          throw new Error(`COULD NOT LOAD CONVERSATION ID: ${storedConversationID}`)
        }
      }else{
        conversation = draftConversation()
      }
      set({activeConversation: {...conversation}})
    },

    updateActiveConversationID: (storedID: number) => {
      set((state)=> {
        if(!state.activeConversation.conversationId.storage){
          return {
            activeConversation: {
              ...state.activeConversation,
              conversationId: {
                temp:state.activeConversation.conversationId.temp,
                storage: storedID
              }
            }
          }
        }
        return {activeConversation: {...state.activeConversation}}
      })
    },
    
    addToStoredConversation: ( convertedConversation: DefinedConversationMetadataType[number] )=>{
      // const { conversationId, title } = convertedConversation
      set((state) => {
        return{
          storedConversationMetadata: [...state.storedConversationMetadata, convertedConversation]
        }  
      })
    },
    
    addUserMessage:(userMessage: UserMessageType) => {
      set( (state) => {
        const updatedConversation = {
          ...state.activeConversation,
          messages: [...state.activeConversation.messages, userMessage]
        }
        return {
          activeConversation: updatedConversation 
        }
      })
    },

    addAssistantMessage:(newAssistantMessage: AssistantMessageType) => {
      set( (state) => {

        return {
          activeConversation: {
            ...state.activeConversation,
            messages:[
              ...state.activeConversation.messages,
              newAssistantMessage
            ]
          }
        }
      })
    },
    
    updateUserMessageID: (tempID: string, storageID: number) => {
      set((state) => {
        const messages = [...state.activeConversation.messages]
        const updatedMessage = messages.map(msg => {
          // msg = {id:{},role:"",content}
          if(msg.role === "user" && msg.id.temp === tempID){
            return {
              ...msg,
              id:{
                temp: msg.id.temp,
                storage: storageID
              }
            }
          }else{
            return msg
          }
          
        })
        return{
          activeConversation: {
            ...state.activeConversation, 
            messages: [...updatedMessage]
          }
        }
      })
    }
  })
)