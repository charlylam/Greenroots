'use client';

import { Input } from '@/components/ui/input';

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: boolean;
};

export default function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  error = false,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm text-brand-dark">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-red-600">
            *
          </span>
        )}
      </label>

      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 bg-brand-white"
        required={required}
        aria-required={required}
        aria-invalid={error}
      />
    </div>
  );
}
