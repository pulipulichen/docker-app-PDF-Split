const path = require('path')
const ShellSpawn = require('../lib/ShellSpawn.js')
const ShellExec = require('../lib/ShellExec.js')
// const {AnnotationFactory} = require('annotpdf');
const pdf = require('pdf-page-counter')
const fs = require('fs')

const isColab = require('../lib/isColab.js')

module.exports = async function (inputFile, splitInformation) {

  if (Array.isArray(splitInformation) === false) {
    console.error('splitInformation is incompleted: ' + inputFile)
    return false
  }

  // let basename = path.basename(inputFile)
  let basenameNoExt = path.parse(inputFile).name

  await ShellSpawn([`mkdir`, `-p`, `"${path.join('/output/' + basenameNoExt)}"`])

  // let files = []
  for (let i = 0; i < splitInformation.length; i++) {
    // files.push('"./' + basenameNoExt + '/' + splitInformation[i].filename + ' - ' + basename + '"')
    // break
    let {page, filename} = splitInformation[i]
    let start = page
    let end
    if (i < splitInformation.length - 1) {
      end = splitInformation[(i+1)].page - 1
    }
    else {
      end = (await pdf(fs.readFileSync(inputFile))).numpages
    }

    // let cmd = `qpdf "${inputFile}" --pages "${inputFile}" ${start}-${end} -- "${path.join(__dirname, '../output/' + basenameNoExt + '/',  filename + ' - ' + basename)}"`
    // let outputName = filename + ' - ' + basenameNoExt
    let outputName = filename.trim()
    if (outputName.length > 50) {
      outputName = outputName.slice(0, 50).trim()
    }
		outputName = outputName.replace(/:/g, '-')
		outputName = outputName.replace(/\?/g, '')

    if (process.env.FILENAME_PREPEND === 'true') {
      outputName = basenameNoExt + '_' + outputName
    } 

    outputName = outputName + '.pdf'
    let cmd = [`qpdf`, `--decrypt`, `"${inputFile}"`, `--pages`, `"${inputFile}"`, `${start}-${end}`, `--`, `"${path.join('/output/' + basenameNoExt + '/',  outputName)}"`]
    console.log(cmd.join(' '))
    
    await ShellSpawn(cmd)
  }

  if (isColab) {
    try {
      await ShellExec(`cd "/output/${basenameNoExt}/"; zip -r -j "../${basenameNoExt}.zip" ./*`)
    }
    catch (e) {
      console.error(e)
    }
  }

  // await execAsync(`LC_ALL=C; cd "${path.join(__dirname, '../output/')}"; 7z a -mx=9 -ms=on "./${basenameNoExt}.7z" ${files.join(' ')}`)
  // let compressCommand = `LC_ALL=C; cd "${path.join(__dirname, '../output/' + basenameNoExt)}"; zip -j -q -9 "../${basenameNoExt}.zip" *.pdf`
  // console.log(compressCommand)
  // await execAsync(compressCommand)
}