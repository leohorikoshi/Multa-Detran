import React from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps, TouchableOpacityProps, TextStyle } from 'react-native';

// Input Component
interface InputProps extends TextInputProps {
  error?: string;
  label?: string;
}

export const FormInput = ({ error, label, style, ...props }: InputProps) => (
  <>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput
      style={[styles.input, error && styles.inputError, style]}
      placeholderTextColor="#666"
      {...props}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </>
);

// Button Component
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  titleStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  style,
  titleStyle,
  disabled,
  ...props
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === 'secondary' && styles.buttonSecondary,
      variant === 'outline' && styles.buttonOutline,
      disabled && styles.buttonDisabled,
      style,
    ]}
    disabled={disabled}
    {...props}
  >
    <Text
      style={[
        styles.buttonText,
        variant === 'secondary' && styles.buttonTextSecondary,
        variant === 'outline' && styles.buttonTextOutline,
        disabled && styles.buttonTextDisabled,
        titleStyle,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 4,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#34a853',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1a73e8',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    borderColor: '#cccccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#ffffff',
  },
  buttonTextOutline: {
    color: '#1a73e8',
  },
  buttonTextDisabled: {
    color: '#666666',
  },
});