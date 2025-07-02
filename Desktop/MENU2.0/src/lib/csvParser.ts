export function parseCSV<T = Record<string, string>>(text: string): T[] {
  const rows: T[] = []
  const lines = text.trim().split('\n')
  
  if (lines.length === 0) return rows
  
  // Parse headers
  const headers = parseCSVLine(lines[0])
  
  // Parse data rows
  let currentLine = ''
  let inQuotes = false
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    
    // Check if we're continuing a multi-line quoted field
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"' && (j === 0 || line[j-1] !== '\\')) {
        inQuotes = !inQuotes
      }
    }
    
    currentLine += (currentLine ? '\n' : '') + line
    
    // If we're not in quotes, this line is complete
    if (!inQuotes) {
      const values = parseCSVLine(currentLine)
      const row: any = {}
      
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      
      rows.push(row as T)
      currentLine = ''
    }
  }
  
  return rows
}

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  // Don't forget the last value
  values.push(current.trim())
  
  return values
}

export function generateCSVTemplate(): string {
  const headers = [
    'store_code',
    'product_category',
    'product_name',
    'strain_type',
    'strain_cross',
    'description',
    'terpene',
    'strength',
    'thca_percent',
    'delta9_percent',
    'is_gummy',
    'is_cookie'
  ]
  
  const examples = [
    ['CLT', 'Flower', 'Blue Dream', 'Hybrid', 'Blueberry x Haze', 'Premium indoor flower', 'Myrcene', '3.5g', '24.8', '0.28', 'false', 'false'],
    ['CLT', 'Vape', 'OG Kush Cart', 'Indica', '', 'Premium distillate cartridge', 'Limonene', '1g', '85.2', '0.1', 'false', 'false'],
    ['CLT', 'Edible', 'Gummy Bears', '', '', 'Delicious fruit gummies', '', '10mg', '', '', 'true', 'false'],
    ['CLT', 'Edible', 'Chocolate Cookies', '', '', 'Premium baked goods', '', '10mg', '', '', 'false', 'true'],
    ['CLT', 'Concentrate', 'Live Resin', 'Hybrid', '', 'Premium concentrate', 'Caryophyllene', '1g', '78.5', '0.15', 'false', 'false'],
    ['CLT', 'Moonwater', 'Moonwater Original', '', '', 'Cannabis beverage', '', '5mg', '', '', 'false', 'false']
  ]
  
  const csvLines = [headers.join(',')]
  examples.forEach(row => {
    csvLines.push(row.map(cell => cell.includes(',') ? `"${cell}"` : cell).join(','))
  })
  
  return csvLines.join('\n')
} 