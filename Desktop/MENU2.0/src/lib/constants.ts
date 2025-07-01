export const CATEGORY_COLORS: Record<string, string> = {
  'Flower': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Vape': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Edible': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Concentrate': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Moonwater': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
}

export const VALID_CATEGORIES = ['Flower', 'Vape', 'Edible', 'Concentrate', 'Moonwater'] as const

export const CATEGORY_ICONS: Record<string, string> = {
  'Flower': '🌸',
  'Vape': '💨',
  'Edible': '🍬',
  'Concentrate': '💎',
  'Moonwater': '🌙'
}

export const CATEGORY_GRADIENTS: Record<string, string> = {
  'Flower': 'from-green-600 to-green-500',
  'Vape': 'from-blue-600 to-blue-500',
  'Edible': 'from-purple-600 to-purple-500',
  'Concentrate': 'from-yellow-600 to-yellow-500',
  'Moonwater': 'from-indigo-600 to-indigo-500'
} 