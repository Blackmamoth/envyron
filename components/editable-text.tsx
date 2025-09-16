import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Edit2 } from "lucide-react";

type Props = {
  value: string
  onSave: (v: string) => Promise<void>
}

export function EditableText({ value, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [temp, setTemp] = useState(value)

  useEffect(() => setTemp(value), [value])

  return isEditing ? (
    <div className="flex gap-2">
      <Input
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSave(temp.trim())
            setIsEditing(false)
          }
          if (e.key === "Escape") setIsEditing(false)
        }}
        autoFocus
      />
      <Button size="sm" onClick={() => { onSave(temp.trim()); setIsEditing(false) }}>
        Save
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
        Cancel
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsEditing(true)}>
      <h1 className="text-xl font-semibold">{value || "New Service"}</h1>
      <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}
