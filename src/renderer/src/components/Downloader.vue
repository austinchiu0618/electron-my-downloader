<script setup lang="ts">
// import streamSaver from 'streamsaver'

const props = defineProps<{
  videoUrl?: string
  title: string
  isStreamSaver: boolean
}>()

const isPause = defineModel<boolean>('isPause')

const emit = defineEmits(['cancel'])
// const { isPause: pause } = useVModels(props, emit)

const options = reactive({
  title: props.title,
  isStreamSaver: props.isStreamSaver,
  streamWriter: null
})

const pauseButton = computed(() => (isPause.value ? '繼續' : '暫停'))
const state = computed(() => (isPause.value ? '暫停中' : '下載中'))

function cancel() {
  emit('cancel')
}

// onMounted(() => {
// })
</script>

<template>
  <div class="min-h-[74vh] p-4 bg-[#111111bb] flex flex-col space-y-3 text-base">
    <div class="flex items-center space-x-10">
      <p class="text-[white]">檔名：{{ options.title }}</p>
      <p class="text-[white]">狀態：{{ state }}</p>
      <div class="flex space-x-3">
        <a-button size="small" type="secondary" @click="isPause = !isPause">{{ pauseButton }}</a-button>
        <a-button size="small" type="primary" status="warning" @click="cancel()">取消</a-button>
      </div>
    </div>

    <div class="text-[white] flex items-center">網址：{{ videoUrl }} <CopyButton :text="videoUrl ?? ''" /></div>

    <div></div>
  </div>
</template>
