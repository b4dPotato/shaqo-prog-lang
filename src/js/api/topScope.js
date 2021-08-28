import { Terminal } from './terminal'
import { Exceptions } from './entities'
import { EXPRESSIONS } from './constants'

const topScope = Object.create(null)
const terminal = new Terminal()

topScope[EXPRESSIONS.cin] = async function (ast, args) {
  if (!args) throw SyntaxError(`Invalid number of arguments - ${args.length}`)

  let i = 0;

  while(i < args.length) {
    let inputVal = await terminal.getInput()
    let arg = args[i]

    console.log('<< ', arg.name)

    if (arg.name) {
      ast.global[arg.name].value = inputVal  // Remove actions with ast
    } else {
      Exceptions.primitiveAssignError({ type: arg.type })
    }

    i++
  }

  return args
}

topScope[EXPRESSIONS.cout] = async function (ast, args) { // Remove action from argument
  if (!args) throw SyntaxError(`Invalid number of arguments - ${args.length}`)
  console.log(args)
  let i = 0;

  while(i < args.length) {
    let arg = args[i]
    
    if(arg?.name) {
      console.log('>> ', arg.value)
    } else {
      Exceptions.referenceError({ name: arg.name })
    }

    i++
  }

  return args
}

EXPRESSIONS.mathOperators.forEach(action => {
  topScope[action.operator] = new Function('ast' ,'args', `return args[0] ${action.operator} args[1]`)
})

export { topScope }