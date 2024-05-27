import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import pkg from '../package.json'
import jsr from '../jsr.json'

const workspaceDir = path.dirname(path.join(url.fileURLToPath(import.meta.url), '..'))

jsr.version = pkg.version

fs.writeFileSync(path.join(workspaceDir, 'jsr.json'), JSON.stringify(jsr, null, 2))
