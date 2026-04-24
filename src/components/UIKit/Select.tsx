'use client';

import { Listbox, ListboxOption, ListboxLabel } from './listbox';
import { Label, ErrorMessage } from './Fieldset';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    'aria-label'?: string;
}

export function Select({
    label,
    value,
    onChange,
    options,
    placeholder = 'Select an option...',
    error,
    disabled,
    'aria-label': ariaLabel,
}: SelectProps) {
    return (
        <div className="w-full">
            {label && (
                <Label className="text-sm/6 text-gray-900 dark:text-white font-medium mb-2 block">
                    {label}
                </Label>
            )}
            <div className="relative">
                <Listbox
                    value={value || null}
                    onChange={(val) => onChange(String(val))}
                    placeholder={placeholder}
                    disabled={disabled}
                    aria-label={ariaLabel || label}
                    className={error ? 'data-[invalid]:true' : ''}
                >
                    {options.map((option) => (
                        <ListboxOption key={option.value} value={option.value}>
                            <ListboxLabel>{option.label}</ListboxLabel>
                        </ListboxOption>
                    ))}
                </Listbox>
            </div>
            {error && (
                <ErrorMessage className="mt-1.5">
                    {error}
                </ErrorMessage>
            )}
        </div>
    );
}

