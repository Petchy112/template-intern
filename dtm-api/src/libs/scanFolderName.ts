import fs from 'fs'
import path from 'path'
import util from 'util'

const fsReadDirAsync = util.promisify(fs.readdir)

export default (pathToFolder: string): Promise<{ name: string, path: string, }[]> =>
    fsReadDirAsync(pathToFolder)
        .then((foldersName: string[]) =>
            foldersName.map(folderName => {
                return {
                    name: folderName,
                    path: path.join(pathToFolder, folderName),
                }
            })
                .filter(folder => fs.statSync(folder.path).isDirectory()),
        )
