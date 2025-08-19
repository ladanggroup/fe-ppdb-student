// components/global/SelectModal.jsx
import * as Dialog from "@/components/ui/dialog"; // menggunakan kode dialog yang sudah kamu buat
import * as Select from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check, Search } from "lucide-react";
import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";

export default function SelectModal({
  title = "Pilih Data",
  options = [],
  value,
  onChange,
}) {
  const [search, setSearch] = useState("");

  // Filter data sesuai pencarian
  const filteredOptions = (options || []).filter((opt) =>
  String(opt?.label || "")
    .toLowerCase()
    .includes((search || "").toLowerCase())
);

  return (
    <Dialog.Dialog>
      <Dialog.DialogTrigger asChild>
        <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Buka Select Modal
        </button>
      </Dialog.DialogTrigger>

      <Dialog.DialogContent className="bg-white">
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>{title}</Dialog.DialogTitle>
        </Dialog.DialogHeader>

        {/* Search Input */}
        <div className="flex items-center gap-2 mt-4 border rounded px-3 py-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Cari..."
            className="flex-1 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Select */}
        <div className="mt-4">
          <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger
              className={cn(
                "flex items-center justify-between w-full border rounded px-3 py-2 text-sm bg-white"
              )}
            >
              <Select.Value placeholder="Pilih opsi" />
              <Select.Icon>
                <ChevronDown className="w-4 h-4" />
              </Select.Icon>
            </Select.Trigger>

            <Select.Content className="bg-white border rounded shadow-lg">
              <Select.ScrollUpButton className="flex items-center justify-center py-1">
                <ChevronUp className="w-4 h-4" />
              </Select.ScrollUpButton>

              <Select.Viewport className="p-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => (
                    <Select.Item
                      key={opt.value}
                      value={opt.value}
                      className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-orange-100 rounded text-sm"
                    >
                      <Select.ItemText>{opt.label}</Select.ItemText>
                      <Select.ItemIndicator>
                        <Check className="w-4 h-4 text-orange-500" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm px-3 py-2">
                    Tidak ada hasil
                  </div>
                )}
              </Select.Viewport>

              <Select.ScrollDownButton className="flex items-center justify-center py-1">
                <ChevronDown className="w-4 h-4" />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Root>
        </div>

        <Dialog.DialogFooter>
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => onChange("")}
          >
            Reset
          </button>
        </Dialog.DialogFooter>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
}
