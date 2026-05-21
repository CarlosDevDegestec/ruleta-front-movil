import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { fetchRouletteData } from './src/services/api';
import { Prize } from './src/types';
import Roulette from './src/components/Roulette';
import QuestionPopup from './src/components/QuestionPopup';
import { theme } from './src/theme';

export default function App() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuestions, setShowQuestions] = useState(true);

  useEffect(() => {
    fetchRouletteData()
      .then(data => setPrizes(data.prizes))
      .catch(() => setError('No se pudo cargar la ruleta. Intenta de nuevo.'))
      .finally(() => setLoading(false));
  }, []);

  return (

    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>¡Gira y Gana!</Text>
            <Text style={styles.heroSub}>Participa y llévate increíbles premios</Text>
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.accent} />
              <Text style={styles.loadingText}>Cargando ruleta...</Text>
            </View>
          )}

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && !error && <Roulette prizes={prizes} />}
        </ScrollView>

        {showQuestions && !loading && !error && (
          <QuestionPopup onComplete={() => setShowQuestions(false)} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  container: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
    gap: 32,
  },
  hero: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.accent,
    textAlign: 'center',
  },
  heroSub: {
    color: theme.muted,
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: theme.muted,
    marginTop: 16,
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 10,
    padding: 16,
    maxWidth: 400,
    width: '100%',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
  },
});
