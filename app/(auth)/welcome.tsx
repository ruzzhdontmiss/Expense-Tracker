import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <Text style={styles.title}>Expense Management</Text>
        <Text style={styles.subtitle}>Track your expenses with ease</Text>
        
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/welcome.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.description}>
          Track expenses, connect bank accounts, and get insights into your spending habits.
        </Text>
        
        <Button 
          mode="contained" 
          onPress={() => router.push('/login')}
          style={styles.button}
        >
          Login
        </Button>
        
        <Button 
          mode="outlined" 
          onPress={() => router.push('/signup')}
          style={styles.secondaryButton}
        >
          Sign Up
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  surface: {
    padding: 20,
    borderRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.7,
  },
  imageContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 200,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 8,
    width: '100%',
  },
  secondaryButton: {
    marginTop: 16,
    width: '100%',
  },
}); 