import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient";
import { cn } from "@/lib/utils";

export default function SelectModalUrl({
  value,
  label,
  apiUrl,
  onSelect,
  classDialogTrigger,
  disabled,
}) {
  const [options, setOptions] = useState([]); 
  const [search, setSearch] = useState(""); 
  const [isOpen, setIsOpen] = useState(false); 

  const fetchData = useCallback(async () => {
    try {
      const response = await apiClient.get(apiUrl);
      setOptions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen, fetchData]);

  // filter berdasarkan pencarian
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel =
    options.find((opt) => opt.id === value)?.name || label || "Pilih opsi...";

  return (
    <div className="relative">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Input
            value={selectedLabel}
            readOnly
            disabled={disabled}
            className={cn("text-left cursor-pointer", classDialogTrigger)}
          />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>{label ?? "Pilih Opsi"}</DialogTitle>
            <DialogDescription>
              Gunakan input pencarian untuk menemukan opsi yang tersedia.
            </DialogDescription>
          </DialogHeader>

          <Input
            type="text"
            placeholder="Cari..."
            className="mb-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="max-h-80 overflow-y-auto rounded p-2 text-gray-700 dark:text-gray-200">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className="cursor-pointer p-2 hover:bg-yellow-100 dark:hover:text-slate-800"
                  onClick={() => {
                    onSelect(option.id);   // kirim balik ke parent
                    setIsOpen(false);
                  }}
                >
                  {option.name}
                </div>
              ))
            ) : (
              <p className="text-gray-500">Tidak ada hasil.</p>
            )}
          </div>

          <Button
            variant="destructive"
            onClick={() => setIsOpen(false)}
            className="mt-2"
          >
            Tutup
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
