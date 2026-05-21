import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { submitClaim } from '../services/api';
import { Prize } from '../types';
import { theme } from '../theme';

interface Props {
  prize: Prize;
  onSuccess: () => void;
  onClose: () => void;
}

export default function ClaimFormModal({ prize, onSuccess, onClose }: Props) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    notifications: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos obligatorios.');
      return;
    }
    setSubmitting(true);
    try {
      await submitClaim({ ...form, prize_id: prize.id });
      Alert.alert(
        '¡Premio registrado!',
        'Nos comunicaremos contigo para entregarte tu premio.',
        [{ text: 'Perfecto', onPress: onSuccess }],
      );
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.message || 'No se pudo registrar tu reclamación. Intenta de nuevo.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>🎁 Reclamar Premio</Text>
            <Text style={styles.subtitle}>Premio ganado:</Text>

            <View style={[styles.prizeTag, { backgroundColor: prize.color }]}>
              <Text
                style={[
                  styles.prizeTagText,
                  { color: prize.rarity === 'legendario' ? '#111' : '#fff' },
                ]}
              >
                {prize.name}
              </Text>
            </View>

            <Text style={styles.fieldLabel}>Nombre completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor={theme.muted}
              value={form.name}
              onChangeText={v => setForm(p => ({ ...p, name: v }))}
            />

            <Text style={styles.fieldLabel}>Teléfono *</Text>
            <TextInput
              maxLength={12}
              style={styles.input}
              placeholder="Ej: +52 33 1234 5678"
              placeholderTextColor={theme.muted}
              value={form.phone}
              onChangeText={v => setForm(p => ({ ...p, phone: v }))}
              keyboardType="phone-pad"
            />

            <Text style={styles.fieldLabel}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              placeholderTextColor={theme.muted}
              value={form.email}
              onChangeText={v => setForm(p => ({ ...p, email: v }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.switchRow}>
              <Switch
                value={form.notifications}
                onValueChange={v => setForm(p => ({ ...p, notifications: v }))}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor="#ffffff"
              />
              <Text style={styles.switchLabel}>
                Quiero recibir notificaciones y promociones
              </Text>
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.btnPrimary, submitting && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={submitting}
                activeOpacity={0.8}
              >
                <Text style={styles.btnPrimaryText}>
                  {submitting ? 'Enviando...' : 'Registrar Premio'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSecondary} onPress={onClose} activeOpacity={0.8}>
                <Text style={styles.btnSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 28,
    maxHeight: '90%',
  },
  title: { fontSize: 20, fontWeight: '700', color: theme.text, marginBottom: 6 },
  subtitle: { color: theme.muted, fontSize: 13, marginBottom: 8 },
  prizeTag: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 22,
    alignSelf: 'flex-start',
  },
  prizeTagText: { fontWeight: '700', fontSize: 15 },
  fieldLabel: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    color: theme.text,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  switchLabel: { flex: 1, color: theme.muted, fontSize: 13 },
  buttons: { gap: 12 },
  btnPrimary: {
    backgroundColor: theme.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#111', fontWeight: '700', fontSize: 16 },
  btnSecondary: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSecondaryText: { color: theme.muted, fontSize: 15 },
});
