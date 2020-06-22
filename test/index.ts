import { parseError } from '../src'
import { expect } from 'chai'

describe('Test parseError function', () => {
  // TODO: Remove try catch expression unless needed in case
  it('should have exists property of Error', () => {
    const error = new Error()
    const result = parseError(error)

    // FIXME: eslint config seems to not be used properly
    // eslint-disable-next-line
    expect(result).to.be.exist
    expect(result).to.be.an('object')
    expect(result).to.include.all.keys(['message', 'stack'])
    expect(result.message).to.be.a('string')
    expect(result.stack).to.be.an('array')
  })

  it('should have correctly catch local format stack and exist properties', () => {
    try {
      throw new Error()
    } catch (error) {
      const result = parseError(error)
      const firstStack = result.stack[0]
      expect(firstStack).to.include.all.keys(['filename', 'line', 'column'])

      expect(firstStack.filename).to.be.a('string')
      expect(/.[t|j]s/.test(firstStack.filename)).to.equal(true)
      expect(false).to.equal(false)

      expect(firstStack.line).to.be.a('number')
      expect(firstStack.column).to.be.a('number')
    }
  })

  it('should parse TypeError properly', () => {
    const stack = `TypeError: Error raised
        at bar http://192.168.31.8:8000/c.js:2:9`

    const error = new TypeError('Error raised')
    error.stack = stack

    const result = parseError(error)
    const expectedResult = {
      message: 'Error raised',
      stack: [
        {
          line: 2,
          column: 9,
          filename: 'http://192.168.31.8:8000/c.js'
        }
      ]
    }

    expect(result).to.deep.equal(expectedResult)
  })

  it('should parse chrome error fixture correctly', () => {
    const error = new TypeError('Error raised')
    const fixtureStack = `TypeError: Error raised
        at bar http://192.168.31.8:8000/c.js:2:9
        at foo http://192.168.31.8:8000/b.js:4:15
        at calc http://192.168.31.8:8000/a.js:4:3
        at <anonymous>:1:11
        at http://192.168.31.8:8000/a.js:22:3
      `

    error.stack = fixtureStack

    const result = parseError(error)
    const expectedStackResult = {
      message: 'Error raised',
      stack: [
        { line: 2, column: 9, filename: 'http://192.168.31.8:8000/c.js' },
        { line: 4, column: 15, filename: 'http://192.168.31.8:8000/b.js' },
        { line: 4, column: 3, filename: 'http://192.168.31.8:8000/a.js' },
        { line: 22, column: 3, filename: 'http://192.168.31.8:8000/a.js' }
      ]
    }

    expect(result).to.deep.equal(expectedStackResult)
  })

  it('should parse firefox fixture correctly', () => {
    const fixtureFirefoxStack = `
      bar@http://192.168.31.8:8000/c.js:2:9
      foo@http://192.168.31.8:8000/b.js:4:15
      calc@http://192.168.31.8:8000/a.js:4:3
      <anonymous>:1:11
      http://192.168.31.8:8000/a.js:22:3
    `

    const error = new TypeError()
    error.stack = fixtureFirefoxStack

    const result = parseError(error)
    const expectedResult = {
      message: '',
      stack: [
        { line: 2, column: 9, filename: 'http://192.168.31.8:8000/c.js' },
        { line: 4, column: 15, filename: 'http://192.168.31.8:8000/b.js' },
        { line: 4, column: 3, filename: 'http://192.168.31.8:8000/a.js' },
        { line: 22, column: 3, filename: 'http://192.168.31.8:8000/a.js' }
      ]
    }

    expect(result).to.deep.equal(expectedResult)
  })
})
