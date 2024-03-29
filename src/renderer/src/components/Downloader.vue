<script setup lang="ts">
import streamSaver from 'streamsaver'

const props = defineProps<{
  videoUrl?: string
}>()

const inputEl = ref<HTMLInputElement>()
const emit = defineEmits(['cancel'])

const options = reactive({
  title: '',
  isPause: false,
  isStreamSaver: true,
  streamWriter: null
})

const modalShow = reactive({
  title: false,
  cancel: false
})

const pauseButton = computed(() => (options.isPause ? '繼續' : '暫停'))
const state = computed(() => (options.isPause ? '暫停中' : '下載中'))

function start() {
  console.log(options.isStreamSaver)
  if (!options.title) {
    options.title = useDateFormat(useNow(), 'YYYYMMDDHHmmss').value
  }
}

function cancel() {
  emit('cancel')
}

watch(
  () => props.videoUrl,
  (newValue, oldValue) => {
    if (!newValue || newValue === oldValue) return
    console.log('watch videoUrl')
  }
)

onBeforeMount(() => {
  modalShow.title = true
  if (inputEl) {
    setTimeout(() => {
      inputEl.value?.focus()
    }, 0)
  }
})
</script>

<template>
  <div>
    <div class="flex items-center space-x-12">
      <p class="text-[white] text-lg">檔名：{{ options.title }}</p>
      <p class="text-[white] text-lg">狀態：{{ state }}</p>
      <div class="flex space-x-2">
        <a-button type="secondary" @click="options.isPause = !options.isPause">{{ pauseButton }}</a-button>
        <a-popconfirm :ok-button-props="{ status: 'danger' }" content="確定是否取消？?" type="error" @ok="cancel">
          <a-button type="primary" status="danger" @click="modalShow.cancel = true">取消</a-button>
        </a-popconfirm>
      </div>
    </div>
  </div>

  <a-modal v-model:visible="modalShow.title" title="影片名稱" @cancel="cancel" @ok="start">
    <a-space direction="vertical" size="medium" fill>
      <a-input ref="inputEl" v-model="options.title" />
      <div class="flex items-center space-x-3">
        <a-switch v-model="options.isStreamSaver" :checked-value="true" />
        <span>使用StreamSaver</span>
      </div>
    </a-space>
  </a-modal>
</template>
