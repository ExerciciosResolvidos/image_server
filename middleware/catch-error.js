
const getMessageError = error => (error.text || error.message)

const checkErrorType = [
  (error) => getMessageError(error).match(/params|permited/) ? 422 : null,
  (error) => getMessageError(error).match(/not found/) ? 404 : null ,
  (error) => getMessageError(error).match(/validation failed/) ? 422 : null 
]

module.exports = (err, req, res, next) => {
  let status = 400
    
  checkErrorType.forEach(test => {
    if (test(err))
      status = test(err)
  })

  const error = {
    message: getMessageError(err),
    stack: err.stack
  }

  if (process.env.NODE_ENV !== "production")
   error.stack = err.stack
  
  console.error(error)

  res.status(status).json(error)
}