import play from 'audio-play'
import load from 'audio-loader'
const SOUNDS = [
  'click',
  'beep',
  'damp-beep',
  'space-beep',
  'button'
]
class AudioService {
  constructor() {
    this._audioBuffers = {}
    SOUNDS.forEach(s => {
      load(`/assets/audio/${s}.mp3`).then(buffer => {
        this._audioBuffers[s] = buffer
      })
    })
  }
  play(audioKey, options) {
    if (audioKey in this._audioBuffers) {
      const baseOptions = {
        loop: false,
        volume: 1
      }
      play(this._audioBuffers[audioKey], Object.assign({}, baseOptions, options))
    }
  }
}

export const audioService = new AudioService()
