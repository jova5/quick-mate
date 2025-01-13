export function replacePlaceholder(inputString: string, t: (input: string) => string): string {
  // Use a regular expression to extract the text within the curly braces
  const placeholderPattern = /\{(.+?)}/; // Matches {text}
  const match = RegExp(placeholderPattern).exec(inputString);

  // If a match is found, extract the placeholder text
  if (match) {
    const extractedText = match[1]; // Get the text inside {}
    // Replace the placeholder with the custom text
    return inputString.replace(placeholderPattern, t(extractedText));
  }

  // If no placeholder is found, return the input string unchanged
  return inputString;
}
