<script setup lang="ts">
import { IconCopy } from '@arco-design/web-vue/es/icon'
import { Notification } from '@arco-design/web-vue'

defineProps<{
  text: string
}>()

const { copy } = useClipboard({ legacy: true })

const onClick = (text: string) => {
  copy(text).then(() => {
    Notification.success({
      content: '複製成功',
      style: {
        width: '160px',
        'align-items': 'center',
        padding: '12px'
      },
      duration: 1500
    })
  })
}
</script>

<template>
  <a-button size="mini" type="text" @click="onClick(text)">
    <IconCopy class="!text-base !text-[#aaa]" />
  </a-button>
</template>
