import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../store/authStore";
import { useGetUserFolders, useCreateFolder, useUpdateFolder, useDeleteFolder } from "../../hooks/useApi";
import { COLORS, FOLDER_COLORS } from "../../constants";
import type { Folder } from "../../types/api";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { FoldersStackParamList } from "../../navigation/types";

type FoldersScreenNavigationProp = StackNavigationProp<
  FoldersStackParamList,
  "FoldersList"
>;

const createFolderSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
  description: z.string().max(200, "Descrição muito longa").optional(),
  color: z.string(),
  isPublic: z.boolean().optional().default(false),
});

type CreateFolderForm = z.infer<typeof createFolderSchema>;

interface FolderItemProps {
  folder: Folder;
  onPress: (folderId: string) => void;
  onEdit: (folder: Folder) => void;
  onDelete: (folderId: string) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  onPress,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleLongPress = () => {
    Alert.alert("Opções da Pasta", `O que deseja fazer com "${folder.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Editar", onPress: () => onEdit(folder) },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          Alert.alert(
            "Confirmar Exclusão",
            `Tem certeza que deseja excluir a pasta "${folder.name}"? Esta ação não pode ser desfeita.`,
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Excluir",
                style: "destructive",
                onPress: () => onDelete(folder.id),
              },
            ]
          );
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.folderItem, { borderLeftColor: folder.color }]}
      onPress={() => onPress(folder.id)}
      onLongPress={handleLongPress}
    >
      <View style={styles.folderHeader}>
        <View style={styles.folderIcon}>
          <Ionicons name="folder" size={24} color={folder.color} />
        </View>
        <View style={styles.folderInfo}>
          <Text style={styles.folderName} numberOfLines={1}>
            {folder.name}
          </Text>
          <Text style={styles.folderDescription} numberOfLines={2}>
            {folder.description || "Sem descrição"}
          </Text>
        </View>
        <View style={styles.folderStats}>
          <Text style={styles.folderPostsCount}>
            {folder._count?.posts || 0} {(folder._count?.posts || 0) === 1 ? "post" : "posts"}
          </Text>
          <Text style={styles.folderDate}>{formatDate(folder.updatedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function FoldersScreen() {
  const navigation = useNavigation<FoldersScreenNavigationProp>();
  const { user } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateFolderForm>({
    resolver: zodResolver(createFolderSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      color: FOLDER_COLORS[0],
      isPublic: false,
    },
  });

  const {
    data: folders,
    isLoading,
    error,
  } = useGetUserFolders(user?.id || '');

  const createFolderMutation = useCreateFolder();
  const updateFolderMutation = useUpdateFolder();
  const deleteFolderMutation = useDeleteFolder();

  const handleFolderPress = (folderId: string) => {
    navigation.navigate('FolderDetails', { folderId });
  };

  const handleCreateFolder = () => {
    setEditingFolder(null);
    reset({
      name: "",
      description: "",
      color: FOLDER_COLORS[0],
      isPublic: false,
    });
    setShowCreateModal(true);
  };

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
    reset({
      name: folder.name,
      description: folder.description || "",
      color: folder.color,
      isPublic: folder.isPublic || false,
    });
    setShowCreateModal(true);
  };

  const handleDeleteFolder = (folderId: string) => {
    deleteFolderMutation.mutate(folderId);
  };

  const onSubmit = (data: CreateFolderForm) => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para criar uma pasta');
      return;
    }

    if (editingFolder) {
      updateFolderMutation.mutate({
        id: editingFolder.id,
        data: {
          name: data.name,
          description: data.description,
          color: data.color,
          isPublic: data.isPublic || false,
        },
      });
    } else {
      createFolderMutation.mutate({
        userId: user.id,
        folderData: {
          name: data.name,
          description: data.description,
          color: data.color,
          icon: 'folder',
          isPublic: data.isPublic || false,
        },
      });
    }
    setShowCreateModal(false);
    setEditingFolder(null);
    reset();
  };

  const renderFolder = ({ item }: { item: Folder }) => (
    <FolderItem
      folder={item}
      onPress={handleFolderPress}
      onEdit={handleEditFolder}
      onDelete={handleDeleteFolder}
    />
  );

  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="folder-outline"
          size={64}
          color={COLORS.textSecondary}
        />
        <Text style={styles.emptyTitle}>Nenhuma pasta ainda</Text>
        <Text style={styles.emptySubtitle}>
          Organize seus posts criando pastas temáticas
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateFolder}
        >
          <Text style={styles.createButtonText}>Criar primeira pasta</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Erro ao carregar pastas</Text>
          <Text style={styles.errorSubtitle}>
            Tente novamente em alguns instantes
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Pastas</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateFolder}>
          <Ionicons name="add" size={24} color={COLORS.background} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={folders || []}
          renderItem={renderFolder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingFolder ? "Editar Pasta" : "Nova Pasta"}
            </Text>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={
                createFolderMutation.isPending || updateFolderMutation.isPending
              }
            >
              <Text style={styles.modalSaveText}>
                {createFolderMutation.isPending ||
                updateFolderMutation.isPending
                  ? "Salvando..."
                  : "Salvar"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome da pasta</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="Ex: Projetos React"
                    placeholderTextColor={COLORS.textSecondary}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    maxLength={50}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição (opcional)</Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.textArea,
                      errors.description && styles.inputError,
                    ]}
                    placeholder="Descreva o conteúdo desta pasta..."
                    placeholderTextColor={COLORS.textSecondary}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={3}
                    maxLength={200}
                  />
                )}
              />
              {errors.description && (
                <Text style={styles.errorText}>
                  {errors.description.message}
                </Text>
              )}
            </View>

            {/* Color Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cor da pasta</Text>
              <Controller
                control={control}
                name="color"
                render={({ field: { value } }) => (
                  <View style={styles.colorPicker}>
                    {FOLDER_COLORS.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          value === color && styles.colorOptionSelected,
                        ]}
                        onPress={() => setValue("color", color)}
                      >
                        {value === color && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color={COLORS.background}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  folderItem: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  folderHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  folderIcon: {
    marginRight: 12,
  },
  folderInfo: {
    flex: 1,
    marginRight: 12,
  },
  folderName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  folderDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  folderStats: {
    alignItems: "flex-end",
  },
  folderPostsCount: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  folderDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalCancelText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  modalSaveText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginTop: 4,
  },
  colorPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: COLORS.background,
  },
});
