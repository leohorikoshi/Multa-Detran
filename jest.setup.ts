import '@testing-library/jest-native/extend-expect';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock de serviços nativos
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock para o redux-persist
jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: jest.fn().mockImplementation((config, reducers) => reducers),
  };
});