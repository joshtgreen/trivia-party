"use client";

import type { AvatarDef } from "@/lib/avatars";

interface AvatarIconProps {
  avatar: AvatarDef;
  size?: number;
  className?: string;
}

/**
 * Renders a geometric avatar as an inline SVG.
 * Shape sets the outer form; face draws simple expressive features.
 */
export function AvatarIcon({ avatar, size = 48, className }: AvatarIconProps) {
  const cx = 24;
  const cy = 24;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-label={avatar.name}
    >
      {/* Background shape */}
      <ShapeBackground shape={avatar.shape} bg={avatar.bg} />

      {/* Face */}
      <Face face={avatar.face} fg={avatar.fg} cx={cx} cy={cy} />
    </svg>
  );
}

function ShapeBackground({ shape, bg }: { shape: AvatarDef["shape"]; bg: string }) {
  switch (shape) {
    case "circle":
      return <circle cx={24} cy={24} r={22} fill={bg} />;
    case "square":
      return <rect x={2} y={2} width={44} height={44} rx={8} fill={bg} />;
    case "diamond":
      return (
        <rect
          x={2}
          y={2}
          width={44}
          height={44}
          rx={8}
          fill={bg}
          transform="rotate(45 24 24) scale(0.72)"
          style={{ transformOrigin: "24px 24px" }}
        />
      );
    case "hex":
      return (
        <polygon
          points="24,2 44,14 44,34 24,46 4,34 4,14"
          fill={bg}
        />
      );
  }
}

function Face({
  face,
  fg,
  cx,
  cy,
}: {
  face: AvatarDef["face"];
  fg: string;
  cx: number;
  cy: number;
}) {
  const eyeY = cy - 3;
  const mouthY = cy + 6;

  // Eyes
  const leftEye = { x: cx - 6, y: eyeY };
  const rightEye = { x: cx + 6, y: eyeY };

  return (
    <g fill={fg} stroke={fg}>
      {/* Eyes */}
      {face === "wink" ? (
        <>
          <circle cx={leftEye.x} cy={leftEye.y} r={2.2} fill={fg} stroke="none" />
          <line x1={rightEye.x - 3} y1={rightEye.y} x2={rightEye.x + 3} y2={rightEye.y} strokeWidth={2} strokeLinecap="round" fill="none" />
        </>
      ) : face === "cool" ? (
        <>
          <line x1={leftEye.x - 4} y1={leftEye.y} x2={leftEye.x + 4} y2={leftEye.y} strokeWidth={2.5} strokeLinecap="round" fill="none" />
          <line x1={rightEye.x - 4} y1={rightEye.y} x2={rightEye.x + 4} y2={rightEye.y} strokeWidth={2.5} strokeLinecap="round" fill="none" />
        </>
      ) : face === "shock" ? (
        <>
          <circle cx={leftEye.x} cy={leftEye.y} r={3} fill="none" strokeWidth={2} />
          <circle cx={rightEye.x} cy={rightEye.y} r={3} fill="none" strokeWidth={2} />
        </>
      ) : (
        <>
          <circle cx={leftEye.x} cy={leftEye.y} r={2.2} fill={fg} stroke="none" />
          <circle cx={rightEye.x} cy={rightEye.y} r={2.2} fill={fg} stroke="none" />
        </>
      )}

      {/* Mouth */}
      {face === "smile" && (
        <path d={`M${cx - 5},${mouthY} Q${cx},${mouthY + 5} ${cx + 5},${mouthY}`} fill="none" strokeWidth={2} strokeLinecap="round" />
      )}
      {face === "grin" && (
        <path d={`M${cx - 6},${mouthY} Q${cx},${mouthY + 7} ${cx + 6},${mouthY}`} fill="none" strokeWidth={2} strokeLinecap="round" />
      )}
      {face === "cool" && (
        <line x1={cx - 4} y1={mouthY + 1} x2={cx + 4} y2={mouthY + 1} strokeWidth={2} strokeLinecap="round" fill="none" />
      )}
      {face === "wink" && (
        <path d={`M${cx - 4},${mouthY} Q${cx},${mouthY + 4} ${cx + 4},${mouthY}`} fill="none" strokeWidth={2} strokeLinecap="round" />
      )}
      {face === "think" && (
        <circle cx={cx + 4} cy={mouthY + 1} r={2.5} fill="none" strokeWidth={2} />
      )}
      {face === "shock" && (
        <ellipse cx={cx} cy={mouthY + 1} rx={3.5} ry={4.5} fill="none" strokeWidth={2} />
      )}
      {face === "chill" && (
        <path d={`M${cx - 5},${mouthY + 1} Q${cx},${mouthY - 2} ${cx + 5},${mouthY + 1}`} fill="none" strokeWidth={2} strokeLinecap="round" />
      )}
      {face === "smirk" && (
        <path d={`M${cx - 3},${mouthY + 1} Q${cx + 2},${mouthY + 5} ${cx + 5},${mouthY}`} fill="none" strokeWidth={2} strokeLinecap="round" />
      )}
    </g>
  );
}
