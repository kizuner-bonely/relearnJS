class CancelablePromise<T> extends Promise<T> {
  timeout(time: number): Promise<T>

  timeout(time: number) {
    const _timeout = new Promise((_, rej) => {
      setTimeout(() => rej('timeout'), time)
    })

    return Promise.race([this, _timeout])
  }
}

export { CancelablePromise }
