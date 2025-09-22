// src/components/VerifySelectionDialog.jsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";

const VerifySelectionDialog = ({ onConfirm, triggerLabel }) => {
  const [open, setOpen] = useState(false);
  const [destinationClass, setDestinationClass] = useState("");

  const handleSubmit = () => {
    if (!destinationClass.trim()) return;
    onConfirm(destinationClass);
    setOpen(false);
    setDestinationClass("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerLabel}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Verifikasi Seleksi</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label className="block text-sm font-medium mb-1.5" htmlFor="class">
            Kelas Tujuan
          </Label>
          <Input
            placeholder="Masukkan kelas"
            value={destinationClass}
            onChange={(e) => setDestinationClass(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button variant="secondary" onClick={handleSubmit}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerifySelectionDialog;
