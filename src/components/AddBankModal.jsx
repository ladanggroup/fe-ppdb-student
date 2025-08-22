import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { showSuccess, showError } from "@/components/ui/toastSonner";

const BankModal = ({
  title = "",
  formData,
  setFormData,
  handleChange,
  update = false,
  onSubmit,
  open,
  setOpen,
  loading,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Panggil fungsi onSubmit dari parent
      onSubmit();
      // Tampilkan toast
      showSuccess("Data bank berhasil disimpan");
      setOpen(false);
    } catch (error) {
      showError("Gagal menyimpan data bank");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <hr className="my-4" />
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Bank</Label>
              <Input
                id="bank_name"
                name="bank_name"
                value={formData?.bank_name || ""}
                onChange={handleChange}
                placeholder="Contoh: Bank Mandiri"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Nomor Rekening</Label>
              <Input
                id="account_number"
                name="account_number"
                type="number"
                value={formData?.account_number || ""}
                onChange={handleChange}
                placeholder="Contoh: 1234567890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Nama Pemilik Rekening</Label>
              <Input
                id="account_name"
                name="account_name"
                value={formData?.account_name || ""}
                onChange={handleChange}
                placeholder="Contoh: John Doe"
                required
              />
            </div>

            {update && (
              <div className="space-y-2">
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <Select
                    id="is_active"
                    name="is_active"
                    value={formData?.is_active || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, is_active: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value={true}>Aktif</SelectItem>
                      <SelectItem value={false}>Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </SelectGroup>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BankModal;
