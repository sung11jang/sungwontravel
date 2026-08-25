import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock, CloudSun, DollarSign, Calendar, MapPin,
  FileText, CheckSquare, Plus, Trash2,
  Car, Bus, Plane, AlertCircle,
  CheckCircle2, Navigation, Info, Sparkles, Palette
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [theme, setTheme] = useState('dark'); // 'dark' | 'airbnb' | 'booking' | 'tripadvisor'
  const [showTipModal, setShowTipModal] = useState(false);

  // 1. Dual Clock State
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const vnTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const krTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

  const formatClock = (date) =>
    date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  // 2. Weather State (Open-Meteo Phu Quoc)
  const [weather, setWeather] = useState({ temp: '29', condition: '맑음' });
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=10.2899&longitude=103.9840&current_weather=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.current_weather) {
          setWeather({
            temp: Math.round(data.current_weather.temperature),
            condition: data.current_weather.weathercode <= 2 ? '맑음/쾌청' : '구름조금'
          });
        }
      })
      .catch(() => setWeather({ temp: '29', condition: '맑음' }));
  }, []);

  // 3. Exchange Rate (Live API)
  const [exchangeRate, setExchangeRate] = useState(0.054);
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/VND')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates && data.rates.KRW) {
          setExchangeRate(data.rates.KRW);
        }
      })
      .catch(() => setExchangeRate(0.054));
  }, []);

  // 4. Budget & Expenses State
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('sungwon_expenses');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: '사파리 & 빈원더스 입장권', amountVND: 3500000, category: '관광' },
      { id: 2, title: '모닝마사지 & 웰컴티', amountVND: 1200000, category: '식비/스파' },
      { id: 3, title: '라페스타 힐튼 공항 샌딩밴 예약', amountVND: 1360000, category: '교통' }
    ];
  });
  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseVND, setNewExpenseVND] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('식비');

  useEffect(() => {
    localStorage.setItem('sungwon_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const totalVND = useMemo(() => expenses.reduce((acc, cur) => acc + Number(cur.amountVND || 0), 0), [expenses]);
  const totalKRW = useMemo(() => Math.round(totalVND * exchangeRate), [totalVND, exchangeRate]);

  const addExpense = (e) => {
    e.preventDefault();
    if (!newExpenseTitle || !newExpenseVND) return;
    const item = {
      id: Date.now(),
      title: newExpenseTitle,
      amountVND: Number(newExpenseVND),
      category: newExpenseCategory
    };
    setExpenses([item, ...expenses]);
    setNewExpenseTitle('');
    setNewExpenseVND('');
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // 5. Checklist State
  const defaultChecklist = [
    { id: 'p1', cat: '서류/금융', text: '여권 (유효기간 6개월 이상 확인)', checked: true },
    { id: 'p2', cat: '서류/금융', text: '항공권 E-티켓 및 호텔 바우처 출력/캡처', checked: true },
    { id: 'p3', cat: '서류/금융', text: '트래블로그/트래블월렛 카드 & 비상 달러(신권)', checked: false },
    { id: 'd1', cat: '전자기기', text: '스마트폰 방수팩 및 목걸이 스트랩', checked: false },
    { id: 'd2', cat: '전자기기', text: '보조배터리 (반드시 기내 휴대 수하물 탑재)', checked: true },
    { id: 's1', cat: '샤워/위생', text: '샤워기 필터 헤드 + 리필 필터 3~4개 (푸꾸옥 필수)', checked: false },
    { id: 's2', cat: '샤워/위생', text: '휴대용 손소독제 및 물티슈 대용량', checked: false },
    { id: 'c1', cat: '의류/잡화', text: '얇은 가디건/바람막이 (기내 및 실내 에어컨 대비)', checked: true },
    { id: 'c2', cat: '의류/잡화', text: '편한 샌들/아쿠아슈즈, 썬캡/선글라스', checked: false },
    { id: 'm1', cat: '상비약', text: '지사제, 소화제, 해열진통제, 종합감기약', checked: true },
    { id: 'm2', cat: '상비약', text: '모기 기피제(모가드 등) & 버물리 패치', checked: false },
    { id: 'w1', cat: '물놀이', text: '수영복/래시가드, 스노클링 마스크', checked: false },
    { id: 'w2', cat: '물놀이', text: '비치타월 또는 방수백(드라이백)', checked: false }
  ];

  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('sungwon_checklist');
    return saved ? JSON.parse(saved) : defaultChecklist;
  });

  useEffect(() => {
    localStorage.setItem('sungwon_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // Schedule Data
  const scheduleData = [
    {
      day: 'Day 1 (12/12 금)',
      title: '입국 ➔ 모닝스파 & 북부 사파리 ➔ 시쉘 체크인',
      badge: '중부 & 북부',
      items: [
        { time: '05:00 - 08:50', title: '인천 ➔ 푸꾸옥 (비엣젯 VJ977)', desc: '공항 픽업 미팅 (+84 786 920 789 핫라인 기사 확인)', mapQuery: 'Phu Quoc International Airport' },
        { time: '09:30 - 12:00', title: '시쉘 짐보관 & 모닝 마사지', desc: '새벽 비행 피로 회복 및 웰컴 드링크 티타임', mapQuery: 'Seashells Phu Quoc Hotel & Spa' },
        { time: '13:00 - 16:30', title: '빈펄 사파리 투어 (VIP/셔틀)', desc: '사파리 버스 우측 좌석 탑승 추천 (기린 식당 먹이주기)', mapQuery: 'Vinpearl Safari Phu Quoc' },
        { time: '17:30 - 20:30', title: '시쉘 체크인 & 즈엉동 야시장/저녁', desc: '해산물 맛집(빈산/메오키친) 및 망고/후추/땅콩 쇼핑', mapQuery: 'Phu Quoc Night Market' }
      ]
    },
    {
      day: 'Day 2 (12/13 토)',
      title: '북부 그랜드월드 & 딥씨 아쿠아리움 힐링',
      badge: '북부 집중',
      items: [
        { time: '09:00 - 12:00', title: '빈원더스 더 딥씨 아쿠아리움', desc: '세계 최대 규모 거북이 돔 수족관 (시원한 실내 관람)', mapQuery: 'The Sea Shell Aquarium VinWonders' },
        { time: '12:30 - 15:00', title: '그랜드월드 수상택시 & 점심', desc: '베니스 운하 곤돌라 체험 및 분수대 뷰 카페 휴식', mapQuery: 'Grand World Phu Quoc' },
        { time: '16:00 - 18:30', title: '시쉘 수영장 인피니티풀 휴식', desc: '서해안 선셋 감상 & 리조트 풀바 칵테일/음료', mapQuery: 'Seashells Phu Quoc Hotel & Spa' },
        { time: '19:00 - 21:00', title: '중부 현지 맛집 저녁 식사', desc: '하이봇 스테이크 또는 로컬 베트남 가정식', mapQuery: 'Duong Dong Phu Quoc' }
      ]
    },
    {
      day: 'Day 3 (12/14 일)',
      title: '남부 라페스타 힐튼 이동 ➔ 사오비치 에메랄드 힐링',
      badge: '중부 ➔ 남부',
      items: [
        { time: '10:30 - 11:30', title: '시쉘 체크아웃 ➔ 라페스타 힐튼 이동', desc: '그랩 7인승 또는 프라이빗 밴 추천 (약 40분 소요)', mapQuery: 'La Festa Phu Quoc, Curio Collection by Hilton' },
        { time: '12:00 - 15:30', title: '사오비치(Sao Beach) 해변 휴양 & 런치', desc: '에메랄드빛 백사장, 코코넛 음료 & 해변 레스토랑', mapQuery: 'Sao Beach Phu Quoc' },
        { time: '16:00 - 18:30', title: '라페스타 힐튼 체크인 & 선셋타운 산책', desc: '이탈리아 아말피 감성 거리 & 키스브릿지 뷰 감상', mapQuery: 'Sunset Town Phu Quoc' },
        { time: '19:00 - 21:00', title: '선셋타운 루프탑 바 / 이탈리안 디너', desc: '라페스타 호텔 레스토랑 또는 타운 내 다이닝', mapQuery: 'La Festa Phu Quoc' }
      ]
    },
    {
      day: 'Day 4 (12/15 월)',
      title: '혼똔섬 기네스 케이블카 & 키스오브더씨 불꽃쇼',
      badge: '남부 랜드마크',
      items: [
        { time: '09:30 - 15:00', title: '혼똔섬 선월드 (케이블카 & 워터파크)', desc: '세계 최장 해상 케이블카 탑승 & 아쿠아토피아 워터파크', mapQuery: 'Hon Thom Cable Car Station' },
        { time: '16:00 - 18:00', title: '라페스타 힐튼 인피니티풀 & 스파 휴식', desc: '노을 감상 및 수영장 릴랙스 타임', mapQuery: 'La Festa Phu Quoc' },
        { time: '19:00 - 20:30', title: '선셋타운 저녁 식사 & 야시장', desc: 'VUI-Fest 야시장 길거리 음식 및 기념품 쇼핑', mapQuery: 'VUI-Fest Bazaar Phu Quoc' },
        { time: '21:00 - 21:40', title: '키스 오브 더 씨(Kiss of the Sea) 불꽃쇼', desc: '화려한 멀티미디어 아트 & 매일 밤 시그니처 불꽃놀이', mapQuery: 'Kiss of the Sea Show' }
      ]
    },
    {
      day: 'Day 5 (12/16 화)',
      title: '체크아웃 ➔ 킹콩마트 쇼핑 ➔ 공항 샌딩 귀국',
      badge: '남부 ➔ 공항 ➔ 인천',
      items: [
        { time: '11:00 - 12:00', title: '라페스타 힐튼 체크아웃 (짐보관)', desc: '사전 예약된 16인승 공항 샌딩 밴 픽업 시간 재확인', mapQuery: 'La Festa Phu Quoc' },
        { time: '12:30 - 16:00', title: '중부 킹콩마트 대형 쇼핑 & 카페', desc: '통후추, 코코넛커피, 건망고, 캐슈넛 등 지인 선물 구매', mapQuery: 'Kingkong Mart Phu Quoc' },
        { time: '16:30 - 18:00', title: '출국 전 마지막 전신 마사지 & 식사', desc: '마사지샵 샤워 시설 이용 후 개운하게 공항 이동 준비', mapQuery: 'Duong Dong Phu Quoc' },
        { time: '18:15 - 19:00', title: '힐튼 전용 밴 탑승 ➔ 푸꾸옥 공항 이동', desc: 'VJ976 탑승수속 & 출국심사 (수하물 20kg 체크)', mapQuery: 'Phu Quoc International Airport' },
        { time: '20:45 - 04:00+1', title: '푸꾸옥 ➔ 인천 (비엣젯 VJ976)', desc: '12/17(수) 새벽 04:00 인천 T1 도착 후 장기주차장 이동', mapQuery: 'Incheon International Airport Terminal 1' }
      ]
    }
  ];

  // Global Top 10 Travel Apps Inspired Theme Definitions
  const styles = useMemo(() => {
    // 1. Airbnb Coral (에어비앤비 스타일: 따뜻한 웜화이트 + 라우샨 코랄 핑크 + 부드러운 플로팅 섀도우)
    if (theme === 'airbnb') {
      return {
        name: '에어비앤비',
        bg: 'bg-[#F7F7F7] text-[#222222]',
        header: 'bg-white/95 border-b border-[#EBEBEB] text-[#222222]',
        card: 'bg-white border border-[#DDDDDD] shadow-md shadow-neutral-200/50 text-[#222222] rounded-3xl',
        innerCard: 'bg-[#F7F7F7] border border-[#EBEBEB] text-[#222222] rounded-2xl',
        hudBox: 'bg-white border border-[#EBEBEB] text-[#222222] shadow-sm rounded-2xl',
        nav: 'bg-white/95 border-t border-[#EBEBEB] text-[#717171]',
        navActive: 'text-[#FF385C] font-black bg-rose-50 border border-rose-200 shadow-sm',
        accentText: 'text-[#FF385C]',
        subText: 'text-[#717171]',
        badge: 'bg-rose-50 text-[#FF385C] border border-rose-200 font-bold',
        btnPrimary: 'bg-[#FF385C] hover:bg-[#E00B41] text-white font-black shadow-md shadow-rose-300',
        input: 'bg-white border-[#B0B0B0] text-[#222222] focus:border-[#FF385C] focus:ring-1 focus:ring-[#FF385C]'
      };
    }
    // 2. Booking.com Blue (부킹닷컴 스타일: 신뢰의 딥 네이비 블루 + 골드 옐로우 하이라이트 + 높은 명도대비)
    if (theme === 'booking') {
      return {
        name: '부킹닷컴',
        bg: 'bg-[#F2F6FA] text-[#1A1A1A]',
        header: 'bg-[#003580] border-b border-[#00224F] text-white',
        card: 'bg-white border border-[#CEE3F8] shadow-md text-[#1A1A1A] rounded-2xl',
        innerCard: 'bg-[#F4F8FD] border border-[#D3E4F6] text-[#1A1A1A] rounded-xl',
        hudBox: 'bg-white border-2 border-[#003580]/30 text-[#1A1A1A] shadow-md rounded-2xl',
        nav: 'bg-white border-t border-[#CEE3F8] text-[#595959]',
        navActive: 'text-[#003580] font-black bg-[#EBF3FF] border-2 border-[#003580]',
        accentText: 'text-[#003580]',
        subText: 'text-[#555555]',
        badge: 'bg-[#FEBB02] text-[#003580] border border-[#E5A800] font-black',
        btnPrimary: 'bg-[#006CE4] hover:bg-[#0057B8] text-white font-extrabold shadow-md',
        input: 'bg-white border-[#90BCEB] text-[#1A1A1A] focus:border-[#006CE4]'
      };
    }
    // 3. TripAdvisor Forest (트립어드바이저 스타일: 산뜻한 트립 그린 + 웜 크림 베이스 + 가독성 극대화)
    if (theme === 'tripadvisor') {
      return {
        name: '트립어드바이저',
        bg: 'bg-[#FAF1ED]/60 text-[#002B11]',
        header: 'bg-white/95 border-b border-[#00AA6C]/30 text-[#002B11]',
        card: 'bg-white border border-[#E0E0E0] shadow-sm text-[#002B11] rounded-2xl',
        innerCard: 'bg-[#F2FAF6] border border-[#D5EFE3] text-[#002B11] rounded-xl',
        hudBox: 'bg-white border-2 border-[#00AA6C]/30 text-[#002B11] shadow-sm rounded-2xl',
        nav: 'bg-white border-t border-[#E0E0E0] text-[#4A4A4A]',
        navActive: 'text-[#00AA6C] font-black bg-[#E8F8F1] border border-[#00AA6C]',
        accentText: 'text-[#00AA6C]',
        subText: 'text-[#4A4A4A]',
        badge: 'bg-[#00AA6C]/10 text-[#00875A] border border-[#00AA6C]/30 font-bold',
        btnPrimary: 'bg-[#00AA6C] hover:bg-[#00875A] text-white font-black shadow-md shadow-emerald-200',
        input: 'bg-white border-slate-300 text-[#002B11] focus:border-[#00AA6C]'
      };
    }
    // 4. Default: Classic Dark Mode (원래 기존 시그니처 다크)
    return {
      name: '기본 다크',
      bg: 'bg-slate-900 text-slate-100',
      header: 'bg-slate-900/95 border-b border-slate-800 text-slate-100',
      card: 'bg-slate-800/90 border border-slate-700 shadow-lg text-slate-100 rounded-2xl',
      innerCard: 'bg-slate-900/80 border border-slate-700/80 text-slate-200 rounded-xl',
      hudBox: 'bg-slate-800/95 border border-slate-700 text-slate-100 shadow-md rounded-2xl',
      nav: 'bg-slate-900/95 border-t border-slate-800 text-slate-400',
      navActive: 'text-emerald-400 font-extrabold bg-slate-800 border border-emerald-500/40',
      accentText: 'text-emerald-400 font-bold',
      subText: 'text-slate-300',
      badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold',
      btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow',
      input: 'bg-slate-900 border-slate-700 text-slate-100 focus:border-emerald-500'
    };
  }, [theme]);

  return (
    <div className={`min-h-screen ${styles.bg} font-sans pb-32 select-none antialiased transition-colors duration-200`}>
      {/* ── TOP HUD HEADER ── */}
      <header className={`sticky top-0 z-40 ${styles.header} backdrop-blur-md px-4 py-3.5 shadow-md`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">🌴</span>
            <div>
              <h1 className={`text-lg sm:text-xl font-extrabold ${theme === 'booking' ? 'text-white' : styles.accentText} leading-tight`}>
                푸꾸옥 가족여행 4박5일
              </h1>
              <p className={`text-xs sm:text-sm font-semibold ${theme === 'booking' ? 'text-blue-200' : styles.subText}`}>
                12/12(금) ~ 12/16(화) • 성원 가족
              </p>
            </div>
          </div>

          {/* Theme Selector (Top 10 Global Travel Apps Style) */}
          <div className="flex items-center space-x-2">
            <div className={`flex items-center p-1 rounded-2xl border ${theme === 'booking' ? 'bg-blue-900/60 border-blue-400' : 'bg-black/5 border-slate-300 dark:border-slate-700'}`}>
              <Palette className="w-4 h-4 mr-1 text-amber-400 shrink-0 ml-1" />
              <button
                onClick={() => setTheme('dark')}
                className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${theme === 'dark' ? 'bg-emerald-600 text-white shadow' : 'opacity-70 hover:opacity-100'}`}
              >
                다크
              </button>
              <button
                onClick={() => setTheme('airbnb')}
                className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${theme === 'airbnb' ? 'bg-[#FF385C] text-white shadow' : 'opacity-70 hover:opacity-100'}`}
              >
                에어비앤비
              </button>
              <button
                onClick={() => setTheme('booking')}
                className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${theme === 'booking' ? 'bg-[#FEBB02] text-[#003580] shadow font-black' : 'opacity-70 hover:opacity-100'}`}
              >
                부킹닷컴
              </button>
              <button
                onClick={() => setTheme('tripadvisor')}
                className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${theme === 'tripadvisor' ? 'bg-[#00AA6C] text-white shadow' : 'opacity-70 hover:opacity-100'}`}
              >
                트립어드바이저
              </button>
            </div>

            <button
              onClick={() => setShowTipModal(true)}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/40 text-xs sm:text-sm font-bold hover:bg-amber-500/30 transition-all active:scale-95 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-bold hidden sm:inline">꿀팁</span>
            </button>
          </div>
        </div>

        {/* HUD Quick Info Strip */}
        <div className={`max-w-3xl mx-auto mt-3 grid grid-cols-3 gap-2.5 ${styles.hudBox} p-3`}>
          {/* 1. Dual Clock */}
          <div className="flex flex-col items-center justify-center border-r border-slate-300/40 dark:border-slate-700 pr-1">
            <span className={`text-xs font-bold flex items-center gap-1 mb-0.5 ${styles.subText}`}>
              <Clock className="w-3.5 h-3.5 text-cyan-500" /> 시계
            </span>
            <div className="font-mono text-center">
              <div className="text-base sm:text-lg font-black text-emerald-500 leading-tight">
                🇻🇳 {formatClock(vnTime).slice(0, 5)}
              </div>
              <div className={`text-xs font-bold ${styles.subText}`}>
                🇰🇷 {formatClock(krTime).slice(0, 5)}
              </div>
            </div>
          </div>

          {/* 2. Realtime Weather */}
          <div className="flex flex-col items-center justify-center border-r border-slate-300/40 dark:border-slate-700 pr-1">
            <span className={`text-xs font-bold flex items-center gap-1 mb-0.5 ${styles.subText}`}>
              <CloudSun className="w-3.5 h-3.5 text-amber-500" /> 날씨
            </span>
            <div className="text-center mt-0.5">
              <span className="text-base sm:text-lg font-black text-amber-500 leading-tight">{weather.temp}°C</span>
              <span className={`text-xs font-bold block ${styles.subText}`}>{weather.condition}</span>
            </div>
          </div>

          {/* 3. Quick Exchange */}
          <div className="flex flex-col items-center justify-center">
            <span className={`text-xs font-bold flex items-center gap-1 mb-0.5 ${styles.subText}`}>
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> 간이 환율
            </span>
            <div className="text-center mt-0.5">
              <span className="text-sm sm:text-base font-black text-emerald-500 leading-tight">동 ÷ 20</span>
              <span className={`text-xs font-bold block ${styles.subText}`}>10만동 ≈ 5,400원</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTAINER ── */}
      <main className="max-w-3xl mx-auto px-4 pt-4">

        {/* ── TAB 1: 일정표 (Timeline) ── */}
        {activeTab === 'timeline' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Flight Summary Banner */}
            <div className={`${styles.card} p-4 flex items-center justify-between`}>
              <div className="flex items-center space-x-3.5">
                <Plane className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <p className="text-sm sm:text-base font-bold">출국: 12/12 05:00 VJ977 ➔ 08:50 도착</p>
                  <p className={`text-xs sm:text-sm font-semibold ${styles.subText} mt-0.5`}>
                    귀국: 12/16 20:45 VJ976 ➔ 04:00(+1) 도착
                  </p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold ${styles.badge} shrink-0`}>
                수하물 20kg
              </span>
            </div>

            {/* Daily Timelines */}
            <div className="space-y-4">
              {scheduleData.map((dayData, idx) => (
                <div key={idx} className={`${styles.card} p-4 sm:p-5`}>
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-black/10 dark:border-white/10">
                    <div>
                      <span className={`text-xs sm:text-sm font-black uppercase tracking-wider ${styles.accentText}`}>
                        {dayData.day}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold mt-0.5 leading-snug">{dayData.title}</h3>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${styles.badge} shrink-0`}>
                      {dayData.badge}
                    </span>
                  </div>

                  {/* Timeline Items */}
                  <div className="relative pl-5 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/10 dark:before:bg-white/10">
                    {dayData.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="relative group">
                        <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-800 shadow" />

                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-xs sm:text-sm font-mono font-black text-amber-500">
                              {item.time}
                            </span>
                            <h4 className="text-sm sm:text-base font-bold mt-0.5">
                              {item.title}
                            </h4>
                            <p className={`text-xs sm:text-sm leading-relaxed ${styles.subText}`}>
                              {item.desc}
                            </p>
                          </div>

                          {item.mapQuery && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.mapQuery)}`}
                              target="_blank"
                              rel="noreferrer"
                              className={`shrink-0 px-2.5 py-1.5 rounded-xl ${styles.innerCard} hover:border-emerald-500 transition-colors flex items-center justify-center text-xs font-bold gap-1 mt-1 shadow-sm`}
                            >
                              <Navigation className="w-4 h-4 text-emerald-500" />
                              <span>길찾기</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: 권역/동선 ── */}
        {activeTab === 'routes' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm sm:text-base font-bold text-amber-500">💡 권역별 최적 이동수단 안내 (추천 옵션)</p>
                <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${styles.subText}`}>
                  교통수단 및 소요시간은 도로 상황에 따른 추천 정보입니다. 가족 짐과 인원에 맞춰 편하게 선택하세요.
                </p>
              </div>
            </div>

            {/* Zone Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`${styles.card} p-4 sm:p-5`}>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${styles.badge}`}>Day 1~2</span>
                <h3 className="text-base sm:text-lg font-bold mt-2">🌿 북부 권역</h3>
                <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${styles.subText}`}>빈펄 사파리, 딥씨 아쿠아리움, 그랜드월드</p>
                <div className={`mt-3 pt-3 border-t border-black/10 dark:border-white/10 text-xs sm:text-sm font-bold ${styles.accentText}`}>
                  추천: 중부 숙소 거점 이동
                </div>
              </div>

              <div className={`${styles.card} p-4 sm:p-5`}>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${styles.badge}`}>Day 1~3 베이스</span>
                <h3 className="text-base sm:text-lg font-bold mt-2">🏙️ 중부 권역</h3>
                <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${styles.subText}`}>즈엉동 야시장, 킹콩마트, 마사지거리</p>
                <div className={`mt-3 pt-3 border-t border-black/10 dark:border-white/10 text-xs sm:text-sm font-bold ${styles.accentText}`}>
                  숙소: 시쉘 푸꾸옥 (2박)
                </div>
              </div>

              <div className={`${styles.card} p-4 sm:p-5`}>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${styles.badge}`}>Day 3~5 베이스</span>
                <h3 className="text-base sm:text-lg font-bold mt-2">🌅 남부 권역</h3>
                <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${styles.subText}`}>선셋타운, 혼똔섬 케이블카, 사오비치</p>
                <div className={`mt-3 pt-3 border-t border-black/10 dark:border-white/10 text-xs sm:text-sm font-bold ${styles.accentText}`}>
                  숙소: 라페스타 힐튼 (2박)
                </div>
              </div>
            </div>

            {/* Routes Detailed Box */}
            <div className={`${styles.card} p-4 sm:p-5 space-y-3.5`}>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-500" />
                구간별 추천 이동수단 상세 안내
              </h3>

              <div className="space-y-3">
                <div className={`${styles.innerCard} p-4`}>
                  <div className="flex justify-between text-sm sm:text-base font-bold">
                    <span>푸꾸옥 공항 ➔ 중부 시쉘 호텔</span>
                    <span className={styles.accentText}>약 15~20분</span>
                  </div>
                  <p className="text-xs sm:text-sm mt-2 leading-relaxed">
                    <strong className="text-emerald-500 mr-1">[추천 1순위]</strong> 시쉘 호텔 무료 픽업 셔틀버스 (확정 완료)
                  </p>
                </div>

                <div className={`${styles.innerCard} p-4`}>
                  <div className="flex justify-between text-sm sm:text-base font-bold">
                    <span>중부(시쉘) ➔ 북부(사파리/그랜드월드)</span>
                    <span className={styles.accentText}>약 40~50분</span>
                  </div>
                  <p className="text-xs sm:text-sm mt-2 leading-relaxed">
                    <strong className="text-emerald-500 mr-1">[추천 1순위]</strong> 그랩 7인승 호출 또는 무료 빈버스(VinBus) 이용
                  </p>
                </div>

                <div className={`${styles.innerCard} p-4`}>
                  <div className="flex justify-between text-sm sm:text-base font-bold">
                    <span>중부(시쉘) ➔ 남부(라페스타 힐튼)</span>
                    <span className={styles.accentText}>약 40~45분</span>
                  </div>
                  <p className="text-xs sm:text-sm mt-2 leading-relaxed">
                    <strong className="text-emerald-500 mr-1">[추천 1순위]</strong> 그랩 7인승 SUV (캐리어 짐 적재 용이)
                  </p>
                </div>

                <div className={`${styles.innerCard} p-4`}>
                  <div className="flex justify-between text-sm sm:text-base font-bold">
                    <span>남부 라페스타 힐튼 ➔ 푸꾸옥 공항 귀국</span>
                    <span className={styles.accentText}>약 25~30분</span>
                  </div>
                  <p className="text-xs sm:text-sm mt-2 leading-relaxed">
                    <strong className="text-emerald-500 mr-1">[추천 1순위]</strong> 라페스타 힐튼 전용 16인승 샌딩 밴 (예약 확정)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: 바우처/주차 ── */}
        {activeTab === 'vouchers' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Shuttle Status */}
            <div className={`${styles.card} p-4 sm:p-5 space-y-3.5`}>
              <h3 className="text-base sm:text-lg font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bus className="w-5 h-5 text-cyan-500" /> 교통 & 셔틀 예약 관리 현황
                </span>
                <span className={`text-xs sm:text-sm font-medium ${styles.subText}`}>한것 / 안한것</span>
              </h3>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-emerald-500 text-sm sm:text-base">시쉘 호텔 무료 공항 픽업 (입국)</span>
                    <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-500">완료(한것)</span>
                    <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${styles.subText}`}>
                      12/12(금) VJ977 도착 후 픽업 미팅 (+84 786 920 789)
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-emerald-500 text-sm sm:text-base">라페스타 힐튼 샌딩 밴 (출국)</span>
                    <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-500">완료(한것)</span>
                    <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${styles.subText}`}>
                      12/16(화) 18:30경 16인승 밴 예약 (1,360,000 VND 현장 결제)
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-amber-500 text-sm sm:text-base">시쉘 체크아웃 셔틀 현장 신청</span>
                    <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-500">미완료(안한것)</span>
                    <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${styles.subText}`}>
                      체크인 시 남부 이동 가능 여부 프런트 문의 (또는 그랩 7인승 이용)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Voucher */}
            <div className={`${styles.card} p-4 sm:p-5 space-y-2.5`}>
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-500" /> 비엣젯 전자 항공권
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${styles.badge}`}>VJ977 / VJ976</span>
              </div>
              <div className={`${styles.innerCard} p-3.5 text-xs sm:text-sm space-y-1.5 leading-relaxed`}>
                <p>• <strong>출국편:</strong> 12/12(금) 05:00 인천 T1 ➔ 08:50 푸꾸옥</p>
                <p>• <strong>귀국편:</strong> 12/16(화) 20:45 푸꾸옥 ➔ 04:00(+1) 인천 T1</p>
                <p className="font-bold text-emerald-500">• 위탁 수하물 20kg 포함 (기내 7kg)</p>
              </div>
            </div>

            {/* Parking Section (맨 아래) */}
            <div className={`${styles.card} p-4 sm:p-5 space-y-3.5`}>
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <Car className="w-5 h-5 text-emerald-500" />
                  인천공항 T1 장기주차장 심야 주차 안내
                </h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${styles.badge}`}>
                  일반 승용차 기준
                </span>
              </div>

              <div className={`${styles.innerCard} p-4 text-xs sm:text-sm space-y-2.5`}>
                <div className="flex justify-between pb-2 border-b border-black/10 dark:border-white/10 text-sm sm:text-base font-bold">
                  <span>예상 요금 (일반 승용차)</span>
                  <span className="text-amber-500">5일 45,000원 (일 9,000원)</span>
                </div>
                <div className="space-y-1.5 leading-relaxed">
                  <p className="font-bold text-emerald-500 text-sm sm:text-base">🚶‍♂️ 심야시간 도보 최단거리 추천 구역:</p>
                  <p>• <strong>1순위 (최단거리):</strong> 장기주차장 P1 주차타워 / P1 A구역 (도보 5~8분 내 터미널 진입)</p>
                  <p>• <strong>2순위:</strong> P2 주차타워 전방 구역 (도보 8~10분)</p>
                  <p className="text-xs sm:text-sm text-amber-500 font-semibold mt-1">
                    ⚠️ 심야시간대(02:00~03:00) 셔틀 배차간격이 길어지므로 도보 진입을 적극 권장합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: 예산/준비물 ── */}
        {activeTab === 'budget' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Total Budget Card */}
            <div className={`${styles.card} p-4 sm:p-5 space-y-3.5`}>
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" /> 여행 누적 지출 합계
                </h3>
                <span className={`text-xs font-mono px-2.5 py-1 rounded-lg ${styles.badge}`}>
                  1 VND ≈ {exchangeRate.toFixed(4)} KRW
                </span>
              </div>

              <div className={`${styles.innerCard} p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-baseline gap-2`}>
                <div className={`text-2xl sm:text-3xl font-black ${styles.accentText}`}>
                  약 {totalKRW.toLocaleString()} <span className="text-base sm:text-lg font-bold">원 (KRW)</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-amber-500">
                  {totalVND.toLocaleString()} <span className={`text-xs sm:text-sm font-normal ${styles.subText}`}>VND (동)</span>
                </div>
              </div>

              {/* Add Expense Form */}
              <form onSubmit={addExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
                <input
                  type="text"
                  placeholder="지출 항목 (예: 점심 식사)"
                  value={newExpenseTitle}
                  onChange={(e) => setNewExpenseTitle(e.target.value)}
                  className={`${styles.input} rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none`}
                />
                <input
                  type="number"
                  placeholder="금액 (VND 동)"
                  value={newExpenseVND}
                  onChange={(e) => setNewExpenseVND(e.target.value)}
                  className={`${styles.input} rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none font-mono`}
                />
                <select
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value)}
                  className={`${styles.input} rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none`}
                >
                  <option value="식비">식비/카페</option>
                  <option value="관광">관광/입장권</option>
                  <option value="교통">교통/그랩</option>
                  <option value="쇼핑">쇼핑/마트</option>
                  <option value="기타">기타</option>
                </select>
                <button
                  type="submit"
                  className={`${styles.btnPrimary} rounded-xl py-2.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-1 transition-all active:scale-95`}
                >
                  <Plus className="w-4 h-4" /> 지출 추가
                </button>
              </form>

              {/* Expense List */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {expenses.map((exp) => (
                  <div key={exp.id} className={`flex items-center justify-between p-3.5 ${styles.innerCard} text-xs sm:text-sm`}>
                    <div>
                      <span className="font-bold text-sm sm:text-base">{exp.title}</span>
                      <span className={`text-xs ml-2 px-2 py-0.5 rounded-lg ${styles.badge}`}>
                        {exp.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3.5">
                      <div className="text-right">
                        <span className="font-bold text-amber-500 block text-sm sm:text-base">{exp.amountVND.toLocaleString()} VND</span>
                        <span className={`text-xs font-mono ${styles.subText}`}>≈ {Math.round(exp.amountVND * exchangeRate).toLocaleString()}원</span>
                      </div>
                      <button onClick={() => removeExpense(exp.id)} className="text-slate-400 hover:text-rose-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <div className={`${styles.card} p-4 sm:p-5 space-y-3.5`}>
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-500" /> 필수 준비물 체크리스트
                </h3>
                <span className={`text-xs sm:text-sm font-semibold ${styles.subText}`}>
                  {checklist.filter(c => c.checked).length} / {checklist.length} 완료
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      item.checked
                        ? 'opacity-40 line-through border-transparent'
                        : `${styles.innerCard} hover:border-slate-400`
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <div className="text-xs sm:text-sm">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded mr-1.5 ${styles.badge}`}>
                        {item.cat}
                      </span>
                      <span className="font-medium">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── BOTTOM NAVIGATION ── */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 ${styles.nav} backdrop-blur-lg px-4 py-2.5 shadow-2xl`}>
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1.5">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex flex-col items-center py-2 px-2 rounded-2xl transition-all ${
              activeTab === 'timeline' ? styles.navActive : `${styles.subText} hover:opacity-100`
            }`}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs sm:text-sm font-bold">일정표</span>
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`flex flex-col items-center py-2 px-2 rounded-2xl transition-all ${
              activeTab === 'routes' ? styles.navActive : `${styles.subText} hover:opacity-100`
            }`}
          >
            <MapPin className="w-5 h-5 mb-1" />
            <span className="text-xs sm:text-sm font-bold">권역/동선</span>
          </button>

          <button
            onClick={() => setActiveTab('vouchers')}
            className={`flex flex-col items-center py-2 px-2 rounded-2xl transition-all ${
              activeTab === 'vouchers' ? styles.navActive : `${styles.subText} hover:opacity-100`
            }`}
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-xs sm:text-sm font-bold">바우처/주차</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`flex flex-col items-center py-2 px-2 rounded-2xl transition-all ${
              activeTab === 'budget' ? styles.navActive : `${styles.subText} hover:opacity-100`
            }`}
          >
            <DollarSign className="w-5 h-5 mb-1" />
            <span className="text-xs sm:text-sm font-bold">예산/준비물</span>
          </button>
        </div>
      </nav>

      {/* ── MODAL: 실전 꿀팁 ── */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${styles.card} max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4`}>
            <div className="flex items-center justify-between pb-3.5 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <h3 className="text-base sm:text-lg font-bold">푸꾸옥 여행 실전 필수 꿀팁</h3>
              </div>
              <button onClick={() => setShowTipModal(false)} className="opacity-70 hover:opacity-100 text-xl font-bold px-2.5 py-1">
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed">
              <div className={`${styles.innerCard} p-4`}>
                <h4 className="font-bold text-amber-500 text-sm sm:text-base mb-1.5">💵 화폐 수취 주의</h4>
                <p>• 찢어지거나 낙서된 베트남 동 지폐는 상점에서 절대 받지 않으니 거스름돈 수령 시 꼭 확인하세요.</p>
                <p className="mt-1.5">• 50만 동(약 2.7만원)과 2만 동(약 1천원)은 둘 다 푸른색이라 야간 결제 시 0 개수를 꼭 확인하세요.</p>
              </div>

              <div className={`${styles.innerCard} p-4`}>
                <h4 className="font-bold text-cyan-500 text-sm sm:text-base mb-1.5">🚖 그랩 호객 방지</h4>
                <p>• 공항 출구 등에서 기사를 자처하는 호객 행위에 응하지 마시고, 앱에 등록된 차량 번호판을 확인 후 탑승하세요.</p>
              </div>

              <div className={`${styles.innerCard} p-4`}>
                <h4 className="font-bold text-emerald-500 text-sm sm:text-base mb-1.5">🚿 수질 & 식수 위생</h4>
                <p>• 호텔에서도 샤워기 필터 헤드를 반드시 교체해 사용하시고, 양치 후 마지막 헹굼물은 생수를 권장합니다.</p>
              </div>
            </div>

            <button onClick={() => setShowTipModal(false)} className={`w-full py-3 ${styles.btnPrimary} rounded-2xl text-sm font-bold transition-all`}>
              확인 완료 (닫기)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}