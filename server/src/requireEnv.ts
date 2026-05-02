const requireEnv = (key: string) => {
  const value = process.env[key]
  if(!value) throw new Error(`Missing ${key} from ENV file.`)
  return value
}

export default requireEnv