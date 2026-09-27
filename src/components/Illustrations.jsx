import React from 'react';
import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '../theme';

// The five system diagrams from the website's home page, redrawn with
// react-native-svg. Each takes a `size` in points and keeps a 400×400 viewBox.

const GOLD = colors.gold;
const LIGHT = colors.lightGold;
const TEAL = colors.teal;
const BG = colors.bgPrimary;
const CINZEL = fonts.headingRegular;
const CORMORANT = fonts.italicRegular;

function Frame({ size, children }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 400 400">
      {children}
    </Svg>
  );
}

/** I — KP: North-Indian chart square with the sub-lord at its centre. */
export function KpChart({ size = 280 }) {
  const houses = [
    ['1', 200, 80], ['12', 115, 115], ['11', 80, 200], ['10', 115, 285],
    ['9', 200, 325], ['8', 285, 285], ['7', 320, 200], ['6', 285, 115],
    ['2', 135, 60], ['3', 265, 60], ['4', 345, 80], ['5', 345, 335],
  ];
  return (
    <Frame size={size}>
      <Rect x="30" y="30" width="340" height="340" fill="none" stroke={GOLD} strokeWidth="1.2" />
      <G stroke={GOLD} strokeWidth="0.8" opacity="0.5">
        <Line x1="30" y1="30" x2="370" y2="370" />
        <Line x1="370" y1="30" x2="30" y2="370" />
        <Line x1="30" y1="200" x2="200" y2="30" />
        <Line x1="200" y1="30" x2="370" y2="200" />
        <Line x1="370" y1="200" x2="200" y2="370" />
        <Line x1="200" y1="370" x2="30" y2="200" />
      </G>
      <G fill={LIGHT} opacity="0.7">
        {houses.map(([n, x, y]) => (
          <SvgText key={n} x={x} y={y} textAnchor="middle" fontFamily={CINZEL} fontSize="11">
            {n}
          </SvgText>
        ))}
      </G>
      <G fill={GOLD}>
        <SvgText x="200" y="105" textAnchor="middle" fontFamily={CORMORANT} fontSize="9">
          Su · Ke-Ve-Ma
        </SvgText>
        <SvgText x="320" y="225" textAnchor="middle" fontFamily={CORMORANT} fontSize="9">
          Mo · Sa-Me
        </SvgText>
        <SvgText x="200" y="350" textAnchor="middle" fontFamily={CORMORANT} fontSize="9">
          Ju · Me-Su-Ra
        </SvgText>
      </G>
      <Circle cx="200" cy="200" r="38" fill={BG} stroke={GOLD} strokeWidth="1" />
      <SvgText x="200" y="196" textAnchor="middle" fill={LIGHT} fontFamily={CINZEL} fontSize="9" letterSpacing="1.5">
        SUB
      </SvgText>
      <SvgText x="200" y="210" textAnchor="middle" fill={LIGHT} fontFamily={CINZEL} fontSize="9" letterSpacing="1.5">
        LORD
      </SvgText>
    </Frame>
  );
}

/** II — BNN: planets along a timeline under Jupiter's arc. */
export function BnnArc({ size = 280 }) {
  const planets = [['Ju', 90], ['Sa', 160], ['Ra', 230], ['Mo', 300]];
  return (
    <Frame size={size}>
      <Line x1="60" y1="200" x2="340" y2="200" stroke={GOLD} strokeWidth="1" opacity="0.6" />
      {planets.map(([label, x]) => (
        <G key={label}>
          <Circle cx={x} cy="200" r="6" stroke={GOLD} strokeWidth="1" fill="rgba(6,19,33,0.8)" />
          <SvgText x={x} y="180" textAnchor="middle" fill={LIGHT} opacity="0.85" fontFamily={CINZEL} fontSize="9">
            {label}
          </SvgText>
        </G>
      ))}
      <SvgText x="90" y="230" textAnchor="middle" fill={LIGHT} opacity="0.6" fontFamily={CORMORANT} fontSize="11">
        past
      </SvgText>
      <SvgText x="300" y="230" textAnchor="middle" fill={LIGHT} opacity="0.6" fontFamily={CORMORANT} fontSize="11">
        future
      </SvgText>
      <Path d="M 60 200 Q 200 80 340 200" fill="none" stroke={TEAL} strokeWidth="1" strokeDasharray="3 5" opacity="0.7" />
      <SvgText x="200" y="105" textAnchor="middle" fill={colors.tealLight} fontFamily={CORMORANT} fontSize="13">
        Jupiter&apos;s Arc
      </SvgText>
      <SvgText x="200" y="320" textAnchor="middle" fill={LIGHT} fontFamily={CINZEL} fontSize="11" letterSpacing="2">
        PAST → VERIFIED → FUTURE
      </SvgText>
      <SvgText x="200" y="345" textAnchor="middle" fill={GOLD} opacity="0.7" fontFamily={CORMORANT} fontSize="13">
        BNN cold reading
      </SvgText>
    </Frame>
  );
}

/** III — Numerology: the Lo Shu magic square. */
export function LoShuGrid({ size = 280 }) {
  const cells = [
    ['3', 120, 130], ['1', 200, 130], ['9', 280, 130],
    ['6', 120, 210], ['5', 200, 210], ['2', 280, 210],
    ['7', 120, 290], ['8', 200, 290], ['4', 280, 290],
  ];
  return (
    <Frame size={size}>
      <G stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.45">
        <Rect x="80" y="80" width="240" height="240" />
        <Line x1="160" y1="80" x2="160" y2="320" />
        <Line x1="240" y1="80" x2="240" y2="320" />
        <Line x1="80" y1="160" x2="320" y2="160" />
        <Line x1="80" y1="240" x2="320" y2="240" />
      </G>
      <G fill={LIGHT} opacity="0.85">
        {cells.map(([n, x, y]) => (
          <SvgText key={n} x={x} y={y} textAnchor="middle" fontFamily={fonts.display} fontSize="26">
            {n}
          </SvgText>
        ))}
      </G>
      <Rect x="160" y="160" width="80" height="80" fill="rgba(200,160,70,0.08)" stroke={GOLD} strokeWidth="1.5" />
      <SvgText x="200" y="56" textAnchor="middle" fill={GOLD} fontFamily={CINZEL} fontSize="11" letterSpacing="3">
        LO SHU GRID
      </SvgText>
      <SvgText x="200" y="358" textAnchor="middle" fill={LIGHT} opacity="0.7" fontFamily={CORMORANT} fontSize="13">
        date · name · destiny
      </SvgText>
    </Frame>
  );
}

/** IV — Horary: concentric rings around the drawn number. */
export function HoraryWheel({ size = 280 }) {
  return (
    <Frame size={size}>
      <Circle cx="200" cy="200" r="160" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.6" />
      <Circle cx="200" cy="200" r="120" fill="none" stroke={TEAL} strokeWidth="1" strokeDasharray="3 5" opacity="0.6" />
      <Circle cx="200" cy="200" r="80" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.5" />
      <G stroke={GOLD} strokeWidth="0.6" opacity="0.3">
        <Line x1="200" y1="40" x2="200" y2="360" />
        <Line x1="40" y1="200" x2="360" y2="200" />
        <Line x1="87" y1="87" x2="313" y2="313" />
        <Line x1="313" y1="87" x2="87" y2="313" />
      </G>
      <SvgText x="200" y="195" textAnchor="middle" fill={GOLD} fontFamily={fonts.display} fontSize="40">
        137
      </SvgText>
      <SvgText x="200" y="220" textAnchor="middle" fill={LIGHT} fontFamily={CINZEL} fontSize="9" letterSpacing="2.5">
        1 — 249
      </SvgText>
      <SvgText x="200" y="60" textAnchor="middle" fill={LIGHT} fontFamily={CINZEL} fontSize="10" letterSpacing="3">
        HORARY NUMBER
      </SvgText>
    </Frame>
  );
}

/** V — Yantra: interlocking triangles within a circle. */
export function YantraStar({ size = 280 }) {
  return (
    <Frame size={size}>
      <Circle cx="200" cy="200" r="150" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.6" />
      <Polygon points="200,90 300,270 100,270" fill="none" stroke={GOLD} strokeWidth="1.2" />
      <Polygon points="200,310 100,130 300,130" fill="none" stroke={TEAL} strokeWidth="1" opacity="0.7" />
      <Circle cx="200" cy="200" r="46" fill={BG} stroke={GOLD} strokeWidth="1" />
      <Circle cx="200" cy="200" r="4" fill={GOLD} />
      <SvgText x="200" y="60" textAnchor="middle" fill={LIGHT} fontFamily={CINZEL} fontSize="10" letterSpacing="3">
        YANTRA &amp; OILS
      </SvgText>
      <SvgText x="200" y="358" textAnchor="middle" fill={GOLD} opacity="0.7" fontFamily={CORMORANT} fontSize="13">
        intention · consecration · form
      </SvgText>
    </Frame>
  );
}

/** Mandala mark used on the chat launcher and chat header. */
export function MandalaMark({ size = 32, strong = false }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Circle cx="50" cy="50" r="46" stroke={strong ? '#e4c869' : '#c9a227'} strokeWidth={strong ? 2 : 1.2} />
      <Circle cx="50" cy="50" r={strong ? 30 : 34} stroke="#e4c869" strokeWidth={strong ? 1 : 0.7} />
      {!strong && (
        <G stroke="#c9a227" strokeWidth="0.8">
          <Line x1="50" y1="4" x2="50" y2="96" />
          <Line x1="4" y1="50" x2="96" y2="50" />
          <Line x1="16" y1="16" x2="84" y2="84" />
          <Line x1="84" y1="16" x2="16" y2="84" />
        </G>
      )}
      <Circle cx="50" cy="50" r="4" fill="#e4c869" />
    </Svg>
  );
}
