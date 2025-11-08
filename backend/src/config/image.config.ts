export const IMAGE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB em bytes
  allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  maxDimensions: {
    width: 4096,
    height: 4096
  },
  outputQuality: 80,
  outputFormat: 'jpeg' as const,
  maxFiles: 5
};