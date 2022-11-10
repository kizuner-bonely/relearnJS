export function monitorRPC(RPCGroup: Promise<unknown>[]) {
  return Promise.allSettled(RPCGroup)
}

export function monitorRPC2(RPCGroup: Promise<unknown>[]) {
  return new Promise(res => {
    let cnt = 0
    const success: Record<number, { value: any }> = {}
    const failure: Record<number, { reason: any }> = {}

    RPCGroup.forEach((p, i) => {
      p.then(
        value => {
          success[i] = { value }
          if (++cnt === RPCGroup.length) res([success, failure])
        },
        reason => {
          failure[i] = { reason }
          if (++cnt === RPCGroup.length) res([success, failure])
        },
      )
    })
  })
}
