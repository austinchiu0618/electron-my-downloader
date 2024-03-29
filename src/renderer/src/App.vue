<script setup lang="ts">
import { IconClose } from '@arco-design/web-vue/es/icon'
// const ipcHandle = () => window.electron.ipcRenderer.send('ping')

const url = ref('')
const videoUrl = ref('')
const isInvalidUrl = ref(false)

function setVideoUrl() {
  if (!url.value || !url.value.startsWith('https')) {
    isInvalidUrl.value = true
  } else {
    videoUrl.value = url.value
    isInvalidUrl.value = false
  }
  return !isInvalidUrl.value
}

function onlinePlay() {
  if (setVideoUrl()) isPlayVideo.value = true
}

function download() {
  if (setVideoUrl()) isDownloading.value = true
}

const isPlayVideo = ref(false)
const isDownloading = ref(false)
</script>

<template>
  <div class="app w-screen h-screen overflow-auto">
    <div class="py-10 flex flex-col w-[90vw] mx-auto">
      <div class="mb-5">
        <div class="mb-1 flex space-x-2">
          <a-input v-model:model-value="url" focus :error="isInvalidUrl"></a-input>
          <a-button type="secondary" @click="onlinePlay">線上觀看</a-button>
          <a-button type="primary" @click="download">下載</a-button>
        </div>
        <div v-show="isInvalidUrl" class="text-[#fe4747] text-lg font-bold">Error：網址錯誤&emsp;|&emsp;影片無法播放</div>
      </div>

      <div v-if="isPlayVideo">
        <div class="text-end mb-1"><IconClose class="!text-[#fff] text-[28px] cursor-pointer" @click="isPlayVideo = false" /></div>
        <VideoPlayer :video-url="videoUrl" @error="isInvalidUrl = true"></VideoPlayer>
      </div>

      <a-divider v-if="isPlayVideo && isDownloading" margin="40px" />

      <div v-if="isDownloading">
        <Downloader :video-url="videoUrl" @cancel="isDownloading = false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  --color-danger-light-1: #ffd4d4;
}
</style>
