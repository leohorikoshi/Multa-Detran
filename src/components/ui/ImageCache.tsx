import React from 'react';
import { Image, ImageProps, ImageStyle, StyleProp } from 'react-native';

interface CachedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  style?: StyleProp<ImageStyle>;
}

export const CachedImage: React.FC<CachedImageProps> = ({ uri, style, ...props }) => {
  return (
    <Image
      {...props}
      style={style}
      source={{ uri }}
      resizeMode="contain"
    />
  );
};