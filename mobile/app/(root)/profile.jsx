import { useEffect, useState } from 'react'
import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { styles } from '@/assets/styles/auth.styles.js'
import { COLORS } from '@/constants/colors.js'

export default function ProfileScreen() {
  const { user, isLoaded } = useUser()
  const { user: clerkUser } = useClerk()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      const initial = user.unsafeMetadata?.displayName || user.publicMetadata?.displayName || user.fullName || user.username || user.emailAddresses?.[0]?.emailAddress?.split('@')[0]
      setDisplayName(initial || '')
    }
  }, [isLoaded, user])

  const save = async () => {
    if (!isLoaded || !user) return
    const name = displayName?.trim()
    if (!name) { 
      Alert.alert('Validation', 'Please enter a name.'); 
      return 
    }
    
    // İsim uzunluğu kontrolü
    if (name.length < 2) {
      Alert.alert('Validation', 'Name must be at least 2 characters.');
      return
    }
    
    if (name.length > 50) {
      Alert.alert('Validation', 'Name cannot exceed 50 characters.');
      return
    }
    
    try {
      setSaving(true)
      
     
      await user.update({ 
        unsafeMetadata: { 
          ...user.unsafeMetadata,
          displayName: name 
        } 
      })
      
      Alert.alert('Success', 'Name updated successfully.', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ])
    } catch (error) {
      console.error('Name update error:', error)
      
      
      let errorMessage = 'An error occurred while updating the name.'
      
      if (error.message) {
        if (error.message.includes('rate_limit')) {
          errorMessage = 'Too many attempts. Please wait a moment and try again.'
        } else if (error.message.includes('network')) {
          errorMessage = 'Please check your internet connection and try again.'
        } else if (error.message.includes('unauthorized')) {
          errorMessage = 'You do not have permission to perform this action.'
        }
      }
      
      Alert.alert('Error', errorMessage)
    } finally {
      setSaving(false)
    }
  }

  return (
    <View style={[styles.container, { justifyContent: 'center' }]}>
      <Text style={styles.title}>Profile Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        placeholderTextColor={COLORS.textLight}
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TouchableOpacity style={styles.button} onPress={save} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save'}</Text>
      </TouchableOpacity>
    </View>
  )
}


