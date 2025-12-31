import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const countries = [
  { code: '+1', name: 'United States', flag: '🇺🇸', minLength: 10, maxLength: 10 },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', minLength: 10, maxLength: 10 },
  { code: '+91', name: 'India', flag: '🇮🇳', minLength: 10, maxLength: 10 },
  { code: '+86', name: 'China', flag: '🇨🇳', minLength: 11, maxLength: 11 },
  { code: '+81', name: 'Japan', flag: '🇯🇵', minLength: 10, maxLength: 10 },
  { code: '+49', name: 'Germany', flag: '🇩🇪', minLength: 10, maxLength: 11 },
  { code: '+33', name: 'France', flag: '🇫🇷', minLength: 9, maxLength: 9 },
  { code: '+61', name: 'Australia', flag: '🇦🇺', minLength: 9, maxLength: 9 },
  { code: '+55', name: 'Brazil', flag: '🇧🇷', minLength: 11, maxLength: 11 },
  { code: '+7', name: 'Russia', flag: '🇷🇺', minLength: 10, maxLength: 10 },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  testIdPrefix?: string;
}

export default function PhoneInput({
  value,
  onChange,
  label = 'Phone Number',
  placeholder = 'Enter your phone number',
  disabled = false,
  testIdPrefix = 'phone'
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const handleCountryChange = (code: string) => {
    const country = countries.find(c => c.code === code);
    if (country) {
      setSelectedCountry(country);
      const numberPart = value.replace(/^\+\d+/, '');
      onChange(country.code + numberPart);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    const limitedInput = input.slice(0, selectedCountry.maxLength);
    onChange(selectedCountry.code + limitedInput);
  };

  const displayNumber = value.replace(selectedCountry.code, '');

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={`${testIdPrefix}-input`}>{label}</Label>}
      <div className="flex gap-2">
        <Select
          value={selectedCountry.code}
          onValueChange={handleCountryChange}
          disabled={disabled}
        >
          <SelectTrigger
            className="w-[140px]"
            data-testid={`${testIdPrefix}-country-select`}
          >
            <SelectValue>
              <span>{selectedCountry.flag} {selectedCountry.code}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem
                key={country.code}
                value={country.code}
                data-testid={`${testIdPrefix}-country-${country.code}`}
              >
                <span>{country.flag} {country.name} ({country.code})</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id={`${testIdPrefix}-input`}
          data-testid={`${testIdPrefix}-input`}
          type="tel"
          value={displayNumber}
          onChange={handleNumberChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={selectedCountry.maxLength}
          autoComplete="tel"
        />
      </div>
      {displayNumber && (
        <p className="text-xs text-muted-foreground">
          Full number: {value}
        </p>
      )}
    </div>
  );
}
