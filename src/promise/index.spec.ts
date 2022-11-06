import { describe, expect, test } from 'vitest'
import { CancelablePromise } from './index'

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
