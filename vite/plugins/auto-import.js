import autoImport from 'unplugin-auto-import/vite'

export default function createAutoImport() {
    return autoImport({
        imports: [
            'vue',
            'vue-router',
            'pinia'
        ],
        dirs: ['./src/locale', './src/api/auto-import-api', './src/stores/modules', './src/hooks', './src/utils/custom'],
        dts: false
    })
}
