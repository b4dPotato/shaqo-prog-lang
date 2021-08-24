export class Terminal {
  getInput () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let value
        while(!value) {
          value = prompt('Write value')
        }
        resolve(value)
      }, 500)
    })
  }
}