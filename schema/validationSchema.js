const exerciseDataValidationSchema = {
  description: {
    isString: true,
    notEmpty: {
      errorMessage: "Must not be empty"
    }
  },
  duration: {
    isInt: true,
    notEmpty: {
      errorMessage: "Must not be empty"
    }
  }
}

module.exports = exerciseDataValidationSchema