import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import FastImage, { FastImageProps, ImageStyle as FastImageStyle } from 'react-native-fast-image';

interface ImageCacheProps extends Omit<FastImageProps, 'source'> {
  uri: string;
  style?: StyleProp<FastImageStyle>;
}

export const CachedImage: React.FC<ImageCacheProps> = ({ uri, style, ...props }) => {
  return (
    <FastImage
      {...props}
      style={style}
      source={{
        uri,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};