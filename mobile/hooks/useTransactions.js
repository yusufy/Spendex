

import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "@/constants/api";


export const useTransactions = (user_id) => {
    const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${user_id}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Transactions request failed: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [user_id]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${user_id}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Summary request failed: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [user_id]);

  const loadData = useCallback(async () => {
    if (!user_id) return;

    setIsLoading(true);
    try {
      
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, user_id]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete transaction: ${response.status} ${errorText}`);
      }

      
      loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};