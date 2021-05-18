import fs from 'fs'
import path from 'path'
import util from 'util'

const fsReadDirAsync = util.promisify(fs.readdir)

export default async (pathToFolder: string): Promise<string[]> => {
    if (fs.existsSync(pathToFolder)) {
        const filesName = await fsReadDirAsync(pathToFolder)
        return filesName
            .filter(fileName => !fs.statSync(path.join(pathToFolder, fileName)).isDirectory())
            .filter(fileName => !fileName.includes('.map'))
    }
    return []
}
