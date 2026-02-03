// Mock Mode Configuration
export const IS_MOCK_MODE = true;

export function showMockNotification(message: string = '📋 นี่เป็นระบบจำลอง (Mockup) - ข้อมูลจะไม่ถูกบันทึกจริง') {
  if (typeof window !== 'undefined') {
    // สร้าง toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in';
    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
      <span class="font-medium">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // ลบออกหลัง 4 วินาที
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s';
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }
}

export function logMockAction(action: string, data?: any) {
  console.log(`[MOCK] ${action}`, data || '');
}
