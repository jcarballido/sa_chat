function capitalizeFirstChar(normalizedHeaders: string[]) {
  const convertedHeaders = normalizedHeaders.map(header => {
  const words = header
    .replaceAll("_"," ")
    .split(" ")
  const capitalized = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
  return capitalized
  })

  return convertedHeaders
}

export default {
  capitalizeFirstChar
}

