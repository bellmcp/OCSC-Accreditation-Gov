const PATH = process.env.REACT_APP_BASE_PATH

export const navigationItems = [
  {
    id: 0,
    title: 'หน้าหลัก',
    url: PATH,
  },
  {
    id: 1,
    title: 'ยื่นคำร้องขอตรวจสอบคุณวุฒิ',
    url: `${PATH}/request`,
  },
  {
    id: 2,
    title: 'ค้นหาหนังสือรับรองคุณวุฒิ',
    url: `${PATH}/search`,
  },
]
