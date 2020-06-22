export interface Stack {
  line: number
  column: number
  filename: string
}

export interface ErrorMessage {
  message: string
  stack: Array<Stack>
}

// const case1 = '  at callFn (/Users/xxx/some-project/node_modules/_mocha@7.2.0@mocha/lib/runnable.js:374:21)'
// const case2 = '  calc@http://192.168.31.8:8000/a.js:4:3'
// const case3 = '  at calc@http://192.168.31.8:8000/a.js:4:3'
// const case4 = '<anonymous>:1:11'

const stackReg = /\(?((http|\/).*[j|t]s):([\d]+):([\d]+)\)?/g

export function parseError (err: Error): ErrorMessage {
  const stack: Array<Stack> = []

  if (err.stack) {
    /* first attemp
    stack = err.stack.split('\n')
      .slice(1)
      .filter((s: string) => stackReg.test(s))
      .map((s: string) => {
        const matched = s.match(stackReg)
        const [, filename,, line, column] = [].slice.call(matched);
        return { filename, line: +line, column: +column }
      })
    */

    /* second method
    [].slice.call(err.stack.matchAll(stackReg)).map(([, filename,, line, column]) => ({
      filename,
      line: +line,
      column: +column
    }))
    */

    // ignore full match and submatch on (http|\/)
    for (const [, filename,, line, column] of err.stack.matchAll(stackReg)) {
      stack.push({ filename, line: +line, column: +column })
    }
  }

  return {
    stack,
    message: err.message
  }
}
