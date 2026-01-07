// src/components/student/ParentsInfoStudent.jsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ErrorLabel from "@/components/ErrorLabel";
import formatIdr from "@/utils/formatIdr";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ParentsInfoStudent = ({
  formData,
  setFormData,
  setFormErrors,
  formErrors,
  disabled,
}) => {
  const copyAddress = (type) => {
    setFormData((prev) => {
      const willCopy = !prev[`${type}_same_as_student`]; // this is the NEXT state
      return {
        ...prev,
        // set flag
        [`${type}_same_as_student`]: willCopy,
        // when checking -> copy student address; when unchecking -> clear parent's address so user can type
        [`${type}_address`]: willCopy ? prev.address || "" : "",
      };
    });
  };

  const lastEducationOptions = [
    "Tidak Sekolah",
    "SD / Sederajat",
    "SMP / Sederajat",
    "SMA / Sederajat",
    "D1 / D2 / D3",
    "D4 / S1",
    "S2 / S3",
    "Lainnya",
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFormErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  return (
    <div className="border-t border-gray-900/10 p-5 space-y-5 mt-8">
      <h3 className="text-lg font-semibold leading-7">
        Informasi Orang Tua / Wali
      </h3>
      <p className="text-sm leading-6 text-gray-600">
        Lengkapi informasi ayah, ibu dan wali (opsional).
      </p>

      {/* AYAH */}
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
          Data Ayah
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Nama Ayah</Label>
            <Input
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              placeholder="Nama Ayah"
              disabled={disabled}
            />
            {formErrors.father_name && (
              <ErrorLabel message={formErrors.father_name} />
            )}
          </div>

          <div>
            <Label>No. Telepon Ayah</Label>
            <Input
              name="father_phone"
              type="number"
              value={formData.father_phone}
              onChange={handleChange}
              placeholder="No. Telepon Ayah"
              disabled={disabled}
            />
            {formErrors.father_phone && (
              <ErrorLabel message={formErrors.father_phone} />
            )}
          </div>

          <div>
            <Label>Pekerjaan Ayah</Label>
            <Input
              name="father_job"
              value={formData.father_job}
              onChange={handleChange}
              placeholder="Pekerjaan Ayah"
              disabled={disabled}
            />
            {formErrors.father_job && (
              <ErrorLabel message={formErrors.father_job} />
            )}
          </div>

          <div>
            <SelectGroup>
              <SelectLabel>Pendidikan Ayah</SelectLabel>
              <Select
                name="father_education"
                value={formData.father_education || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, father_education: value }))
                }
                disabled={disabled}
              >
                <SelectTrigger className="w-full bg-white text-gray-900">
                  <SelectValue placeholder="Pilih Pendidikan" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900">
                  {lastEducationOptions.map((item) => (
                    <SelectItem
                      className="hover:bg-sky-100"
                      key={item}
                      value={item}
                    >
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SelectGroup>

            {formErrors.father_education && (
              <ErrorLabel message={formErrors.father_education} />
            )}
          </div>

          <div>
            <Label>Penghasilan Ayah</Label>
            <Input
              name="father_income"
              type="number"
              value={formData.father_income}
              onChange={handleChange}
              placeholder="Penghasilan Ayah"
              disabled={disabled}
            />
            <span className="text-sm text-gray-500">
              {formData.father_income
                ? formatIdr(formData.father_income)
                : "Rp 0"}
            </span>
            {formErrors.father_income && (
              <ErrorLabel message={formErrors.father_income} />
            )}
          </div>

          <div className="sm:col-span-2">
            <Label>Alamat Ayah</Label>
            <Textarea
              name="father_address"
              value={formData.father_address}
              onChange={handleChange}
              disabled={formData.father_same_as_student || disabled}
              className="bg-white text-gray-900"
              placeholder="Alamat Ayah"
              rows={3}
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.father_same_as_student}
              onChange={() => copyAddress("father")}
              disabled={disabled}
            />
            <Label className="text-sm text-gray-700 dark:text-gray-600">
              Alamat sama dengan siswa
            </Label>
          </div>
        </div>
      </div>

      {/* IBU */}
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
          Data Ibu
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Nama Ibu</Label>
            <Input
              name="mother_name"
              value={formData.mother_name}
              onChange={handleChange}
              placeholder="Nama Ibu"
              disabled={disabled}
            />
            {formErrors.mother_name && (
              <ErrorLabel message={formErrors.mother_name} />
            )}
          </div>

          <div>
            <Label>No. Telepon Ibu</Label>
            <Input
              name="mother_phone"
              type="number"
              value={formData.mother_phone}
              onChange={handleChange}
              placeholder="No. Telepon Ibu"
              disabled={disabled}
            />
            {formErrors.mother_phone && (
              <ErrorLabel message={formErrors.mother_phone} />
            )}
          </div>

          <div>
            <Label>Pekerjaan Ibu</Label>
            <Input
              name="mother_job"
              value={formData.mother_job}
              onChange={handleChange}
              placeholder="Pekerjaan Ibu"
              disabled={disabled}
            />
            {formErrors.mother_job && (
              <ErrorLabel message={formErrors.mother_job} />
            )}
          </div>

          <div>
            <SelectGroup>
              <SelectLabel>Pendidikan Ibu</SelectLabel>
              <Select
                name="mother_education"
                value={formData.mother_education || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, mother_education: value }))
                }
                disabled={disabled}
              >
                <SelectTrigger className="w-full bg-white text-gray-900">
                  <SelectValue placeholder="Pilih Pendidikan" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900">
                  {lastEducationOptions.map((item) => (
                    <SelectItem
                      className="hover:bg-sky-100"
                      key={item}
                      value={item}
                    >
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SelectGroup>
            {formErrors.mother_education && (
              <ErrorLabel message={formErrors.mother_education} />
            )}
          </div>

          <div>
            <Label>Penghasilan Ibu</Label>
            <Input
              name="mother_income"
              type="number"
              value={formData.mother_income}
              onChange={handleChange}
              placeholder="Penghasilan Ibu"
              disabled={disabled}
            />
            <span className="text-sm text-gray-600">
              {formData.mother_income
                ? formatIdr(formData.mother_income)
                : "Rp 0"}
            </span>
            {formErrors.mother_income && (
              <ErrorLabel message={formErrors.mother_income} />
            )}
          </div>

          <div className="sm:col-span-2">
            <Label>Alamat Ibu</Label>
            <Textarea
              name="mother_address"
              value={formData.mother_address}
              onChange={handleChange}
              className="bg-white text-gray-900"
              placeholder="Alamat Ibu"
              disabled={formData.mother_same_as_student || disabled}
              rows={3}
            />
            {formErrors.mother_address && (
              <ErrorLabel message={formErrors.mother_address} />
            )}
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.mother_same_as_student}
              onChange={() => copyAddress("mother")}
              disabled={disabled}
            />
            <Label className="text-sm text-gray-700 dark:text-gray-600">
              Alamat sama dengan siswa
            </Label>
          </div>
        </div>
      </div>

      {/* WALI */}
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
          Data Wali (Opsional)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Nama Wali</Label>
            <Input
              name="guardian_name"
              value={formData.guardian_name}
              onChange={handleChange}
              placeholder="Nama Wali"
              disabled={disabled}
            />
          </div>

          <div>
            <Label>No. Telepon Wali</Label>
            <Input
              name="guardian_phone"
              type="number"
              value={formData.guardian_phone}
              onChange={handleChange}
              placeholder="No. Telepon Wali"
              disabled={disabled}
            />
          </div>

          <div>
            <Label>Pekerjaan Wali</Label>
            <Input
              name="guardian_job"
              value={formData.guardian_job}
              onChange={handleChange}
              placeholder="Pekerjaan Wali"
              disabled={disabled}
            />
          </div>

          <div>
            <SelectGroup>
              <SelectLabel>Pendidikan Wali</SelectLabel>
              <Select
                name="guardian_education"
                value={formData.guardian_education || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    guardian_education: value,
                  }))
                }
                disabled={disabled}
              >
                <SelectTrigger className="w-full bg-white text-gray-900">
                  <SelectValue placeholder="Pilih Pendidikan" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900">
                  {lastEducationOptions.map((item) => (
                    <SelectItem
                      className="hover:bg-sky-100"
                      key={item}
                      value={item}
                    >
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SelectGroup>
          </div>

          <div>
            <Label>Penghasilan Wali</Label>
            <Input
              name="guardian_income"
              type="number"
              value={formData.guardian_income}
              onChange={handleChange}
              placeholder="Penghasilan Wali"
              disabled={disabled}
            />
            <span className="text-sm text-gray-600">
              {formData.guardian_income
                ? formatIdr(formData.guardian_income)
                : "Rp 0"}
            </span>
          </div>

          <div className="sm:col-span-2">
            <Label>Alamat Wali</Label>
            <Textarea
              name="guardian_address"
              value={formData.guardian_address}
              onChange={handleChange}
              className="bg-white text-gray-900"
              placeholder="Alamat Wali"
              disabled={formData.guardian_same_as_student || disabled}
              rows={3}
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.guardian_same_as_student}
              onChange={() => copyAddress("guardian")}
              disabled={disabled}
            />
            <Label className="text-sm text-gray-700 dark:text-gray-600">
              Alamat sama dengan siswa
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentsInfoStudent;
