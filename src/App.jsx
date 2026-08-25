import React, { useState, useEffect } from 'react';

// 해외여행 종합 준비물 체크리스트
const defaultChecklists = [
  { id: 'c1', text: '여권 실물 (만료일 6개월 이상 확인)', category: '서류/바우처', checked: true },
  { id: 'c2', text: '여권 사본 및 증명사진 2매', category: '서류/바우처', checked: false },
  { id: 'c3', text: '그랩(Grab) 앱 & 한국 카드 등록', category: '서류/바우처', checked: true },
  { id: 'c4', text: '트래블로그 / 트래블월렛 카드', category: '서류/바우처', checked: false },
  { id: 'c5', text: '비상금 달러(신권 100달러) & 원화', category: '서류/바우처', checked: false },
  { id: 'c6', text: '해외여행자보험 영문 증명서', category: '서류/바우처', checked: false },
  { id: 'c7', text: 'eSIM 등록 QR코드 / 유심 핀', category: '서류/바우처', checked: false },
  { id: 'c8', text: '보조배터리 (기내 수하물 필수)', category: '전자기기', checked: false },
  { id: 'c9', text: '휴대폰 충전기 & 멀티 어댑터(돼지코)', category: '전자기기', checked: false },
  { id: 'c10', text: '이어폰 & 충전 케이블', category: '전자기기', checked: false },
  { id: 'c11', text: '선크림 (자외선 차단제 SPF50+)', category: '샤워/화장', checked: false },
  { id: 'c12', text: '스킨, 로션, 수분크림', category: '샤워/화장', checked: false },
  { id: 'c13', text: '알로에 수딩젤 (화상 진정용)', category: '샤워/화장', checked: false },
  { id: 'c14', text: '칫솔 & 치약 & 면도기', category: '샤워/화장', checked: false },
  { id: 'c15', text: '일자별 옷 (여름 반팔, 반바지)', category: '의류/잡화', checked: false },
  { id: 'c16', text: '속옷 & 양말 여유분', category: '의류/잡화', checked: false },
  { id: 'c17', text: '잠옷 (편한 실내복)', category: '의류/잡화', checked: false },
  { id: 'c18', text: '얇은 겉옷 (기내/실내 에어컨 대비)', category: '의류/잡화', checked: false },
  { id: 'c19', text: '선글라스 & 모자', category: '의류/잡화', checked: false },
  { id: 'c20', text: '지사제 & 소화제 (물갈이 대비 필수)', category: '상비약', checked: false },
  { id: 'c21', text: '진통제 (타이레놀) & 종합감기약', category: '상비약', checked: false },
  { id: 'c22', text: '모기약 (바르는 버물리 / 기피제)', category: '상비약', checked: false },
  { id: 'c23', text: '밴드 & 후시딘 연고', category: '상비약', checked: false },
  { id: 'c24', text: '목베개 & 안대 & 이어폰', category: '기내휴대', checked: false },
  { id: 'c25', text: '샤워기 필터 & 비타민 리필', category: '기타/물놀이', checked: false },
  { id: 'c26', text: '휴대폰 방수팩 & 아쿠아슈즈', category: '기타/물놀이', checked: false },
  { id: 'c27', text: '수영복 & 래시가드', category: '기타/물놀이', checked: false },
  { id: 'c28', text: '비상용 컵라면 & 간식', category: '기타/물놀이', checked: false },
];

const tripDays = [
  { id: 'day1', dayNumber: 1, dateStr: '12.12 (토)', label: '1일차' },
  { id: 'day2', dayNumber: 2, dateStr: '12.13 (일)', label: '2일차' },
  { id: 'day3', dayNumber: 3, dateStr: '12.14 (월)', label: '3일차' },
  { id: 'day4', dayNumber: 4, dateStr: '12.15 (화)', label: '4일차' },
  { id: 'day5', dayNumber: 5, dateStr: '12.16 (수)', label: '5일차' },
];

const initialSchedules = [
  // Day 1
  { id: 's1', day: 'day1', time: '02:30', title: '인천공항 T1 도착 및 장기주차', type: 'CAR', location: '인천공항 제1여객터미널 장기주차장', memo: 'P1/P2 주차타워 주차 후 터미널 이동' },
  { id: 's2', day: 'day1', time: '05:00', title: '비엣젯 VJ977 항공기 탑승 출발', type: 'FLIGHT', location: '인천국제공항 제1여객터미널', memo: '05:00 출발 (1인당 위탁수하물 20kg 포함)'[cite: 2]},
  { id: 's3', day: 'day1', time: '08:50', title: '푸꾸옥 공항 도착 및 입국 수속', type: 'CAR', location: 'Phu Quoc International Airport', memo: '출구 앞 시쉘 피켓 기사님 미팅 (+84 786 920 789)' },
  { id: 's4', day: 'day1', time: '10:00', title: '모닝 마사지 & 짐 보관', type: 'HOTEL', location: '푸꾸옥 시내 마사지샵', memo: '마사지로 피로 풀고 짐 맡긴 후 사파리 출발' },
  { id: 's5', day: 'day1', time: '11:30', title: '북부 빈펄 사파리(Safari) 관람', type: 'PLACE', location: 'Vinpearl Safari Phu Quoc', memo: '사파리 투어 버스 탑승 & 기린 식당' },
  { id: 's6', day: 'day1', time: '15:30', title: '시쉘 푸꾸옥 호텔 체크인', type: 'HOTEL', location: 'Seashells Phu Quoc Hotel & Spa', memo: '체크인 15:00 (12/14 체크아웃 셔틀 사전예약)'[cite: 3, 4]},
  { id: 's7', day: 'day1', time: '18:30', title: '저녁식사: 베트남 가정식 [메오키친]', type: 'RESTAURANT', location: 'Meo Kitchen Phu Quoc', memo: '쌀국수, 반쎄오, 분짜 추천 맛집' },
  { id: 's8', day: 'day1', time: '20:00', title: '즈엉동 야시장 산책 & 킹콩마트', type: 'PLACE', location: 'Phu Quoc Night Market', memo: '호텔에서 도보 이동 가능 (열대과일 & 쇼핑)' },

  // Day 2
  { id: 's9', day: 'day2', time: '09:30', title: '북부 그랜드월드 & 아쿠아리움', type: 'PLACE', location: 'Grand World Phu Quoc', memo: '베니스 운하 도시 & 초대형 아쿠아리움' },
  { id: 's10', day: 'day2', time: '14:00', title: '시쉘 호텔 수영장 & 리조트 힐링', type: 'HOTEL', location: 'Seashells Phu Quoc Hotel & Spa', memo: '인피니티 풀 바다 전망 휴식' },
  { id: 's11', day: 'day2', time: '18:00', title: '저녁식사: 시푸드 강추 맛집 [빈산]', type: 'RESTAURANT', location: 'Binh San Seafood Phu Quoc', memo: '랍스터, 맛조개, 치즈새우 구이' },

  // Day 3
  { id: 's12', day: 'day3', time: '11:00', title: '시쉘 체크아웃 ➔ 라페스타 힐튼 이동', type: 'CAR', location: 'La Festa Phu Quoc, Curio Collection by Hilton', memo: '그랩 7인승 대형 호출 (약 35분 소요)' },
  { id: 's13', day: 'day3', time: '14:30', title: '남부 사오비치(Sao Beach) 해변 휴식', type: 'PLACE', location: 'Sao Beach Phu Quoc', memo: '새하얀 모래사장 & 시원한 코코넛 음료' },
  { id: 's14', day: 'day3', time: '18:30', title: '저녁식사: 남부 맛집 [하이봇] 스테이크', type: 'RESTAURANT', location: 'Hibot Restaurant Sunset Town', memo: '⚠️ 3개 매장 중 스테이크 판매 지점 방문!' },

  // Day 4
  { id: 's15', day: 'day4', time: '09:30', title: '남부 혼똔섬 해상 케이블카 & 워터파크', type: 'PLACE', location: 'Hon Thom Cable Car Station', memo: '세계 최장 바다 케이블카 탑승' },
  { id: 's16', day: 'day4', time: '17:00', title: '선셋타운 산책 & 키스브릿지 노을 감상', type: 'PLACE', location: 'Kiss Bridge Phu Quoc', memo: '남부 일몰 명소 포토존' },
  { id: 's17', day: 'day4', time: '19:30', title: '키스 오브 더 씨 야간 불꽃 분수쇼', type: 'PLACE', location: 'Sunset Town Phu Quoc', memo: '남부 필수 야간 멀티미디어 불꽃쇼' },

  // Day 5
  { id: 's18', day: 'day5', time: '12:00', title: '라페스타 힐튼 체크아웃 & 짐 보관', type: 'HOTEL', location: 'La Festa Phu Quoc, Curio Collection by Hilton', memo: '체크아웃 후 호텔 프런트 무료 짐보관'[cite: 9]},
  { id: 's19', day: 'day5', time: '14:00', title: '선셋타운 카페 휴식 & 기념품 쇼핑', type: 'PLACE', location: 'Sunset Town Phu Quoc', memo: '마지막 남부 힐링 티타임' },
  { id: 's20', day: 'day5', time: '18:00', title: '공항 이동 (호텔 밴 또는 그랩 7인승)', type: 'CAR', location: 'Phu Quoc International Airport', memo: '공항 도착 후 출국 수속 (출발 2시간 45분 전)' },
  { id: 's21', day: 'day5', time: '20:45', title: '비엣젯 VJ976 항공기 탑승 푸꾸옥 출발', type: 'FLIGHT', location: 'Phu Quoc International Airport', memo: '20:45 출발 ➔ 12/17(목) 04:00 인천 T1 도착'[cite: 2]},
  { id: 's22', day: 'day5', time: '04:00', title: '인천공항 T1 도착 및 귀가', type: 'CAR', location: '인천국제공항 제1여객터미널 장기주차장', memo: '주차 요금 정산 후 안전 귀가' },
];

const initialDocs = [
  {
    id: 'd_transfer_guide',
    category: '이동/셔틀',
    title: '🚐 전 구간 픽업 / 샌딩 / 이동 총정리',
    code: '사전 예약 여부 확인',
    memo: '1️⃣ [12/12 입국 픽업: 예약완료] 공항 ➔ 시쉘 푸꾸옥 (무료 픽업 확정 / 기사: +84 786 920 789)\n2️⃣ [12/14 체크아웃: 현장예약] 시쉘 체크인 시 프런트에 셔틀 예약\n3️⃣ [12/14 호텔 이동: 당일호출] 시쉘 ➔ 라페스타 힐튼 (그랩 7인승 약 35분)\n4️⃣ [12/16 출국 샌딩: 유료예약] 힐튼 ➔ 공항 (호텔 밴 136만동 사전예약 또는 그랩 7인승 호출)',
    imgUrl: '',
    rawEmail: ''
  },
  {
    id: 'd_flight_tickets',
    category: '항공권',
    title: '✈️ 비엣젯 항공 왕복 E-티켓 (5인)',
    code: '예약번호 1400828892050635'[cite: 1, 2],
    memo: '• 출국(VJ977): 12/12(토) 05:00 인천 T1 ➔ 08:50 푸꾸옥\n• 귀국(VJ976): 12/16(수) 20:45 푸꾸옥 ➔ 12/17 04:00 인천 T1\n• 수하물: 1인당 위탁 20kg + 기내 7kg'[cite: 2],
    imgUrl: '',
    rawEmail: ''
  },
  {
    id: 'd_seashells_room',
    category: '호텔',
    title: '🏨 중부: 시쉘 푸꾸옥 호텔 & 스파 (12/12~12/14)',
    code: '체크인 15:00 / 야시장 도보권'[cite: 3, 4],
    memo: '• 룸1 (3인): Agoda #1764447810 (Twin Ocean View / 조식 3인)\n• 룸2 (2인): Trip.com #1400828467787978 (King City View / 조식 2인)\n• 호텔 전화: +84 297 7300 999'[cite: 3, 4, 6],
    imgUrl: '',
    rawEmail: ''
  },
  {
    id: 'd_lafesta_info',
    category: '호텔',
    title: '🏨 남부: 라페스타 푸꾸옥 힐튼 (12/14~12/16)',
    code: '체크인 15:00 / 선셋타운 위치'[cite: 9, 10],
    memo: '• 룸1 (3인): Agoda #1764537797 (King Capri Terrace / 조식 3인)\n• 룸2 (2인): Trip.com #1400828468433911 (King Classico / 조식 2인)\n• 체크아웃 후 당일 무료 짐보관 가능 / 전화: +84 297 3525 555'[cite: 7, 9, 10],
    imgUrl: '',
    rawEmail: ''
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDay, setSelectedDay] = useState('day1');
  const [checkCategory, setCheckCategory] = useState('전체');
  const [showTipModal, setShowTipModal] = useState(false);
  
  const [items, setItems] = useState(initialSchedules);
  const [docs, setDocs] = useState(initialDocs);
  const [expenses, setExpenses] = useState([
    { id: 'e1', title: '비엣젯 항공권 (5인 왕복 총액)', vnd: 59070000, krw: 2953500 },
    { id: 'e2', title: '인천공항 5일 장기주차비 (준중형 SUV)', vnd: 900000, krw: 45000 },
  ]);

  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem('my_personal_checklists_v15');
    return saved ? JSON.parse(saved) : defaultChecklists;
  });

  const [currentWeather, setCurrentWeather] = useState({ location: '푸꾸옥', temp: '29°C', desc: '맑음 ☀️' });
  const [koreaWeather, setKoreaWeather] = useState({ temp: '2°C', desc: '구름조금 ⛅' });
  const [localTime, setLocalTime] = useState('');
  const [koreaTime, setKoreaTime] = useState('');

  const [exchangeRate, setExchangeRate] = useState(0.053);
  const [vndInput, setVndInput] = useState('100000');
  const [naturalInput, setNaturalInput] = useState('');
  const [myCarLocation, setMyCarLocation] = useState('장기 P2 주차타워 2층 B구역');
  const [parkingSavedMsg, setParkingSavedMsg] = useState(false);

  const [docCategory, setDocCategory] = useState('호텔');
  const [docTitle, setDocTitle] = useState('');
  const [docCode, setDocCode] = useState('');
  const [docMemo, setDocMemo] = useState('');
  const [docImgUrl, setDocImgUrl] = useState('');
  const [previewImg, setPreviewImg] = useState(null);

  const [newCheckItem, setNewCheckItem] = useState('');
  const [newCheckCat, setNewCheckCat] = useState('기타/물놀이');
  const [expTitle, setExpTitle] = useState('');
  const [expVnd, setExpVnd] = useState('');

  useEffect(() => {
    localStorage.setItem('my_personal_checklists_v15', JSON.stringify(checklists));
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
    const loadData = async () => {
      try {
        const resKR = await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.46&longitude=126.44&current=temperature_2m,weather_code');
        const dataKR = await resKR.json();
        if (dataKR?.current) {
          setKoreaWeather({ temp: `${Math.round(dataKR.current.temperature_2m)}°C`, desc: getWeatherDesc(dataKR.current.weather_code) });
        }
      } catch (e) {}

      try {
        const resPQ = await fetch('https://api.open-meteo.com/v1/forecast?latitude=10.22&longitude=103.96&current=temperature_2m,weather_code');
        const dataPQ = await resPQ.json();
        if (dataPQ?.current) {
          setCurrentWeather({ location: '푸꾸옥', temp: `${Math.round(dataPQ.current.temperature_2m)}°C`, desc: getWeatherDesc(dataPQ.current.weather_code) });
        }
      } catch (e) {}

      try {
        const rateRes = await fetch('https://open.er-api.com/v6/latest/VND');
        const rateData = await rateRes.json();
        if (rateData?.rates?.KRW) {
          setExchangeRate(rateData.rates.KRW);
        }
      } catch (e) {
        setExchangeRate(0.053);
      }
    };

    loadData();
  }, []);

  const handleSmartAddSchedule = (e) => {
    e.preventDefault();
    if (!naturalInput.trim()) return;

    const text = naturalInput.trim();
    let targetDay = selectedDay;
    let extractedTime = '12:00';
    let type = 'PLACE';
    let title = text;

    if (text.includes('12/12') || text.includes('12일') || text.includes('첫째날') || text.includes('1일차')) targetDay = 'day1';
    else if (text.includes('12/13') || text.includes('13일') || text.includes('둘째날') || text.includes('2일차')) targetDay = 'day2';
    else if (text.includes('12/14') || text.includes('14일') || text.includes('셋째날') || text.includes('3일차')) targetDay = 'day3';
    else if (text.includes('12/15') || text.includes('15일') || text.includes('넷째날') || text.includes('4일차')) targetDay = 'day4';
    else if (text.includes('12/16') || text.includes('16일') || text.includes('마지막날') || text.includes('5일차')) targetDay = 'day5';

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

    if (text.includes('식당') || text.includes('밥') || text.includes('저녁') || text.includes('점심') || text.includes('야시장') || text.includes('카페') || text.includes('먹기') || text.includes('빈산') || text.includes('메오키친') || text.includes('하이봇')) type = 'RESTAURANT';
    else if (text.includes('호텔') || text.includes('체크인') || text.includes('체크아웃') || text.includes('리조트') || text.includes('숙소') || text.includes('씨쉘') || text.includes('힐튼')) type = 'HOTEL';
    else if (text.includes('비행기') || text.includes('공항') || text.includes('탑승') || text.includes('출발') || text.includes('도착')) type = 'FLIGHT';
    else if (text.includes('주차') || text.includes('출차') || text.includes('셔틀') || text.includes('차량')) type = 'CAR';

    title = text.replace(/12\/\d{1,2}|\d일차|\d{1,2}일/g, '')
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
      memo: '스마트 등록됨',
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

  const handleAddDoc = () => {
    if (!docTitle) {
      alert('바우처/티켓 이름을 입력해 주세요.');
      return;
    }
    const newDoc = {
      id: String(Date.now()),
      category: docCategory,
      title: docTitle,
      code: docCode || '확인 완료',
      memo: docMemo,
      imgUrl: docImgUrl,
    };
    setDocs(prev => [newDoc, ...prev]);
    setDocTitle('');
    setDocCode('');
    setDocMemo('');
    setDocImgUrl('');
    alert('바우처가 안전하게 등록되었습니다!');
  };

  const handleToggleCheck = (id) => {
    setChecklists((prev) => prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)));
  };

  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (!newCheckItem) return;
    setChecklists((prev) => [...prev, { id: String(Date.now()), text: newCheckItem, category: newCheckCat, checked: false }]);
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
      krw: Math.round(amount * exchangeRate),
    };
    setExpenses((prev) => [...prev, newExp]);
    setExpTitle('');
    setExpVnd('');
  };

  const totalKRW = expenses.reduce((acc, cur) => acc + (cur.krw || 0), 0);
  const currentDaySchedules = items.filter((it) => it.day === selectedDay);

  const filteredChecklists = checkCategory === '전체'
    ? checklists
    : checklists.filter((c) => c.category === checkCategory);

  const checklistCategories = ['전체', '서류/바우처', '전자기기', '샤워/화장', '의류/잡화', '상비약', '기내휴대', '기타/물놀이'];

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
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'system-ui, -apple-system, sans-serif', borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. 상단 브리핑 HUD (크로스체크 제거 & 꿀팁 버튼 탑재) */}
      <header style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '16px 18px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#38BDF8', backgroundColor: 'rgba(56,189,248,0.18)', padding: '4px 10px', borderRadius: '8px' }}>
            푸꾸옥 4박 5일 가족 여행 🌴
          </span>
          <button
            onClick={() => setShowTipModal(true)}
            style={{ backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '5px 12px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            💡 실전 꿀팁 보기
          </button>
        </div>

        {/* 듀얼 시계 (글씨 크기 확대) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px', backgroundColor: '#1E293B', padding: '12px 14px', borderRadius: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>베트남 푸꾸옥 시간</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F8FAFC', marginTop: '2px' }}>{localTime || '19:48'}</div>
          </div>
          <div style={{ borderLeft: '1px solid #334155', paddingLeft: '14px' }}>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>한국 시간 (+2시간)</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#38BDF8', marginTop: '2px' }}>{koreaTime || '21:48'}</div>
          </div>
        </div>

        {/* 날씨 & 환율 공식 바 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', backgroundColor: '#1E293B', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}>
          <div>
            <span style={{ color: '#94A3B8' }}>📍 푸꾸옥: </span>
            <b style={{ color: '#FCD34D' }}>{currentWeather.temp} {currentWeather.desc}</b>
          </div>
          <div style={{ borderLeft: '1px solid #334155', paddingLeft: '10px' }}>
            <span style={{ color: '#94A3B8' }}>공식: </span>
            <b style={{ color: '#38BDF8' }}>동 ÷ 20 ≈ 원화</b>
          </div>
        </div>
      </header>

      {/* 2. 4개 탭 네비게이션 */}
      <nav style={{ display: 'flex', backgroundColor: '#FFFFFF', borderBottom: '1px solid #CBD5E1', position: 'sticky', top: 0, zIndex: 10 }}>
        {[
          { id: 'schedule', label: '일정표', icon: '📅' },
          { id: 'route', label: '권역/동선', icon: '🗺️' },
          { id: 'docs', label: '바우처/주차', icon: '🎫' },
          { id: 'tools', label: '예산/준비물', icon: '🎒' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px 0',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab.id ? '4px solid #2563EB' : '4px solid transparent',
              color: activeTab === tab.id ? '#2563EB' : '#64748B',
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '18px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* 3. 메인 콘텐츠 영역 */}
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        
        {/* TAB 1: 타임테이블 순서 일정표 (가시성 대폭 강화) */}
        {activeTab === 'schedule' && (
          <div>
            {/* 날짜 선택 버튼 (크고 보기 쉽게) */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
              {tripDays.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDay(d.id)}
                  style={{
                    flex: 1,
                    minWidth: '76px',
                    padding: '10px 6px',
                    borderRadius: '12px',
                    border: '2px solid',
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
                  <span style={{ fontSize: '15px', fontWeight: 'bold' }}>{d.label}</span>
                  <span style={{ fontSize: '12px', opacity: 0.85 }}>{d.dateStr}</span>
                </button>
              ))}
            </div>

            {/* AI 스마트 일정 등록창 */}
            <form onSubmit={handleSmartAddSchedule} style={{ backgroundColor: '#FFFFFF', padding: '14px 16px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E293B' }}>✨ 일정 편하게 추가하기</span>
                <span style={{ fontSize: '11px', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>자동 정리</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="예: 저녁 7시 메오키친 쌀국수 / 13일 아침 9시 케이블카"
                  value={naturalInput}
                  onChange={(e) => setNaturalInput(e.target.value)}
                  style={{ flex: 1, padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '14px' }}
                />
                <button
                  type="submit"
                  style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '10px', padding: '0 16px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  등록
                </button>
              </div>
            </form>

            {/* 타임라인(Timeline) 디자인 순차 나열 */}
            <div style={{ position: 'relative', paddingLeft: '8px' }}>
              {/* 세로 연결 라인 */}
              <div style={{ position: 'absolute', left: '38px', top: '20px', bottom: '20px', width: '3px', backgroundColor: '#E2E8F0', zIndex: 1 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 2 }}>
                {currentDaySchedules.map((item, idx) => {
                  const badge = getTypeBadge(item.type);
                  return (
                    <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      
                      {/* 타임스탬프 원형 뱃지 */}
                      <div style={{ width: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ backgroundColor: '#1E293B', color: '#FFFFFF', padding: '4px 6px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                          {item.time}
                        </div>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: badge.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginTop: '6px', border: '2px solid #FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                          {badge.icon}
                        </div>
                      </div>

                      {/* 일정 상세 카드 (글자 크기 확대) */}
                      <div style={{ flex: 1, backgroundColor: '#FFFFFF', padding: '14px 16px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 5px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0F172A', lineHeight: '1.4' }}>
                            {item.title}
                          </div>
                          <div style={{ display: 'flex', gap: '6px', marginLeft: '6px', flexShrink: 0 }}>
                            <button
                              onClick={() => openGoogleMaps(item.location || item.title)}
                              style={{ border: 'none', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              지도
                            </button>
                            <button onClick={() => handleDeleteSchedule(item.id)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', fontSize: '14px' }}>
                              ✕
                            </button>
                          </div>
                        </div>

                        {item.memo && (
                          <div style={{ fontSize: '13px', color: '#475569', marginTop: '6px', backgroundColor: '#F8FAFC', padding: '8px 10px', borderRadius: '8px', lineHeight: '1.5' }}>
                            {item.memo}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 여행 권역 및 동선도 */}
        {activeTab === 'route' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: '#FFF', padding: '18px', borderRadius: '16px' }}>
              <div style={{ fontSize: '13px', opacity: 0.85, fontWeight: 'bold' }}>PHU QUOC TRAVEL ROUTE</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>푸꾸옥 북부 ➔ 중부 ➔ 남부 권역별 이동 동선도</div>
            </div>

            {/* 권역별 다이어그램 (글씨 확대) */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1E293B', marginBottom: '14px', textAlign: 'center' }}>
                🧭 푸꾸옥 핵심 권역 한눈에 보기
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                {/* 1. 북부 */}
                <div style={{ backgroundColor: '#ECFDF5', border: '2px solid #10B981', borderRadius: '14px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b style={{ color: '#065F46', fontSize: '15px' }}>🌲 [북부] 사파리 & 테마파크</b>
                    <span style={{ fontSize: '12px', backgroundColor: '#A7F3D0', color: '#065F46', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>차량 45분</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#047857', marginTop: '6px', lineHeight: '1.5' }}>
                    • <b>주요 명소:</b> 빈펄 사파리(기린식당), 빈원더스, 그랜드월드
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '13px', fontWeight: 'bold' }}>
                  ⬇️ (그랩 택시 약 45분 / 빈버스 무료셔틀) ⬇️
                </div>

                {/* 2. 중부 */}
                <div style={{ backgroundColor: '#EFF6FF', border: '2px solid #2563EB', borderRadius: '14px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b style={{ color: '#1E40AF', fontSize: '15px' }}>🏙️ [중부] 시내 & 숙소 (씨쉘 리조트)</b>
                    <span style={{ fontSize: '12px', backgroundColor: '#BFDBFE', color: '#1E40AF', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>공항 15분</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#1D4ED8', marginTop: '6px', lineHeight: '1.5' }}>
                    • <b>주요 명소:</b> 푸꾸옥 공항, 즈엉동 야시장(도보권), 메오키친, 빈산
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '13px', fontWeight: 'bold' }}>
                  ⬇️ (그랩 7인승 대형 택시 약 35분) ⬇️
                </div>

                {/* 3. 남부 */}
                <div style={{ backgroundColor: '#FFF7ED', border: '2px solid #F97316', borderRadius: '14px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b style={{ color: '#9A3412', fontSize: '15px' }}>🌊 [남부] 볼거리 중심 & 숙소 (라페스타 힐튼)</b>
                    <span style={{ fontSize: '12px', backgroundColor: '#FED7AA', color: '#9A3412', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>공항 25분</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#C2410C', marginTop: '6px', lineHeight: '1.5' }}>
                    • <b>주요 명소:</b> 라페스타 힐튼, 혼똔섬 케이블카, 키스브릿지 불꽃쇼, 사오비치
                  </div>
                </div>
              </div>
            </div>

            {/* 이동 시간 요약 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1E293B', marginBottom: '10px' }}>
                ⏱️ 권역별 이동 소요 시간 & 추천 교통편
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: '8px', borderLeft: '4px solid #2563EB' }}>
                  <b>• 공항 ➔ 씨쉘(중부):</b> 약 15~20분 (호텔 무료 픽업 확정)
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
                  <b>• 중부 ➔ 북부(사파리):</b> 약 45~50분 (그랩 7인승 또는 무료 빈버스)
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: '8px', borderLeft: '4px solid #F97316' }}>
                  <b>• 중부 ➔ 남부(라페스타 힐튼):</b> 약 35분 (그랩 7인승 대형 택시 추천)
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: '8px', borderLeft: '4px solid #EF4444' }}>
                  <b>• 남부(힐튼) ➔ 공항:</b> 약 25~30분 (호텔 16인승 밴 사전예약 또는 그랩)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 바우처 & 주차 */}
        {activeTab === 'docs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* 인천공항 T1 주차 메모 및 셔틀 카드 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#1E293B' }}>🚗 인천공항 T1 장기주차 (준중형 SUV)</span>
                <span style={{ fontSize: '13px', color: '#2563EB', fontWeight: 'bold' }}>5일 45,000원</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={myCarLocation}
                  onChange={(e) => setMyCarLocation(e.target.value)}
                  placeholder="예: 장기 P2 주차타워 2층 B구역"
                  style={{ flex: 1, padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '14px' }}
                />
                <button
                  onClick={() => { setParkingSavedMsg(true); setTimeout(() => setParkingSavedMsg(false), 2000); }}
                  style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '10px', padding: '0 16px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  저장
                </button>
              </div>
              {parkingSavedMsg && <div style={{ fontSize: '12px', color: '#059669', fontWeight: 'bold', marginBottom: '8px' }}>✅ 주차 위치가 안전하게 저장되었습니다.</div>}
              
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                • <b>T1 순환셔틀:</b> 04:30 ~ 24:00 (무료 운행)<br />
                • <b>🚨 심야 셔틀 미운행:</b> 05:00 출발(새벽 02:30 공항도착) 시 도보 10분 거리의 P1/P2 주차타워를 이용하세요.
              </div>
            </div>

            {/* 예약 바우처 목록 (글씨 확대) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1E293B' }}>📋 내 보관함 & 호텔/항공 바우처</div>
              {docs.map((docItem) => (
                <div key={docItem.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ backgroundColor: docItem.category === '항공권' ? '#1E3A8A' : '#1E293B', color: '#FFF', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '6px' }}>
                      {docItem.category}
                    </span>
                    <button onClick={() => setDocs(prev => prev.filter(d => d.id !== docItem.id))} style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1E293B' }}>{docItem.title}</div>
                    {docItem.code && <div style={{ fontSize: '13px', color: '#2563EB', fontWeight: 'bold', marginTop: '4px' }}>📌 {docItem.code}</div>}
                    {docItem.memo && (
                      <div style={{ fontSize: '13px', color: '#334155', marginTop: '8px', lineHeight: '1.6', backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '10px', borderLeft: '4px solid #2563EB', whiteSpace: 'pre-line' }}>
                        {docItem.memo}
                      </div>
                    )}

                    {docItem.imgUrl && (
                      <div style={{ marginTop: '10px' }}>
                        <img
                          src={docItem.imgUrl}
                          alt="티켓 미리보기"
                          onClick={() => setPreviewImg(docItem.imgUrl)}
                          style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer', border: '1px solid #E2E8F0' }}
                        />
                        <button
                          onClick={() => setPreviewImg(docItem.imgUrl)}
                          style={{ width: '100%', marginTop: '6px', padding: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          🔍 티켓/바우처 사진 크게 보기
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 신규 바우처 등록 폼 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>
                ➕ 새 바우처 / 티켓 사진 등록
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  style={{ width: '100px', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', backgroundColor: '#FFF' }}
                >
                  <option value="호텔">🏨 호텔</option>
                  <option value="항공권">✈️ 항공권</option>
                  <option value="투어/티켓">🎫 투어/티켓</option>
                  <option value="영수증">🧾 영수증</option>
                </select>
                <input
                  type="text"
                  placeholder="바우처/티켓 이름"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  style={{ flex: 1, padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <input
                type="text"
                placeholder="예약번호 / 확인 코드"
                value={docCode}
                onChange={(e) => setDocCode(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px', marginBottom: '8px' }}
              />

              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                  📷 바우처 QR 또는 티켓 사진 첨부
                </label>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: '12px', width: '100%' }} />
              </div>

              <button
                onClick={handleAddDoc}
                style={{ width: '100%', backgroundColor: '#2563EB', color: '#FFF', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                바우처 저장하기
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: 예산 & 준비물 */}
        {activeTab === 'tools' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* 정밀 실시간 환율 계산기 (글씨 확대) */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#1E293B' }}>💱 실시간 환율 계산기</span>
                <span style={{ fontSize: '12px', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                  1 VND ≈ {(exchangeRate).toFixed(4)}원
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  value={vndInput}
                  onChange={(e) => setVndInput(e.target.value)}
                  placeholder="동(VND) 입력"
                  style={{ flex: 1, padding: '10px', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '15px' }}
                />
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>VND =</span>
                <span style={{ fontWeight: 'bold', color: '#2563EB', fontSize: '18px' }}>
                  {Math.round((Number(vndInput) || 0) * exchangeRate).toLocaleString()}원
                </span>
              </div>
              
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
                (간이 공식 ÷ 20 적용 시: 약 {Math.round((Number(vndInput) || 0) / 20).toLocaleString()}원)
              </div>

              <div style={{ display: 'flex', gap: '6px', marginTop: '10px', overflowX: 'auto' }}>
                {[
                  { label: '5만동 (2.6천원)', val: '50000' },
                  { label: '10만동 (5.3천원)', val: '100000' },
                  { label: '50만동 (2.6만원)', val: '500000' },
                  { label: '100만동 (5.3만원)', val: '1000000' },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => setVndInput(btn.val)}
                    style={{ flex: 1, padding: '8px 4px', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '12px', color: '#334155', cursor: 'pointer', textAlign: 'center' }}
                  >
                    <b>{btn.label}</b>
                  </button>
                ))}
              </div>
            </div>

            {/* 여행 가계부 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#1E293B' }}>💰 여행 누적 지출</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#DC2626' }}>{totalKRW.toLocaleString()}원</span>
              </div>
              <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="항목 (예: 야시장 식사)"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  style={{ flex: 1, padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
                <input
                  type="number"
                  placeholder="동(VND)"
                  value={expVnd}
                  onChange={(e) => setExpVnd(e.target.value)}
                  style={{ width: '90px', padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
                <button type="submit" style={{ backgroundColor: '#1E293B', color: '#FFF', border: 'none', borderRadius: '8px', padding: '0 12px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                  추가
                </button>
              </form>
              <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {expenses.map((exp) => (
                  <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '6px 0', borderBottom: '1px dashed #F1F5F9' }}>
                    <span style={{ color: '#475569' }}>{exp.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 'bold', color: '#1E293B' }}>{exp.krw.toLocaleString()}원</span>
                      <button onClick={() => setExpenses(prev => prev.filter(e => e.id !== exp.id))} style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 해외여행 준비물 체크리스트 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#1E293B' }}>🎒 해외여행 종합 준비물 체크</span>
                <span style={{ fontSize: '13px', color: '#2563EB', fontWeight: 'bold' }}>
                  {checklists.filter(c => c.checked).length} / {checklists.length} 완료
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '10px' }}>
                🔒 본인 기기에만 개별 저장되므로 자유롭게 체크하세요.
              </div>

              {/* 카테고리 필터 */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '10px' }}>
                {checklistCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCheckCategory(cat)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: checkCategory === cat ? '#2563EB' : '#E2E8F0',
                      backgroundColor: checkCategory === cat ? '#EFF6FF' : '#FFFFFF',
                      color: checkCategory === cat ? '#1D4ED8' : '#64748B',
                      fontSize: '12px',
                      fontWeight: checkCategory === cat ? 'bold' : 'normal',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 준비물 추가 */}
              <form onSubmit={handleAddChecklist} style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                <select
                  value={newCheckCat}
                  onChange={(e) => setNewCheckCat(e.target.value)}
                  style={{ width: '100px', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '12px', backgroundColor: '#FFF' }}
                >
                  <option value="서류/바우처">서류/바우처</option>
                  <option value="전자기기">전자기기</option>
                  <option value="샤워/화장">샤워/화장</option>
                  <option value="의류/잡화">의류/잡화</option>
                  <option value="상비약">상비약</option>
                  <option value="기내휴대">기내휴대</option>
                  <option value="기타/물놀이">기타/물놀이</option>
                </select>
                <input
                  type="text"
                  placeholder="추가 준비물 입력"
                  value={newCheckItem}
                  onChange={(e) => setNewCheckItem(e.target.value)}
                  style={{ flex: 1, padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
                <button type="submit" style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '8px', padding: '0 12px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                  추가
                </button>
              </form>

              {/* 리스트 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto' }}>
                {filteredChecklists.map((chk) => (
                  <div
                    key={chk.id}
                    onClick={() => handleToggleCheck(chk.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: chk.checked ? '#F8FAFC' : '#FFFFFF',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: chk.checked ? '#94A3B8' : '#1E293B', textDecoration: chk.checked ? 'line-through' : 'none' }}>
                      <span style={{ fontSize: '16px' }}>{chk.checked ? '✅' : '⬜'}</span>
                      <span style={{ fontSize: '11px', backgroundColor: '#F1F5F9', color: '#64748B', padding: '2px 6px', borderRadius: '4px' }}>
                        {chk.category}
                      </span>
                      <span>{chk.text}</span>
                    </div>
                    <button onClick={(e) => handleDeleteChecklist(chk.id, e)} style={{ border: 'none', background: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '4px', fontSize: '14px' }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. 실전 꿀팁 팝업 모달 */}
      {showTipModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', maxWidth: '440px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#0F172A' }}>💡 베트남 푸꾸옥 실전 꿀팁</span>
              <button onClick={() => setShowTipModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#64748B', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>
              <div style={{ backgroundColor: '#FEF2F2', padding: '12px', borderRadius: '12px', borderLeft: '4px solid #EF4444' }}>
                <b>💵 훼손 지폐 수취 거부 주의</b><br />
                모서리가 1mm라도 찢어지거나 낙서된 지폐는 상점에서 받지 않습니다. 거스름돈 받을 때 즉시 확인하세요!
              </div>

              <div style={{ backgroundColor: '#EFF6FF', padding: '12px', borderRadius: '12px', borderLeft: '4px solid #2563EB' }}>
                <b>💵 50만동 vs 2만동 색상 혼동 주의</b><br />
                <b>50만동(약 2.6만원)</b>과 <b>2만동(약 1천원)</b>은 둘 다 파란색이라 어두운 야시장/택시에서 착각하기 매우 쉽습니다.
              </div>

              <div style={{ backgroundColor: '#FFFBEB', padding: '12px', borderRadius: '12px', borderLeft: '4px solid #F59E0B' }}>
                <b>🚖 그랩(Grab) 호객 택시 탑승 금지</b><br />
                공항/길거리에서 "그랩? 마이 프렌드" 하며 접근하는 기사는 바가지 사기 택시입니다. 반드시 앱으로 직접 부르고 번호판을 확인하세요.
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px' }}>
                <b>🚰 식수 & 양치 수칙</b><br />
                수돗물은 석회질이 있어 절대 마시면 안 되며, 양치 시에도 제공되는 생수를 사용하시는 것이 안전합니다.
              </div>

              <div style={{ backgroundColor: '#ECFDF5', padding: '12px', borderRadius: '12px', borderLeft: '4px solid #10B981' }}>
                <b>🦁 빈펄 사파리 버스 명당</b><br />
                사파리 투어 버스 탑승 시 <b>오른쪽 좌석</b>에 앉아야 사자, 호랑이, 곰을 바로 눈앞에서 관람할 수 있습니다.
              </div>
            </div>

            <button
              onClick={() => setShowTipModal(false)}
              style={{ width: '100%', marginTop: '16px', backgroundColor: '#0F172A', color: '#FFF', padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 5. 바우처 사진 확대 모달 */}
      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}
        >
          <div style={{ maxWidth: '100%', textAlign: 'center' }}>
            <img src={previewImg} alt="바우처 원본" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '10px' }} />
            <div style={{ color: '#FFF', fontSize: '13px', marginTop: '12px' }}>화면을 터치하면 닫힙니다.</div>
          </div>
        </div>
      )}
    </div>
  );
}