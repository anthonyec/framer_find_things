<script lang="ts" context="module">
  let currentPopup: string | null = $state(null)

  export function getPopup() {
    return {
      open(id: string) {
        currentPopup = id
      },

      close() {
        currentPopup = null
      },

      isOpen(id?: string) {
        if (!id) {
          return Boolean(currentPopup)
        }

        return currentPopup === id
      },
    }
  }
</script>

