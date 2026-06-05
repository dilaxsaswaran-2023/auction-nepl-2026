export const placeholderImage = "/players/default-player.svg";

const supportedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

function encodePlayerFileName(name) {
  return encodeURIComponent(name.trim());
}

export function getPlayerImageCandidates(player) {
  const name = player.name?.trim();
  const candidates = [];

  if (player.image) {
    candidates.push(player.image);
  }

  if (name) {
    const encodedName = encodePlayerFileName(name);
    supportedExtensions.forEach((extension) => {
      candidates.push(`/players/${encodedName}${extension}`);
    });
  }

  candidates.push(placeholderImage);
  return [...new Set(candidates)];
}
