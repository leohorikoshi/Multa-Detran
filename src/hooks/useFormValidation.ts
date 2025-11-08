import { useState, useCallback, useMemo } from 'react';

interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

interface ValidationRules {
  [field: string]: ValidationRule[];
}

interface UseFormValidationProps {
  rules: ValidationRules;
  onValidationChange?: (isValid: boolean) => void;
}

export const useFormValidation = ({ rules, onValidationChange }: UseFormValidationProps) => {
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Validar um campo específico
  const validateField = useCallback((field: string, value: string) => {
    const fieldRules = rules[field] || [];
    
    for (const rule of fieldRules) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
    return '';
  }, [rules]);

  // Validar todos os campos
  const validateAllFields = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
      const value = values[field] || '';
      const error = validateField(field, value);
      if (error) {
        isValid = false;
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    onValidationChange?.(isValid);
    return isValid;
  }, [rules, values, validateField, onValidationChange]);

  // Atualizar valor do campo com validação em tempo real
  const setValue = useCallback((field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [validateField]);

  // Verificar se o formulário está válido
  const isValid = useMemo(() => {
    return Object.keys(rules).every(field => {
      const value = values[field] || '';
      return !validateField(field, value);
    });
  }, [rules, values, validateField]);

  return {
    values,
    errors,
    touched,
    setValue,
    validateAllFields,
    isValid,
  };
};

// Regras de validação comuns
export const commonValidationRules = {
  required: (message: string = 'Campo obrigatório'): ValidationRule => ({
    validate: (value: string) => value.length > 0,
    message,
  }),
  
  email: (message: string = 'Email inválido'): ValidationRule => ({
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),
  
  minLength: (length: number, message?: string): ValidationRule => ({
    validate: (value: string) => value.length >= length,
    message: message || `Mínimo de ${length} caracteres`,
  }),
  
  maxLength: (length: number, message?: string): ValidationRule => ({
    validate: (value: string) => value.length <= length,
    message: message || `Máximo de ${length} caracteres`,
  }),
  
  matches: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value: string) => regex.test(value),
    message,
  }),
  
  cpf: (message: string = 'CPF inválido'): ValidationRule => ({
    validate: (value: string) => {
      const cpf = value.replace(/[^\d]/g, '');
      if (cpf.length !== 11) return false;
      
      // Verifica se todos os dígitos são iguais
      if (/^(\d)\1+$/.test(cpf)) return false;
      
      // Validação dos dígitos verificadores
      let sum = 0;
      let remainder;
      
      // Primeiro dígito verificador
      for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(9, 10))) return false;
      
      // Segundo dígito verificador
      sum = 0;
      for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(10, 11))) return false;
      
      return true;
    },
    message,
  }),
};