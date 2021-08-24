import { TYPES } from "./constants"
import { topScope } from "./topScope"
export class Interpreter {
  async interpret (ast) {
    if (!ast.stack.length) return
    console.log('stack', ast.stack)
  
    for (const action of ast.stack) {
      if (action.type === TYPES.expression) {
        const args = action.args.map(arg => ast.global[arg.name] || arg)
        await topScope[action.kind](ast, args)
      }
    }
  }
}