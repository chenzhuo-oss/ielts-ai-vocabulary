// Node.js executes this standalone TypeScript file directly in CommonJS mode.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("node:fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("node:path");

type UnknownRecord = Record<string, unknown>;
type FindingLevel = "ERROR" | "WARNING";

type Finding = {
  level: FindingLevel;
  location: string;
  message: string;
};

const VOCABULARY_PATH = path.resolve(
  __dirname,
  "../src/data/vocabulary.json",
);

const SOURCE_WARNING_LENGTH = 30;

const CORE_WORDS = new Set([
  "significant", "crucial", "pivotal", "vital",
  "primary", "principal", "predominant", "central",
  "increase", "escalate", "surge", "expand",
  "decline", "diminish", "decrease", "shrink",
  "alter", "modify", "transform", "shift",
  "indicate", "demonstrate", "illustrate", "reveal",
  "issue", "complication", "difficulty", "challenge",
  "approach", "strategy", "technique", "methodology",
  "advantage", "benefit", "merit", "strength",
  "drawback", "limitation", "weakness", "disadvantage",
  "beneficial", "advantageous", "favorable", "constructive",
  "detrimental", "adverse", "harmful", "damaging",
  "necessary", "indispensable", "compulsory", "mandatory",
  "feasible", "possible", "viable", "achievable",
  "prevalent", "widespread", "common", "pervasive",
  "substantial", "considerable", "notable", "marked",
  "analyze", "assess", "evaluate", "examine",
  "influence", "affect", "impact", "shape",
  "cause", "induce", "trigger", "generate",
  "consequence", "outcome", "result", "effect",
  "preserve", "conserve", "protect", "safeguard",
  "acquire", "obtain", "attain", "gain",
  "facilitate", "promote", "support", "foster",
  "restrict", "constrain", "inhibit", "hinder",
  "objective", "aim", "purpose", "intention",
]);

const WORD_FIELDS = [
  "id",
  "word",
  "phonetic",
  "meanings",
  "collocations",
  "exampleSentences",
  "synonyms",
];
const MEANING_FIELDS = ["id", "partOfSpeech", "definitionZh"];
const EXAMPLE_FIELDS = ["text", "translation", "source", "meaningId"];
const COLLOCATION_FIELDS = ["text", "translation"];

const findings: Finding[] = [];

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function addFinding(
  level: FindingLevel,
  location: string,
  message: string,
): void {
  findings.push({ level, location, message });
}

function checkExactFields(
  value: UnknownRecord,
  requiredFields: string[],
  location: string,
  additionalAllowedFields: string[] = [],
): void {
  for (const field of requiredFields) {
    if (!(field in value)) {
      addFinding("ERROR", location, `Missing required field "${field}".`);
    }
  }

  const allowed = new Set([...requiredFields, ...additionalAllowedFields]);
  for (const field of Object.keys(value)) {
    if (!allowed.has(field)) {
      addFinding("ERROR", location, `Unexpected field "${field}".`);
    }
  }
}

function checkNonEmptyString(
  value: unknown,
  location: string,
  fieldName: string,
): value is string {
  if (!isNonEmptyString(value)) {
    addFinding("ERROR", location, `"${fieldName}" must be a non-empty string.`);
    return false;
  }
  return true;
}

function validateWord(
  value: unknown,
  index: number,
  seenWordIds: Set<string>,
  seenWords: Set<string>,
): void {
  const fallbackLocation = `words[${index}]`;
  if (!isRecord(value)) {
    addFinding("ERROR", fallbackLocation, "Word entry must be an object.");
    return;
  }

  const location = isNonEmptyString(value.word)
    ? `${fallbackLocation} (${value.word})`
    : fallbackLocation;

  checkExactFields(value, WORD_FIELDS, location, ["exampleSentence"]);

  if ("exampleSentence" in value) {
    addFinding(
      "WARNING",
      location,
      'Deprecated field "exampleSentence" is present; use "exampleSentences" instead.',
    );
  }

  if (checkNonEmptyString(value.id, location, "id")) {
    if (seenWordIds.has(value.id)) {
      addFinding("ERROR", location, `Duplicate word id "${value.id}".`);
    }
    seenWordIds.add(value.id);
  }

  if (checkNonEmptyString(value.word, location, "word")) {
    if (seenWords.has(value.word)) {
      addFinding("ERROR", location, `Duplicate word "${value.word}".`);
    }
    seenWords.add(value.word);
  }

  checkNonEmptyString(value.phonetic, location, "phonetic");

  const meaningIds = new Set<string>();
  if (!Array.isArray(value.meanings) || value.meanings.length === 0) {
    addFinding("ERROR", location, "meanings must be a non-empty array.");
  } else {
    value.meanings.forEach((meaning, meaningIndex) => {
      const meaningLocation = `${location}.meanings[${meaningIndex}]`;
      if (!isRecord(meaning)) {
        addFinding("ERROR", meaningLocation, "Meaning must be an object.");
        return;
      }

      checkExactFields(meaning, MEANING_FIELDS, meaningLocation);
      if (checkNonEmptyString(meaning.id, meaningLocation, "id")) {
        if (meaningIds.has(meaning.id)) {
          addFinding(
            "ERROR",
            meaningLocation,
            `Duplicate meaning id "${meaning.id}" within this word.`,
          );
        }
        meaningIds.add(meaning.id);
      }
      checkNonEmptyString(meaning.partOfSpeech, meaningLocation, "partOfSpeech");
      checkNonEmptyString(meaning.definitionZh, meaningLocation, "definitionZh");
    });
  }

  if (!Array.isArray(value.exampleSentences)) {
    addFinding("ERROR", location, "exampleSentences must be an array.");
  } else {
    if (
      value.exampleSentences.length < 1 ||
      value.exampleSentences.length > 3
    ) {
      addFinding(
        "ERROR",
        location,
        "exampleSentences must contain between 1 and 3 items.",
      );
    }

    value.exampleSentences.forEach((exampleSentence, exampleIndex) => {
      const exampleLocation =
        `${location}.exampleSentences[${exampleIndex}]`;
      if (!isRecord(exampleSentence)) {
        addFinding(
          "ERROR",
          exampleLocation,
          "Example sentence must be an object.",
        );
        return;
      }

      checkExactFields(exampleSentence, EXAMPLE_FIELDS, exampleLocation);
      checkNonEmptyString(exampleSentence.text, exampleLocation, "text");
      checkNonEmptyString(
        exampleSentence.translation,
        exampleLocation,
        "translation",
      );
      if (
        checkNonEmptyString(exampleSentence.source, exampleLocation, "source") &&
        [...exampleSentence.source].length > SOURCE_WARNING_LENGTH
      ) {
        addFinding(
          "WARNING",
          exampleLocation,
          `source is ${[...exampleSentence.source].length} characters long; expected a short brand-level or book-level label (maximum ${SOURCE_WARNING_LENGTH} characters before warning).`,
        );
      }
      if (
        checkNonEmptyString(
          exampleSentence.meaningId,
          exampleLocation,
          "meaningId",
        ) &&
        !meaningIds.has(exampleSentence.meaningId)
      ) {
        addFinding(
          "ERROR",
          exampleLocation,
          `meaningId "${exampleSentence.meaningId}" does not reference a meaning in this word.`,
        );
      }
    });
  }

  if (!Array.isArray(value.collocations) || value.collocations.length === 0) {
    addFinding("ERROR", location, "collocations must be a non-empty array.");
  } else {
    const seenCollocationTexts = new Set<string>();
    value.collocations.forEach((collocation, collocationIndex) => {
      const collocationLocation =
        `${location}.collocations[${collocationIndex}]`;
      if (!isRecord(collocation)) {
        addFinding(
          "ERROR",
          collocationLocation,
          "Collocation must be an object.",
        );
        return;
      }

      checkExactFields(collocation, COLLOCATION_FIELDS, collocationLocation);
      if (checkNonEmptyString(collocation.text, collocationLocation, "text")) {
        if (seenCollocationTexts.has(collocation.text)) {
          addFinding(
            "ERROR",
            collocationLocation,
            `Duplicate collocation text "${collocation.text}" within this word.`,
          );
        }
        seenCollocationTexts.add(collocation.text);
      }
      checkNonEmptyString(
        collocation.translation,
        collocationLocation,
        "translation",
      );
    });
  }

  if (!Array.isArray(value.synonyms)) {
    addFinding("ERROR", location, "synonyms must be an array.");
    return;
  }

  if (value.synonyms.length < 2 || value.synonyms.length > 4) {
    addFinding("ERROR", location, "synonyms must contain between 2 and 4 items.");
  }

  const seenSynonyms = new Set<string>();
  value.synonyms.forEach((synonym, synonymIndex) => {
    const synonymLocation = `${location}.synonyms[${synonymIndex}]`;
    if (!checkNonEmptyString(synonym, synonymLocation, "synonym")) {
      return;
    }

    if (seenSynonyms.has(synonym)) {
      addFinding("ERROR", synonymLocation, `Duplicate synonym "${synonym}".`);
    }
    seenSynonyms.add(synonym);

    if (isNonEmptyString(value.word) && synonym === value.word) {
      addFinding("ERROR", synonymLocation, "A word cannot be its own synonym.");
    }

    if (!CORE_WORDS.has(synonym)) {
      addFinding(
        "ERROR",
        synonymLocation,
        `Synonym "${synonym}" is not in the v0.1 Core Word List.`,
      );
    }
  });
}

function main(): void {
  let data: unknown;

  try {
    data = JSON.parse(fs.readFileSync(VOCABULARY_PATH, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`ERROR [vocabulary.json] Unable to read or parse JSON: ${message}`);
    process.exitCode = 1;
    return;
  }

  if (!isRecord(data)) {
    console.error("ERROR [vocabulary.json] Vocabulary Set must be an object.");
    process.exitCode = 1;
    return;
  }

  checkNonEmptyString(data.id, "Vocabulary Set", "id");
  checkNonEmptyString(data.name, "Vocabulary Set", "name");

  let wordCount = 0;
  if (!Array.isArray(data.words)) {
    addFinding("ERROR", "Vocabulary Set", '"words" must be an array.');
  } else {
    wordCount = data.words.length;
    const seenWordIds = new Set<string>();
    const seenWords = new Set<string>();
    data.words.forEach((word, index) =>
      validateWord(word, index, seenWordIds, seenWords),
    );
  }

  for (const finding of findings) {
    console.log(`${finding.level} [${finding.location}] ${finding.message}`);
  }

  const errorCount = findings.filter(({ level }) => level === "ERROR").length;
  const warningCount = findings.filter(({ level }) => level === "WARNING").length;
  console.log(
    `Vocabulary QA complete: ${wordCount} words, ${errorCount} error(s), ${warningCount} warning(s).`,
  );

  if (errorCount > 0) {
    process.exitCode = 1;
  }
}

main();
