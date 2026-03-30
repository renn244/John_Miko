import type { FieldError } from "react-hook-form";

export const getErrorMessages = (error?: FieldError): { message: string }[] => {
  let value: { message: string }[]  = [];

  if (!error) return value

  if (error.types) {
    Object.values(error.types).forEach((err) => {

      // handling invalid types
      if(typeof err === 'boolean') return
      if(typeof err === 'undefined') return

      if(err instanceof Array) {
        err.forEach((msg) => {
          value.push({ message: msg })
        })
      } else {
        value.push({ message: err })
      }
    })
  } else if(error.message) {
    value = [{ message: error.message }]
  }

  return value
}