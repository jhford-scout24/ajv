import _Ajv from "../ajv"
import chai from "../chai"
const should = chai.should()

describe('issue #50: references with "definitions"', () => {
  it("should be supported by addSchema", spec("addSchema"))

  it("should be supported by compile", spec("addSchema"))

  function spec(method) {
    return () => {
      const ajv = new _Ajv()

      ajv[method]({
        $id: "http://example.com/test/person.json#",
        definitions: {
          name: {type: "string"},
        },
        type: "object",
        properties: {
          name: {$ref: "#/definitions/name"},
        },
      })

      ajv[method]({
        $id: "http://example.com/test/employee.json#",
        type: "object",
        properties: {
          person: {$ref: "/test/person.json#"},
          role: {type: "string"},
        },
      })

      const result = ajv.validate("http://example.com/test/employee.json#", {
        person: {
          name: "Alice",
        },
        role: "Programmer",
      })

      result.should.equal(true)
      should.equal(ajv.errors, null)
    }
  }
})
