// import type z from "zod"
import { AssistantMessageContentSchema, type AssistantMessageType } from "../../types/message.schema"
import SpecificationTable from "./SpecificationTable"

const AssistantMessage = ({ assistantMessage }: { assistantMessage: AssistantMessageType }) => {
  // try {
  const result = assistantMessage.content
  try {
    // const parsed: z.infer<typeof AssistantMessageContentSchema> = JSON.parse(result)
    const validatedResult = AssistantMessageContentSchema.safeParse(result)
    if (validatedResult.error) {
      console.log("ERROR VALIDATING CONTENT: ")
      console.log(validatedResult.error)
      return (
        <div className={` my-8 text-[#e4e4e4]`}>
          <div className={`w-full p-2 rounded-xl`}>
            ERROR WITH DOMAIN DATA
          </div>
        </div>
      )
    }
    const content = validatedResult.data
    if(content.data.length === 0){
    return (
      <div className={`my-8 text-[#121212]`}>
        <div className={`w-full p-2 rounded-xl`}>
          No results found.
        </div>
      </div>
    )
      
    }
    if (content.type === "similar_products") {
      // console.log("RESULT TYPE: SIMILAR PRODUCTS")
      const { data } = content;
      const t = data.map(entry => {
        const refModels = Object.keys(entry)
        const s1 = refModels.map(mod => {
          return entry[mod]
        })
        const s = s1[0]
        return s
      })
      const t1 = t[0]

      return (
        <div className={`my-8 text-black`}>
          <div className={`w-full p-2 rounded-xl`}>
            <SpecificationTable specs={t1} />
          </div>
        </div>
      )

    }

    return (
      <div className={`my-8 text-black`}>
        <div className={`w-full p-2 rounded-xl`}>
          <SpecificationTable specs={content.data} />
        </div>
      </div>
    )

  } catch (error) {
    // console.log("CONTENT COULD NOT BE PARSED WITH JSON.parse")
    console.log("RESULT:")
    console.log(result)
    return (
      <div className={` my-8 text-black`}>
        <div className={`w-full p-2 rounded-xl`}>
          {result.text}
        </div>
      </div>
    )
  }
}

export default AssistantMessage