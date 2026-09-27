import React from 'react';
import { HoraryWheel, KpChart, LoShuGrid, YantraStar } from './Illustrations';

const ART = { horary: HoraryWheel, kp: KpChart, numerology: LoShuGrid, yantra: YantraStar };

/** The chart diagram that represents a consultation package. */
export default function ServiceArt({ slug, size }) {
  const Art = ART[slug] || KpChart;
  return <Art size={size} />;
}
