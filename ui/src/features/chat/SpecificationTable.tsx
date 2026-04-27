import type z from "zod"
import dataManipulation from "../../services/dataManipulation.services"
import type { SpecifcationRowSchema } from "../../types/message.schema"

type SpecificationTableProps = {
	specs: z.infer<typeof SpecifcationRowSchema>[]
}

const SpecificationTable = ({ specs }: SpecificationTableProps ) => {

	const headers = Object.keys(specs[0]) as (keyof typeof specs[number])[]
	const convertedHeaders = dataManipulation.capitalizeFirstChar(headers)

	return (
		<div className="overflow-x-auto     
			/* scrollbar size */
	    [&::-webkit-scrollbar]:h-2
  	  [&::-webkit-scrollbar]:w-2    
			[&::-webkit-scrollbar-thumb]:bg-white/10
			[&::-webkit-scrollbar-thumb]:rounded-full
			[scrollbar-width:thin]
			[scrollbar-color:rgba(255,255,255,0.2)] "
		>
			<table className=" p-2 w-full border-separate border-spacing-0 rounded-xl whitespace-nowrap">
				<thead className="">
					<tr className="text-black ">
						{
							convertedHeaders.map(header => {
								return (
									<th className={`
									p-2 																
									border-t-black
									border-t
									first:border-l
									first:border-l-black 
									first:rounded-tl-lg
									last:rounded-tr-lg
									last:border-r
									last:border-r-black
									${header === "Model"
											? 'text-left'
											: header === "Waterproof"
												? 'text-center'
												: 'text-right'}`} >
										{header}
									</th>
								)
							})
						}
					</tr>
				</thead>
				<tbody>
					{
						specs.map((spec, index) => {
							return (
								<tr className="p-2 hover:bg-red-100">
									{
										Object.entries(spec).map(([key, value]) => {
											return (
												<td className={`
													p-2 
													odd:
													border-b 
													border-gray-200
													first:border-l 
													first:border-l-black
													last:border-r 
													last:border-r-black
													${key === "model" ? "font-medium" : ""}
													${typeof value === "number"
														? "text-right"
														: typeof value === "boolean"
															? "text-center"
															: "text-left"}
													${index === Object.values(specs).length - 1 ? 'first:rounded-bl-lg last:rounded-br-lg border-b-black' : ''}
													${index % 2 === 0 ? "" : ""}
												`}>
													{typeof value === 'boolean'
														? value
															? "Yes"
															: "No"
														: value}
												</td>
											)
										})
									}
								</tr>
							)
						})
					}
				</tbody>
			</table>
		</div>
	)
}
export default SpecificationTable