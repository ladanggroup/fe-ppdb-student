import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorLabel from "@/components/ErrorLabel";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const PasswordField = ({
    label,
    value,
    onChange,
    error,
    id = "password",
    required,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="mb-6">
            <Label htmlFor={id} className="block text-left mb-2 required">
                {label}
            </Label>
            <div className="relative">
                <Input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2",
                        "text-gray-500 dark:text-gray-400",
                        "hover:text-ppdb-orange-dark dark:hover:text-ppdb-orange"
                    )}
                    aria-label="Toggle password visibility"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {error && (
                <ErrorLabel message={error} />
            )}
        </div>
    );
};

export default PasswordField;