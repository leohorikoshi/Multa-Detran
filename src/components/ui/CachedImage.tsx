import React from 'react';
import { Image, ImageProps } from 'react-native';

interface ImageCacheProps extends Omit<ImageProps, 'source'> {
  uri: string;
  size?: { width: number; height: number };
}

// Componente de imagem simplificado (sem cache de FileSystem)
export const CachedImage: React.FC<ImageCacheProps> = ({ uri, style, ...props }) => {
  return <Image source={{ uri }} style={style} {...props} />;
};