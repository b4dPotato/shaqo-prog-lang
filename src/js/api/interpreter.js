import { TYPES } from "./constants"
import { topScope } from "./topScope"
export class Interpreter {
  async interpret (ast) {
    if (!ast.stack.length) return
  
    if (ast.stack.length) {
      console.log('stack --start', [...ast.stack])

      let action = ast.stack[0]
      if (action.type === TYPES.expression) {
        const args = action.args.map(arg => ast.getVol(arg.name) || arg)
        await topScope[action.kind](ast, args)
        ast.stack.shift()
      }

      this.interpret(ast)
      console.log('stack --end', [...ast.stack])
    }
  }
}