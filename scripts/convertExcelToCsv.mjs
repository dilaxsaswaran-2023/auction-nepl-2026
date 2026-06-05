import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import Papa from "papaparse";
import readXlsxFile from "read-excel-file/node";

const workbookPath =
  process.argv[2] ||
  path.resolve("NEPL2026 (Responses).xlsx");

const outputPath = path.resolve("public", "data", "players.csv");

const columns = {
  name: "Your Name With initials",
  gender: "Your Gender",
  team2025: "Mention Your Contributed team in NEPL 2025",
  skills: "Describe your Cricket skills in following options",
};

const clean = (value) => String(value ?? "").trim();
const normalizeHeader = (value) => clean(value).replace(/\s+/g, " ").toLowerCase();

function normalizeSkillText(value) {
  return clean(value)
    .replace(/\s+/g, " ")
    .replace(/[–—]/g, "-");
}

function extractBattingStyle(value) {
  const text = normalizeSkillText(value);
  const match = text.match(/\b(Right|Left)\s*Hand\s*-?\s*Batsman\b/i);
  if (!match) return "N/A";
  return `${capitalize(match[1])} Hand-Batsman`;
}

function extractBowlingStyle(value) {
  const text = normalizeSkillText(value);
  const match = text.match(/\b(Right|Left)\s*Arm\s*-?\s*Bowler\b/i);
  if (!match) return "N/A";
  return `${capitalize(match[1])} Arm-Bowler`;
}

function capitalize(value) {
  const lower = String(value).toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function formatNamePart(value) {
  return clean(value)
    .toLowerCase()
    .split(/([\s'-]+)/)
    .map((part) => (/^[a-z]/.test(part) ? capitalize(part) : part))
    .join("");
}

function normalizeInitials(value) {
  return clean(value)
    .replace(/\./g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join(".");
}

function normalizePlayerName(value) {
  const name = clean(value).replace(/\s+/g, " ");
  if (!name) return "";

  const dottedInitialMatch = name.match(/^([A-Za-z](?:\s*\.\s*[A-Za-z])*)\s*\.\s*(.+)$/);
  if (dottedInitialMatch) {
    return `${normalizeInitials(dottedInitialMatch[1])}.${formatNamePart(
      dottedInitialMatch[2],
    )}`;
  }

  const spacedInitialMatch = name.match(/^([A-Za-z])\.?\s+(.+)$/);
  if (spacedInitialMatch) {
    return `${spacedInitialMatch[1].toUpperCase()}.${formatNamePart(
      spacedInitialMatch[2],
    )}`;
  }

  const trailingInitialMatch = name.match(/^(.+?)\s+([A-Za-z])\.?$/);
  if (trailingInitialMatch) {
    return `${trailingInitialMatch[2].toUpperCase()}.${formatNamePart(
      trailingInitialMatch[1],
    )}`;
  }

  const formattedName = formatNamePart(name);
  if (/^[A-Z][a-zA-Z'-]+$/.test(formattedName) && formattedName.length > 1) {
    return `${formattedName.charAt(0)}.${formattedName}`;
  }

  return formattedName;
}

function resolveColumns(row) {
  const actualHeaders = Object.keys(row);
  const normalizedToActual = new Map(
    actualHeaders.map((header) => [normalizeHeader(header), header]),
  );

  return Object.fromEntries(
    Object.entries(columns).map(([key, expectedHeader]) => [
      key,
      normalizedToActual.get(normalizeHeader(expectedHeader)),
    ]),
  );
}

if (!fs.existsSync(workbookPath)) {
  console.error(`Workbook not found: ${workbookPath}`);
  console.error("Usage: npm run convert:csv -- \"path/to/NEPL2026 (Responses).xlsx\"");
  process.exit(1);
}

const workbookRows = await readXlsxFile(workbookPath);
const rawRows = Array.isArray(workbookRows[0]?.data)
  ? workbookRows[0].data
  : workbookRows;
const headers = rawRows[0]?.map((header) => String(header ?? "")) || [];
const rows = rawRows.slice(1).map((row) =>
  Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])),
);

if (!rows.length) {
  throw new Error("The workbook does not contain any player rows.");
}

const resolvedColumns = resolveColumns(rows[0]);
const missingColumns = Object.entries(resolvedColumns)
  .filter(([, actualHeader]) => !actualHeader)
  .map(([key]) => columns[key]);

if (missingColumns.length) {
  throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
}

const players = rows
  .map((row) => {
    const name = normalizePlayerName(row[resolvedColumns.name]);
    const gender = clean(row[resolvedColumns.gender]) || "N/A";
    const team2025 = clean(row[resolvedColumns.team2025]) || "New Player";
    const skills = row[resolvedColumns.skills];

    return {
      name,
      gender,
      team2025,
      battingStyle: extractBattingStyle(skills),
      bowlingStyle: extractBowlingStyle(skills),
      image: name ? `/players/${encodeURIComponent(name)}.jpg` : "",
    };
  })
  .filter((player) => player.name);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const csv = Papa.unparse(players, {
  columns: ["name", "gender", "team2025", "battingStyle", "bowlingStyle", "image"],
});

fs.writeFileSync(outputPath, `${csv}\n`, "utf8");

console.log(`Converted ${players.length} players`);
console.log(`Wrote ${outputPath}`);
