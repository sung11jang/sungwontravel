import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock, CloudSun, DollarSign, Calendar, MapPin,
  FileText, CheckSquare, Plus, Trash2, ExternalLink,
  ChevronRight, Car, Bus, Plane, Hotel, AlertCircle,
  HelpCircle, CheckCircle2, Navigation, Info, ChevronDown, Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('timeline');
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
  const [weather, setWeather] = useState({ temp: '--', condition: '맑음' });
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

  // 3. Exchange Rate (Live API + Fallback)
  const [exchangeRate, setExchangeRate] = useState(0.054); // 1 VND ≈ 0.054 KRW
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

  // 4. Budget & Expenses State (원화 / 동 듀얼 표기)
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

  // 5. Checklist State (Local Storage)
  const defaultChecklist = [
    { id: 'p1', cat: '서류/금융', text: '여권 (유효기간 6개월 이상 확인)', checked: true },
    { id: 'p2', cat: '서류/금융', text: '항공권 E-티켓 및 호텔 바우처 출력/캡처', checked: true },
    { id: 'p3', cat: '서류/금융', text: '트래블로그/트래블월렛 카드 & 비상 달러(신권)', checked: false },
    { id: 'd1', cat: '전자기기', text: '스마트폰 방수팩 및 스트랩', checked: false },
    { id: 'd2', cat: '전자기기', text: '보조배터리 (반드시 기내 휴대 수하물)', checked: true },
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

  // 6. Schedule Data
  const scheduleData = [
    {
      day: 'Day 1 (12/12 금)',
      title: '입국 ➔ 모닝스파 & 북부 사파리 ➔ 시쉘 체크인',
      badge: '중부 & 북부',
      items: [
        { time: '05:00 - 08:50', title: '인천 ➔ 푸꾸옥 (VJ977)', desc: '공항 픽업 미팅 (+84 786 920 789 핫라인 확인)', mapQuery: 'Phu Quoc International Airport' },
        { time: '09:30 - 12:00', title: '시쉘 짐보관 & 모닝 마사지', desc: '새벽 비행 피로 회복 및 웰컴 드링크', mapQuery: 'Seashells Phu Quoc Hotel & Spa' },
        { time: '13:00 - 16:30', title: '빈펄 사파리 투어 (VIP/셔틀)', desc: '사파리 버스 우측 좌석 탑승 추천 (기린 식당 먹이주기 체험)', mapQuery: 'Vinpearl Safari Phu Quoc' },
        { time: '17:30 - 20:30', title: '시쉘 체크인 & 즈엉동 야시장/저녁', desc: '해산물(빈산/메오키친) 및 망고/땅콩 쇼핑', mapQuery: 'Phu Quoc Night Market' }
      ]
    },
    {
      day: 'Day 2 (12/13 토)',
      title: '북부 그랜드월드 & 딥씨 아쿠아리움 힐링',
      badge: '북부 집중',
      items: [
        { time: '09:00 - 12:00', title: '빈원더스 더 딥씨 아쿠아리움', desc: '세계 최대 규모 거북이 돔 수족관 (시원한 실내 관람)', mapQuery: 'The Sea Shell Aquarium VinWonders' },
        { time: '12:30 - 15:00', title: '그랜드월드 수상택시 & 점심', desc: '베니스 운하 곤돌라 체험 및 분수대 뷰 카페', mapQuery: 'Grand World Phu Quoc' },
        { time: '16:00 - 18:30', title: '시쉘 수영장 인피니티풀 휴식', desc: '선셋 감상 & 리조트 풀바 음료', mapQuery: 'Seashells Phu Quoc Hotel & Spa' },
        { time: '19:00 - 21:00', title: '중부 현지 맛집 저녁 식사', desc: '하이봇 스테이크 또는 로컬 맛집', mapQuery: 'Duong Dong Phu Quoc' }
      ]
    },
    {
      day: 'Day 3 (12/14 일)',
      title: '남부 라페스타 힐튼 이동 ➔ 사오비치 에메랄드 힐링',
      badge: '중부 ➔ 남부',
      items: [
        { time: '10:30 - 11:30', title: '시쉘 체크아웃 ➔ 라페스타 힐튼 이동', desc: '그랩 7인승 또는 호텔 프라이빗 밴 추천 (약 40분 소요)', mapQuery: 'La Festa Phu Quoc, Curio Collection by Hilton' },
        { time: '12:00 - 15:30', title: '사오비치(Sao Beach) 해변 휴양 & 런치', desc: '에메랄드빛 백사장, 코코넛 음료 & 해변 레스토랑', mapQuery: 'Sao Beach Phu Quoc' },
        { time: '16:00 - 18:30', title: '라페스타 힐튼 정식 체크인 & 선셋타운 산책', desc: '이탈리아 아말피 감성 거리 & 키스브릿지 뷰', mapQuery: 'Sunset Town Phu Quoc' },
        { time: '19:00 - 21:00', title: '선셋타운 루프탑 바 / 이탈리안 디너', desc: '라페스타 호텔 레스토랑 또는 타운 내 다이닝', mapQuery: 'La Festa Phu Quoc' }
      ]
    },
    {
      day: 'Day 4 (12/15 월)',
      title: '혼똔섬 기네스 케이블카 & 키스오브더씨 불꽃쇼',
      badge: '남부 랜드마크',
      items: [
        { time: '09:30 - 15:00', title: '혼똔섬 선월드 (케이블카 & 워터파크)', desc: '세계 최장 해상 케이블카 탑승 & 아쿠아토피아 워터파크', mapQuery: 'Hon Thom Cable Car Station' },
        { time: '16:00 - 18:00', title: '라페스타 힐튼 인피니티풀 & 스파 휴식', desc: '노을 감상 및 피로 회복', mapQuery: 'La Festa Phu Quoc' },
        { time: '19:00 - 20:30', title: '선셋타운 저녁 식사 & 야시장', desc: 'VUI-Fest 야시장 길거리 음식 및 기념품 쇼핑', mapQuery: 'VUI-Fest Bazaar Phu Quoc' },
        { time: '21:00 - 21:40', title: '키스 오브 더 씨(Kiss of the Sea) 불꽃쇼', desc: '화려한 멀티미디어 아트 & 매일 밤 펼쳐지는 시그니처 불꽃놀이', mapQuery: 'Kiss of the Sea Show' }
      ]
    },
    {
      day: 'Day 5 (12/16 화)',
      title: '체크아웃 ➔ 킹콩마트 쇼핑 ➔ 공항 샌딩 귀국',
      badge: '남부 ➔ 공항 ➔ 인천',
      items: [
        { time: '11:00 - 12:00', title: '라페스타 힐튼 체크아웃 (짐보관)', desc: '사전 예약된 16인승 공항 샌딩 밴 픽업 시간 재확인', mapQuery: 'La Festa Phu Quoc' },
        { time: '12:30 - 16:00', title: '중부 킹콩마트 대형 쇼핑 & 카페', desc: '통후추, 코코넛커피, 건망고, 캐슈넛 등 지인 선물 구매', mapQuery: 'Kingkong Mart Phu Quoc' },
        { time: '16:30 - 18:00', title: '출국 전 마지막 전신 마사지 & 식사', desc: '마사지샵 샤워 시설 이용 후 깔끔하게 비행 준비', mapQuery: 'Duong Dong Phu Quoc' },
        { time: '18:15 - 19:00', title: '힐튼 전용 밴 탑승 ➔ 푸꾸옥 공항 이동', desc: 'VJ976 탑승수속 & 출국심사 (수하물 20kg 체크)', mapQuery: 'Phu Quoc International Airport' },
        { time: '20:45 - 04:00+1', title: '푸꾸옥 ➔ 인천 (VJ976)', desc: '12/17(수) 새벽 04:00 인천 T1 도착 후 주차장 이동', mapQuery: 'Incheon International Airport Terminal 1' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24 select-none antialiased">
      {/* ── TOP HUD HEADER ── */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌴</span>
            <div>
              <h1 className="text-base font-bold text-emerald-400 leading-tight">푸꾸옥 가족여행 4박5일</h1>
              <p className="text-[11px] text-slate-400">12/12(금) ~ 12/16(화) • 성원 가족 전용</p>
            </div>
          </div>

          <button
            onClick={() => setShowTipModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>💡 실전 꿀팁</span>
          </button>
        </div>

        {/* HUD Quick Info Strip */}
        <div className="max-w-3xl mx-auto mt-2.5 grid grid-cols-3 gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700/60 text-[11px]">
          {/* Dual Clock */}
          <div className="flex flex-col items-center justify-center border-r border-slate-700">
            <span className="text-slate-400 text-[10px] flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> 듀얼 시계
            </span>
            <div className="font-mono text-slate-200 mt-0.5 text-center">
              <div>🇻🇳 <span className="text-emerald-300 font-bold">{formatClock(vnTime).slice(0, 5)}</span></div>
              <div className="text-[10px] text-slate-400">🇰🇷 {formatClock(krTime).slice(0, 5)}</div>
            </div>
          </div>

          {/* Realtime Weather */}
          <div className="flex flex-col items-center justify-center border-r border-slate-700">
            <span className="text-slate-400 text-[10px] flex items-center gap-1">
              <CloudSun className="w-3 h-3 text-amber-400" /> 푸꾸옥 날씨
            </span>
            <div className="font-semibold text-slate-200 mt-0.5">
              <span className="text-amber-300 text-sm font-bold">{weather.temp}°C</span>
              <span className="text-[10px] text-slate-300 ml-1">({weather.condition})</span>
            </div>
          </div>

          {/* Quick Rate */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-slate-400 text-[10px] flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" /> 간이 환율
            </span>
            <div className="text-center mt-0.5 font-bold text-slate-200">
              <span className="text-emerald-300">동÷20</span>
              <span className="text-[10px] text-slate-400 block font-normal">10만동 ≈ 5,400원</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-3xl mx-auto px-4 pt-4">

        {/* ── TAB 1: 일정표 (Timeline) ── */}
        {activeTab === 'timeline' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Flight Banner Summary */}
            <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/40 p-3.5 rounded-2xl border border-blue-700/40 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Plane className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <p className="font-bold text-blue-200">출국: 12/12 05:00 VJ977 ➔ 08:50 도착</p>
                  <p className="text-slate-300 mt-0.5">귀국: 12/16 20:45 VJ976 ➔ 04:00(+1) 도착</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-[10px] font-bold border border-blue-400/30">
                수하물 20kg
              </span>
            </div>

            {/* Daily Timelines */}
            <div className="space-y-6">
              {scheduleData.map((dayData, idx) => (
                <div key={idx} className="bg-slate-800/60 rounded-2xl border border-slate-700/70 p-4 shadow-sm">
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/60">
                    <div>
                      <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">{dayData.day}</span>
                      <h3 className="text-sm font-bold text-slate-100 mt-0.5">{dayData.title}</h3>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-700 text-cyan-300 border border-slate-600">
                      {dayData.badge}
                    </span>
                  </div>

                  {/* Timeline Items */}
                  <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                    {dayData.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="relative group">
                        {/* Dot */}
                        <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-slate-800 group-hover:scale-125 transition-transform" />

                        <div className="flex items-start justify-between">
                          <div className="pr-2">
                            <span className="text-[11px] font-mono font-bold text-amber-300/90">{item.time}</span>
                            <h4 className="text-sm font-bold text-slate-100 mt-0.5">{item.title}</h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                          </div>

                          {/* Google Maps Shortcut */}
                          {item.mapQuery && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.mapQuery)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0 p-2 rounded-xl bg-slate-700/50 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 border border-slate-600/50 transition-colors flex items-center justify-center text-[11px] gap-1"
                              title="Google Maps 길찾기"
                            >
                              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="hidden sm:inline">길찾기</span>
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

        {/* ── TAB 2: 권역 / 동선 (Zone & Transport Info) ── */}
        {activeTab === 'routes' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Intro Notice */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <p className="font-bold text-amber-300">💡 권역별 최적 이동수단 안내 (참고용 추천)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  아래 교통수단 및 이동 시간은 현지 교통 상황에 따라 유동적일 수 있는 **추천 옵션**입니다. 가족 짐과 인원에 맞춰 편하게 선택하세요.
                </p>
              </div>
            </div>

            {/* Visual Zone Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* North Zone */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-emerald-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Day 1~2</span>
                <h3 className="text-base font-bold text-slate-100 mt-2">🌿 북부 권역</h3>
                <p className="text-xs text-slate-400 mt-1">빈펄 사파리, 빈원더스 아쿠아리움, 그랜드월드</p>
                <div className="mt-3 pt-3 border-t border-slate-700/60 text-[11px] text-emerald-300 font-semibold">
                  추천 숙소: 중부 이동 거점 활용
                </div>
              </div>

              {/* Central Zone */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-cyan-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Day 1~3 베이스</span>
                <h3 className="text-base font-bold text-slate-100 mt-2">🏙️ 중부 권역</h3>
                <p className="text-xs text-slate-400 mt-1">즈엉동 야시장, 킹콩마트, 시쉘 호텔, 마사지거리</p>
                <div className="mt-3 pt-3 border-t border-slate-700/60 text-[11px] text-cyan-300 font-semibold">
                  숙소: 시쉘 푸꾸옥 호텔 & 스파 (2박)
                </div>
              </div>

              {/* South Zone */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-indigo-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Day 3~5 베이스</span>
                <h3 className="text-base font-bold text-slate-100 mt-2">🌅 남부 권역</h3>
                <p className="text-xs text-slate-400 mt-1">선셋타운, 혼똔섬 케이블카, 사오비치, 키스오브더씨</p>
                <div className="mt-3 pt-3 border-t border-slate-700/60 text-[11px] text-indigo-300 font-semibold">
                  숙소: 라페스타 힐튼 푸꾸옥 (2박)
                </div>
              </div>
            </div>

            {/* Recommended Route & Transportation Breakdown */}
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/70 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-400" />
                구간별 이동수단 & 소요시간 <span className="text-xs text-amber-400 font-normal">(추천 가이드)</span>
              </h3>

              <div className="space-y-3">
                {/* Route 1 */}
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>푸꾸옥 공항 ➔ 중부 시쉘 호텔</span>
                    <span className="text-emerald-400">약 15~20분</span>
                  </div>
                  <div className="mt-2 text-xs space-y-1">
                    <p className="text-slate-300">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold mr-1.5">추천 1순위</span>
                      **시쉘 무료 픽업 셔틀버스** (호텔 픽업 사전 확정 완료)
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      대체수단: 그랩(Grab) 7인승 호출 시 약 150,000 ~ 200,000 VND
                    </p>
                  </div>
                </div>

                {/* Route 2 */}
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>중부(시쉘) ➔ 북부(사파리 / 그랜드월드)</span>
                    <span className="text-emerald-400">약 40~50분</span>
                  </div>
                  <div className="mt-2 text-xs space-y-1">
                    <p className="text-slate-300">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold mr-1.5">추천 1순위</span>
                      **그랩(Grab) 7인승 호출** 또는 프라이빗 렌트카 (가족 이동 시 피로도 최소화)
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold mr-1.5">무료 옵션</span>
                      **빈버스(VinBus 무료 전기버스)**: 시쉘 인근 정류장에서 북부 그랜드월드까지 무료 운행 (배차 간격 확인 필요)
                    </p>
                  </div>
                </div>

                {/* Route 3 */}
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>중부(시쉘 호텔) ➔ 남부(라페스타 힐튼 호텔)</span>
                    <span className="text-emerald-400">약 40~45분</span>
                  </div>
                  <div className="mt-2 text-xs space-y-1">
                    <p className="text-slate-300">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold mr-1.5">추천 1순위</span>
                      **그랩 7인승 편도 호출** (캐리어 짐이 많으므로 7인승 SUV 또는 대형 밴 필수)
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      예상 비용: 약 350,000 ~ 450,000 VND 내외
                    </p>
                  </div>
                </div>

                {/* Route 4 */}
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>남부 라페스타 힐튼 ➔ 푸꾸옥 공항 귀국</span>
                    <span className="text-emerald-400">약 25~30분</span>
                  </div>
                  <div className="mt-2 text-xs space-y-1">
                    <p className="text-slate-300">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold mr-1.5">추천 1순위</span>
                      **라페스타 힐튼 사전예약 16인승 밴** (1,360,000 VND / 확정 예약 완료)
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      귀국 시 모든 쇼핑 짐과 가족 전원이 가장 쾌적하게 공항으로 직행하는 최적 수단
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: 바우처 / 주차 (Vouchers, Shuttle Status, Parking) ── */}
        {activeTab === 'vouchers' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. 이동 / 셔틀 예약 진행 상태 (한것 vs 안한것 구분) */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-cyan-400" />
                  교통 & 셔틀 예약 관리 현황
                </span>
                <span className="text-[11px] text-slate-400 font-normal">한것 / 안한것 체크</span>
              </h3>

              <div className="space-y-2.5">
                {/* Done 1 */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start justify-between">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-300">시쉘 호텔 무료 공항 픽업 (입국)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">완료(한것)</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        12/12(금) VJ977 도착 후 미팅 (비상 핫라인: +84 786 920 789)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Done 2 */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start justify-between">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-300">라페스타 힐튼 유료 밴 공항 샌딩 (출국)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">완료(한것)</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        12/16(화) 18:30경 16인승 밴 예약 확정 (1,360,000 VND 현장 결제)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Not Done 1 */}
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start justify-between">
                  <div className="flex items-start space-x-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-300">시쉘 체크아웃 셔틀 현장 신청 (선택)</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">미완료(안한것)</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        체크인 시 프런트 데스크에서 남부 이동 시간대 셔틀 가능 여부 문의 필요 (또는 그랩 7인승 이용)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Not Done 2 */}
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start justify-between">
                  <div className="flex items-start space-x-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-300">북부(사파리/그랜드월드) 이동수단 확정</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">현장선택(안한것)</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        당일 컨디션에 따라 빈버스(무료) 탑승 vs 그랩 7인승 호출 현장 결정
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 항공권 및 숙소 바우처 카드 */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                항공 및 숙소 바우처
              </h3>

              {/* Flight Voucher */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Plane className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-slate-100">비엣젯 항공 (VietJet Air)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">전자 항공권</span>
                </div>
                <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl space-y-1">
                  <p>• 출국: 12/12(금) 05:00 ICN T1 ➔ 08:50 PQC (편명: VJ977)</p>
                  <p>• 귀국: 12/16(화) 20:45 PQC ➔ 04:00(+1) ICN T1 (편명: VJ976)</p>
                  <p className="text-emerald-400 font-semibold">• 위탁 수하물 20kg 포함 (기내 7kg)</p>
                </div>
              </div>

              {/* Hotel Vouchers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">시쉘 푸꾸옥 (2박)</span>
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded">12/12~12/14</span>
                  </div>
                  <p className="text-xs text-slate-300">• 객실: 오션뷰 디럭스 (조식 포함)</p>
                  <p className="text-[11px] text-slate-400">• 중부 즈엉동 시내 도보 접근성 우수</p>
                </div>

                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">라페스타 힐튼 (2박)</span>
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded">12/14~12/16</span>
                  </div>
                  <p className="text-xs text-slate-300">• 객실: 킹/트윈 클래식 (조식 포함)</p>
                  <p className="text-[11px] text-slate-400">• 선셋타운 & 불꽃놀이 명당</p>
                </div>
              </div>
            </div>

            {/* 3. [맨 아래 배치] 인천공항 T1 장기주차 가이드 (승용차 기준 & 심야 도보 최단거리 추천) */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-400" />
                  인천공항 T1 장기주차장 심야 주차 안내
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">
                  일반 승용차 기준
                </span>
              </div>

              {/* Info Box */}
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60 text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-slate-300">
                  <span>예상 요금 (소형/일반 승용차)</span>
                  <span className="font-bold text-amber-300 text-sm">5일 기준 45,000원 (일 9,000원)</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    🚶‍♂️ 심야시간(02:00~03:00) 여객터미널 도보 진입 최우선 추천 구역:
                  </p>
                  <div className="bg-slate-800 p-2.5 rounded-lg space-y-1 text-[11px] text-slate-300">
                    <p>
                      <strong className="text-cyan-300">1순위 (최단거리):</strong> **장기주차장 P1 주차타워** 또는 **P1 A구역**
                    </p>
                    <p className="text-slate-400">
                      ➔ 지하통로 또는 지상 횡단보도를 통해 T1 1층 입국장/지하 1층까지 **도보 5~8분** 내 직접 진입 가능
                    </p>
                    <p>
                      <strong className="text-cyan-300">2순위:</strong> **P2 주차타워** 및 P2 최전방 구역 (도보 8~10분)
                    </p>
                  </div>
                  <p className="text-[11px] text-amber-400/90 mt-1">
                    ⚠️ 심야시간대에는 순환 셔틀버스 배차 간격이 길어지므로(15~20분 간격), P1/P2 구역에 주차 후 **도보로 터미널 이동**하시는 것이 훨씬 빠르고 안전합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: 예산 / 준비물 (Budget KRW+VND & Checklist) ── */}
        {activeTab === 'budget' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Real-time Exchange Calculator */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/90 rounded-2xl p-4 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  실시간 정밀 환율 환산기
                </h3>
                <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded font-mono">
                  1 VND ≈ {exchangeRate.toFixed(4)} KRW
                </span>
              </div>

              {/* Total Accumulated Expense Card (원화 / 동 듀얼 표기) */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/80">
                <span className="text-xs text-slate-400 block mb-1">여행 누적 지출 합계 (원화 & 베트남 동)</span>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div className="text-xl font-extrabold text-emerald-400">
                    약 {totalKRW.toLocaleString()} <span className="text-sm font-bold text-slate-300">원 (KRW)</span>
                  </div>
                  <div className="text-base font-bold text-amber-300">
                    {totalVND.toLocaleString()} <span className="text-xs font-semibold text-slate-400">VND (동)</span>
                  </div>
                </div>
              </div>

              {/* Add Expense Form */}
              <form onSubmit={addExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                <input
                  type="text"
                  placeholder="지출 항목 (예: 야시장 야식)"
                  value={newExpenseTitle}
                  onChange={(e) => setNewExpenseTitle(e.target.value)}
                  className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  placeholder="금액 (VND 동)"
                  value={newExpenseVND}
                  onChange={(e) => setNewExpenseVND(e.target.value)}
                  className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <select
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value)}
                  className="bg-slate-900/90 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="식비">식비/카페</option>
                  <option value="관광">관광/입장권</option>
                  <option value="교통">교통/그랩</option>
                  <option value="쇼핑">쇼핑/마트</option>
                  <option value="기타">기타</option>
                </select>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl py-2 px-3 flex items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> 추가
                </button>
              </form>

              {/* Expense List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {expenses.map((exp) => {
                  const itemKRW = Math.round(exp.amountVND * exchangeRate);
                  return (
                    <div key={exp.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
                      <div>
                        <span className="font-semibold text-slate-200">{exp.title}</span>
                        <span className="text-[10px] text-slate-400 ml-2 px-1.5 py-0.5 rounded bg-slate-800">
                          {exp.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <span className="font-bold text-amber-300 block">{exp.amountVND.toLocaleString()} VND</span>
                          <span className="text-[10px] text-slate-400 font-mono">≈ {itemKRW.toLocaleString()}원</span>
                        </div>
                        <button
                          onClick={() => removeExpense(exp.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7 Categories Checklist */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  여행 필수 준비물 체크리스트 (로컬 저장)
                </h3>
                <span className="text-xs text-slate-400">
                  {checklist.filter(c => c.checked).length} / {checklist.length} 완료
                </span>
              </div>

              {/* Grouped Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className={`flex items-start space-x-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      item.checked
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400 line-through'
                        : 'bg-slate-900/50 border-slate-700/70 text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-slate-600 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mr-1.5 ${
                        item.checked ? 'bg-slate-800 text-slate-500' : 'bg-slate-700 text-cyan-300'
                      }`}>
                        {item.cat}
                      </span>
                      <span>{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── BOTTOM NAVIGATION BAR ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-4 py-2">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'timeline' ? 'text-emerald-400 font-bold bg-slate-800/80' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-[11px]">일정표</span>
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'routes' ? 'text-emerald-400 font-bold bg-slate-800/80' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-5 h-5 mb-1" />
            <span className="text-[11px]">권역/동선</span>
          </button>

          <button
            onClick={() => setActiveTab('vouchers')}
            className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'vouchers' ? 'text-emerald-400 font-bold bg-slate-800/80' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-[11px]">바우처/주차</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'budget' ? 'text-emerald-400 font-bold bg-slate-800/80' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-5 h-5 mb-1" />
            <span className="text-[11px]">예산/준비물</span>
          </button>
        </div>
      </nav>

      {/* ── MODAL: 실전 꿀팁 보기 ── */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">푸꾸옥 여행 실전 필수 꿀팁</h3>
              </div>
              <button
                onClick={() => setShowTipModal(false)}
                className="text-slate-400 hover:text-slate-100 text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <h4 className="font-bold text-amber-300 mb-1">💵 화폐 & 지폐 수취 주의</h4>
                <p>• 찢어지거나 낙서된 베트남 동 지폐는 현지 마트/상점에서 **절대 받지 않습니다**. 거스름돈 받을 때 훼손 여부를 꼭 확인하세요.</p>
                <p className="mt-1">• **50만 동(약 2.7만원)**과 **2만 동(약 1천원)**은 둘 다 푸른색 계열이라 야간에 색상 혼동이 잦습니다. 결제 전 0 개수를 꼭 확인하세요.</p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <h4 className="font-bold text-cyan-300 mb-1">🚖 그랩(Grab) 호객 방지</h4>
                <p>• 공항/야시장 출구에서 "내가 너 그랩 기사다"라며 스마트폰 화면을 보여주는 호객 행위에 절대 응하지 마세요.</p>
                <p className="mt-1">• 반드시 **내 스마트폰 앱에 등록된 차량 번호판**과 일치하는 차량만 탑승해야 바가지요금을 방지할 수 있습니다.</p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <h4 className="font-bold text-emerald-300 mb-1">🚿 수질 & 식수 위생</h4>
                <p>• 푸꾸옥은 섬 지역 특성상 석회질 및 수도 배관이 노후되어 호텔에서도 **샤워기 필터 사용이 필수**입니다.</p>
                <p className="mt-1">• 양치질할 때 마지막 헹굼물은 세면대 수돗물 대신 **무료 제공 생수(Bottled Water)**를 사용하세요.</p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <h4 className="font-bold text-indigo-300 mb-1">🦁 사파리 & 맛집 공략</h4>
                <p>• **빈펄 사파리 버스**: 탑승 시 **우측 좌석**에 앉아야 동물들이 더 가까이 보입니다.</p>
                <p className="mt-1">• **추천 맛집**: 모닝글로리·반쎄오 맛집 [메오키친], 해산물 버터구이 [빈산], 분위기 좋은 [하이봇 스테이크].</p>
              </div>
            </div>

            <button
              onClick={() => setShowTipModal(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white rounded-xl transition-all"
            >
              확인 완료 (닫기)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}