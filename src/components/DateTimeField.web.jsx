import React from 'react';
import { Input } from './Form';

/**
 * Web fallback for DateTimeField: the native pickers are not available in the
 * browser, so the value is typed in the same 'YYYY-MM-DD' / 'HH:MM' format.
 */
export default function DateTimeField({ mode, value, onChange, placeholder }) {
  return (
    <Input
      value={value}
      onChangeText={onChange}
      placeholder={`${placeholder} (${mode === 'date' ? 'YYYY-MM-DD' : 'HH:MM, 24-hour'})`}
      maxLength={mode === 'date' ? 10 : 5}
    />
  );
}
