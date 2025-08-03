import { ref, onMounted, onUnmounted } from 'vue'

export function useResponsive() {
  // Screen size refs - initialize with current window size if available
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 768)

  // Standard device type detection
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const isLargeDesktop = ref(false)

  // Specific breakpoint detection
  const isSmallMobile = ref(false) // < 400px
  const isMediumMobile = ref(false) // 400-575px
  const isLargeMobile = ref(false) // 576-767px
  const isSmallTablet = ref(false) // 768-991px
  const isLargeTablet = ref(false) // 992-1023px
  const isSmallDesktop = ref(false) // 1024-1199px
  const isMediumDesktop = ref(false) // 1200-1439px

  // Orientation detection
  const isPortrait = ref(false)
  const isLandscape = ref(false)

  const updateResponsiveValues = () => {
    if (typeof window === 'undefined') return

    const width = window.innerWidth
    const height = window.innerHeight

    windowWidth.value = width
    windowHeight.value = height

    // Device type detection
    isMobile.value = width < 768
    isTablet.value = width >= 768 && width < 1024
    isDesktop.value = width >= 1024
    isLargeDesktop.value = width >= 1440

    // Specific breakpoints
    isSmallMobile.value = width < 400
    isMediumMobile.value = width >= 400 && width < 576
    isLargeMobile.value = width >= 576 && width < 768
    isSmallTablet.value = width >= 768 && width < 992
    isLargeTablet.value = width >= 992 && width < 1024
    isSmallDesktop.value = width >= 1024 && width < 1200
    isMediumDesktop.value = width >= 1200 && width < 1440

    // Orientation detection
    isPortrait.value = height > width
    isLandscape.value = width > height
  }

  // Initialize values immediately if window is available
  if (typeof window !== 'undefined') {
    updateResponsiveValues()
  }

  onMounted(() => {
    updateResponsiveValues()
    window.addEventListener('resize', updateResponsiveValues)
    window.addEventListener('orientationchange', updateResponsiveValues)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateResponsiveValues)
    window.removeEventListener('orientationchange', updateResponsiveValues)
  })

  return {
    // Window dimensions
    windowWidth,
    windowHeight,

    // Standard device types
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,

    // Specific breakpoints
    isSmallMobile,
    isMediumMobile,
    isLargeMobile,
    isSmallTablet,
    isLargeTablet,
    isSmallDesktop,
    isMediumDesktop,

    // Orientation
    isPortrait,
    isLandscape,

    // Convenience methods
    currentBreakpoint: () => {
      if (isSmallMobile.value) return 'xs'
      if (isMediumMobile.value) return 'sm'
      if (isLargeMobile.value) return 'md'
      if (isSmallTablet.value) return 'lg'
      if (isLargeTablet.value) return 'xl'
      if (isSmallDesktop.value) return '2xl'
      if (isMediumDesktop.value) return '3xl'
      return '4xl'
    },
  }
}