const {dialog} = require('electron')

module.exports = async function() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled) {
        return;
    } else {
        return filePaths[0]
    }
}