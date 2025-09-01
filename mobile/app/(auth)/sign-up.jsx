import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { styles } from '@/assets/styles/auth.styles.js'
import { COLORS } from '@/constants/colors.js'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)

  
  const onSignUpPress = async () => {
    if (!isLoaded) return

    
    setError("")

    
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      
      
      setPendingVerification(true)
    } catch (err) {
      const firstError = err?.errors?.[0]
      const code = firstError?.code
      switch (code) {
        case "form_identifier_exists":
          setError("This e-mail address is already in use. Please use a different one.")
          break
        case "form_password_length_too_short":
          setError("Password is too short. Please use a longer password.")
          break
        case "form_password_pwned":
          setError("This password is too common. Please choose a different password.")
          break
        case "form_password_not_strong_enough":
          setError("Password is not strong enough. Try adding numbers and symbols.")
          break
        default:
          setError(firstError?.message || "Fill in all the blanks")
      }
      console.log(JSON.stringify(err, null, 2))
    }
  }

  
  const onVerifyPress = async () => {
    if (!isLoaded) return

    
    setError("")

    try {
      
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      
      
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        
        
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      const firstError = err?.errors?.[0]
      const code = firstError?.code
      switch (code) {
        case "form_code_incorrect":
          setError("Invalid verification code.")
          break
        case "form_code_expired":
          setError("Verification code expired. Request a new code.")
          break
        default:
          setError(firstError?.message || "Verification failed. Please try again.")
      }
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>

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
          style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor={COLORS.textLight}
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    )
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
        <Image source={require("../../assets/images/revenue-i2.png")} style={styles.illustration} />
        <Text style={styles.title}>Create an Account</Text>

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
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          placeholderTextColor={COLORS.textLight}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>


      </View>
    </KeyboardAwareScrollView>
  )
}