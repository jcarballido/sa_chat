import type { CsvQuery } from "../store/buildStore.js"

export function buildChatService(inventoryStore: CsvQuery, specificationStore:CsvQuery, messageStore:any){

  async function generateResponse(){
    // llm captures intent
    if(messageStore.history.length == 0){
      // New chat created
    }else{
      // capture history to pass into llm
    }
  }

  async function getRowByColumnValue(column:string,value:string) {
    const result = inventoryStore.getRowsByColumnValue(column,value)
    return result
  }

  return{
    getRowByColumnValue,
    generateResponse
  }
}