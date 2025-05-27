type TextFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TextField({ label, placeholder, value, onChange }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-gray-500 uppercase tracking-wide">
        {label}
      </label>

      <input
        className="rounded-lg border border-gray-300 p-3 text-md placeholder:text-gray-400 text-gray-800 font-medium"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
  );
} 