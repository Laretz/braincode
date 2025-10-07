import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Picker } from '@react-native-picker/picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCreatePost, useGetUserFolders } from '../../hooks/useApi';
import { useAuthStore } from '../../store/authStore';
import { COLORS, PROGRAMMING_LANGUAGES, SUCCESS_MESSAGES } from '../../constants';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainTabParamList } from '../../navigation/types';

type CreatePostScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Create'>;

const createPostSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  code: z.string().min(1, 'Código é obrigatório'),
  language: z.string().min(1, 'Linguagem é obrigatória'),
  folderId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

export default function CreatePostScreen() {
  const navigation = useNavigation<CreatePostScreenNavigationProp>();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      description: '',
      code: '',
      language: '',
      folderId: undefined,
    },
  });

  const selectedLanguage = watch('language');
  const { user } = useAuthStore();

  const createPostMutation = useCreatePost();
  const { data: userFolders = [], isLoading: foldersLoading } = useGetUserFolders(user?.id || '');

  const onSubmit = (data: CreatePostFormData) => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para criar um post');
      return;
    }

    // Usar id do usuário autenticado
    const userId = user.id;
    
    if (!userId) {
      Alert.alert('Erro', 'ID do usuário não encontrado. Tente fazer login novamente.');
      return;
    }

    createPostMutation.mutate({
      userId: userId,
      postData: {
        title: data.title,
        content: data.description,
        code: data.code,
        language: data.language,
        folderId: data.folderId,
        tags: data.tags || [],
        isPublic: data.isPublic || false,
      }
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      javascript: '#f7df1e',
      typescript: '#3178c6',
      python: '#3776ab',
      java: '#ed8b00',
      csharp: '#239120',
      cpp: '#00599c',
      go: '#00add8',
      rust: '#000000',
      php: '#777bb4',
      ruby: '#cc342d',
    };
    return colors[language.toLowerCase()] || COLORS.primary;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Novo Post</Text>
          <TouchableOpacity
            style={[
              styles.publishButton,
              createPostMutation.isPending && styles.publishButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={createPostMutation.isPending}
          >
            <Text style={styles.publishButtonText}>
              {createPostMutation.isPending ? 'Publicando...' : 'Publicar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Título *</Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  placeholder="Digite o título do seu post..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                />
              )}
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title.message}</Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descrição *</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    errors.description && styles.inputError,
                  ]}
                  placeholder="Descreva seu código, explique o que faz, como funciona..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={4}
                />
              )}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description.message}</Text>
            )}
          </View>

          {/* Language */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Linguagem *</Text>
            <Controller
              control={control}
              name="language"
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione uma linguagem" value="" />
                    {PROGRAMMING_LANGUAGES.map((lang) => (
                      <Picker.Item
                        key={lang.value}
                        label={lang.label}
                        value={lang.value}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            />
            {selectedLanguage && (
              <View style={styles.languagePreview}>
                <View
                  style={[
                    styles.languageTag,
                    { backgroundColor: getLanguageColor(selectedLanguage) },
                  ]}
                >
                  <Text style={styles.languageText}>{selectedLanguage}</Text>
                </View>
              </View>
            )}
            {errors.language && (
              <Text style={styles.errorText}>{errors.language.message}</Text>
            )}
          </View>

          {/* Folder Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pasta (Opcional)</Text>
            <Controller
              control={control}
              name="folderId"
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={value || ''}
                    onValueChange={(itemValue) => onChange(itemValue === '' ? undefined : itemValue)}
                    style={styles.picker}
                    enabled={!foldersLoading}
                  >
                    <Picker.Item label="Nenhuma pasta selecionada" value="" />
                    {userFolders.map((folder) => (
                      <Picker.Item
                        key={folder.id}
                        label={`${folder.icon} ${folder.name}`}
                        value={folder.id}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            />
            {foldersLoading && (
              <Text style={styles.helperText}>Carregando pastas...</Text>
            )}
          </View>

          {/* Code */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Código *</Text>
            <Controller
              control={control}
              name="code"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.codeInput,
                    errors.code && styles.inputError,
                  ]}
                  placeholder="Cole seu código aqui..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={10}
                  textAlignVertical="top"
                />
              )}
            />
            {errors.code && (
              <Text style={styles.errorText}>{errors.code.message}</Text>
            )}
          </View>

          {/* Visibility */}
          <View style={styles.inputContainer}>
            <View style={styles.visibilityContainer}>
              <View style={styles.visibilityInfo}>
                <Text style={styles.label}>Visibilidade</Text>
                <Text style={styles.helperText}>
                  Posts públicos aparecem no feed para todos os usuários
                </Text>
              </View>
              <Controller
                control={control}
                name="isPublic"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    value={value || false}
                    onValueChange={onChange}
                    trackColor={{ false: COLORS.border, true: COLORS.primary }}
                    thumbColor={value ? COLORS.background : COLORS.textSecondary}
                  />
                )}
              />
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Dicas para um bom post:</Text>
            <Text style={styles.tipText}>• Use um título claro e descritivo</Text>
            <Text style={styles.tipText}>• Explique o contexto do código</Text>
            <Text style={styles.tipText}>• Adicione comentários no código</Text>
            <Text style={styles.tipText}>• Formate o código corretamente</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  publishButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  publishButtonDisabled: {
    opacity: 0.6,
  },
  publishButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  codeInput: {
    fontFamily: 'monospace',
    fontSize: 14,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 4,
  },
  helperText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  picker: {
    color: COLORS.text,
  },
  languagePreview: {
    marginTop: 8,
  },
  languageTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  languageText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
  visibilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visibilityInfo: {
    flex: 1,
    marginRight: 16,
  },
  tipsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
});