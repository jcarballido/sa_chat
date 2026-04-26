import { AssistantMessageContentSchema, type AssistantMessageType } from "../../types/message.schema"
import SpecificationTable from "./SpecificationTable"

const AssistantMessage = ({ assistantMessage }: { assistantMessage: AssistantMessageType }) => {
  try {
    const result = assistantMessage.content
    const parsed: typeof AssistantMessageContentSchema = JSON.parse(result)
    const validatedResult = AssistantMessageContentSchema.safeParse(parsed)
    // if(validatedResult.error){
    //   console.log("Error validating message:")
    //   console.log(validatedResult.error)
    //   console.log("***")
    // }
    if (validatedResult.success) {
      const result = validatedResult.data
      if (!result.data) {
        console.log("No data present")
        return (
          <div className={` my-8 text-black`}>
            <div className={`w-full p-2 rounded-xl`}>
              ERROR WITH DOMAIN DATA
            </div>
          </div>
        )
      }
      if (result.type === "similar_products") {
        console.log("PRODUCT COMPARISON")
        console.log("RESULT DATA:")
        console.log(result.data)
        console.log("---")
        const { data } = result;
        const t = data.map(entry => {
          console.log("ENTRY AT SIMILAR_PRODUCTS")
          console.log(entry)
          const refModels = Object.keys(entry)
          const s1 = refModels.map(mod => {
            return entry[mod]
          })
          const s = s1[0]
          return s
        })
        const t1 = t[0]

        return(
            <div className={`my-8 text-black`}>
              <div className={`w-full p-2 rounded-xl`}>
                <SpecificationTable specs={t1} />
              </div>
            </div>          
        )
        
      }
      // if(result.type === "other"){
      //   return (<div className={` my-8 text-black`}>
      //     <div className={`w-full p-2 rounded-xl`}>
      //       {data.text}
      //     </div>
      //   </div>)                        
      // }
      // if(result.type === ("product_lookup_by_model" | "product_lookup_by_specs" | "similar_products"))
      // if (result.type !== "similar_products"){
        return (
          <div className={`my-8 text-black`}>
            <div className={`w-full p-2 rounded-xl`}>
              <SpecificationTable specs={result.data} />
            </div>
          </div>
        )
      // }
    }
    // throw new Error("Zod validation failed")
  } catch (error) {
    console.log(error)
    return (
      <div className={`my-8 text-black`}>
        <div className={`w-full p-2 rounded-xl`}>
          {assistantMessage.content}
        </div>
      </div>
    )
  }
}

export default AssistantMessage