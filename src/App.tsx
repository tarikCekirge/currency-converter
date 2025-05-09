import { Button } from './components/ui/button'
import { ModeToggle } from './components/ui/mode-toggle'

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Button>Click me</Button>
      <ModeToggle />
    </div>
  )
}

export default App