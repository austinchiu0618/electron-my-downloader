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
