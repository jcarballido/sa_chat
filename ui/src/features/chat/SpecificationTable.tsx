const SpecificationTable = ({specs}:{specs:{"model":string,"gun_count":number, "waterproof":boolean, "height":number, "width": number }[]}) => {

	const headers = Object.keys(specs[0]) as (keyof typeof specs[number])[] 

	return(
		<div className="overflow-x-auto     
				/* scrollbar size */
    [&::-webkit-scrollbar]:h-2
    [&::-webkit-scrollbar]:w-2

    /* track */
    

    /* thumb */
    [&::-webkit-scrollbar-thumb]:bg-white/10
    [&::-webkit-scrollbar-thumb]:rounded-full

    /* hover */
    [&::-webkit-scrollbar-thumb]:bg-white/20

    /* Firefox */
    [scrollbar-width:thin]
    [scrollbar-color:rgba(255,255,255,0.2)] ">
			<table className=" p-2 w-full border-separate border-spacing-0 rounded-xl">
				<thead className="">
					<tr className="text-black ">
						{
							headers.map( header => {
								return(
									<th className={`
									p-2 
									
									odd: 
									
									border-t-black
									border-t
									first:border-l
									first:border-l-black 
									first:rounded-tl-lg
									last:rounded-tr-lg
									last:border-r
									last:border-r-black
									bg-gray-300
									font-semibold
									${header === "model" 
									? 'text-left'
									: header === "waterproof"
										? 'text-center'
										:'text-right'}`} >
										{header}
									</th>
								)
							})
						}
					</tr>
				</thead>
				<tbody>
					{
						specs.map( (spec, index) => {
							return(
								<tr className="p-2 hover:bg-red-100">
									{
										Object.entries(spec).map( ([key,value]) => {
											// if(typeof value === 'boolean'){
											// 	return (
											// 		<td className={`text-center odd:bg-white/10 border-b border-gray-200 ${index % 2 === 0 ? "bg-white":"bg-stone-100"}`}>
											// 			{value ? "YES":"NO"}
											// 		</td>
											// 	)
											// }
											return(
												<td className={`
													p-2 
													odd:
													border-b 
													border-gray-200
													first:border-l 
													first:border-l-black
													last:border-r 
													last:border-r-black
													${key === "model" ? "font-medium":""}
													${typeof value === "number" 
													? "text-right"
													: typeof value === "boolean"
														? "text-center"
														: "text-left"}
													${index === Object.values(specs).length - 1 ? 'first:rounded-bl-lg last:rounded-br-lg border-b-black':''}
													${index % 2 === 0 ? "":""}
												`}>
													{typeof value === 'boolean' 
													? value 
														? "Yes"
														:"No"
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