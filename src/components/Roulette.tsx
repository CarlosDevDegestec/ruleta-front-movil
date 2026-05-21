import React, { useRef, useState } from 'react';
import {
  View,
  Animated,
  Easing,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { fetchRouletteData } from '../services/api';
import { Prize } from '../types';
import CanvasRoulette from './CanvasRoulette';
import WinnerModal from './WinnerModal';
import ClaimFormModal from './ClaimFormModal';
import { theme } from '../theme';

interface Props {
  prizes: Prize[];
}

export default function Roulette({ prizes }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [showClaim, setShowClaim] = useState(false);
  const [claimed, setClaimed] = useState(false);

  // Accumulated rotation in degrees — never reset so the wheel keeps its position
  const spinValue = useRef(new Animated.Value(0)).current;
  const currentDeg = useRef(0);

  // Maps any degree value to a rotation string (extrapolate extends beyond 0-360)
  const rotate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend',
  });

  const spin = async () => {
    if (spinning || claimed) return;
    setSpinning(true);
    setWinner(null);

    try {
      const data = await fetchRouletteData();
      const sliceAngle = 360 / data.prizes.length;
      const winnerPrize = data.prizes[data.winner_index];

      // In the SVG wheel slice 0 starts at the top.
      // To bring slice W to the top we rotate by: 360 - (W * sliceAngle + sliceAngle/2)
      const sliceCenter = data.winner_index * sliceAngle + sliceAngle / 2;
      const stopAt = (360 - sliceCenter + 360) % 360;

      const normalizedCurrent = currentDeg.current % 360;
      const delta = (stopAt - normalizedCurrent + 360) % 360;
      // Always spin at least 5 full rotations for visual effect
      const targetDeg = currentDeg.current + 5 * 360 + delta;

      Animated.timing(spinValue, {
        toValue: targetDeg,
        duration: 6000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          currentDeg.current = targetDeg;
          setWinner(winnerPrize);
          setSpinning(false);
        }
      });
    } catch {
      setSpinning(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Wheel + pointer */}
      <View style={styles.wheelWrapper}>
        {/* Down-pointing triangle as the spin pointer */}
        <View style={styles.pointer} />
        <Animated.View style={{ transform: [{ rotate }] }}>
          <CanvasRoulette prizes={prizes} />
        </Animated.View>
      </View>

      <TouchableOpacity
        onPress={spin}
        disabled={spinning || claimed || prizes.length === 0}
        style={[styles.btn, (spinning || claimed) && styles.btnDisabled]}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>
          {spinning ? 'Girando...' : claimed ? '✅ Premio Reclamado' : '🎰 ¡Girar!'}
        </Text>
      </TouchableOpacity>

      {winner && !showClaim && (
        <WinnerModal
          prize={winner}
          onClaim={() => setShowClaim(true)}
          onClose={() => setWinner(null)}
        />
      )}

      {winner && showClaim && (
        <ClaimFormModal
          prize={winner}
          onSuccess={() => {
            setShowClaim(false);
            setClaimed(true);
            setWinner(null);
          }}
          onClose={() => setShowClaim(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 32,
    width: '100%',
  },
  wheelWrapper: {
    alignItems: 'center',
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 28,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFB71B',
    marginBottom: -14,
    zIndex: 10,
  },
  btn: {
    backgroundColor: theme.accent,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
