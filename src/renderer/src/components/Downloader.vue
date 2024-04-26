<script setup lang="ts">
import streamSaver from 'streamsaver'
import { downloadStateText, DownloadState } from '@renderer/types'

const props = defineProps<{
  videoUrl?: string
  title: string
  isUseStreamSaver: boolean
  isStart: boolean
}>()

const state = defineModel<number>('state')

const emit = defineEmits(['cancel'])

const config = reactive({
  beginTime: '', // 開始下載的時間
  errorNum: 0, // 錯誤數
  finishNum: 0, // 已下載數
  downloadIndex: 0, // 當前下載片段
  finishList: [], // 下載完成項目
  tsUrlList: [], // ts URL數組
  mediaFileList: [], // 下載的媒體數組
  streamWriter: null, // 文件流寫入器
  streamDownloadIndex: 0, // 文件流寫入器，正準備寫入第幾個視頻片段
  aesConf: {
    // AES 視頻解密配置
    method: '', // 加密算法
    uri: '', // key 所在文件路徑
    iv: '', // 偏移值
    key: '', // 秘鑰
    decryptor: null, // 解碼器對象
    stringToBuffer: function (str) {
      return new TextEncoder().encode(str)
    }
  }
})

const contorlButtonText = computed(() => {
  switch (state.value) {
    case DownloadState.ready:
      return '開始'
    case DownloadState.schedule:
    case DownloadState.downloading:
      return '暫停'
    case DownloadState.pause:
      return '繼續'
    case DownloadState.end:
      return '完成'
    case DownloadState.error:
      return '重新下載'
    default:
      return ''
  }
})

const onPause = () => {
  if (state.value === DownloadState.ready) {
    state.value = DownloadState.downloading
  } else if (state.value === DownloadState.downloading) {
    state.value = DownloadState.pause
  } else if (state.value === DownloadState.pause) {
    state.value = DownloadState.downloading
  }
}

// function start() {

// }

function cancel() {
  emit('cancel')
}

onMounted(() => {
  if (props.isUseStreamSaver) {
    config.streamWriter = streamSaver.createWriteStream(`${props.title}.mp4`).getWriter()
  }
})
</script>

<template>
  <div class="min-h-[74vh] p-4 bg-[#111111bb] flex flex-col space-y-3 text-base text-[white]">
    <div class="flex items-center space-x-12">
      <p>檔名：{{ title }}</p>
      <p>狀態：{{ downloadStateText(state) }}</p>
      <div class="flex space-x-5">
        <a-button :disabled="state === DownloadState.end" size="small" type="secondary" @click="onPause">{{ contorlButtonText }}</a-button>
        <a-button size="small" type="primary" status="warning" @click="cancel()">取消</a-button>
      </div>
    </div>
    <div class="flex items-center">
      <p class="truncate">網址：{{ videoUrl }}</p>
      <CopyButton :text="videoUrl ?? ''" />
    </div>

    <div></div>
  </div>
</template>
