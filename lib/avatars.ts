/**
 * Static avatar library.
 * Each avatar is defined by an ID, a display name, and color palette.
 * Rendered as simple geometric SVGs via the AvatarIcon component.
 */

export interface AvatarDef {
  id: string;
  name: string;
  bg: string;
  fg: string;
  accent: string;
  shape: "circle" | "square" | "diamond" | "hex";
  face: "smile" | "grin" | "cool" | "wink" | "think" | "shock" | "chill" | "smirk";
}

export const AVATARS: AvatarDef[] = [
  // Warm row
  { id: "av-01", name: "Coral", bg: "#FF6B6B", fg: "#FFFFFF", accent: "#C44D4D", shape: "circle", face: "smile" },
  { id: "av-02", name: "Tangerine", bg: "#FF8C42", fg: "#FFFFFF", accent: "#CC6F35", shape: "square", face: "grin" },
  { id: "av-03", name: "Sunny", bg: "#FFD93D", fg: "#1A1A2E", accent: "#CCB031", shape: "diamond", face: "cool" },
  { id: "av-04", name: "Peach", bg: "#FFAAA5", fg: "#1A1A2E", accent: "#CC8884", shape: "circle", face: "wink" },
  { id: "av-05", name: "Blaze", bg: "#E63946", fg: "#FFFFFF", accent: "#B82E38", shape: "hex", face: "smirk" },
  { id: "av-06", name: "Amber", bg: "#F4A261", fg: "#1A1A2E", accent: "#C3824E", shape: "square", face: "chill" },

  // Cool row
  { id: "av-07", name: "Sky", bg: "#48BFE3", fg: "#FFFFFF", accent: "#3A99B6", shape: "circle", face: "smile" },
  { id: "av-08", name: "Ocean", bg: "#0077B6", fg: "#FFFFFF", accent: "#005F92", shape: "square", face: "think" },
  { id: "av-09", name: "Mint", bg: "#2EC4B6", fg: "#FFFFFF", accent: "#259D92", shape: "diamond", face: "grin" },
  { id: "av-10", name: "Teal", bg: "#168AAD", fg: "#FFFFFF", accent: "#126E8A", shape: "hex", face: "cool" },
  { id: "av-11", name: "Arctic", bg: "#90E0EF", fg: "#1A1A2E", accent: "#73B3BF", shape: "circle", face: "wink" },
  { id: "av-12", name: "Frost", bg: "#CAF0F8", fg: "#1A1A2E", accent: "#A2C0C6", shape: "square", face: "chill" },

  // Purple/Pink row
  { id: "av-13", name: "Violet", bg: "#7B2CBF", fg: "#FFFFFF", accent: "#622399", shape: "circle", face: "smirk" },
  { id: "av-14", name: "Grape", bg: "#9D4EDD", fg: "#FFFFFF", accent: "#7E3EB1", shape: "diamond", face: "smile" },
  { id: "av-15", name: "Orchid", bg: "#C77DFF", fg: "#1A1A2E", accent: "#9F64CC", shape: "hex", face: "grin" },
  { id: "av-16", name: "Bubblegum", bg: "#FF6392", fg: "#FFFFFF", accent: "#CC4F75", shape: "circle", face: "wink" },
  { id: "av-17", name: "Plum", bg: "#5A189A", fg: "#FFFFFF", accent: "#48137B", shape: "square", face: "think" },
  { id: "av-18", name: "Rose", bg: "#FF477E", fg: "#FFFFFF", accent: "#CC3965", shape: "diamond", face: "cool" },

  // Green row
  { id: "av-19", name: "Lime", bg: "#80ED99", fg: "#1A1A2E", accent: "#66BE7A", shape: "circle", face: "smile" },
  { id: "av-20", name: "Forest", bg: "#2D6A4F", fg: "#FFFFFF", accent: "#24553F", shape: "square", face: "think" },
  { id: "av-21", name: "Sage", bg: "#95D5B2", fg: "#1A1A2E", accent: "#77AA8E", shape: "diamond", face: "chill" },
  { id: "av-22", name: "Emerald", bg: "#40916C", fg: "#FFFFFF", accent: "#337456", shape: "hex", face: "grin" },
  { id: "av-23", name: "Spring", bg: "#B7E4C7", fg: "#1A1A2E", accent: "#92B69F", shape: "circle", face: "wink" },
  { id: "av-24", name: "Jungle", bg: "#1B4332", fg: "#FFFFFF", accent: "#163628", shape: "square", face: "smirk" },

  // Neutral/Dark row
  { id: "av-25", name: "Slate", bg: "#495057", fg: "#FFFFFF", accent: "#3A4045", shape: "circle", face: "cool" },
  { id: "av-26", name: "Storm", bg: "#343A40", fg: "#FFFFFF", accent: "#2A2E33", shape: "hex", face: "think" },
  { id: "av-27", name: "Silver", bg: "#ADB5BD", fg: "#1A1A2E", accent: "#8A9197", shape: "diamond", face: "smile" },
  { id: "av-28", name: "Charcoal", bg: "#212529", fg: "#FFFFFF", accent: "#1A1E21", shape: "square", face: "smirk" },
  { id: "av-29", name: "Cloud", bg: "#DEE2E6", fg: "#1A1A2E", accent: "#B2B5B8", shape: "circle", face: "chill" },
  { id: "av-30", name: "Ash", bg: "#6C757D", fg: "#FFFFFF", accent: "#565E64", shape: "hex", face: "grin" },

  // Bright/Neon row
  { id: "av-31", name: "Neon", bg: "#39FF14", fg: "#1A1A2E", accent: "#2ECC10", shape: "diamond", face: "shock" },
  { id: "av-32", name: "Electric", bg: "#00F5FF", fg: "#1A1A2E", accent: "#00C4CC", shape: "circle", face: "cool" },
  { id: "av-33", name: "Magenta", bg: "#FF00FF", fg: "#FFFFFF", accent: "#CC00CC", shape: "hex", face: "grin" },
  { id: "av-34", name: "Laser", bg: "#FF3131", fg: "#FFFFFF", accent: "#CC2727", shape: "square", face: "shock" },
  { id: "av-35", name: "Plasma", bg: "#BF00FF", fg: "#FFFFFF", accent: "#9900CC", shape: "diamond", face: "smirk" },
  { id: "av-36", name: "Volt", bg: "#FFFF00", fg: "#1A1A2E", accent: "#CCCC00", shape: "circle", face: "wink" },

  // Earth tones
  { id: "av-37", name: "Clay", bg: "#BC6C25", fg: "#FFFFFF", accent: "#965620", shape: "square", face: "think" },
  { id: "av-38", name: "Sand", bg: "#DDA15E", fg: "#1A1A2E", accent: "#B1814B", shape: "circle", face: "chill" },
  { id: "av-39", name: "Rust", bg: "#9B2226", fg: "#FFFFFF", accent: "#7C1B1E", shape: "hex", face: "cool" },
  { id: "av-40", name: "Cocoa", bg: "#6F4E37", fg: "#FFFFFF", accent: "#593E2C", shape: "diamond", face: "smile" },
];

export function getAvatarById(id: string): AvatarDef | undefined {
  return AVATARS.find((a) => a.id === id);
}

export function getRandomAvatar(): AvatarDef {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}
