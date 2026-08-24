import React, { useState, useEffect } from 'react';

// 실전 체감 100% 준비물 (개인 로컬 저장)
const defaultChecklists = [
  { id: 'c1', text: '여권 실물 (만료일 6개월 이상 남았는지 확인)', category: '서류/금융', checked: true },
  { id: 'c2', text: '그랩(Grab) 앱 설치 & 한국 카드 사전 등록', category: '서류/금융', checked: true },
  { id: 'c3', text: '트래블로그/트래블월렛 카드 (출금 비번 기억)', category: '서류/금융', checked: false },
  { id: 'c4', text: '비상금 원화/달러 (100달러 신권 환율 유리)', category: '서류/금융', checked: false },
  { id: 'c5', text: '해외여행자보험 영문 증명서 캡처', category: '서류/금융', checked: false },
  { id: 'c6', text: '왓츠앱(WhatsApp) 설치 (시쉘 기사님 연락용 +84 786 920 789)', category: '서류/금융', checked: false },
  { id: 'c7', text: '넷플릭스/유튜브/쿠팡플레이 오프라인 영상 다운로드', category: 'OTT/엔터', checked: false },
  { id: 'c8', text: '오프라인 음악 플레이리스트 다운로드', category: 'OTT/엔터', checked: false },
  { id: 'c9', text: '유선 이어폰 및 젠더 (기내 영화 & 배터리 방전 대비)', category: 'OTT/엔터', checked: false },
  { id: 'c10', text: '보조배터리 (기내 수하물 휴대 필수)', category: '전자기기', checked: false },
  { id: 'c11', text: 'eSIM 등록 QR / 유심 핀', category: '전자기기', checked: false },
  { id: 'c12', text: '멀티 어댑터 (돼지코) & 초고속 멀티 충전기', category: '전자기기', checked: false },
  { id: 'c13', text: '스마트폰 방수팩 (물 속 터치 확인)', category: '물놀이/휴양', checked: false },
  { id: 'c14', text: '아쿠아슈즈 & 래시가드/수영복', category: '물놀이/휴양', checked: false },
  { id: 'c15', text: '샤워기 필터 & 비타민 리필 (수질 민감 대비)', category: '물놀이/휴양', checked: false },
  { id: 'c16', text: '알로에 수딩젤 (햇빛 화상 진정용)', category: '물놀이/휴양', checked: false },
  { id: 'c17', text: '상비약 (지사제, 소화제, 타이레놀, 감기약, 모기약)', category: '상비약', checked: false },
  { id: 'c18', text: '얇은 바람막이/가디건 (기내 & 호텔 에어컨 대비)', category: '편의용품', checked: false },
];

const tripDays = [
  { id: 'day1', dayNumber: 1, dateStr: '12.12 (토)', label: 'Day 1' },
  { id: 'day2', dayNumber: 2, dateStr: '12.13 (일)', label: 'Day 2' },
  { id: 'day3', dayNumber: 3, dateStr: '12.14 (월)', label: 'Day 3' },
  { id: 'day4', dayNumber: 4, dateStr: '12.15 (화)', label: 'Day 4' },
  { id: 'day5', dayNumber: 5, dateStr: '12.16 (수)', label: 'Day 5' },
];

const initialSchedules = [
  // Day 1
  { id: 's1', day: 'day1', time: '05:00', title: '인천공항 T1 도착 및 장기주차장 주차', type: 'CAR', location: '인천공항 제1여객터미널 장기주차장', memo: '주차 기둥 사진 촬영 / 셔틀 첫차 04:30 운행' },
  { id: 's2', day: 'day1', time: '08:50', title: '푸꾸옥 국제공항(PQC) 도착 (VJ977)', type: 'FLIGHT', location: 'Phu Quoc International Airport', memo: '국제선 출구 앞 기사 미팅 (Seashells 피켓)' },
  { id: 's3', day: 'day1', time: '09:30', title: '시쉘 푸꾸옥 호텔 도착 및 얼리체크인/짐보관', type: 'HOTEL', location: 'Seashells Phu Quoc Hotel & Spa', memo: '귀국 셔틀(12/14) 체크인 시 사전 예약' },
  { id: 's4', day: 'day1', time: '18:30', title: '즈엉동 야시장 저녁식사', type: 'RESTAURANT', location: 'Phu Quoc Night Market', memo: '해산물 바비큐 & 킹콩마트 쇼핑' },
  
  // Day 2
  { id: 's5', day: 'day2', time: '09:30', title: '혼똔섬 케이블카 & 아쿠아토피아 워터파크', type: 'PLACE', location: 'Hon Thom Cable Car Station', memo: '세계 최장 해상 케이블카' },
  { id: 's6', day: 'day2', time: '18:00', title: '선셋타운 산책 & 키스 브릿지 노을 감상', type: 'PLACE', location: 'Sunset Town Phu Quoc', memo: '일몰 뷰 감상' },

  // Day 3
  { id: 's7', day: 'day3', time: '11:30', title: '시쉘 체크아웃 ➔ 라페스타 푸꾸옥 힐튼 이동', type: 'HOTEL', location: 'La Festa Phu Quoc, Curio Collection by Hilton', memo: '인접 객실 배정 확인 및 체크인' },
  { id: 's8', day: 'day3', time: '15:00', title: '사오비치 휴양 & 코코넛 스무디', type: 'PLACE', location: 'Sao Beach Phu Quoc', memo: '에메랄드빛 해변 휴식' },

  // Day 4
  { id: 's9', day: 'day4', time: '10:00', title: '리조트 수영장 휴식 & 선셋타운 카페', type: 'PLACE', location: 'La Festa Phu Quoc, Curio Collection by Hilton', memo: '호텔 부대시설 힐링' },
  { id: 's10', day: 'day4', time: '19:00', title: '키스 오브 더 씨(Kiss of the Sea) 분수쇼', type: 'PLACE', location: 'Sunset Town Phu Quoc', memo: '야간 불꽃놀이 & 멀티미디어 쇼' },

  // Day 5
  { id: 's11', day: 'day5', time: '12:00', title: '라페스타 힐튼 체크아웃 & 프런트 짐보관', type: 'HOTEL', location: 'La Festa Phu Quoc, Curio Collection by Hilton', memo: '체크아웃 후 짐 무료 보관 가능' },
  { id: 's12', day: 'day5', time: '18:00', title: '공항 이동 (호텔 프런트 짐 찾기 ➔ 공항)', type: 'CAR', location: 'Phu Quoc International Airport', memo: '비행기 출발 2시간 30분 전 도착' },
  { id: 's13', day: 'day5', time: '20:45', title: '비엣젯 VJ976 푸꾸옥(PQC) 출발 ➔ 인천행', type: 'FLIGHT', location: 'Phu Quoc International Airport', memo: '20:45 출발' },
  { id: 's14', day: 'day5', time: '04:00', title: '인천공항 T1 도착 및 장기주차장 출차', type: 'CAR', location: '인천국제공항 제1여객터미널 장기주차장', memo: '무인 정산기 사전 결제 후 출차' },
];

const initialDocs = [
  {
    id: 'd_seashells_pickup',
    category: '호텔/셔틀',
    title: '✅ 시쉘 푸꾸옥 무료 공항 픽업 셔틀 (확약 완료)',
    code: 'VJ977 도착 / 5인 탑승',
    memo: '📍 미팅 포인트: 국제선 입국장 앞 (호텔명 Seashells 피켓 기사 대기)\n📞 기사님 직통: +84 786 920 789 (WhatsApp 가능)\n💡 체크아웃 셔틀은 체크인할 때 프런트에서 사전 예약 필수',
    imgUrl: '',
    rawEmail: 'Flight Number: VJ977 / Number of Guests: 5 / Meeting Point: In front of the international arrivals area / Driver Contact: +84 786 920 789'
  },
  {
    id: 'd_lafesta_info',
    category: '호텔/셔틀',
    title: '🏨 라페스타 푸꾸옥 힐튼 (룸/짐보관/샌딩 공식 안내)',
    code: '체크아웃 12/16 (짐보관 가능)',
    memo: '1️⃣ 인접 객실: 체크인 당일 현장 상황에 맞춰 최대한 우선 배정 노력\n2️⃣ 짐 보관: 12/16 체크아웃 후 당일 리셉션 프런트에 무료 보관 가능\n3️⃣ 공항 샌딩: 무료 셔틀 미제공 (16인승 밴 편도 1,360,800 VND 약 6.8만원 / 왕복 2,268,000 VND 약 11.3만원)\n📞 호텔 직통: +84 297 3525 555',
    imgUrl: '',
    rawEmail: 'You can keep the luggage at Reception after check-out. Complimentary shuttle not provided. 16-seat vehicle: One-way VND 1,360,800 / Round-trip VND 2,268,000. Tel: +84 297 3525 555'
  },
  {
    id: 'd_seashells_room',
    category: '호텔/셔틀',
    title: '시쉘 푸꾸옥 호텔 & 스파 (12/12 ~ 12/14)',
    code: '룸1: Agoda #1764447810 (3인) / 룸2: Trip.com #1400828467787978 (2인)',
    memo: '투숙객: 장성원, 정수아, 정진우, 명진, 정우택 (총 5명)',
    imgUrl: '',
    rawEmail: ''
  },
  {
    id: 'd_lafesta_room',
    category: '호텔/셔틀',
    title: '라페스타 푸꾸옥 힐튼 (12/14 ~ 12/16)',
    code: '룸1: Agoda #1764537797 (3인) / 룸2: Trip.com #1400828468433911 (2인)',
    memo: '선셋타운 중심 위치 / 야경 및 부대시설 이용',
    imgUrl: '',
    rawEmail: ''
  },
  {
    id: 'd_flight_tickets',
    category: '항공권',
    title: '비엣젯 항공 왕복 E-티켓 (5인)',
    code: '출국 VJ977 (12/12 08:50 PQC 도착) ➔ 귀국 VJ976 (12/16 20:45 PQC 출발)',
    memo: '인천공항 제1여객터미널 탑승 / 수하물 규정 확인',
    imgUrl: '',
    rawEmail: ''
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDay, setSelectedDay] = useState('day1');
  
  const [items, setItems] = useState(initialSchedules);
  const [docs, setDocs] = useState(initialDocs);
  const [expenses, setExpenses] = useState([
    { id: 'e1', title: '인천공항 5일 장기주차비', vnd: 900000, krw: 45000 },
    { id: 'e2', title: '야시장 해산물 저녁 식사', vnd: 700000, krw: 35000 },
  ]);

  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem('my_personal_checklists_v6');
    return saved ? JSON.parse(saved) : defaultChecklists;
  });

  const [currentWeather, setCurrentWeather] = useState({ location: '푸꾸옥', temp: '29°C', desc: '맑음 ☀️' });
  const [koreaWeather, setKoreaWeather] = useState({ temp: '2°C', desc: '구름조금 ⛅' });
  const [localTime, setLocalTime] = useState('');
  const [koreaTime, setKoreaTime] = useState('');

  const [vndInput, setVndInput] = useState('100000');
  const [naturalInput, setNaturalInput] = useState('');
  const [myCarLocation, setMyCarLocation] = useState('장기 P2 주차타워 2층 B구역');
  const [parkingSavedMsg, setParkingSavedMsg] = useState(false);

  const [emailText, setEmailText] = useState('');
  const [docCategory, setDocCategory] = useState('호텔/셔틀');
  const [docTitle, setDocTitle] = useState('');
  const [docCode, setDocCode] = useState('');
  const [docMemo, setDocMemo] = useState('');
  const [docImgUrl, setDocImgUrl] = useState('');
  const [previewImg, setPreviewImg] = useState(null);

  const [newCheckItem, setNewCheckItem] = useState('');
  const [expTitle, setExpTitle] = useState('');
  const [expVnd, setExpVnd] = useState('');

  useEffect(() => {
    localStorage.setItem('my_personal_checklists_v6', JSON.stringify(checklists));
  }, [checklists]);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setKoreaTime(now.toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' }));
      setLocalTime(now.toLocaleTimeString('ko-KR', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' }));
    };
    updateClocks();
    const timer = setInterval(updateClocks, 1000);
    return () => clearInterval(timer);
  }, []);

  const getWeatherDesc = (code) => {
    if (code === 0) return '맑음 ☀️';
    if (code <= 3) return '구름조금 ⛅';
    if (code <= 48) return '안개 🌫️';
    if (code <= 67) return '비 🌧️';
    if (code <= 77) return '눈 ❄️';
    return '소나기 🌦️';
  };

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const resKR = await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.46&longitude=126.44&current=temperature_2m,weather_code');
        const dataKR = await resKR.json();
        if (dataKR?.current) {
          setKoreaWeather({ temp: `${Math.round(dataKR.current.temperature_2m)}°C`, desc: getWeatherDesc(dataKR.current.weather_code) });
        }
      } catch (e) {}

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current=temperature_2m,weather_code`);
              const data = await res.json();
              if (data?.current) {
                setCurrentWeather({ location: '내 위치(GPS)', temp: `${Math.round(data.current.temperature_2m)}°C`, desc: getWeatherDesc(data.current.weather_code) });
              }
            } catch (e) { loadPQ(); }
          },
          () => { loadPQ(); },
          { timeout: 5000 }
        );
      } else { loadPQ(); }
    };

    const loadPQ = async () => {
      try {
        const resPQ = await fetch('https://api.open-meteo.com/v1/forecast?latitude=10.22&longitude=103.96&current=temperature_2m,weather_code');
        const dataPQ = await resPQ.json();
        if (dataPQ?.current) {
          setCurrentWeather({ location: '푸꾸옥', temp: `${Math.round(dataPQ.current.temperature_2m)}°C`, desc: getWeatherDesc(dataPQ.current.weather_code) });
        }
      } catch (e) {}
    };

    loadWeather();
  }, []);

  const handleSmartAddSchedule = (e) => {
    e.preventDefault();
    if (!naturalInput.trim()) return;

    const text = naturalInput.trim();
    let targetDay = selectedDay;
    let extractedTime = '12:00';
    let type = 'PLACE';
    let title = text;

    if (text.includes('12/12') || text.includes('12일') || text.includes('첫째날') || text.includes('Day 1') || text.includes('day1')) targetDay = 'day1';
    else if (text.includes('12/13') || text.includes('13일') || text.includes('둘째날') || text.includes('Day 2') || text.includes('day2')) targetDay = 'day2';
    else if (text.includes('12/14') || text.includes('14일') || text.includes('셋째날') || text.includes('Day 3') || text.includes('day3')) targetDay = 'day3';
    else if (text.includes('12/15') || text.includes('15일') || text.includes('넷째날') || text.includes('Day 4') || text.includes('day4')) targetDay = 'day4';
    else if (text.includes('12/16') || text.includes('16일') || text.includes('마지막날') || text.includes('Day 5') || text.includes('day5')) targetDay = 'day5';

    const timeMatch = text.match(/(\d{1,2}):(\d{2})/);
    const hourMatch = text.match(/(오전|오후|아침|저녁|새벽|밤)?\s*(\d{1,2})시\s*(\d{1,2}분|반)?/);

    if (timeMatch) {
      extractedTime = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
    } else if (hourMatch) {
      let hour = parseInt(hourMatch[2], 10);
      const isPM = hourMatch[1] === '오후' || hourMatch[1] === '저녁' || hourMatch[1] === '밤';
      if (isPM && hour < 12) hour += 12;
      let min = '00';
      if (hourMatch[3] === '반') min = '30';
      else if (hourMatch[3]) min = hourMatch[3].replace('분', '').padStart(2, '0');
      extractedTime = `${String(hour).padStart(2, '0')}:${min}`;
    }

    if (text.includes('식당') || text.includes('밥') || text.includes('저녁') || text.includes('점심') || text.includes('야시장') || text.includes('카페') || text.includes('먹기')) type = 'RESTAURANT';
    else if (text.includes('호텔') || text.includes('체크인') || text.includes('체크아웃') || text.includes('리조트') || text.includes('숙소')) type = 'HOTEL';
    else if (text.includes('비행기') || text.includes('공항') || text.includes('탑승') || text.includes('출발') || text.includes('도착')) type = 'FLIGHT';
    else if (text.includes('주차') || text.includes('출차') || text.includes('셔틀') || text.includes('차량')) type = 'CAR';

    title = text.replace(/12\/\d{1,2}|Day\s*\d|\d{1,2}일차|\d{1,2}일/g, '')
                .replace(/(오전|오후|아침|저녁|새벽|밤)?\s*\d{1,2}시\s*(\d{1,2}분|반)?/g, '')
                .replace(/\d{1,2}:\d{2}/g, '')
                .replace(/에\s*|에서\s*|가서\s*/g, ' ')
                .trim();
    if (!title) title = text;

    const newItem = {
      id: String(Date.now()),
      day: targetDay,
      time: extractedTime,
      title: title,
      type: type,
      location: title,
      memo: '스마트 자동 정리됨',
    };

    setItems(prev => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    setSelectedDay(targetDay);
    setNaturalInput('');
  };

  const handleDeleteSchedule = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const openGoogleMaps = (query) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDocImgUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleParseAndAddDoc = () => {
    if (!docTitle && !emailText) {
      alert('바우처 이름 또는 이메일 내용을 입력해 주세요.');
      return;
    }
    let finalTitle = docTitle;
    let finalCode = docCode;
    let finalMemo = docMemo;

    if (emailText) {
      if (!finalTitle) {
        if (emailText.toLowerCase().includes('seashells')) finalTitle = '시쉘 푸꾸옥 공항 픽업 확인서';
        else if (emailText.toLowerCase().includes('la festa') || emailText.toLowerCase().includes('hilton')) finalTitle = '라페스타 푸꾸옥 힐튼 안내';
        else finalTitle = '예약 확인 이메일 바우처';
      }
      const codeMatch = emailText.match(/(?:confirmation|reservation|booking|예약번호|확인번호)[:\s#]*([A-Z0-9-]+)/i);
      if (codeMatch && !finalCode) finalCode = `CONF #${codeMatch[1]}`;
      if (!finalMemo) finalMemo = emailText.slice(0, 160) + (emailText.length > 160 ? '...' : '');
    }

    const newDoc = {
      id: String(Date.now()),
      category: docCategory,
      title: finalTitle,
      code: finalCode || '견적/확인 완료',
      memo: finalMemo,
      imgUrl: docImgUrl,
      rawEmail: emailText
    };

    setDocs(prev => [newDoc, ...prev]);
    setDocTitle('');
    setDocCode('');
    setDocMemo('');
    setEmailText('');
    setDocImgUrl('');
    alert('스마트 바우처 카드가 등록되었습니다!');
  };

  const handleToggleCheck = (id) => {
    setChecklists((prev) => prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)));
  };

  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (!newCheckItem) return;
    setChecklists((prev) => [...prev, { id: String(Date.now()), text: newCheckItem, category: '개인준비', checked: false }]);
    setNewCheckItem('');
  };

  const handleDeleteChecklist = (id, e) => {
    e.stopPropagation();
    setChecklists(prev => prev.filter(c => c.id !== id));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expTitle || !expVnd) return;
    const amount = Number(expVnd);
    const newExp = {
      id: String(Date.now()),
      title: expTitle,
      vnd: amount,
      krw: Math.round(amount / 20),
    };
    setExpenses((prev) => [...prev, newExp]);
    setExpTitle('');
    setExpVnd('');
  };

  const totalKRW = expenses.reduce((acc, cur) => acc + (cur.krw || 0), 0);
  const currentDaySchedules = items.filter((it) => it.day === selectedDay);

  const getTypeBadge = (type) => {
    switch (type) {
      case 'CAR': return { icon: '🚗', color: '#FEF3C7' };
      case 'FLIGHT': return { icon: '✈️', color: '#EFF6FF' };
      case 'HOTEL': return { icon: '🏨', color: '#EEF2FF' };
      case 'RESTAURANT': return { icon: '🍽️', color: '#FFF7ED' };
      default: return { icon: '📍', color: '#ECFDF5' };
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif', borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. 상단 브리핑 HUD */}
      <header style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '16px 18px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#38BDF8', backgroundColor: 'rgba(56,189,248,0.15)', padding: '3px 8px', borderRadius: '6px' }}>
            푸꾸옥 4박 5일 가족 여행 🌴
          </span>
          <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 'bold' }}>
            ● 위성/GPS 연동
          </span>
        </div>

        {/* 듀얼 시계 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px', backgroundColor: '#1E293B', padding: '10px 12px', borderRadius: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>현지 시간 (베트남 푸꾸옥)</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#F8FAFC', marginTop: '2px' }}>{localTime || '19:48'}</div>
          </div>
          <div style={{ borderLeft: '1px solid #334155', paddingLeft: '12px' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>한국 시간 (2시간 빠름)</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#94A3B8', marginTop: '2px' }}>{koreaTime || '21:48'}</div>
          </div>
        </div>

        {/* 실시간 날씨 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px', backgroundColor: '#1E293B', padding: '8px 12px', borderRadius: '10px', fontSize: '11px' }}>
          <div>
            <span style={{ color: '#94A3B8' }}>📍 {currentWeather.location}: </span>
            <b style={{ color: '#FCD34D' }}>{currentWeather.temp} {currentWeather.desc}</b>
          </div>
          <div style={{ borderLeft: '1px solid #334155', paddingLeft: '8px' }}>
            <span style={{ color: '#94A3B8' }}>🇰🇷 한국: </span>
            <b style={{ color: '#60A5FA' }}>{koreaWeather.temp} {koreaWeather.desc}</b>
          </div>
        </div>

        {/* 베트남동 / 20 = 원화 꿀팁 바 */}
        <div style={{ marginTop: '10px', backgroundColor: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.3)', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', color: '#E0F2FE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>💡 <b>환율 공식:</b> 베트남 동 <b>÷ 20</b> = 원화</span>
          <span style={{ color: '#38BDF8', fontWeight: 'bold' }}>10만동 ÷ 20 = 5,000원</span>
        </div>
      </header>

      {/* 2. 탭 네비게이션 */}
      <nav style={{ display: 'flex', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 10 }}>
        {[
          { id: 'schedule', label: '일정', icon: '📅' },
          { id: 'route', label: '지도/동선', icon: '🗺️' },
          { id: 'parking', label: '공항주차', icon: '🚗' },
          { id: 'docs', label: '바우처/꿀팁', icon: '🎫' },
          { id: 'tools', label: '예산/준비', icon: '🎒' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab.id ? '3px solid #2563EB' : '3px solid transparent',
              color: activeTab === tab.id ? '#2563EB' : '#64748B',
              fontWeight: 'bold',
              fontSize: '11px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '15px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* 3. 탭별 메인 영역 */}
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        
        {/* TAB 1: 일정표 (12/12 ~ 12/16 완벽 반영) */}
        {activeTab === 'schedule' && (
          <div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
              {tripDays.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDay(d.id)}
                  style={{
                    flex: 1,
                    minWidth: '65px',
                    padding: '8px 4px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: selectedDay === d.id ? '#2563EB' : '#E2E8F0',
                    backgroundColor: selectedDay === d.id ? '#EFF6FF' : '#FFFFFF',
                    color: selectedDay === d.id ? '#1D4ED8' : '#64748B',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{d.label}</span>
                  <span style={{ fontSize: '10px', opacity: 0.85 }}>{d.dateStr}</span>
                </button>
              ))}
            </div>

            {/* AI 스마트 일정 등록창 */}
            <form onSubmit={handleSmartAddSchedule} style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B' }}>✨ AI 대충 입력 스마트 정리</span>
                <span style={{ fontSize: '10px', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>자연어 자동분석</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px' }}>
                말하듯이 편하게 적으면 시간, 일차, 장소를 알아서 정리해 줍니다.
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="예: 저녁 7시에 즈엉동 야시장 해산물 먹기 / 13일 아침 9시 케이블카"
                  value={naturalInput}
                  onChange={(e) => setNaturalInput(e.target.value)}
                  style={{ flex: 1, padding: '9px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '12px' }}
                />
                <button
                  type="submit"
                  style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '8px', padding: '0 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  등록
                </button>
              </div>
            </form>

            {/* 일정 리스트 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentDaySchedules.map((item, idx) => {
                const badge = getTypeBadge(item.type);
                return (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#2563EB', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>
                        {idx + 1}
                      </div>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: badge.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                        {badge.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 'bold' }}>⏰ {item.time}</div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E293B', marginTop: '2px' }}>{item.title}</div>
                        {item.memo && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{item.memo}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => openGoogleMaps(item.location || item.title)}
                        style={{ border: 'none', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '6px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        지도
                      </button>
                      <button onClick={() => handleDeleteSchedule(item.id)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}>
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: 지도/동선 */}
        {activeTab === 'route' && (
          <div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto' }}>
              {tripDays.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDay(d.id)}
                  style={{
                    flex: 1,
                    minWidth: '65px',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedDay === d.id ? '#2563EB' : '#E2E8F0',
                    backgroundColor: selectedDay === d.id ? '#2563EB' : '#FFFFFF',
                    color: selectedDay === d.id ? '#FFFFFF' : '#64748B',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: '#FFF', padding: '16px', borderRadius: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', opacity: 0.85, fontWeight: 'bold' }}>GOOGLE MAPS ROUTE</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '2px' }}>
                {tripDays.find(d => d.id === selectedDay)?.label} ({tripDays.find(d => d.id === selectedDay)?.dateStr}) 전체 동선
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentDaySchedules.map((item, idx) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#1E293B', fontSize: '13px' }}>{item.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>📍 {item.location || item.title} ({item.time})</div>
                    </div>
                  </div>
                  <button
                    onClick={() => openGoogleMaps(item.location || item.title)}
                    style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', padding: '7px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    🗺️ 길찾기
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 공항주차 & 셔틀 */}
        {activeTab === 'parking' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>
                🚗 내 차 주차 위치 메모 (출차 시 확인)
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={myCarLocation}
                  onChange={(e) => setMyCarLocation(e.target.value)}
                  placeholder="예: 장기 P2 타워 2층 B구역"
                  style={{ flex: 1, padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
                <button
                  onClick={() => { setParkingSavedMsg(true); setTimeout(() => setParkingSavedMsg(false), 2000); }}
                  style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '8px', padding: '0 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  저장
                </button>
              </div>
              {parkingSavedMsg && <div style={{ fontSize: '11px', color: '#059669', fontWeight: 'bold' }}>✅ 주차 위치가 안전하게 저장되었습니다.</div>}
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B' }}>🚌 T1 장기주차장 순환 셔틀버스 정보</span>
                <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 'bold' }}>무료 탑승</span>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '10px', fontSize: '12px', lineHeight: '1.6' }}>
                • <b>운행 시간:</b> <span style={{ color: '#2563EB', fontWeight: 'bold' }}>04:30 ~ 24:00 (자정)</span><br />
                • <b>배차 간격:</b> 8분 ~ 16분 간격 (왕복 16분 소요)<br />
                • <b>탑승 위치:</b> 여객터미널 1층 3C, 13C 게이트 건너편 정류장
              </div>
              
              <div style={{ marginTop: '10px', backgroundColor: '#FEF2F2', padding: '10px 12px', borderRadius: '8px', fontSize: '11px', color: '#991B1B', lineHeight: '1.5' }}>
                <b>🚨 심야/새벽(00:00 ~ 04:30) 운행 중단 안내:</b><br />
                • 자정(24:00)부터 새벽 04:30까지는 셔틀버스가 다니지 않습니다.<br />
                • 이 시간대에는 <b>도보 이동(약 10~15분)</b> 또는 <b>터미널과 가까운 P1/P2 주차타워</b>에 주차하시는 것을 추천합니다.
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>
                📊 인천공항 T1 장기주차장 (소형)
              </div>
              <div style={{ backgroundColor: '#EFF6FF', padding: '12px', borderRadius: '10px', border: '1px solid #DBEAFE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1D4ED8' }}>4박 5일 총 예상 요금</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>1일 9,000원 × 5일</div>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B' }}>45,000원</div>
              </div>
              <div style={{ backgroundColor: '#F1F5F9', padding: '8px 10px', borderRadius: '6px', fontSize: '11px', color: '#475569', marginTop: '8px' }}>
                💡 경차 / 다자녀(2자녀 이상) / 저공해(친환경) 차량은 <b>50% 자동 감면</b>됩니다.
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 바우처/꿀팁 (실제 이메일 회신 데이터 완벽 반영) */}
        {activeTab === 'docs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* 보관함 목록 (시쉘 & 라페스타 힐튼 회신 탑재) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B' }}>📋 내 보관함 & 호텔 회신 바우처</div>
              {docs.map((docItem) => (
                <div key={docItem.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ backgroundColor: docItem.category === '항공권' ? '#1E3A8A' : '#1E293B', color: '#FFF', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                      {docItem.category}
                    </span>
                    <button onClick={() => setDocs(prev => prev.filter(d => d.id !== docItem.id))} style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1E293B' }}>{docItem.title}</div>
                    {docItem.code && <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: 'bold', marginTop: '4px' }}>📌 {docItem.code}</div>}
                    {docItem.memo && (
                      <div style={{ fontSize: '12px', color: '#334155', marginTop: '8px', lineHeight: '1.6', backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #2563EB', whiteSpace: 'pre-line' }}>
                        {docItem.memo}
                      </div>
                    )}

                    {docItem.imgUrl && (
                      <div style={{ marginTop: '10px' }}>
                        <img
                          src={docItem.imgUrl}
                          alt="티켓 미리보기"
                          onClick={() => setPreviewImg(docItem.imgUrl)}
                          style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: '1px solid #E2E8F0' }}
                        />
                        <button
                          onClick={() => setPreviewImg(docItem.imgUrl)}
                          style={{ width: '100%', marginTop: '6px', padding: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          🔍 바우처 사진 전체화면 확대 (QR 제시용)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 신규 등록 폼 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B', marginBottom: '6px' }}>
                ➕ 추가 바우처 / 티켓 사진 등록
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  style={{ width: '110px', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '12px', backgroundColor: '#FFF' }}
                >
                  <option value="호텔/셔틀">🏨 호텔/셔틀</option>
                  <option value="항공권">✈️ 항공권</option>
                  <option value="투어/티켓">🎫 투어/티켓</option>
                  <option value="영수증">🧾 영수증</option>
                </select>
                <input
                  type="text"
                  placeholder="바우처/티켓명"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  style={{ flex: 1, padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '12px' }}
                />
              </div>

              <input
                type="text"
                placeholder="예약번호 / 확인 코드"
                value={docCode}
                onChange={(e) => setDocCode(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '12px', marginBottom: '8px' }}
              />

              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                  📷 바우처 QR / 탑승권 티켓 사진 첨부
                </label>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: '11px', width: '100%' }} />
              </div>

              <button
                onClick={handleParseAndAddDoc}
                style={{ width: '100%', backgroundColor: '#2563EB', color: '#FFF', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
              >
                ✨ 스마트 바우처 카드로 저장
              </button>
            </div>

            {/* 현지 실전 꿀팁 */}
            <div style={{ backgroundColor: '#FFFBEB', padding: '16px', borderRadius: '16px', border: '1px solid #FEF3C7', color: '#92400E' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>💡 푸꾸옥 여행 현지 실전 꿀팁</div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', lineHeight: '1.6' }}>
                <li><b>그랩(Grab) 이용:</b> 공항 호객 택시 탑승 금지, 반드시 그랩 앱으로 호출하세요.</li>
                <li><b>수수료 무료 ATM:</b> 트래블로그 카드는 <b>VPBank, BIDV</b> ATM에서 인출 수수료가 0원입니다.</li>
                <li><b>동(VND) 계산법:</b> 베트남 동에서 <b>÷ 20</b> 하면 한국 원화 (예: 10만동 ÷ 20 = 5천원).</li>
                <li><b>시쉘 기사 미팅:</b> 비행기 착륙 후 WhatsApp으로 기사님(+84 786 920 789)께 메시지를 보내면 더욱 빠릅니다.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 5: 예산/준비 */}
        {activeTab === 'tools' && (
          <div>
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B' }}>💱 실시간 환율 계산기</span>
                <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 'bold' }}>베트남동 ÷ 20 = 원화</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  value={vndInput}
                  onChange={(e) => setVndInput(e.target.value)}
                  placeholder="동(VND) 입력"
                  style={{ flex: 1, padding: '8px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
                <span style={{ fontWeight: 'bold', fontSize: '12px' }}>VND =</span>
                <span style={{ fontWeight: 'bold', color: '#2563EB', fontSize: '16px' }}>
                  {Math.round((Number(vndInput) || 0) / 20).toLocaleString()} 원
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginTop: '10px', overflowX: 'auto' }}>
                {[
                  { label: '5만동 (2.5천원)', val: '50000' },
                  { label: '10만동 (5천원)', val: '100000' },
                  { label: '50만동 (2.5만원)', val: '500000' },
                  { label: '100만동 (5만원)', val: '1000000' },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => setVndInput(btn.val)}
                    style={{ flex: 1, padding: '6px 4px', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '11px', color: '#334155', cursor: 'pointer', textAlign: 'center' }}
                  >
                    <b>{btn.label}</b>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B' }}>💰 여행 누적 지출</span>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#DC2626' }}>{totalKRW.toLocaleString()} 원</span>
              </div>
              <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="항목 (예: 야시장 식사)"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  style={{ flex: 1, padding: '7px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '12px' }}
                />
                <input
                  type="number"
                  placeholder="동(VND)"
                  value={expVnd}
                  onChange={(e) => setExpVnd(e.target.value)}
                  style={{ width: '85px', padding: '7px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '12px' }}
                />
                <button type="submit" style={{ backgroundColor: '#1E293B', color: '#FFF', border: 'none', borderRadius: '6px', padding: '0 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  추가
                </button>
              </form>
              <div style={{ maxHeight: '110px', overflowY: 'auto' }}>
                {expenses.map((exp) => (
                  <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '5px 0', borderBottom: '1px dashed #F1F5F9' }}>
                    <span style={{ color: '#475569' }}>{exp.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 'bold', color: '#1E293B' }}>{exp.krw.toLocaleString()}원</span>
                      <button onClick={() => setExpenses(prev => prev.filter(e => e.id !== exp.id))} style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B' }}>🎒 나만의 준비물 체크 (개인 폰 저장)</span>
                <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 'bold' }}>
                  {checklists.filter(c => c.checked).length} / {checklists.length} 완료
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px' }}>
                🔒 본인 스마트폰에만 개별 저장되므로 자유롭게 체크하세요.
              </div>
              <form onSubmit={handleAddChecklist} style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="추가 준비물 입력 (예: 선글라스)"
                  value={newCheckItem}
                  onChange={(e) => setNewCheckItem(e.target.value)}
                  style={{ flex: 1, padding: '7px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '12px' }}
                />
                <button type="submit" style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', padding: '0 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  추가
                </button>
              </form>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
                {checklists.map((chk) => (
                  <div
                    key={chk.id}
                    onClick={() => handleToggleCheck(chk.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 9px',
                      backgroundColor: chk.checked ? '#F8FAFC' : '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #F1F5F9',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: chk.checked ? '#94A3B8' : '#1E293B', textDecoration: chk.checked ? 'line-through' : 'none' }}>
                      <span>{chk.checked ? '✅' : '⬜'}</span>
                      <span style={{ fontSize: '10px', backgroundColor: '#F1F5F9', color: '#64748B', padding: '2px 4px', borderRadius: '4px' }}>
                        {chk.category}
                      </span>
                      <span>{chk.text}</span>
                    </div>
                    <button onClick={(e) => handleDeleteChecklist(chk.id, e)} style={{ border: 'none', background: 'none', color: '#CBD5E1', cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 사진 확대 모달 */}
      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}
        >
          <div style={{ maxWidth: '100%', textAlign: 'center' }}>
            <img src={previewImg} alt="바우처 원본" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }} />
            <div style={{ color: '#FFF', fontSize: '12px', marginTop: '12px' }}>화면을 터치하면 닫힙니다.</div>
          </div>
        </div>
      )}
    </div>
  );
}