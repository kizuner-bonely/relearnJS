import { describe, expect, test } from 'vitest'
import {
  CancelablePromise,
  monitorRPC,
  monitorRPC2,
  monitorRPC3,
} from './index'

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

  test('monitorRPC3', async () => {
    const p = monitorRPC3(
      [
        () => createRPC(1000, true),
        () => createRPC(2000, false),
        () => createRPC(3000, true),
        () => createRPC(4000, false),
        () => createRPC(5000, true),
        () => createRPC(1000, false),
        () => createRPC(2000, false),
        () => createRPC(3000, true),
      ],
      5,
    )

    const firstExpectedAns = [
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

    const secondExpectedAns = [
      {
        2: { value: true },
      },
      {
        0: { reason: false },
        1: { reason: false },
      },
    ]

    await expect(p.value).resolves.toEqual(firstExpectedAns)
    await expect(p.then().value).resolves.toEqual(secondExpectedAns)
  }, 10000)
})

function createRPC(timeout: number, result: boolean) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (result) resolve(true)
      else reject(false)
    }, timeout)
  })
}
