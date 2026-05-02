const MINOR_WORDS = new Set([
  "a", "an", "the",
  "and", "but", "or", "for", "nor", "yet", "so",
  "about", "above", "across", "after", "against", "along", "among", "around",
  "at", "before", "behind", "below", "beneath", "beside", "between", "beyond",
  "by", "concerning", "despite", "down", "during", "except", "excluding",
  "following", "from", "in", "inside", "into", "like", "near", "of", "off",
  "on", "onto", "opposite", "out", "outside", "over", "past", "per", "plus",
  "regarding", "round", "save", "since", "than", "through", "throughout",
  "to", "toward", "towards", "under", "underneath", "unlike", "until", "up",
  "upon", "versus", "via", "with", "within", "without",
])

const NUMERIC_PATTERN = /^\d+[\.\)]?\s*$/

function isAcronym(word: string): boolean {
  return word.length >= 2 && word === word.toUpperCase()
}

function hasSpecialCasing(word: string): boolean {
  if (word.length === 0) return false
  if (word === word.toLowerCase()) return false
  if (word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase()) return false
  return true
}

function isNumericMarker(word: string): boolean {
  return NUMERIC_PATTERN.test(word.trim())
}

function isMostlyChinese(text: string): boolean {
  let chineseCount = 0
  for (const char of text) {
    if ((char >= '\u4e00' && char <= '\u9fff') || (char >= '\u3000' && char <= '\u303f')) {
      chineseCount++
    }
  }
  return chineseCount > 0
}

function titleCaseWord(word: string, isFirst: boolean, isLast: boolean): string {
  if (isAcronym(word)) return word
  if (hasSpecialCasing(word)) return word

  const lower = word.toLowerCase()

  if (isFirst || isLast) {
    return lower.charAt(0).toUpperCase() + lower.slice(1)
  }

  if (MINOR_WORDS.has(lower)) {
    return lower
  }

  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function titleCaseSegment(text: string): string {
  const tokens = text.match(/\S+|\s+/g) ?? [text]
  const contentIndices: number[] = []

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t.trim() && !/\s/.test(t) && !isNumericMarker(t)) {
      contentIndices.push(i)
    }
  }

  const result: string[] = []

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (/\s/.test(t)) {
      result.push(t)
    } else if (t.trim()) {
      let isFirst = false
      let isLast = false

      if (isNumericMarker(t)) {
        isFirst = false
        isLast = false
      } else {
        const pos = contentIndices.indexOf(i)
        if (pos !== -1) {
          isFirst = pos === 0
          isLast = pos === contentIndices.length - 1
        }
      }

      result.push(titleCaseWord(t, isFirst, isLast))
    } else {
      result.push(t)
    }
  }

  return result.join("")
}

export function toTitleCase(text: string): string {
  if (isMostlyChinese(text)) return text

  const parts = text.split(/(:\s+)/)
  return parts
    .map((part) => (/^:\s+$/.test(part) ? part : titleCaseSegment(part)))
    .join("")
}
