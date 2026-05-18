export function success<T>(dataSchema: T) {
  return{
    status:"success",
    data: dataSchema,
    error:null
  }
}
  
export function failure (code: string, message:string){
  return {
    status:"error",
    data: null,
    error:{
      code,
      message
    }
  }
}
