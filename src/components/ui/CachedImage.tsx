import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { ImageProps } from 'react-native';
import FastImage from 'react-native-fast-image';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

interface ImageCacheProps extends Omit<ImageProps, 'source'> {
  uri: string;
  size?: { width: number; height: number };
}

// Verificar se uma imagem já está em cache
const checkImageInCache = async (uri: string): Promise<string | null> => {
  try {
    const filename = uri.split('/').pop();
    const cacheDir = `${FileSystem.cacheDirectory}images/`;
    const cacheFilePath = `${cacheDir}${filename}`;

    // Criar diretório de cache se não existir
    const cacheExists = await FileSystem.getInfoAsync(cacheDir);
    if (!cacheExists.exists) {
      await FileSystem.makeDirectoryAsync(cacheDir);
    }

    // Verificar se arquivo existe no cache
    const fileExists = await FileSystem.getInfoAsync(cacheFilePath);
    if (fileExists.exists) {
      return cacheFilePath;
    }

    return null;
  } catch (error) {
    console.error('Erro ao verificar cache:', error);
    return null;
  }
};

// Adicionar imagem ao cache
const cacheImage = async (uri: string, size?: { width: number; height: number }): Promise<string | null> => {
  try {
    const filename = uri.split('/').pop();
    const cacheDir = `${FileSystem.cacheDirectory}images/`;
    const cacheFilePath = `${cacheDir}${filename}`;

    // Baixar e manipular imagem se necessário
    if (size) {
      const result = await manipulateAsync(
        uri,
        [{
          resize: {
            width: size.width,
            height: size.height
          }
        }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );
      
      await FileSystem.copyAsync({
        from: result.uri,
        to: cacheFilePath
      });
    } else {
      await FileSystem.downloadAsync(uri, cacheFilePath);
    }

    return cacheFilePath;
  } catch (error) {
    console.error('Erro ao cachear imagem:', error);
    return null;
  }
};

// Componente de imagem com cache
export const CachedImage = ({ uri, size, ...props }: ImageCacheProps & FastImage['props']) => {
  const [imageUri, setImageUri] = useState<string>(uri);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      // Verificar cache
      const cachedUri = await checkImageInCache(uri);
      if (cachedUri) {
        if (isMounted) setImageUri(cachedUri);
        return;
      }

      // Cachear imagem se não existir
      const newCachedUri = await cacheImage(uri, size);
      if (newCachedUri && isMounted) {
        setImageUri(newCachedUri);
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [uri, size]);

  return (
    <FastImage
      {...props}
      source={{
        uri: imageUri,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable
      }}
    />
  );
};