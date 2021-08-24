import { Terminal } from './terminal'
import { Exceptions } from './entities'

const topScope = Object.create(null)
const terminal = new Terminal()

topScope.cin = async function (ast, args) {
  for (let i = 0; i < args.length; i++) {
    let inputVal = await terminal.getInput()
    let arg = args[i]

    console.log('<< ', arg.name)

    if (arg.name) {
      ast.getVol(arg.name).value = inputVal  // Remove actions with ast
    } else {
      Exceptions.primitiveAssignError({ type: arg.type })
    }
  }

  return args
}

topScope.cout = async function (ast, args) {
  for (let i = 0; i < args.length; i++) {
    let arg = args[i]
    
    if(arg?.name) {
      console.log('>> ', arg.value)
    } else {
      Exceptions.referenceError({ name: arg.name })
    }
  }

  return args
}

export { topScope }