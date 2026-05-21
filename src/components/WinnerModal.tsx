import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Prize } from '../types';
import { theme } from '../theme';

interface Props {
  prize: Prize;
  onClaim: () => void;
  onClose: () => void;
}

export default function WinnerModal({ prize, onClaim, onClose }: Props) {
  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>¡Felicidades!</Text>
          <Text style={styles.subtitle}>Has ganado:</Text>

          <View style={[styles.prizeBox, { backgroundColor: prize.color }]}>
            <Text
              style={[
                styles.prizeName,
                { color: prize.rarity === 'legendario' ? '#111' : '#fff' },
              ]}
            >
              {prize.name}
            </Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnPrimary} onPress={onClaim} activeOpacity={0.8}>
              <Text style={styles.btnPrimaryText}>Reclamar Premio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.btnSecondaryText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
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
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  emoji: { fontSize: 56, marginBottom: 8 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: { color: theme.muted, marginBottom: 20 },
  prizeBox: {
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 28,
    marginBottom: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  prizeName: { fontSize: 20, fontWeight: '800' },
  buttons: { flexDirection: 'row', gap: 12, width: '100%' },
  btnPrimary: {
    flex: 1,
    backgroundColor: theme.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#111', fontWeight: '700', fontSize: 15 },
  btnSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSecondaryText: { color: theme.muted, fontSize: 15 },
});
