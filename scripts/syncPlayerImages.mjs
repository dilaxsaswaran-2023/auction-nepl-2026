import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

const playersDir = path.resolve("public", "players");
const csvPath = path.resolve("public", "data", "players.csv");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic"]);
const manualMatches = new Map([
  ["DSC_4570 - Thedsanamoorthy Tisiyanthan.jpg", "T.Tisiyanthan"],
  ["g - kajeeban.jpg", "V.Kajeeban"],
  ["IMG_20260502_113318 - Gowsihan Gowsi.jpg", "V.Gowsihan"],
  ["IMG_8847 - uma sangar.HEIC", "K.Umasangar"],
  ["IMG-20250514-WA0009 - kumaran sas.jpg", "S.Saravanakumaran"],
  ["IMG-20251211-WA0038 - Reginauld Felician.jpg", "R.F.Alexander"],
]);

function clean(value) {
  return String(value ?? "").trim();
}

function tokenize(value) {
  return clean(value)
    .toLowerCase()
    .replace(/[-_().,\[\]]/g, " ")
    .replace(/[^a-z0-9'-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !/^\d+$/.test(token))
    .filter((token) => token.length > 1 || /^[a-z]$/.test(token));
}

function playerParts(name) {
  const parts = clean(name).split(".");
  return {
    initials: parts.slice(0, -1).map((part) => part.toLowerCase()),
    nameTokens: tokenize(parts.at(-1)),
  };
}

function fileNameSegments(fileName) {
  const parsed = path.parse(fileName);
  const base = parsed.name;
  return [base, ...base.split(/\s+-\s+/)].filter(Boolean);
}

function scoreSegment(player, segment) {
  const tokens = tokenize(segment);
  const tokenSet = new Set(tokens);
  let score = 0;

  const matchedNameTokens = player.nameTokens.filter((token) => tokenSet.has(token));
  if (matchedNameTokens.length) {
    score += matchedNameTokens.length * 70;
  }

  if (matchedNameTokens.length === player.nameTokens.length && player.nameTokens.length) {
    score += 100;
  }

  const otherTokens = tokens.filter((token) => !player.nameTokens.includes(token));
  const matchedInitials = player.initials.filter((initial) =>
    otherTokens.some((token) => token === initial || token.startsWith(initial)),
  );
  score += matchedInitials.length * 36;

  if (matchedNameTokens.length && matchedInitials.length) {
    score += 90;
  }

  const segmentText = tokens.join(" ");
  const nameText = player.nameTokens.join(" ");
  if (nameText && segmentText.includes(nameText)) {
    score += 30;
  }

  return score;
}

function scoreFile(player, fileName) {
  return Math.max(...fileNameSegments(fileName).map((segment) => scoreSegment(player, segment)));
}

function uniqueTargetPath(targetPath) {
  if (!fs.existsSync(targetPath)) return targetPath;

  const parsed = path.parse(targetPath);
  let index = 2;
  let nextPath = path.join(parsed.dir, `${parsed.name}-${index}${parsed.ext}`);
  while (fs.existsSync(nextPath)) {
    index += 1;
    nextPath = path.join(parsed.dir, `${parsed.name}-${index}${parsed.ext}`);
  }
  return nextPath;
}

const csv = fs.readFileSync(csvPath, "utf8");
const { data: players } = Papa.parse(csv, { header: true, skipEmptyLines: true });
const playerLookup = players.map((player, index) => ({
  index,
  name: player.name,
  parts: playerParts(player.name),
}));

const imageFiles = fs
  .readdirSync(playersDir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => name !== "default-player.svg")
  .filter((name) => supportedExtensions.has(path.extname(name).toLowerCase()));

const planned = [];
const unmatched = [];
const usedPlayerIndexes = new Set();

for (const fileName of imageFiles) {
  const manualPlayerName = manualMatches.get(fileName);
  if (manualPlayerName) {
    const playerIndex = playerLookup.find((player) => player.name === manualPlayerName)?.index;
    if (playerIndex !== undefined && !usedPlayerIndexes.has(playerIndex)) {
      usedPlayerIndexes.add(playerIndex);
      planned.push({ fileName, playerIndex, playerName: manualPlayerName, score: Infinity });
      continue;
    }
  }

  const scores = playerLookup
    .map((player) => ({ ...player, score: scoreFile(player.parts, fileName) }))
    .filter((candidate) => candidate.score >= 220)
    .sort((a, b) => b.score - a.score);

  const [best, second] = scores;
  if (!best || (second && best.score - second.score < 35) || usedPlayerIndexes.has(best.index)) {
    unmatched.push(fileName);
    continue;
  }

  usedPlayerIndexes.add(best.index);
  planned.push({ fileName, playerIndex: best.index, playerName: best.name, score: best.score });
}

const renamed = [];

for (const item of planned) {
  const sourcePath = path.join(playersDir, item.fileName);
  const extension = path.extname(item.fileName);
  const intendedTargetPath = path.join(playersDir, `${item.playerName}${extension}`);
  const targetPath =
    path.resolve(sourcePath).toLowerCase() === path.resolve(intendedTargetPath).toLowerCase()
      ? intendedTargetPath
      : uniqueTargetPath(intendedTargetPath);
  const targetName = path.basename(targetPath);

  if (path.resolve(sourcePath).toLowerCase() !== path.resolve(targetPath).toLowerCase()) {
    fs.renameSync(sourcePath, targetPath);
  }

  players[item.playerIndex].image = `/players/${encodeURIComponent(targetName)}`;
  renamed.push(`${item.fileName} -> ${targetName}`);
}

for (const player of players) {
  const expectedPrefix = `${player.name}.`;
  const matchedFile = fs
    .readdirSync(playersDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .find((fileName) => fileName.startsWith(expectedPrefix));

  if (matchedFile) {
    player.image = `/players/${encodeURIComponent(matchedFile)}`;
  }
}

const cleanedCsv = Papa.unparse(
  players.map((player) =>
    Object.fromEntries(
      Object.entries(player).map(([key, value]) => [key, clean(value)]),
    ),
  ),
  {
    columns: ["name", "gender", "team2025", "battingStyle", "bowlingStyle", "image"],
  },
);

fs.writeFileSync(csvPath, `${cleanedCsv}\n`, "utf8");

console.log(`Renamed/linked ${renamed.length} image files.`);
renamed.forEach((line) => console.log(line));
console.log("");
console.log(`Unmatched or ambiguous files: ${unmatched.length}`);
unmatched.forEach((line) => console.log(line));
