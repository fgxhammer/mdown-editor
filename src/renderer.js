const marked = require('marked')
const { ipcRenderer, app } = require('electron')
// const { remote } = require('electron')
const path = require('path')
const dompurify = require('dompurify')
const { updateUserInterface } = require('./utils/updateUserInterface')

// Globals
let fileOpened = null
let originalFileContent = ''
let currentFileContent = ''

// Electron elements
// const currentWindow = remote.getCurrentWindow()

// Html elements
const markdownView = document.querySelector('#markdown')
const htmlView = document.querySelector('#html')
const newFileButton = document.querySelector('#new-file')
const openFileButton = document.querySelector('#open-file')
const saveMarkdownButton = document.querySelector('#save-markdown')
const revertButton = document.querySelector('#revert')
const saveHtmlButton = document.querySelector('#save-html')
const showFileButton = document.querySelector('#show-file')
const openInDefaultButton = document.querySelector('#open-in-default')

const renderMarkdownToHtml = markdown => {
  htmlView.innerHTML = dompurify.sanitize(marked(markdown))
}

markdownView.addEventListener('keyup', event => {
  currentFileContent = event.target.value
  renderMarkdownToHtml(currentFileContent)
  const hasChanges = currentFileContent !== originalFileContent
  updateUserInterface({ hasChanges, fileOpened })
})

openFileButton.addEventListener('click', () => {
  ipcRenderer.invoke('get-file-from-user')
})

saveMarkdownButton.addEventListener('click', (e) => {
  ipcRenderer.invoke('save-file', { fileOpened, currentFileContent })
})

ipcRenderer.on('file-open', (e, { filePath, fileContent }) => {
  fileOpened = filePath
  originalFileContent, currentFileContent = fileContent
  markdownView.value = fileContent
  renderMarkdownToHtml(fileContent)
  updateUserInterface({ fileOpened })
})
