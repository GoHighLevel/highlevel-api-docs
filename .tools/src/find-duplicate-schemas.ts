import fs from 'node:fs';
import path from 'node:path';

const WORKSPACE_DIR = process.cwd();

function findJsonFiles(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findJsonFiles(filePath));
        } else if (file.endsWith('.json')) {
            results.push(filePath);
        }
    });
    return results;
}

interface SchemaMap {
    [schemaName: string]: Set<string>;
}

function collectSchemas(files: string[]): SchemaMap {
    const schemaMap: SchemaMap = {};
    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const json = JSON.parse(content);
            const schemas = json?.components?.schemas;
            if (schemas && typeof schemas === 'object') {
                for (const schemaName of Object.keys(schemas)) {
                    if (!schemaMap[schemaName]) {
                        schemaMap[schemaName] = new Set();
                    }
                    schemaMap[schemaName].add(file);
                }
            }
        } catch (e) {
            // Ignore parse errors for non-Swagger JSON files
        }
    }
    return schemaMap;
}

function printDuplicates(schemaMap: SchemaMap) {
    let found = false;
    for (const [schema, files] of Object.entries(schemaMap)) {
        if (files.size > 1) {
            found = true;
            console.log(`Schema "${schema}" is defined in:`);
            for (const file of files) {
                console.log(`  - ${file}`);
            }
            console.log('');
        }
    }
    if (!found) {
        console.log('No repeated schema definitions found.');
    }
}

const jsonFiles = findJsonFiles(WORKSPACE_DIR);
const schemaMap = collectSchemas(jsonFiles);
printDuplicates(schemaMap);
