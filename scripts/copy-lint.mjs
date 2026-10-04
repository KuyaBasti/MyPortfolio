#!/usr/bin/env node
// copy-lint: fails when an em dash (U+2014) appears outside a comment.
// House rule (AGENTS.md): no em dashes in visible text. En dashes are allowed.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const ROOT = process.cwd();
const SRC_DIRS = ["src"];
const DOC_FILES = ["README.md", "SYSTEM-DESIGN.md", "AGENTS.md", "CLAUDE.md"];
const CODE_EXTS = new Set([".ts", ".tsx", ".js", ".mjs", ".css"]);
const EM = "—";

function* walk(dir) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const st = statSync(full);
        if (st.isDirectory()) yield* walk(full);
        else if (CODE_EXTS.has(extname(entry))) yield full;
    }
}

// Scan code, skipping // line comments and /* */ block comments (including CSS
// comments inside template-literal <style> blocks). A "//" preceded by ":" is
// treated as part of a URL, not a comment.
function violationsInCode(content) {
    const lines = [];
    let inBlock = false;
    let inLine = false;
    let lineNo = 1;
    for (let i = 0; i < content.length; i++) {
        const c = content[i];
        const n = content[i + 1];
        const p = content[i - 1];
        if (c === "\n") {
            lineNo++;
            inLine = false;
            continue;
        }
        if (inLine) continue;
        if (inBlock) {
            if (c === "*" && n === "/") {
                inBlock = false;
                i++;
            }
            continue;
        }
        if (c === "/" && n === "*") {
            inBlock = true;
            i++;
            continue;
        }
        if (c === "/" && n === "/" && p !== ":") {
            inLine = true;
            continue;
        }
        if (c === EM) lines.push(lineNo);
    }
    return lines;
}

function violationsInDoc(content) {
    const lines = [];
    content.split("\n").forEach((line, idx) => {
        if (line.includes(EM)) lines.push(idx + 1);
    });
    return lines;
}

let bad = 0;
let scanned = 0;

for (const dir of SRC_DIRS) {
    for (const file of walk(join(ROOT, dir))) {
        scanned++;
        for (const line of violationsInCode(readFileSync(file, "utf8"))) {
            console.error(`${relative(ROOT, file)}:${line}  em dash in visible text`);
            bad++;
        }
    }
}

for (const doc of DOC_FILES) {
    let content;
    try {
        content = readFileSync(join(ROOT, doc), "utf8");
    } catch {
        continue;
    }
    scanned++;
    for (const line of violationsInDoc(content)) {
        console.error(`${doc}:${line}  em dash in visible text`);
        bad++;
    }
}

if (bad > 0) {
    console.error(`copy-lint: ${bad} violation(s). House rule: no em dashes in visible text.`);
    process.exit(1);
}
console.log(`copy-lint: clean (${scanned} files)`);
