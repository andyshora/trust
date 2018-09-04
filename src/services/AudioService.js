import play from 'audio-play'
import load from 'audio-loader'
class AudioService {
  constructor() {
    this._audioBuffers = {}
    load('/assets/audio/click.mp3').then(buffer => {
      this._audioBuffers['click'] = buffer
    })
    load('/assets/audio/beep.mp3').then(buffer => {
      this._audioBuffers['beep'] = buffer
    })
  }
  play(audioKey) {
    if (audioKey in this._audioBuffers) {
      const options = {
        loop: false,
        volume: 1
      }
      play(this._audioBuffers[audioKey], options)
    }
  }
}

export const audioService = new AudioService()
