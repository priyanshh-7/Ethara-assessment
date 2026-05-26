import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "docs");
const tempDir = path.join(os.tmpdir(), `ethara-docx-${Date.now()}`);
const docxPath = path.join(outDir, "Ethara-Learn-Codebase.docx");
const zipPath = path.join(outDir, "Ethara-Learn-Codebase.zip");

const excludedDirs = new Set(["node_modules", "dist", ".git"]);
const excludedFiles = new Set(["package-lock.json", ".env"]);
const allowedDotFiles = new Set([".gitignore", ".env.example"]);

const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;

const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`;

const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:after="120" w:line="300" w:lineRule="auto"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/><w:color w:val="101419"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:qFormat/>
    <w:pPr><w:spacing w:after="120"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:sz w:val="44"/><w:color w:val="0F766E"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:keepNext/><w:spacing w:before="360" w:after="200"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:sz w:val="32"/><w:color w:val="2E74B5"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr><w:keepNext/><w:spacing w:before="280" w:after="140"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:sz w:val="26"/><w:color w:val="2E74B5"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Code">
    <w:name w:val="Code"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="15"/><w:color w:val="1F2937"/></w:rPr>
  </w:style>
</w:styles>`;

const appProps = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Codex</Application>
</Properties>`;

const coreProps = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Ethara Learn Codebase</dc:title>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified>
</cp:coreProperties>`;

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function paragraph(text, style = "Normal") {
  const preserved = text.startsWith(" ") || text.endsWith(" ") ? ' xml:space="preserve"' : "";
  return `<w:p><w:pPr><w:pStyle w:val="${style}"/></w:pPr><w:r><w:t${preserved}>${escapeXml(text)}</w:t></w:r></w:p>`;
}

function pageBreak() {
  return `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    if (entry.isDirectory() && excludedDirs.has(entry.name)) return [];
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    const relative = path.relative(root, fullPath).replaceAll("\\", "/");
    const base = path.basename(relative);
    if (excludedFiles.has(base)) return [];
    if (base.startsWith(".") && !allowedDotFiles.has(base)) return [];
    if (relative.startsWith("docs/")) return [];
    if (relative.startsWith("scripts/generate-codebase-doc.mjs")) return [];
    return [relative];
  });
}

const files = walk(root).sort((a, b) => a.localeCompare(b));
const body = [];

body.push(paragraph("Ethara Learn Codebase", "Title"));
body.push(paragraph("Full source code document for the LMS website."));
body.push(paragraph(`Generated: ${new Date().toLocaleString()}`));
body.push(paragraph("Private .env files, node_modules, build output, and package lockfiles are intentionally excluded."));
body.push(paragraph("Use .env.example files and the README deployment section for environment configuration."));
body.push(pageBreak());
body.push(paragraph("Folder Structure", "Heading1"));
for (const file of files) body.push(paragraph(file, "Code"));

for (const file of files) {
  body.push(pageBreak());
  body.push(paragraph(file, "Heading1"));
  const text = fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  if (lines.length === 1 && lines[0] === "") {
    body.push(paragraph("(empty file)", "Code"));
  } else {
    for (const line of lines) body.push(paragraph(line || " ", "Code"));
  }
}

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${body.join("\n")}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1080" w:bottom="1440" w:left="1080" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(path.join(tempDir, "_rels"), { recursive: true });
fs.mkdirSync(path.join(tempDir, "word", "_rels"), { recursive: true });
fs.mkdirSync(path.join(tempDir, "docProps"), { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(tempDir, "[Content_Types].xml"), contentTypes);
fs.writeFileSync(path.join(tempDir, "_rels", ".rels"), rootRels);
fs.writeFileSync(path.join(tempDir, "word", "document.xml"), documentXml);
fs.writeFileSync(path.join(tempDir, "word", "styles.xml"), styles);
fs.writeFileSync(path.join(tempDir, "word", "_rels", "document.xml.rels"), docRels);
fs.writeFileSync(path.join(tempDir, "docProps", "core.xml"), coreProps);
fs.writeFileSync(path.join(tempDir, "docProps", "app.xml"), appProps);

fs.rmSync(docxPath, { force: true });
fs.rmSync(zipPath, { force: true });
execFileSync("powershell.exe", [
  "-NoProfile",
  "-Command",
  `Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${zipPath}' -Force`
]);
fs.renameSync(zipPath, docxPath);

fs.rmSync(tempDir, { recursive: true, force: true });
console.log(docxPath);
