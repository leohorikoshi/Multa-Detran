import React, { memo } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ViewStyle,
  StyleProp,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

interface FormContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const FormContainer = memo(({ children, style }: FormContainerProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, style]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>{children}</View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
});

interface FormRowProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const FormRow = memo(({ children, style }: FormRowProps) => (
  <View style={[styles.row, style]}>{children}</View>
));

interface FormGroupProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const FormGroup = memo(({ children, style }: FormGroupProps) => (
  <View style={[styles.group, style]}>{children}</View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  group: {
    marginBottom: 24,
  },
});