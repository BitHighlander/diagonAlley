/*
        Sound
          - Highlander

 */

let playChingle = async function () {
    let debug = true
    let tag = " | playChingle | "
    try {


        let audio = new Audio('../src/renderer/assets/sounds/chaching.mp3')
        audio.play();

        return true
    } catch (e) {
        console.error('e', e)
        throw Error('999: Unknown Error: ' + e.message)
    }
}

export default {
    playChingle,
}