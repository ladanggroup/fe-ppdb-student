import { Label } from "@/components/ui/label";
import SelectModalUrl from "@/components/SelectModalUrl";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ErrorLabel from "../ErrorLabel";

const PersonalInfoStudent = ({
  formData,
  handleChange,
  formErrors,
  provinces,
  cities,
  districts,
}) => {
  return (
    <div className="border-b border-gray-900/10 pb-6">
      <h3 className="text-lg font-semibold leading-7 text-gray-900 dark:text-white">
        1. Informasi Pribadi Siswa
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        Lengkapi data pribadi Anda.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="md:col-span-1">
          <Label className="block text-left mb-2" htmlFor="name">
            Nama Siswa
          </Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nama Siswa"
            required
          />
          {formErrors.name && <ErrorLabel message={formErrors.name} />}
        </div>
        <div className="md:col-span-1">
          <Label className="block text-left mb-2" htmlFor="email">
            Email
          </Label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          {formErrors.email && <ErrorLabel message={formErrors.email} />}
        </div>
        <div className="md:col-span-1">
          <Label className="block text-left mb-2" htmlFor="nisn">
            NISN
          </Label>
          <Input
            name="nisn"
            value={formData.nisn}
            onChange={handleChange}
            placeholder="NISN"
            required
          />
          {formErrors.nisn && <ErrorLabel message={formErrors.nisn} />}
        </div>
        <div className="md:col-span-1">
          <Label className="block text-left mb-2" htmlFor="school_origin">
            Asal Sekolah
          </Label>
          <Input
            name="school_origin"
            value={formData.school_origin}
            onChange={handleChange}
            placeholder="Asal Sekolah"
            required
          />
          {formErrors.school_origin && (
            <ErrorLabel message={formErrors.school_origin} />
          )}
        </div>
        <div className="md:col-span-1">
          <Label className="block text-left mb-2" htmlFor="phone">
            Telepon
          </Label>
          <Input
            name="phone"
            type="number"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Telepon"
            required
          />
          {formErrors.phone && <ErrorLabel message={formErrors.phone} />}
        </div>
        <div className="md:col-span-1">
          <Label className="block text-left mb-2" htmlFor="birth_place">
            Tempat Lahir
          </Label>
          <Input
            name="birth_place"
            value={formData.birth_place}
            onChange={handleChange}
            placeholder="Tempat Lahir"
            required
          />
          {formErrors.birth_place && (
            <ErrorLabel message={formErrors.birth_place} />
          )}
        </div>
        <div className="md:col-span-1">
          <Label className="block text-left mb-2" htmlFor="birth_date">
            Tanggal Lahir
          </Label>
          <Input
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            required
          />
          {formErrors.birth_date && (
            <ErrorLabel message={formErrors.birth_date} />
          )}
        </div>
        <div className="md:col-span-1">
          <Label className="block text-left mb-2" htmlFor="gender">
            Jenis Kelamin
          </Label>
          <Select
            name="gender"
            value={formData.gender || ""}
            onValueChange={(value) =>
              handleChange({ target: { name: "gender", value } })
            }
            required
          >
            <SelectTrigger className="bg-white text-gray-900">
              <SelectValue placeholder="Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900">
              <SelectItem className="hover:bg-sky-100" value="Laki-laki">
                Laki-laki
              </SelectItem>
              <SelectItem className="hover:bg-sky-100" value="Perempuan">
                Perempuan
              </SelectItem>
            </SelectContent>
          </Select>
          {formErrors.gender && <ErrorLabel message={formErrors.gender} />}
        </div>
        <div className="md:col-span-2">
          <Label className="block mb-2" htmlFor="Alamat">
            Alamat
          </Label>
          <Textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="text-gray-900 bg-white"
            rows={3}
            placeholder="Alamat"
            required
          />
          {formErrors.address && <ErrorLabel message={formErrors.address} />}
        </div>
        <div className="md:col-span-1">
          <Label
            htmlFor="province_id"
            className="block text-left mb-2 dark:text-white"
          >
            Provinsi
          </Label>
          <SelectModalUrl
            label={
              provinces.find((p) => p.id === formData.province_id)?.name ||
              "Pilih Provinsi"
            }
            apiUrl={"/api/regions/provinces"}
            onSelect={(id) =>
              handleChange({ target: { name: "province_id", value: id } })
            }
            required
          />
          {formErrors.province_id && (
            <ErrorLabel message={formErrors.province_id} />
          )}
        </div>
        <div className="md:col-span-1">
          <Label
            htmlFor="city_id"
            className="block text-left mb-2 dark:text-white"
          >
            Kota/Kabupaten
          </Label>
          <SelectModalUrl
            label={
              cities.find((c) => c.id === formData.city_id)?.name ||
              "Pilih Kota/Kabupaten"
            }
            apiUrl={`/api/regions/cities?province_id=${formData.province_id}`}
            onSelect={(id) =>
              handleChange({ target: { name: "city_id", value: id } })
            }
            disabled={!formData.province_id}
            required
          />
          {formErrors.city_id && <ErrorLabel message={formErrors.city_id} />}
        </div>
        <div className="md:col-span-2">
          <Label
            htmlFor="district_id"
            className="block text-center mb-2 dark:text-white"
          >
            Kecamatan
          </Label>
          <SelectModalUrl
            label={
              districts.find((d) => d.id === formData.district_id)?.name ||
              "Pilih Kecamatan"
            }
            apiUrl={`/api/regions/districts?city_id=${formData.city_id}`}
            onSelect={(id) =>
              handleChange({ target: { name: "district_id", value: id } })
            }
            disabled={!formData.city_id}
            required
          />
          {formErrors.district_id && (
            <ErrorLabel message={formErrors.district_id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStudent;
