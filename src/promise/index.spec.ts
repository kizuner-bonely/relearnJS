import { describe, expect, test } from 'vitest'
import { CancelablePromise, monitorRPC, monitorRPC2 } from './index'

//* CancelablePromise
describe('CancelablePromise', () => {
  test('success', async () => {
    const p = new CancelablePromise(res => {
      setTimeout(res, 1000)
    }).timeout(5000)

    await expect(p).resolves.toEqual(undefined)
  })

  test('timeout', async () => {
    const p = new CancelablePromise(res => {
      setTimeout(res, 2000)
    }).timeout(1000)

    await expect(p).rejects.toThrow('timeout')
  })
})

describe('RPCGroup', () => {
  test('allSettled', async () => {
    const p = monitorRPC([
      createRPC(1000, true),
      createRPC(2000, false),
      createRPC(3000, true),
      createRPC(4000, false),
      createRPC(5000, true),
    ])

    const expectedAns = [
      { status: 'fulfilled', value: true },
      { status: 'rejected', reason: false },
      { status: 'fulfilled', value: true },
      { status: 'rejected', reason: false },
      { status: 'fulfilled', value: true },
    ]

    await expect(p).resolves.toEqual(expectedAns)
  })

  test('monitorRPC2', async () => {
    const p = monitorRPC2([
      createRPC(1000, true),
      createRPC(2000, false),
      createRPC(3000, true),
      createRPC(4000, false),
      createRPC(5000, true),
    ])

    const expectedAns = [
      {
        0: { value: true },
        2: { value: true },
        4: { value: true },
      },
      {
        1: { reason: false },
        3: { reason: false },
      },
    ]

    await expect(p).resolves.toEqual(expectedAns)
  })
})

function createRPC(timeout: number, result: boolean) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (result) resolve(true)
      else reject(false)
    }, timeout)
  })
}
