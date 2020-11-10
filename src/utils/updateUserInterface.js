const updateUserInterface = ({ hasChanges, fileOpened }) => {
  const appTitle = 'Mdown ⬇'

  if (fileOpened) {
    // currentWindow.setTitle(`${path.basename(fileOpened)} - ${appTitle}`)
    document.title = `${path.basename(fileOpened)} - ${appTitle}`
  }
  if (hasChanges && fileOpened) {
    // currentWindow.setTitle(`${path.basename(fileOpened)} ● - ${appTitle}`)
    document.title = `${path.basename(fileOpened)} ● - ${appTitle}`
  }
  if (hasChanges && !fileOpened) {
    // currentWindow.setTitle(`New File ● - ${appTitle}`)
    document.title = `New File ● - ${appTitle}`
  }

  console.log(fileOpened)

  // TODO do this with channels
  // currentWindow.setRepresentedFilename(fileOpened)
  // currentWindow.setDocumentEdited(hasChanges)

  revertButton.disabled = !hasChanges
  saveMarkdownButton.disabled = !hasChanges
}

module.exports = {
  updateUserInterface
}