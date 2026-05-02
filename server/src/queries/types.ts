export type Operators<T> = {
  eq?: T,
  neq?: T,
  gt?:T extends number ? T : never,
  gte?:T extends number ? T : never,
  lt?:T extends number ? T : never,
  lte?:T extends number ? T : never,
}

export type Filter<T> = {
  [K in keyof T]? : Operators<T[K]>
  // [K in keyof T]?: T[K] extends string
  // ? {eq: string}
  // : T[K] extends boolean
  //   ? {eq: boolean}
  //   : Operators<T[K]>
}
