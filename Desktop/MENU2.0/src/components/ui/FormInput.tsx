interface FormInputProps {
  label: string
  value: string | number | undefined
  onChange: (value: string) => void
  type?: 'text' | 'number' | 'textarea' | 'select'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  rows?: number
}

export function FormInput({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  required = false, 
  placeholder,
  options = [],
  rows = 3
}: FormInputProps) {
  const baseClass = "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
          placeholder={placeholder}
          rows={rows}
          required={required}
        />
      ) : type === 'select' ? (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  )
} 