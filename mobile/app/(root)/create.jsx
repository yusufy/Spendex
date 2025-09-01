import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
  } from "react-native";
  import { useRouter } from "expo-router";
  import { useUser } from "@clerk/clerk-expo";
  import { useState } from "react";
  import { API_URL } from "../../constants/api";
  import { styles } from "../../assets/styles/create.styles";
  import { COLORS } from "../../constants/colors";
  import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

  
  const CATEGORIES = [
    { id: "food", name: "Food & Drinks", icon: "fast-food" },
    { id: "shopping", name: "Shopping", icon: "cart" },
    { id: "transportation", name: "Transportation", icon: "car" },
    { id: "entertainment", name: "Entertainment", icon: "film" },
    { id: "bills", name: "Bills", icon: "receipt" },
    { id: "income", name: "Income", icon: "cash" },
    { id: "other", name: "Other", icon: "ellipsis-horizontal" },
  ];
  
  const CreateScreen = () => {
    const router = useRouter();
    const { user } = useUser();
    const insets = useSafeAreaInsets();
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isExpense, setIsExpense] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleCreate = async () => {
      
      if (!title.trim()) return Alert.alert("Error", "Please enter a transaction title");
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        Alert.alert("Error", "Please enter a valid amount");
        return;
      }
  
      if (!selectedCategory) return Alert.alert("Error", "Please select a category");
  
      setIsLoading(true);
      try {
        
        const formattedAmount = isExpense
          ? -Math.abs(parseFloat(amount))
          : Math.abs(parseFloat(amount));
  
        const response = await fetch(`${API_URL}/transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            title,
            amount: formattedAmount,
            category: selectedCategory,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData);
          throw new Error(errorData.error || "Failed to create transaction");
        }
  
        Alert.alert("Success", "Transaction created successfully");
        router.back();
      } catch (error) {
        Alert.alert("Error", error.message || "Failed to create transaction");
        console.error("Error creating transaction:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
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
        {}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Transaction</Text>
          <TouchableOpacity
            style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
            onPress={handleCreate}
            disabled={isLoading}
          >
            <Text style={[
              styles.saveButton,
              isExpense && styles.saveButtonExpense
            ]}>{isLoading ? "Saving..." : "Save"}</Text>
            {!isLoading && <Ionicons 
              name="checkmark" 
              size={18} 
              color={isExpense ? COLORS.expense : COLORS.primary} 
            />}
          </TouchableOpacity>
        </View>
  
        <View style={styles.card}>
          <View style={styles.typeSelector}>
                        {}
            <TouchableOpacity
              style={[styles.typeButton, isExpense && styles.typeButtonExpenseActive]}
              onPress={() => setIsExpense(true)}
            >
              <Ionicons
                name="arrow-down-circle"
                size={22}
                color={isExpense ? COLORS.white : COLORS.expense}
                style={styles.typeIcon}
              />
              <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>
                Expense
              </Text>
            </TouchableOpacity>

            {}
            <TouchableOpacity
              style={[styles.typeButton, !isExpense && styles.typeButtonIncomeActive]}
              onPress={() => setIsExpense(false)}
            >
              <Ionicons
                name="arrow-up-circle"
                size={22}
                color={!isExpense ? COLORS.white : COLORS.income}
                style={styles.typeIcon}
              />
              <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>
  
          {}
          <View style={[
            styles.amountContainer,
            isExpense ? styles.amountContainerExpense : styles.amountContainerIncome
          ]}>
            <Text style={[
              styles.currencySymbol,
              isExpense ? styles.currencySymbolExpense : styles.currencySymbolIncome
            ]}>$</Text>
            <TextInput
              style={[
                styles.amountInput,
                isExpense ? styles.amountInputExpense : styles.amountInputIncome
              ]}
              placeholder="0.00"
              placeholderTextColor={isExpense ? COLORS.expenseLight : COLORS.incomeLight}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
  
          {}
          <View style={[
            styles.inputContainer,
            isExpense ? styles.inputContainerExpense : styles.inputContainerIncome
          ]}>
            <Ionicons
              name="create-outline"
              size={22}
              color={isExpense ? COLORS.expense : COLORS.income}
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                isExpense ? styles.inputExpense : styles.inputIncome
              ]}
              placeholder="Transaction Title"
              placeholderTextColor={isExpense ? COLORS.expenseLight : COLORS.incomeLight}
              value={title}
              onChangeText={setTitle}
            />
          </View>
  
          {}
          <Text style={styles.sectionTitle}>
            <Ionicons name="pricetag-outline" size={16} color={COLORS.text} /> Category
          </Text>
  
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.name && (
                    isExpense ? styles.categoryButtonExpenseActive : styles.categoryButtonIncomeActive
                  ),
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Ionicons
                  name={category.icon}
                  size={20}
                  color={selectedCategory === category.name ? COLORS.white : COLORS.text}
                  style={styles.categoryIcon}
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.name && styles.categoryButtonTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
  
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      </View>
      </KeyboardAwareScrollView>
    );
  };
  export default CreateScreen;