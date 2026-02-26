export function buildChatService(inventoryStore: any){

  async function getRowsByColumnValue(column:string,value:string) {
    const result = inventoryStore.getRowsByColumnValue(column,value)
    return result
  }

  return{
    getRowsByColumnValue
  }
}