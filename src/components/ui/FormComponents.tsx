import React from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps, TouchableOpacityProps, TextStyle, Platform, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

// Input Component
interface InputProps extends TextInputProps {
  error?: string;
  label?: string;
}

export const FormInput: React.FC<InputProps> = ({ error, label, style, onChangeText, onBlur, value, placeholder, secureTextEntry, keyboardType, editable = true, maxLength, autoCapitalize, autoCorrect, ...props }) => {
  const { colors } = useTheme();
  
  // Para web, usar input HTML nativo para evitar problemas de foco
  if (Platform.OS === 'web') {
    const inputType = secureTextEntry ? 'password' : 
                      keyboardType === 'email-address' ? 'email' : 
                      keyboardType === 'numeric' ? 'text' : // Mudado de 'tel' para 'text'
                      'text';
    
    return (
      <>
        {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
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
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: error ? colors.error : colors.border,
            borderRadius: 8,
            paddingLeft: 15,
            paddingRight: 15,
            fontSize: 16,
            color: colors.text,
            outline: 'none',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        />
        {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
      </>
    );
  }

  // Para mobile, usar TextInput do React Native
  return (
    <>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input, 
          { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          error && { borderColor: colors.error },
          style
        ]}
        placeholderTextColor={colors.textSecondary}
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
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
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
  const { colors } = useTheme();
  
  if (Platform.OS === 'web') {
    return (
      <>
        {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
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
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: error ? colors.error : colors.border,
              borderRadius: 8,
              paddingLeft: 15,
              paddingRight: 50,
              fontSize: 16,
              color: colors.text,
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
        {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
      </>
    );
  }

  // Mobile
  return (
    <>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View style={styles.passwordContainer}>
        <TextInput
          {...props}
          style={[
            styles.input, 
            styles.passwordInput,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
            error && { borderColor: colors.error },
            style
          ]}
          placeholderTextColor={colors.textSecondary}
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
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
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
}) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.primary },
        variant === 'secondary' && { backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.secondary },
        variant === 'outline' && { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.primary },
        (disabled || loading) && { opacity: 0.5 },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      <Text
        style={[
          styles.buttonText,
          { color: '#FFFFFF' },
          variant === 'secondary' && { color: colors.text },
          variant === 'outline' && { color: colors.primary },
          titleStyle,
        ]}
      >
        {loading ? 'Carregando...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  input: {
    borderRadius: 4,
    padding: 12,
    marginBottom: 4,
    fontSize: 16,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
    fontWeight: '500',
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
    top: 12,
    padding: 5,
    zIndex: 10,
  },
  eyeIcon: {
    fontSize: 20,
  },
  button: {
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});