export type OwnerKey = "harmen" | "leila" | "chiante"

export const USER_CONFIG: Record<OwnerKey, { icon: string; title: string }> = {
  harmen: {
    icon: "\uD83D\uDE0A", // quokka - using a happy face as placeholder, we'll use a custom SVG
    title: "Harmen's To-Dos",
  },
  leila: {
    icon: "\uD83E\uDDAB", // capybara - beaver emoji as closest match
    title: "Leila's To-Dos",
  },
  chiante: {
    icon: "\uD83D\uDC31", // cat
    title: "Chiante's To-Dos",
  },
} as const

export const OWNERS: OwnerKey[] = ["harmen", "leila", "chiante"]
