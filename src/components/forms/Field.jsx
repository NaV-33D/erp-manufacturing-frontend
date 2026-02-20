import React from "react";
import { ChevronDown } from "lucide-react";

const Label = ({ children, required }) => (
  <label className="text-xs font-medium text-gray-700">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const base =
  "w-full border rounded-md px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300";

export const InputField = ({
  label,
  required,
  placeholder,
  value,
  onChange,
  disabled,
  type = "text",

  // 🔽 new
  validate, // "email" | "phone" | RegExp | (value) => string | null
  error,
  setError,
}) => {
  const runValidation = (val) => {
    if (!setError) return;

    if (required && !val) {
      setError("This field is required");
      return;
    }

    if (!val) {
      setError("");
      return;
    }

    // email
    if (validate === "email") {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      setError(ok ? "" : "Invalid email address");
      return;
    }

    // phone
    if (validate === "phone") {
      const ok = /^[6-9]\d{9}$/.test(val);
      setError(ok ? "" : "Invalid phone number");
      return;
    }

    // regex
    if (validate instanceof RegExp) {
      setError(validate.test(val) ? "" : "Invalid format");
      return;
    }

    // custom fn
    if (typeof validate === "function") {
      const msg = validate(val);
      setError(msg || "");
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Label required={required}>{label}</Label>

      <input
        type={type}
        className={`
    ${base}
    ${error ? "border-red-500 focus:ring-red-200" : ""}
    ${disabled ? "opacity-70 cursor-not-allowed" : ""}
  `}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => {
          let val = e.target.value;

          // only apply phone restriction if validate="phone"
          if (validate === "phone") {
            val = val.replace(/\D/g, ""); // digits only
            if (val.length > 10) return; // max 10 digits
          }

          onChange?.(val);
        }}
        onBlur={(e) => runValidation(e.target.value)}
        disabled={disabled}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export const TextareaField = ({
  label,
  required,
  placeholder,
  value,
  onChange,
  rows = 4,
}) => (
  <div className="flex flex-col gap-1 md:col-span-2">
    <Label required={required}>{label}</Label>
    <textarea
      rows={rows}
      className={base}
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
    />
  </div>
);

// UI-select (button style). You can later replace with your dropdown component.
export const SelectField = ({
  label,
  required,
  value,
  placeholder = "Select",
  options = [],
  onChange,
  disabled,
}) => (
  <div className="flex flex-col gap-1">
    <Label required={required}>{label}</Label>

    <div className="relative">
      <select
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`${base} appearance-none pr-8 ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  </div>
);
