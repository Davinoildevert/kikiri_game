import Image from "next/image";
import { useState } from "react";

interface Player {
  id: string;
  name: string;
  balance: number;
  bets: Record<string, number>;
  totalWins: number;
  isOnline: boolean;
}

interface BetOverlayProps {
  zone: string;
  bets: Array<{ player: string; amount: number }>;

  onClick: () => void;
  isWinning?: boolean;
  currentPlayer: Player;
  style?: React.CSSProperties;
  label?: string;
  svgShape?: { points: string };
}

function BetOverlay({ zone, bets, onClick, isWinning = false, currentPlayer, style, svgShape, chipOffsetX = 0.5, chipOffsetY = 0.5 }: BetOverlayProps & { chipColor?: string, chipOffsetX?: number, chipOffsetY?: number }) {
  const [hovered, setHovered] = useState(false);
  const activeBets = bets.filter(bet => bet.amount > 0);
  const hasBet = activeBets.length > 0;
  const betAmount = activeBets.reduce((sum, bet) => sum + bet.amount, 0);
  // Palette casino : vert foncé, doré, blanc pour le jeton
  const fillColor = isWinning
    ? "rgba(255, 215, 0, 0.35)" // doré intense si gagnant
    : hovered
      ? "rgba(34,197,94,0.25)" // vert casino au survol
      : hasBet
        ? "rgba(255,255,255,0.10)" // discret si jeton posé
        : "transparent";
  const glow = isWinning
    ? "0 0 16px 8px rgba(255,215,0,0.7)"
    : hovered
      ? "0 0 12px 4px rgba(34,197,94,0.5)"
      : hasBet
        ? "0 0 8px 2px rgba(255,255,255,0.15)"
        : "none";
  const strokeColor = isWinning
    ? "#FFD700"
    : hovered
      ? "#22c55e"
      : "transparent";
  const strokeWidth = hovered || isWinning ? 3 : 0;

  // Rendu overlay SVG ou rectangle, mais jeton TOUJOURS en div pour uniformité
  if (svgShape) {
    // Pour SVG : pas de background, boxShadow ou border sur le div parent
    return (
      <div
        className="absolute"
        style={{ ...style, background: 'none', boxShadow: 'none', border: 'none', borderRadius: 0, overflow: 'visible' }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'auto' }}
        >
          <polygon
            points={svgShape.points}
            fill={isWinning ? 'rgba(255, 215, 0, 0.35)' : hovered ? 'rgba(34,197,94,0.25)' : 'transparent'}
            stroke={isWinning ? '#FFD700' : hovered ? '#22c55e' : 'transparent'}
            strokeWidth={hovered || isWinning ? 3 : 0}
            style={{ cursor: 'pointer', transition: 'fill 0.2s, stroke 0.2s' }}
          />
          {isWinning && (
            <circle cx="50" cy="50" r="26" fill="none" stroke="#FFD700" strokeWidth="5" opacity="0.7" />
          )}
        </svg>
        {/* Jeton visuel TOUJOURS en div, positionné en % de la zone */}
        {hasBet && (
          <div style={{
            position: 'absolute',
            left: `${chipOffsetX * 100}%`,
            top: `${chipOffsetY * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#FFD700',
            border: '4px solid #B8860B',
            boxShadow: '0 0 8px #FFD700',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18,
            userSelect: 'none',
            pointerEvents: 'none',
            textShadow: '0 0 4px #B8860B',
          }}>{betAmount}</div>
        )}
      </div>
    );
  }
  // fallback rectangle (rect classique)
  return (
    <div
      className="absolute cursor-pointer transition-all duration-300 group"
      style={{
        ...style,
        background: fillColor,
        boxShadow: glow,
        border: strokeWidth ? `${strokeWidth}px solid ${strokeColor}` : undefined,
        borderRadius: 12,
        transition: 'background 0.2s, box-shadow 0.2s, border 0.2s',
        overflow: 'visible',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Jeton visuel TOUJOURS en div, positionné en % de la zone */}
      {hasBet && (
        <div style={{
          position: 'absolute',
          left: `${chipOffsetX * 100}%`,
          top: `${chipOffsetY * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#FFD700',
          border: '4px solid #B8860B',
          boxShadow: '0 0 8px #FFD700',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 18,
          userSelect: 'none',
          pointerEvents: 'none',
          textShadow: '0 0 4px #B8860B',
        }}>{betAmount}</div>
      )}
      {/* Halo gagnant */}
      {isWinning && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '5px solid #FFD700',
          opacity: 0.7,
          zIndex: 1,
        }} />
      )}
    </div>
  );
}

// Zones personnalisées pour les mises spéciales
const zones = [
  { id: "1-5", label: "1-5", style: { left: "25.2%", top: "66%", width: "20%", height: "31%" }, svgShape: { points:"0,0 90,0 90,30 0,90" }, chipOffsetX: 0.2, chipOffsetY: 0.65 },
  { id: "1-4", label: "1-4", style: { left: "25.2%", top: "35%", width: "20%", height: "32%" }, svgShape: { points: "0,2 90,60 90,90 0,90" }, chipOffsetX: 0.2, chipOffsetY: 0.3 },
  { id: "2-4", label: "2-4", style: { left: "31%", top: "33%", width: "20%", height: "31%" }, svgShape: { points: "-15,3 108,3 108,60 65,60" }, chipOffsetX: 0.75, chipOffsetY: 0.5 },
  { id: "3-5", label: "3-5", style: { left: "49%", top: "32%", width: "20%", height: "34%" }, svgShape: { points: "0,3 115,3 46,60 0,60" }, chipOffsetX: 0.75, chipOffsetY: 0.2 },
  { id: "3-6", label: "3-6", style: { left: "57%", top: "34%", width: "20%", height: "34%" }, svgShape: { points: "0,57 90,0 90,90 0,90" }, chipOffsetX: 0.7, chipOffsetY: 0.5 },
  { id: "2-6", label: "2-6", style: { left: "57.2%", top: "65%", width: "20%", height: "34%" }, svgShape: { points: "0,0 90,0 90,90 0,30"}, chipOffsetX: 0.7, chipOffsetY: 0.6 },
  { id: "1-6", label: "1-6", style: { left: "19%", top: "77%", width: "60%", height: "20.5%" }, svgShape: { points: "-15,-5 150,0 300,100 -165,100" }, chipOffsetX: 0.4, chipOffsetY: 0.7 },
  { id: "2-5", label: "2-5", style: { left: "42.5%", top: "54%", width: "16%", height: "22%" }, chipOffsetX: 0.8, chipOffsetY: 0.7 },
  { id: "dice-1", label: "1", style: { left: "2.5%", top: "32%", width: "23.5%", height: "65%" }, chipOffsetX: 0.2, chipOffsetY: 0.2 },
  { id: "dice-2", label: "2", style: { left: "2.5%", top: "2%", width: "23.5%", height: "30%" }, chipOffsetX: 0.85, chipOffsetY: 0.2 },
  { id: "dice-3", label: "3", style: { left: "26.5%", top: "2%", width: "23.5%", height: "30%" }, chipOffsetX: 0.85, chipOffsetY: 0.2 },
  { id: "dice-4", label: "4", style: { left: "50.5%", top: "2%", width: "23.5%", height: "30%" }, chipOffsetX: 0.85, chipOffsetY: 0.2 },
  { id: "dice-5", label: "5", style: { left: "74.3%", top: "2%", width: "23.5%", height: "30%" }, chipOffsetX: 0.85, chipOffsetY: 0.2 },
  { id: "dice-6", label: "6", style: { left: "74.3%", top: "32%", width: "23.5%", height: "65%" }, chipOffsetX: 0.85, chipOffsetY: 0.9 },
];

export default function PlateauKikiri({
  onZoneClick,
  allPlayers,
  isSpinning,
  selectedChip,
  winningZone,
  currentPlayer
}: {
  onZoneClick?: (zoneId: string) => void;
  allPlayers: Player[];
  isSpinning: boolean;
  selectedChip: number;
  winningZone?: string | null;
  currentPlayer: Player;
}) {
  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-[2/1]">
      <Image
        src="/plateau-kikiri.png"
        alt="Plateau Kikiri"
        fill
        style={{ objectFit: "contain" }}
        priority
      />
      {/* Overlays interactifs pour chaque zone */}
      {zones.map((zone) => (
        <BetOverlay
          key={zone.id}
          zone={zone.id}
          bets={allPlayers.map(p => ({ player: p.name, amount: (p.bets && p.bets[zone.id]) ? p.bets[zone.id] : 0 }))}
          onClick={() => !isSpinning && onZoneClick?.(zone.id)}
          isWinning={winningZone === zone.id}
          currentPlayer={currentPlayer}
          style={zone.style}
          label={zone.label}
          svgShape={zone.svgShape}
          chipOffsetX={zone.chipOffsetX}
          chipOffsetY={zone.chipOffsetY}
        />
      ))}
    </div>
  );
}
