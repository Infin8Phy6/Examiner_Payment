import React, { useState, useEffect } from 'react';
import { Text, Button, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Hook to handle routing
import axios from 'axios';  // Axios for API calls
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for persistent storage

const VerificationPage: React.FC = () => {
  const [status, setStatus] = useState<string>(''); // Status state
  const router = useRouter(); // Hook for routing

  useEffect(() => {
    // Check if the status is "Verified", if so navigate to /page3
    const checkStatus = async () => {
      const storedStatus = await AsyncStorage.getItem('status');
      if (storedStatus === 'Verified') {
        router.push('/page3');
      }
    };

    checkStatus();
  }, [router]);

  const handleVerify = async () => {
    try {
      const hash = await AsyncStorage.getItem('hash');
      if (!hash) {
        console.error('No hash found in AsyncStorage.');
        return;
      }

      console.log('Hash received:', hash);

      // Send the hash to the JS server for verification
      const response = await axios.post('https://xmer.onrender.com/api/verify', { data: hash });

      // If the response is Verified
      if (response.data.status === 'Verified') {
        // Set status as Verified in AsyncStorage
        await AsyncStorage.setItem('status', 'Verified');
        router.push('/page3');
      } else {
        // Set status as Not Verified in AsyncStorage
        await AsyncStorage.setItem('status', 'Not Verified');
        router.push('/index');
      }
    } catch (error) {
      console.error('Error during verification:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Page</Text>
      <Button title="Verify" onPress={handleVerify} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default VerificationPage;
