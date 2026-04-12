import React, { useState, useId } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Input component — floating label, password toggle, validation states
 */
export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = ' ',
  error,
  success,
  hint,
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  required = false,
  className = '',
  inputClassName = '',
  ...props
}) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  const hasValue = value !== undefined ? value !== '' : false;
  const isFloated = focused || hasValue;

  const borderColor = error
    ? 'var(--c-red)'
    : success
    ? 'var(--c-teal)'
    : focused
    ? 'var(--c-blue)'
    : 'var(--c-border-strong)';

  const glowColor = error
    ? 'rgba(255,91,91,0.15)'
    : success
    ? 'rgba(0,212,170,0.15)'
    : focused
    ? 'rgba(79,141,255,0.15)'
    : 'transparent';

  return (
    <div className={`input-wrapper ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--r-md)',
          border: `1px solid ${borderColor}`,
          background: disabled ? 'rgba(255,255,255,0.02)' : 'var(--c-bg-card)',
          transition: 'border-color var(--t-fast), box-shadow var(--t-fast)',
          boxShadow: focused ? `0 0 0 3px ${glowColor}` : 'none',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {/* Left icon */}
        {Icon && (
          <div style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: focused ? 'var(--c-blue)' : 'var(--c-text-muted)',
            transition: 'color var(--t-fast)',
            pointerEvents: 'none', zIndex: 1,
            display: 'flex', alignItems: 'center',
          }}>
            <Icon size={16} />
          </div>
        )}

        {/* Floating label */}
        {label && (
          <label
            htmlFor={id}
            style={{
              position: 'absolute',
              left: Icon ? 44 : 14,
              top: isFloated ? 8 : '50%',
              transform: isFloated ? 'none' : 'translateY(-50%)',
              fontSize: isFloated ? 10 : 14,
              fontWeight: isFloated ? 600 : 400,
              color: error
                ? 'var(--c-red)'
                : success
                ? 'var(--c-teal)'
                : focused
                ? 'var(--c-blue)'
                : 'var(--c-text-muted)',
              transition: 'all var(--t-fast)',
              pointerEvents: 'none',
              letterSpacing: isFloated ? '0.4px' : 0,
              textTransform: isFloated ? 'uppercase' : 'none',
              zIndex: 1,
            }}
          >
            {label}{required && ' *'}
          </label>
        )}

        {/* Actual input */}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder={label ? (isFloated ? placeholder : '') : placeholder}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--c-text-primary)',
            fontSize: 14,
            fontFamily: 'Inter, sans-serif',
            paddingLeft: Icon ? 44 : 14,
            paddingRight: (type === 'password' || IconRight) ? 44 : error || success ? 44 : 14,
            paddingTop: label ? 22 : 12,
            paddingBottom: label ? 8 : 12,
          }}
          className={inputClassName}
          {...props}
        />

        {/* Password toggle / right icon / validation icon */}
        <div style={{
          position: 'absolute', right: 12, top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--c-text-muted)', display: 'flex', alignItems: 'center',
                padding: 2, transition: 'color var(--t-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--c-text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--c-text-muted)'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          )}
          {error && <AlertCircle size={15} color="var(--c-red)" />}
          {success && !error && <CheckCircle2 size={15} color="var(--c-teal)" />}
          {IconRight && !error && !success && <IconRight size={15} color="var(--c-text-muted)" />}
        </div>
      </div>

      {/* Error / hint text */}
      {(error || hint) && (
        <p style={{
          fontSize: 11, fontWeight: 500,
          color: error ? 'var(--c-red)' : 'var(--c-text-muted)',
          paddingLeft: 4, display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
