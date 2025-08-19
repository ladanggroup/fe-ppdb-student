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
import { cn } from '@/lib/utils';

export default function SelectModalUrl({ label, name, apiUrl, onSelect, classDialogTrigger }) {
  const [options, setOptions] = useState([]); // Menyimpan opsi dari API
  const [selected, setSelected] = useState(null); // Menyimpan nama opsi terpilih
  const [selectedId, setSelectedId] = useState(null); // Menyimpan ID opsi
  const [search, setSearch] = useState(""); // Input pencarian
  const [isOpen, setIsOpen] = useState(false); // Status modal

  useEffect(() => {
    setSelected(null);
    setSelectedId(null);
  }, [apiUrl]);

  /**
   * Fetch data from API.
   *
   * @returns {Promise<void>}
   */
  const fetchData = useCallback(async () => {
    try {
      const response = await apiClient.get(apiUrl);
      setOptions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [apiUrl]);

  // Filter opsi berdasarkan pencarian
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  // Saat user memilih opsi
  const selectOption = (option) => {
    setSelected(option.name);
    setSelectedId(option.id);
    setIsOpen(false);
    onSelect(option.id);
  };

  // just fetch when open is true
  useEffect(() => {
    if (isOpen === true) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  return (
    <div className="relative">
      {/* Button untuk membuka modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
        className={cn("w-full", classDialogTrigger)}
          // className="bg-white dark:bg-[#1f2d3a] dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md cursor-pointer"
          asChild
        >
          <Input
            value={selected || label || "Pilih opsi..."}
            readOnly
            className="text-left"
          />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-800">
          {/* Header Modal */}
          <DialogHeader>
            <DialogTitle>{label ?? "Pilih Opsi"}</DialogTitle>
            <DialogDescription>
              Gunakan input pencarian untuk menemukan opsi yang tersedia.
            </DialogDescription>
          </DialogHeader>

          {/* Input Pencarian */}
          <Input
            type="text"
            placeholder="Cari..."
            className="mb-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* List Pilihan */}
          <div className="max-h-80 overflow-y-auto rounded p-2 text-gray-700 dark:text-gray-200">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className="cursor-pointer p-2 hover:bg-yellow-100 dark:hover:text-slate-800"
                  onClick={() => selectOption(option)}
                >
                  {option.name}
                </div>
              ))
            ) : (
              <p className="text-gray-500">Tidak ada hasil.</p>
            )}
          </div>

          {/* Tombol Tutup */}
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
