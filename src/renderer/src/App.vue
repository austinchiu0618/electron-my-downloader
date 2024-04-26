<script setup lang="ts">
// const ipcHandle = () => window.electron.ipcRenderer.send('ping')
import { IconDelete, IconPaste, IconPlayArrowFill, IconDownload, IconUpload } from '@arco-design/web-vue/es/icon'

import { Status, downloadStateText, DownloadState, type Tab } from '@renderer/types'
import type { FileItem } from '@arco-design/web-vue/es'

const VideoPlayer = defineAsyncComponent(() => import('@renderer/components/VideoPlayer.vue'))
const Downloader = defineAsyncComponent(() => import('@renderer/components/Downloader.vue'))

const { confirmModal, warningModal } = useSimpleModal()

const inputUrl = ref('https://v.cdnlz2.com/20240423/30420_1923c90f/2000k/hls/mixed.m3u8')
// https://v12.tlkqc.com/wjv12/202404/24/DSBC353uqc84/video/1000k_0X720_64k_25/hls/index.m3u8

const urlHistory = reactive({
  list: useLocalStorage<string[]>('urlHistory', []),
  add(url) {
    if (urlHistory.list.includes(url)) urlHistory.list.splice(urlHistory.list.indexOf(url), 1)
    urlHistory.list.unshift(url)
    if (urlHistory.list.length > 5) urlHistory.list.pop()
  },
  clean() {
    warningModal({
      content: '是否清除觀看紀錄',
      onOk() {
        urlHistory.list.splice(0, urlHistory.list.length)
      }
    })
  }
})

const videoStatus = ref(Status.normal)
const errorMessage = computed(() => {
  switch (videoStatus.value) {
    case Status.invalidUrl:
      return '網址錯誤'
    case Status.playError:
      return '影片無法播放'
    default:
      return ''
  }
})

function validUrl(url: string) {
  const isEmpty = !url
  const isWrongUrl = !(url.startsWith('http') || url.startsWith('blob'))
  videoStatus.value = isEmpty || isWrongUrl ? Status.invalidUrl : Status.normal
  return !(isEmpty || isWrongUrl)
}

const playVideo = reactive({
  start(url = inputUrl.value) {
    if (!validUrl(url)) return
    if (tabList.length === 0 || tabList[0].key !== 'video') {
      tabList.unshift({
        key: 'video',
        title: '線上觀看',
        component: shallowRef(VideoPlayer),
        props: {
          videoUrl: url
        },
        event: {
          error: () => {
            videoStatus.value = Status.playError
          }
        },
        model: {}
      })
      activeTab.value = 'video'
      urlHistory.add(url)
    } else {
      if (tabList[0].props.videoUrl === url) {
        activeTab.value = 'video'
      } else {
        if (videoStatus.value === Status.playError) {
          tabList[0].props.videoUrl = url
          urlHistory.add(url)
        } else {
          confirmModal({
            content: '是否更換影片',
            onOk() {
              tabList[0].props.videoUrl = url
              urlHistory.add(url)
            }
          })
        }
      }
    }
  }
})

const initDownloadOption = {
  title: '',
  isStart: false,
  isUseStreamSaver: true
}

const downloadVideo = reactive({
  showStartModal: false,
  options: {
    title: '',
    isStart: false,
    isUseStreamSaver: true
  },
  openDownloadOption() {
    if (!validUrl(inputUrl.value)) return
    if (!downloadVideo.options.title) downloadVideo.options.title = useDateFormat(useNow(), 'YYYYMMDDHHmmss').value
    downloadVideo.showStartModal = true
  },
  start() {
    const timestamp = useDateFormat(useNow(), 'YYYYMMDDHHmmss').value
    if (!downloadVideo.options.title) downloadVideo.options.title = timestamp
    tabList.push({
      key: timestamp,
      title: downloadVideo.options.title,
      component: shallowRef(Downloader),
      props: {
        videoUrl: inputUrl.value,
        title: downloadVideo.options.title,
        isStart: downloadVideo.options.isStart,
        isUseStreamSaver: downloadVideo.options.isUseStreamSaver
      },
      model: {
        state: downloadVideo.options.isStart ? DownloadState.downloading : DownloadState.ready
      },
      event: {
        cancel() {
          downloadVideo.cancel(timestamp)
        }
      }
    })
    activeTab.value = timestamp
  },
  optionsInit() {
    downloadVideo.options = { ...initDownloadOption, title: useDateFormat(useNow(), 'YYYYMMDDHHmmss').value }
  },
  cancel(key: string) {
    warningModal({
      content: '是否取消下載',
      onOk() {
        const index = tabList.findIndex((el) => el.key === key)
        tabList.splice(index, 1)
        if (tabList.length > 0) activeTab.value = tabList[0].key
      }
    })
  }
})

function uploadFile(fileList: FileItem[], fileItem: FileItem) {
  if (fileList.length > 1) fileList.shift()
  if (fileItem.file) {
    const videoUrl = URL.createObjectURL(fileItem.file)
    downloadVideo.options.title = fileItem.file.name
    playVideo.start(videoUrl)
  }
}

const tabList = reactive<Tab[]>([])
const activeTab = ref('')
const clickTab = (key) => {
  activeTab.value = key
}
const deleteTab = (key) => {
  if (key === 'video') {
    tabList.shift()
    if (tabList.length > 0) activeTab.value = tabList[0].key
  } else {
    downloadVideo.cancel(key)
  }
}

const pasteText = () => {
  navigator.clipboard.readText().then((text) => {
    inputUrl.value = text
  })
}
</script>

<template>
  <div class="app w-screen h-screen overflow-auto">
    <div class="py-8 flex flex-col w-[93vw] mx-auto">
      <div class="mb-5 flex flex-col space-y-1.5">
        <div class="flex items-center space-x-2">
          <a-input v-model:model-value="inputUrl" focus :error="videoStatus === Status.invalidUrl">
            <template #suffix>
              <button v-if="inputUrl" @click="inputUrl = ''"><IconDelete class="!text-lg !text-[#aaa]" /></button>
              <button v-else @click="pasteText"><IconPaste class="!text-lg !text-[#aaa]" /></button>
            </template>

            <template #prepend>
              <a-dropdown position="bl" update-at-scroll @select="playVideo.start">
                <a-button size="mini">觀看紀錄</a-button>
                <template #content>
                  <div class="min-w-[60.5vw]">
                    <a-doption v-for="url in urlHistory.list" :key="url" :value="url">{{ url }}</a-doption>
                    <a-button size="mini" type="text" @click="urlHistory.clean">清除紀錄</a-button>
                  </div>
                </template>
              </a-dropdown>
            </template>
          </a-input>

          <a-button type="secondary" @click="playVideo.start()">
            <IconPlayArrowFill class="text-base" />
            線上觀看
          </a-button>

          <a-button type="primary" @click="downloadVideo.openDownloadOption">
            <IconDownload class="text-base" />
            下載影片
          </a-button>

          <a-upload :auto-upload="false" :show-file-list="false" @change="uploadFile">
            <template #upload-button>
              <a-button status="success"> <IconUpload />本機m3u8</a-button>
            </template>
          </a-upload>
        </div>

        <p v-if="videoStatus !== 0" class="text-[#fe4747] font-bold text-base">Error：{{ errorMessage }}</p>

        <p v-if="tabList[0] && tabList[0].key === 'video'" class="text-[#fff] text-base flex items-center">
          目前播放網址：{{ tabList[0].props.videoUrl }}
          <CopyButton :text="tabList[0].props.videoUrl" />
        </p>
      </div>

      <!-- Tabs -->
      <div v-if="tabList.length > 0" class="tabs">
        <a-tabs type="card" :active-key="activeTab" auto-switch :editable="true" @delete="deleteTab" @tab-click="clickTab">
          <a-tab-pane v-for="tab of tabList" :key="tab.key" :title="tab.title">
            <template v-if="'state' in tab.model" #title>{{ tab.title }} - {{ downloadStateText(tab.model.state) }}</template>
            <component :is="tab.component" v-bind="tab.props" v-model:state="tab.model.state" v-on="tab.event"></component>
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- 設定影片Modal -->
      <a-modal v-model:visible="downloadVideo.showStartModal" title="設定影片" @ok="downloadVideo.start">
        <a-space direction="vertical" size="medium" fill>
          <a-input ref="inputEl" v-model="downloadVideo.options.title">
            <template v-if="downloadVideo.options.title !== ''" #suffix>
              <button @click="downloadVideo.options.title = ''">
                <IconDelete class="!text-lg !text-[#aaa]" />
              </button>
            </template>
          </a-input>
          <div class="flex items-center justify-start space-x-4">
            <div class="flex items-center space-x-2">
              <a-switch v-model="downloadVideo.options.isUseStreamSaver" :checked-value="true" />
              <span>使用StreamSaver</span>
            </div>
            <div class="flex items-center space-x-2">
              <a-switch v-model="downloadVideo.options.isStart" />
              <span>開始下載</span>
            </div>
            <div class="flex-grow text-right">
              <a-button class="justify-items-end" type="text" @click="downloadVideo.optionsInit">初始化設定</a-button>
            </div>
          </div>
        </a-space>
      </a-modal>

      <!-- 是否取消下載 -->
      <!-- <a-modal v-model:visible="downloadVideo.isShowCancelModal" status="danger" simple title="是否取消下載" @ok="downloadVideo.cancelConfirm" /> -->
    </div>
  </div>
</template>

<style scoped>
.app {
  --color-danger-light-1: #ffd4d4;
}

.tabs {
  /* arco-tabs border color */
  --color-neutral-3: transparent;
  --color-bg-2: transparent;
}

:deep(.arco-input-prepend) {
  padding: 0;
}

:deep(.arco-tabs-tab) {
  background: #333 !important;
  border: 0px !important;
  border-radius: 12px 12px 0px 0px !important;
  color: #eee !important;
}

:deep(.arco-tabs-tab-active) {
  background: #686868 !important;
}

:deep(.arco-tabs-content) {
  padding-top: 0px;
  box-shadow: 0px 2px 20px -1px #383838;
}

:deep(.arco-tabs) {
  overflow: visible !important;
}
</style>
