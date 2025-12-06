import React from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps, TouchableOpacityProps, TextStyle, Platform, View } from 'react-native';

// Input Component
interface InputProps extends TextInputProps {
  error?: string;
  label?: string;
}

export const FormInput: React.FC<InputProps> = ({ error, label, style, onChangeText, onBlur, value, placeholder, secureTextEntry, keyboardType, editable = true, maxLength, autoCapitalize, autoCorrect, ...props }) => {
  // Para web, usar input HTML nativo para evitar problemas de foco
  if (Platform.OS === 'web') {
    const inputType = secureTextEntry ? 'password' : 
                      keyboardType === 'email-address' ? 'email' : 
                      keyboardType === 'numeric' ? 'text' : // Mudado de 'tel' para 'text'
                      'text';
    
    return (
      <>
        {label && <Text style={styles.label}>{label}</Text>}
        <input
          type={inputType}
          inputMode={keyboardType === 'numeric' ? 'numeric' : keyboardType === 'email-address' ? 'email' : 'text'}
          placeholder={placeholder}
          value={value as string}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onChangeText?.(e.target.value);
          }}
          onBlur={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onBlur) {
              onBlur(e as any);
            }
          }}
          onKeyDown={(e) => {
            // Prevenir submit do form ao pressionar Enter
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          disabled={!editable}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect ? 'on' : 'off'}
          style={{
            width: '100%',
            height: 50,
            backgroundColor: '#FFF',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: error ? '#ff4444' : '#ddd',
            borderRadius: 8,
            paddingLeft: 15,
            paddingRight: 15,
            fontSize: 16,
            color: '#333',
            outline: 'none',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </>
    );
  }

  // Para mobile, usar TextInput do React Native
  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor="#666"
        underlineColorAndroid="transparent"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

// Alias para compatibilidade
export const Input = FormInput;

// Password Input com botão de mostrar/ocultar
interface PasswordInputProps extends InputProps {
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  showPassword, 
  onTogglePassword, 
  error, 
  label, 
  style,
  ...props 
}) => {
  if (Platform.OS === 'web') {
    return (
      <>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.passwordContainer}>
          <input
            {...(props as any)}
            type={showPassword ? 'text' : 'password'}
            placeholder={props.placeholder}
            value={props.value as string}
            onChange={(e) => {
              e.preventDefault();
              e.stopPropagation();
              props.onChangeText?.(e.target.value);
            }}
            onBlur={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (props.onBlur) {
                props.onBlur(e as any);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            disabled={!props.editable}
            maxLength={props.maxLength}
            style={{
              width: '100%',
              height: 50,
              backgroundColor: '#FFF',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: error ? '#ff4444' : '#ddd',
              borderRadius: 8,
              paddingLeft: 15,
              paddingRight: 50,
              fontSize: 16,
              color: '#333',
              outline: 'none',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          />
          <TouchableOpacity 
            onPress={onTogglePassword}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </>
    );
  }

  // Mobile
  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.passwordContainer}>
        <TextInput
          {...props}
          style={[styles.input, styles.passwordInput, error && styles.inputError, style]}
          placeholderTextColor="#666"
          underlineColorAndroid="transparent"
          autoCorrect={false}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity 
          onPress={onTogglePassword}
          style={styles.eyeButton}
        >
          <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

// Button Component
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  titleStyle?: TextStyle;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  style,
  titleStyle,
  disabled,
  loading,
  ...props
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === 'secondary' && styles.buttonSecondary,
      variant === 'outline' && styles.buttonOutline,
      (disabled || loading) && styles.buttonDisabled,
      style,
    ]}
    disabled={disabled || loading}
    {...props}
  >
    <Text
      style={[
        styles.buttonText,
        variant === 'secondary' && styles.buttonTextSecondary,
        variant === 'outline' && styles.buttonTextOutline,
        (disabled || loading) && styles.buttonTextDisabled,
        titleStyle,
      ]}
    >
      {loading ? 'Carregando...' : title}
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
  passwordContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 4,
  },
  passwordInput: {
    paddingRight: 50,
    marginBottom: 0,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
    zIndex: 10,
  },
  eyeIcon: {
    fontSize: 20,
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