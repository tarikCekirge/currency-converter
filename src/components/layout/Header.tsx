import { ModeToggle } from "@/components/ui/mode-toggle"

const Header = () => {
    return (
        <header>
            <div className="container py-4 flex items-center gap-4 justify-between border-b border-muted">
                <h1 className="text-lg font-bold tracking-tight text-primary">Currency Converter</h1>
                <ModeToggle />
            </div>
        </header>
    )
}

export default Header