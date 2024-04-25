import { Modal } from '@arco-design/web-vue'
import type { ModalConfig } from '@arco-design/web-vue/es/modal'

export function useSimpleModal() {
  const confirmModal = (options: ModalConfig) => {
    const opt: ModalConfig = {
      closable: false,
      bodyStyle: {
        textAlign: 'center',
        fontSize: '18px'
      },
      ...options
    }
    Modal.confirm(opt)
  }

  const warningModal = (options: ModalConfig) => {
    const opt: ModalConfig = {
      title: 'Warning',
      closable: false,
      hideCancel: false,
      bodyStyle: {
        textAlign: 'center',
        fontSize: '18px'
      },
      okButtonProps: {
        status: 'warning'
      },
      ...options
    }
    Modal.warning(opt)
  }

  return {
    confirmModal,
    warningModal
  }
}
