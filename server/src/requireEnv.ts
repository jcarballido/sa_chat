const requireEnv = (key: string) => {
  const value = process.env[key]
  console.log("KEY:")
  console.log(key)
  console.log(".ENV VALUE:")
  console.log(value)
  if(!value) throw new Error(`Missing ${key} from ENV file.`)
  return value
}

export default requireEnv