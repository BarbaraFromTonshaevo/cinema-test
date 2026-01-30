import { defineStore } from 'pinia'
import type { Label } from '@/types/metadata/label'

export const useLabelStore = defineStore('labels', () => {
  
  const labels = reactive<Record<string, Label>>({})
  const loaded = ref(false)
  const loading = ref(false)

  async function fetchLabels() {
    if (loaded.value || loading.value) return

    loading.value = true

    const data = await $fetch<Label[]>(
      'https://cms.test.ksfr.tech/api/v1/metadata/labels'
    )

    for (const label of data) {
      labels[label.oid] = label
    }

    loaded.value = true
    loading.value = false
  }

  function getLabel(oid: string): Label | null {
    return labels[oid] ?? null
  }

  function getLabelName(oid: string): string {
    return labels[oid]?.name ?? ''
  }

  return {
    labels,
    fetchLabels,
    getLabel,
    getLabelName,
    loaded
  }
})