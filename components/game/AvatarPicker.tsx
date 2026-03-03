"use client";

import { AVATARS, type AvatarDef } from "@/lib/avatars";
import { AvatarIcon } from "./AvatarIcon";

interface AvatarPickerProps {
  selected: string;
  onSelect: (avatarId: string) => void;
}

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300">Pick your avatar</label>
      <div className="grid grid-cols-8 gap-2">
        {AVATARS.map((avatar: AvatarDef) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.id)}
            className={`rounded-lg p-1 transition-all ${
              selected === avatar.id
                ? "ring-2 ring-white bg-zinc-700 scale-110"
                : "hover:bg-zinc-800 opacity-70 hover:opacity-100"
            }`}
            title={avatar.name}
          >
            <AvatarIcon avatar={avatar} size={36} />
          </button>
        ))}
      </div>
    </div>
  );
}
