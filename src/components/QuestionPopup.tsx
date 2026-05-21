import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { fetchQuestions } from '../services/api';
import { Question } from '../types';
import { theme } from '../theme';

interface Props {
  onComplete: () => void;
}

export default function QuestionPopup({ onComplete }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions()
      .then(setQuestions)
      .catch(() => setError('Error al cargar las preguntas.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = () => {
    const allAnswered = questions.every(
      q => answers[q.id] !== undefined && answers[q.id] !== '',
    );
    if (!allAnswered) {
      setError('Por favor responde todas las preguntas.');
      return;
    }
    onComplete();
  };

  return (
    <Modal transparent animationType="fade" visible onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>✨ Antes de girar...</Text>
            <Text style={styles.subtitle}>
              Cuéntanos tu experiencia. Solo toma un momento.
            </Text>

            {loading && (
              <ActivityIndicator
                color={theme.accent}
                style={{ marginVertical: 20 }}
              />
            )}

            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {!loading &&
              questions.map(q => (
                <View key={q.id} style={styles.questionBlock}>
                  <Text style={styles.questionText}>{q.question}</Text>

                  {q.type === 'rating' ? (
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <TouchableOpacity
                          key={star}
                          onPress={() =>
                            setAnswers(prev => ({ ...prev, [q.id]: star }))
                          }
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.star,
                              {
                                opacity:
                                  (answers[q.id] as number) >= star ? 1 : 0.3,
                              },
                            ]}
                          >
                            ⭐
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <TextInput
                      multiline
                      numberOfLines={3}
                      placeholder="Escribe tu respuesta..."
                      placeholderTextColor={theme.muted}
                      value={(answers[q.id] as string) || ''}
                      onChangeText={v =>
                        setAnswers(prev => ({ ...prev, [q.id]: v }))
                      }
                      style={styles.textarea}
                      textAlignVertical="top"
                    />
                  )}
                </View>
              ))}

            {!loading && (
              <TouchableOpacity
                style={styles.btn}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>Continuar a la Ruleta →</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 16,
    padding: 28,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
  },
  title: { fontSize: 20, fontWeight: '700', color: theme.text, marginBottom: 6 },
  subtitle: { color: theme.muted, fontSize: 14, marginBottom: 24 },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: '#ef4444', fontSize: 14 },
  questionBlock: { marginBottom: 24 },
  questionText: { color: theme.text, fontWeight: '500', marginBottom: 10 },
  starsRow: { flexDirection: 'row', gap: 8 },
  star: { fontSize: 28 },
  textarea: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    color: theme.text,
    padding: 10,
    fontSize: 14,
    minHeight: 80,
  },
  btn: {
    backgroundColor: theme.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: '#111', fontWeight: '700', fontSize: 16 },
});
