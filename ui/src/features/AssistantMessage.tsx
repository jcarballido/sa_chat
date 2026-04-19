import { AssistantDataSchema, type AssistantMessageType } from "../types/message.schema"
import SpecificationTable from "./chat/SpecificationTable"

const AssistantMessage = ({assistantMessage}:{assistantMessage: AssistantMessageType}) => {
  try {
    const result = JSON.parse(assistantMessage.content)
    const validatedResult = AssistantDataSchema.safeParse(result)
    if(validatedResult.success){
      const data = validatedResult.data.domainData
      return (
        <div className={`my-8 text-black`}>
          <div className={`w-full p-2 rounded-xl`}>
            <SpecificationTable specs={data}/>
          </div>
        </div>
      )
    }
    throw new Error("Zod validation failed")
  } catch (error) {
    return (<div className={` my-8 text-black`}>
      <div className={`w-full p-2 rounded-xl`}>
        {assistantMessage.content}
      </div>
    </div>)                        
  }
}

export default AssistantMessage