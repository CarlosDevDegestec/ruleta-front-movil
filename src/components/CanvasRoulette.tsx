import React, { useMemo } from 'react';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';
import { Prize } from '../types';

interface Props {
  prizes: Prize[];
}

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = CENTER - 12;

// Converts polar angle (0=top, clockwise) to SVG cartesian coordinates
function polarToCartesian(r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  };
}

function describeSlice(startDeg: number, endDeg: number): string {
  const start = polarToCartesian(RADIUS, startDeg);
  const end = polarToCartesian(RADIUS, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x.toFixed(3)} ${start.y.toFixed(3)}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`,
    'Z',
  ].join(' ');
}

export default function CanvasRoulette({ prizes }: Props) {
  const sliceAngle = prizes.length > 0 ? 360 / prizes.length : 0;
  const fontSize = Math.max(10, Math.min(14, 280 / Math.max(prizes.length, 1)));

  const slices = useMemo(() => {
    return prizes.map((prize, i) => {
      const startDeg = i * sliceAngle;
      const endDeg = startDeg + sliceAngle;
      const midDeg = startDeg + sliceAngle / 2;

      // Text anchor point along the radius, 2/3 out from center
      const textPos = polarToCartesian(RADIUS * 0.65, midDeg);
      const label =
        prize.name.length > 18 ? prize.name.substring(0, 16) + '…' : prize.name;
      const textRotation = midDeg - 90; // align text along the radius

      return { prize, path: describeSlice(startDeg, endDeg), textPos, label, textRotation };
    });
  }, [prizes, sliceAngle]);

  return (
    <Svg width={SIZE} height={SIZE}>
      {/* Slices */}
      {slices.map(({ prize, path, textPos, label, textRotation }) => (
        <G key={prize.id}>
          <Path
            d={path}
            fill={prize.color}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={1.5}
          />
          <SvgText
            x={textPos.x}
            y={textPos.y}
            fill={prize.rarity === 'legendario' ? '#111111' : '#ffffff'}
            fontSize={fontSize}
            fontWeight="bold"
            textAnchor="end"
            transform={`rotate(${textRotation}, ${textPos.x}, ${textPos.y})`}
          >
            {label}
          </SvgText>
        </G>
      ))}

      {/* Outer decorative ring */}
      <Circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS + 4}
        fill="none"
        stroke="#FFB71B"
        strokeWidth={4}
      />

      {/* Center disc */}
      <Circle
        cx={CENTER}
        cy={CENTER}
        r={22}
        fill="#111111"
        stroke="#FFB71B"
        strokeWidth={3}
      />

      {/* Center star */}
      <SvgText
        x={CENTER}
        y={CENTER + 6}
        fill="#FFB71B"
        fontSize={16}
        fontWeight="bold"
        textAnchor="middle"
      >
        ★
      </SvgText>
    </Svg>
  );
}
