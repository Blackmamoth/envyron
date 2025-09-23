import type { Service } from "@/db/schema";
import { type SetStateAction, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  isOpen: boolean;
  onOpenChange: React.Dispatch<SetStateAction<boolean>>;
  availableServices: Service[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<SetStateAction<string>>;
  onAddService: (service: Service) => void;
};

export function AddServiceModal({
  isOpen,
  onOpenChange,
  availableServices,
  searchQuery,
  setSearchQuery,
  onAddService,
}: Props) {
  const filteredServices = useMemo(
    () =>
      availableServices.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [availableServices, searchQuery],
  );
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#006D77] hover:bg-[#83C5BE] text-white">
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0B1437] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Add Service</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search services and templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#050A1C] border-gray-600 text-white"
            />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#050A1C] hover:bg-gray-800 transition-colors"
              >
                <div>
                  <h3 className="font-medium font-mono">{service.name}</h3>
                  <p className="text-sm text-gray-400">{service.description}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onAddService(service)}
                  className="bg-[#006D77] hover:bg-[#83C5BE] text-white"
                >
                  Add
                </Button>
              </div>
            ))}
            {filteredServices.length === 0 && (
              <p className="text-center text-gray-400 py-4">
                No services found
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
