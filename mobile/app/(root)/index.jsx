import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Text, View, Image, TouchableOpacity, RefreshControl, Alert, Modal } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '@/hooks/useTransactions'
import { useEffect, useState } from 'react'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../assets/styles/home.styles.js'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { BalanceCard } from '@/components/BalanceCard'
import { FlatList } from 'react-native'
import { TransactionItem } from '@/components/TransactionItem.jsx'
import NoTransactionsFound from '@/components/NoTransactionsFound'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Page() {
  const { user } = useUser()
  const router = useRouter();
  const { transactions, summary, isLoading, loadData, deleteTransaction} = useTransactions(user.id);
  const [refreshing, setRefreshing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    loadData();
    loadProfileImage();
  }, [loadData]);

  
  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem(`profileImage_${user.id}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error('Profil resmi yüklenirken hata:', error);
    }
  };

  
  const saveProfileImage = async (imageUri) => {
    try {
      await AsyncStorage.setItem(`profileImage_${user.id}`, imageUri);
    } catch (error) {
      console.error('Profil resmi kaydedilirken hata:', error);
    }
  };

  
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await saveProfileImage(imageUri);
      setModalVisible(false);
    }
  };

  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery access permission is required to select photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await saveProfileImage(imageUri);
      setModalVisible(false);
    }
  };

  
  const removeProfileImage = async () => {
    try {
      await AsyncStorage.removeItem(`profileImage_${user.id}`);
      setProfileImage(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Profil resmi kaldırılırken hata:', error);
    }
  };

  
  const showImageOptions = () => {
    setModalVisible(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  const handleDelete = (id) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      {text: "Cancel", style: "cancel"},
      {text: "Delete", style: "destructive", onPress: () => deleteTransaction(id)},
    ]);
  }

if(isLoading && !refreshing) return <PageLoader />

return (
  <View style={styles.container}>
    <View style={styles.content}>
      {}
      <View style={styles.header}>
        {}
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={showImageOptions} style={styles.profileImageContainer}>
            <View style={[styles.avatarContainer, profileImage && styles.profileImage]}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={35} color="#999" />
              )}
            </View>
            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={12} color="#FFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.usernameText}>
              {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
            </Text>
          </View>
        </View>
        {}
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <SignOutButton />
        </View>
      </View>

      <BalanceCard summary={summary} />

      <View style={styles.transactionsHeaderContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>
    </View>

    <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {}
            <View style={styles.modalHandle} />
            
            <Text style={styles.modalTitle}>Profile Picture</Text>
            <Text style={styles.modalSubtitle}>How would you like to update your profile picture?</Text>
            
            <View style={styles.modalOptionsContainer}>
              <TouchableOpacity style={styles.modalOptionPrimary} onPress={takePhoto}>
                <View style={styles.modalOptionIconContainer}>
                  <Ionicons name="camera" size={24} color="#FFF" />
                </View>
                <View style={styles.modalOptionTextContainer}>
                  <Text style={styles.modalOptionTitlePrimary}>Take Photo</Text>
                  <Text style={styles.modalOptionDescriptionPrimary}>Take a new photo with camera</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalOptionPrimary} onPress={pickImage}>
                <View style={styles.modalOptionIconContainer}>
                  <Ionicons name="images" size={24} color="#FFF" />
                </View>
                <View style={styles.modalOptionTextContainer}>
                  <Text style={styles.modalOptionTitlePrimary}>Choose from Gallery</Text>
                  <Text style={styles.modalOptionDescriptionPrimary}>Select from existing photos</Text>
                </View>
              </TouchableOpacity>
              
              {profileImage && (
                <TouchableOpacity style={styles.modalOptionDanger} onPress={removeProfileImage}>
                  <View style={[styles.modalOptionIconContainer, styles.dangerIconContainer]}>
                    <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                  </View>
                  <View style={styles.modalOptionTextContainer}>
                    <Text style={styles.modalOptionTitleDanger}>Remove Photo</Text>
                    <Text style={styles.modalOptionDescriptionDanger}>Return to default avatar</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.modalCancelButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}





