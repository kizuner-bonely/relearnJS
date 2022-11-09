export function monitorRPC(RPCGroup: Promise<unknown>[]) {
  return Promise.allSettled(RPCGroup)
}
