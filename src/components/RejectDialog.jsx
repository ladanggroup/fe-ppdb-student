import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function RejectDialog({
  triggerLabel = "Tolak",
  triggerClassName = "",
  onConfirm,
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(note); // lempar note ke parent
    }
    setNote("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className={triggerClassName || "bg-red-500 text-white hover:bg-red-400"}
        >
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Tolak Data</DialogTitle>
          <DialogDescription>
            Tambahkan catatan penolakan agar pengguna tahu alasannya.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Label className="text-sm font-medium">Catatan</Label>
          {/* <label className="text-sm font-medium">Catatan</label> */}
          <Textarea
            className="w-full mt-1 p-2 border rounded-md bg-background"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Masukkan catatan penolakan..."
            required
          />
        </div>

        <DialogFooter className="mt-4">
          <Button 
            onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button
            className="bg-red-500 text-white hover:bg-red-400"
            onClick={handleConfirm}
            disabled={!note.trim()}
          >
            Konfirmasi Tolak
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
