export function checkStopToken(stopToken?: string) {
  if (stopToken !== undefined) {
    const xhr = new XMLHttpRequest()

    // synchronous XHR usage to check the token
    xhr.open('GET', stopToken, false)
    try {
      xhr.send(null)
    } catch (e) {
      throw new Error('aborted')
    }
  }
}
