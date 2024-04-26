import type { Component } from 'vue'

export type AnyObject = Record<string, any>

export interface Tab {
  key: string
  title: string
  component: Component
  props: AnyObject
  event: AnyObject
  model: AnyObject
}

export enum Status {
  normal,
  invalidUrl,
  playError
}

export enum DownloadState {
  ready,
  schedule,
  downloading,
  pause,
  end,
  error
}

export function downloadStateText(state: number | undefined) {
  switch (state) {
    case DownloadState.ready:
      return '尚未開始'
    case DownloadState.schedule:
      return '排程中'
    case DownloadState.downloading:
      return '下載中'
    case DownloadState.pause:
      return '暫停中'
    case DownloadState.end:
      return '下載完成'
    case DownloadState.error:
      return '下載錯誤'
    default:
      return ''
  }
}
