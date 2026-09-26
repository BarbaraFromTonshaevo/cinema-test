// Запросы к API тестового стенда с фолбэком на снапшот из data/snapshot/.
// Снапшот используется, если стенд не ответил за apiTimeout мс
// или если включён флаг NUXT_PUBLIC_API_SNAPSHOT=true.
// Обновить снапшот: npm run snapshot:update

const snapshots: Record<string, () => Promise<{ default: unknown }>> = {
    'showcases/showcases/mainpage/web/': () => import('@/data/snapshot/mainpage.json'),
    'metadata/genres/': () => import('@/data/snapshot/genres.json'),
    'metadata/labels/': () => import('@/data/snapshot/labels.json'),
}

async function loadSnapshot<T>(path: string): Promise<T> {
    const { default: data } = await snapshots[path]!()
    return structuredClone(data) as T
}

export async function fetchApi<T>(path: string): Promise<T> {
    const { apiBase, apiSnapshot, apiTimeout } = useRuntimeConfig().public
    const hasSnapshot = path in snapshots

    if (apiSnapshot && hasSnapshot) return loadSnapshot<T>(path)

    try {
        return await $fetch<T>(path, { baseURL: apiBase, timeout: Number(apiTimeout), retry: 0 })
    }
    catch (error) {
        if (!hasSnapshot) throw error
        console.warn(`[api] ${path} недоступен, используется снапшот`)
        return loadSnapshot<T>(path)
    }
}
