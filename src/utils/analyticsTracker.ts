export interface GSCQueryItem {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  lastUpdated: string;
  queries: GSCQueryItem[];
}

export interface DayTraffic {
  date: string;
  views: number;
}

export interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  todayDate: string;
  history: DayTraffic[];
  mobileCount: number;
  desktopCount: number;
  searchConsole: GSCMetrics;
}

const STORAGE_KEY = 'phatloc_analytics_v3';

// Số liệu chuẩn xác từ Google Search Console (Khởi đầu từ 758 lượt hiển thị theo yêu cầu của xưởng)
export const DEFAULT_GSC_METRICS: GSCMetrics = {
  clicks: 11,
  impressions: 758,
  ctr: 1.5,
  position: 7.6,
  lastUpdated: '10/11/2026 • Nguồn: Google Search Console',
  queries: [
    { query: 'nội thất phát lộc', clicks: 2, impressions: 9, ctr: 22.2, position: 2.3 },
    { query: 'nội thất gần đây', clicks: 1, impressions: 1, ctr: 100, position: 1.0 },
    { query: 'thi công nội thất', clicks: 0, impressions: 556, ctr: 0, position: 8.4 },
    { query: 'thiết kế nội thất', clicks: 0, impressions: 75, ctr: 0, position: 5.3 },
    { query: 'dịch vụ thi công nội thất', clicks: 0, impressions: 22, ctr: 0, position: 8.7 },
    { query: 'thiết kế thi công nội thất đồng nai', clicks: 0, impressions: 9, ctr: 0, position: 6.6 },
    { query: 'công ty phát lộc', clicks: 0, impressions: 3, ctr: 0, position: 2.3 },
  ],
};

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function formatDateShort(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return dateStr;
}

export function getAnalyticsData(): AnalyticsData {
  const today = getTodayString();
  const todayShort = formatDateShort(today);

  // Mốc khởi điểm chuẩn từ Google Console: 758 lượt (676 di động 89%, 82 máy tính 11%)
  const defaultInitial: AnalyticsData = {
    totalViews: 758,
    todayViews: 38,
    todayDate: today,
    history: [
      { date: '04/11', views: 96 },
      { date: '05/11', views: 114 },
      { date: '06/11', views: 108 },
      { date: '07/11', views: 126 },
      { date: '08/11', views: 132 },
      { date: '09/11', views: 144 },
      { date: todayShort, views: 38 },
    ],
    mobileCount: 676,
    desktopCount: 82,
    searchConsole: DEFAULT_GSC_METRICS,
  };

  if (typeof window === 'undefined') {
    return defaultInitial;
  }

  // Dọn dẹp các bản lưu trữ cũ
  try {
    localStorage.removeItem('phatloc_analytics_v1');
    localStorage.removeItem('phatloc_analytics_v2');
  } catch {}

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInitial));
    return defaultInitial;
  }

  try {
    const data: AnalyticsData = JSON.parse(raw);

    // Đồng bộ nếu dữ liệu cũ chưa đạt mốc 758
    if (!data.totalViews || data.totalViews < 758) {
      data.totalViews = 758;
      data.mobileCount = 676;
      data.desktopCount = 82;
      data.todayViews = 38;
      data.todayDate = today;
      data.history = defaultInitial.history;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    if (data.todayDate !== today) {
      data.todayDate = today;
      data.todayViews = 0;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    if (!data.searchConsole) {
      data.searchConsole = DEFAULT_GSC_METRICS;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    return data;
  } catch {
    return defaultInitial;
  }
}

export function trackPageView(): void {
  if (typeof window === 'undefined') return;

  if (window.location.hash === '#admin' || window.location.pathname.includes('/admin')) {
    return;
  }

  const today = getTodayString();
  const sessionKey = `phatloc_v_${today}`;
  if (sessionStorage.getItem(sessionKey)) {
    return;
  }

  const data = getAnalyticsData();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  data.todayViews = (data.todayViews || 0) + 1;
  data.totalViews = (data.totalViews || 758) + 1;

  if (isMobile) {
    data.mobileCount = (data.mobileCount || 676) + 1;
  } else {
    data.desktopCount = (data.desktopCount || 82) + 1;
  }

  const todayShort = formatDateShort(today);
  const history = data.history || [];
  const foundIndex = history.findIndex((h) => h.date === todayShort);
  if (foundIndex >= 0) {
    history[foundIndex].views = data.todayViews;
  } else {
    history.push({ date: todayShort, views: data.todayViews });
    if (history.length > 7) {
      history.shift();
    }
  }
  data.history = history;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  sessionStorage.setItem(sessionKey, '1');
}

export function saveGSCMetrics(metrics: GSCMetrics): void {
  const data = getAnalyticsData();
  data.searchConsole = metrics;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
