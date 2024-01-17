const ShellSpawn = require('./lib/ShellSpawn')
const GetFiles = require('./lib/GetFiles')

const path = require('path')
const fs = require('fs')

const ExtractSplitInformation = require('./lib-pdf/ExtractSplitInformation.js')
const SplitPDF = require('./lib-pdf/SplitPDF.js')

let main = async function () {
  let files = GetFiles()

  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    // console.log(file)
    if (file.endsWith('.pdf') === false) {
      continue
    }

    let filename = path.basename(file)
    let filenameNoExt = filename
    if (filenameNoExt.endsWith('.pdf')) {
      filenameNoExt = filenameNoExt.slice(0, -4)
    }

    // let commandsCache = [
    //   ["rm", "-rf", `/cache/*`],
    //   [`cp`, `"${file}"`, `"/cache/${filename}"`]
    // ]

    // for (let j = 0; j < commandsCache.length; j++) {
    //   await ShellSpawn(commandsCache[j])
    // }

    // -----------------------

    let cacheFile = file
    let splitInformation = await ExtractSplitInformation(cacheFile)
    // console.log(splitInformation)
    await SplitPDF(cacheFile, splitInformation)

    // -----------------------
    
    // let commandsEnd = [
    //   [`rm`, `"/cache/${filename}"`],
    //   ["mv", `/cache/*.pdf`, `/input/`]
    // ]


    // for (let j = 0; j < commandsEnd.length; j++) {
    //   await ShellSpawn(commandsEnd[j])
    // }
  }
}

main()
