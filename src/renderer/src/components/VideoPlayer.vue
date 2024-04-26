<script setup lang="ts">
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import Hls from 'hls.js'

const props = defineProps<{
  videoUrl?: string
}>()

const emit = defineEmits(['error'])

const videoEl = ref<HTMLVideoElement>()
let videoPlayer: Plyr

const plyrOptions = {
  controls: ['play-large', 'rewind', 'play', 'fast-forward', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
  ratio: '16:9',
  speed: { selected: 1, options: [0.75, 1, 1.5, 2, 4] },
  blankVideo: './'
}

const setVideoUrl = (url: string) => {
  if (videoEl.value && Hls.isSupported()) {
    const hls = new Hls()
    hls.on(Hls.Events.ERROR, function (event, data) {
      // console.error('HLS error:', data.type, data.details)
      if (data.details === 'manifestLoadError') {
        emit('error')
      }
      console.error('HLS Error： ', data.type, data.details)
    })
    hls.loadSource(url)
    hls.attachMedia(videoEl.value)
  }
}

watch(
  () => props.videoUrl,
  (newValue, oldValue) => {
    if (!newValue || newValue === oldValue) return
    setVideoUrl(newValue)
  }
)

onMounted(() => {
  if (videoEl.value) {
    videoPlayer = new Plyr(videoEl.value, plyrOptions)
    videoPlayer.on('loadedmetadata', () => {
      videoPlayer.play()
    })
    videoPlayer.on('error', (err) => {
      emit('error')
      console.error('VideoPlayer Error： ', err)
    })
    if (props.videoUrl) {
      setVideoUrl(props.videoUrl)
    }
  }
})

onUnmounted(() => {
  videoPlayer?.destroy()
})
</script>

<template>
  <div class="w-full">
    <video id="player" ref="videoEl"></video>
  </div>
</template>
