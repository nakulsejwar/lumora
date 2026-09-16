export const generateId = (name: string): string => {
  // Get the first 2-3 characters of the name
  const firstCharacters = name.slice(0, 3);

  // Combine the first characters with the hash
  let id = `${firstCharacters}`;

  const randomDigits = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return id + randomDigits;
};

const hashCode = (s: string): number => {
  let hash = 0;
  if (s.length === 0) {
    return hash;
  }
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash); // Make sure the hash is positive
};
