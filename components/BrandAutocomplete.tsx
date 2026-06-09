interface Props {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}

export default function BrandInput({ value, onChange, disabled }: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      placeholder="e.g. Coca-Cola"
      autoComplete="off"
      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 disabled:opacity-50"
    />
  )
}
