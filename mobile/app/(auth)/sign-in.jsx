import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View} from 'react-native'
import { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { styles } from '@/assets/styles/auth.styles.js'
import { COLORS } from '@/constants/colors.js'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  
  const onSignInPress = async () => {
    if (!isLoaded) return

    
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      
      
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        
        
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Invalid email or password");
      } else {
        setError("Fill in all the blanks");
      }
    }
  }

  return (
    <KeyboardAwareScrollView 
    style={{flex:1}}
    contentContainerStyle={{flexGrow:1}}
    enableOnAndroid={true}
    enableAutomaticScroll={true}
    keyboardShouldPersistTaps="handled"
    extraScrollHeight={50}
    showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Image source={require("../../assets/images/revenue-i4.png")} style={styles.illustration} />
        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size = {20} color = {COLORS.expense} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => setError("")}>
            <Ionicons name="close" size = {20} color = {COLORS.textLight} />
          </TouchableOpacity>
          </View>
        ): null}

      <TextInput
        style={[styles.input, error && styles.errorInput]}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor={COLORS.textLight}
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        style={[styles.input, error && styles.errorInput]}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        placeholderTextColor={COLORS.textLight}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity style={styles.button} onPress={onSignInPress}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/sign-up')}>
          <Text style={styles.linkText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      </View>
    </KeyboardAwareScrollView>
  )
}