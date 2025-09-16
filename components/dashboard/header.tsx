import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--envyron-navy)]/95 backdrop-blur-sm border-b border-[var(--envyron-teal)]/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[var(--envyron-teal)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-white font-semibold text-xl">Envyron</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 rounded-full bg-[var(--envyron-teal)]/20 hover:bg-[var(--envyron-teal)]/30"
              >
                <User className="w-4 h-4 text-[var(--envyron-light-teal)]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[var(--envyron-navy)] border-[var(--envyron-teal)]/30">
              <DropdownMenuItem className="text-white hover:bg-[var(--envyron-teal)]/20">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
