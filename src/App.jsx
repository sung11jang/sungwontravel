import React, { useState, useEffect } from 'react';

// 해외여행 종합 준비물 체크리스트 (7개 카테고리)
const defaultChecklists = [
  // 1. 서류 / 바우처
  { id: 'c1', text: '여권 실물 (만료일 6개월 이상 확인)', category: '서류/바우처', checked: true },
  { id: 'c2', text: '여권 사본 및 여권용 증명사진 2매 (분실 대비)', category: '서류/바우처', checked: false },
  { id: 'c3', text: '그랩(Grab) 앱 설치 & 한국 카드 사전 등록', category: '서류/바우처', checked: true },
  { id: 'c4', text: '트래블로그 / 트래블월렛 카드 (출금 비번 확인)', category: '서류/바우처', checked: false },
  { id: 'c5', text: '비상금 달러(신권 100달러 권장) & 원화', category: '서류/바우처', checked: false },
  { id: 'c6', text: '해외여행자보험 영문 증명서 캡처본', category: '서류/바우처', checked: false },
  { id: 'c7', text: 'eSIM 등록 QR코드 / 유심 핀', category: '서류/바우처', checked: false },
  { id: 'c8', text: '왓츠앱(WhatsApp) 설치 (시쉘 기사 소통용)', category: '서류/바우처', checked: false },

  // 2. 전자기기
  { id: 'c9', text: '보조배터리 (반드시 기내 수하물 휴대)', category: '전자기기', checked: false },
  { id: 'c10', text: '스마트폰 & 스마트워치 충전 케이블', category: '전자기기', checked: false },
  { id: 'c11', text: '멀티 어댑터 (돼지코) & 초고속 멀티 충전기', category: '전자기기', checked: false },
  { id: 'c12', text: '에어팟 / 무선 이어폰 & 유선 이어폰(방전 대비)', category: '전자기기', checked: false },
  { id: 'c13', text: '셀카봉 및 삼각대', category: '전자기기', checked: false },

  // 3. 샤워 / 화장 / 미용
  { id: 'c14', text: '자외선 차단제 (선크림 SPF50+)', category: '샤워/화장', checked: false },
  { id: 'c15', text: '스킨, 로션, 수분크림 (기초 화장품)', category: '샤워/화장', checked: false },
  { id: 'c16', text: '알로에 수딩젤 (햇빛 화상 진정용)', category: '샤워/화장', checked: false },
  { id: 'c17', text: '클렌징폼 & 클렌징 오일/티슈', category: '샤워/화장', checked: false },
  { id: 'c18', text: '샴푸, 린스, 바디워시 (여행용 소용량)', category: '샤워/화장', checked: false },
  { id: 'c19', text: '칫솔 & 치약 (호텔 일회용보다 개인지참 권장)', category: '샤워/화장', checked: false },
  { id: 'c20', text: '면도기 & 빗 & 화장솜/면봉', category: '샤워/화장', checked: false },
  { id: 'c21', text: '렌즈 세척액 & 렌즈통 / 인공눈물', category: '샤워/화장', checked: false },

  // 4. 의류 / 잡화
  { id: 'c22', text: '일자별 옷 (여름 반팔, 반바지, 원피스)', category: '의류/잡화', checked: false },
  { id: 'c23', text: '속옷 & 양말 (일정 + 1~2벌 여유분)', category: '의류/잡화', checked: false },
  { id: 'c24', text: '잠옷 (편한 실내복)', category: '의류/잡화', checked: false },
  { id: 'c25', text: '얇은 바람막이 / 가디건 (기내 & 실내 에어컨 대비)', category: '의류/잡화', checked: false },
  { id: 'c26', text: '선글라스 & 자외선 차단 모자 (볼캡/버킷햇)', category: '의류/잡화', checked: false },
  { id: 'c27', text: '외출용 크로스백 / 에코백', category: '의류/잡화', checked: false },

  // 5. 상비약
  { id: 'c28', text: '지사제 & 소화제 (물갈이 및 장염 대비 필수)', category: '상비약', checked: false },
  { id: 'c29', text: '진통해열제 (타이레놀 / 이지엔6)', category: '상비약', checked: false },
  { id: 'c30', text: '종합 감기약 & 목감기약', category: '상비약', checked: false },
  { id: 'c31', text: '모기 기피제 & 버물리 (물린 뒤 바르는 약)', category: '상비약', checked: false },
  { id: 'c32', text: '방수 밴드 & 후시딘 연고', category: '상비약', checked: false },
  { id: 'c33', text: '비타민C & 유산균 & 개인 복용약', category: '상비약', checked: false },

  // 6. 비행기 기내용
  { id: 'c34', text: '목베개 & 안대 & 귀마개', category: '기내휴대', checked: false },
  { id: 'c35', text: 'OTT 영상(넷플릭스/유튜브) & 음악 오프라인 다운로드', category: '기내휴대', checked: false },
  { id: 'c36', text: '기내용 겉옷 / 수면양말', category: '기내휴대', checked: false },
  { id: 'c37', text: '볼펜 1자루 (세관신고서 작성용)', category: '기내휴대', checked: false },
  { id: 'c38', text: '소독티슈 & 물티슈 & 립밤/미스트', category: '기내휴대', checked: false },

  // 7. 기타 / 물놀이
  { id: 'c39', text: '샤워기 필터 & 비타민 리필 (푸꾸옥 수질 민감 대비)', category: '기타/물놀이', checked: false },
  { id: 'c40', text: '스마트폰 방수팩 (물 속 터치 작동 확인)', category: '기타/물놀이', checked: false },
  { id: 'c41', text: '수영복 / 래시가드 & 아쿠아슈즈', category: '기타/물놀이', checked: false },
  { id: 'c42', text: '물안경 / 스노클링 장비 & 튜브', category: '기타/물놀이', checked: false },
  { id: 'c43', text: '젖은 빨래용 지퍼백 여유분 & 비닐봉지', category: '기타/물놀이', checked: false },
  { id: 'c44', text: '손톱깎이 & 접이식 우산 (양산 겸용)', category: '기타/물놀이', checked: false },
  { id: 'c45', text: '비상용 컵라면 & 볶음김치/간식', category: '기타/물놀이', checked: false },
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
  { id: 's1', day: 'day1', time: '02:30', title: '인천공항 T1 도착 및 장기주차장 주차', type: 'CAR', location: '인천공항 제1여객터미널 장기주차장', memo: 'P1/P2 주차타워 추천 (심야 셔틀 미운행/도보 10분)' },
  { id: 's2', day: 'day1', time: '05:00', title: '비엣젯 VJ977 탑승 (인천 T1 ➔ 푸꾸옥)', type: 'FLIGHT', location: '인천국제공항 제1여객터미널', memo: '05:00 출발 (위탁 수하물 20kg 포함)[cite: 2]' },
  { id: 's3', day: 'day1', time: '08:50', title: '푸꾸옥 공항 도착 ➔ [예약완료] 시쉘 무료 픽업 미팅', type: 'CAR', location: 'Phu Quoc International Airport', memo: '국제선 출구 Seashells 피켓 기사 미팅 (+84 786 920 789)' },
  { id: 's4', day: 'day1', time: '10:00', title: '모닝 마사지 & 짐보관 (또는 시쉘 호텔 짐보관)', type: 'HOTEL', location: '푸꾸옥 시내 마사지샵', memo: '마사지 후 짐 맡기고 북부 투어 출발' },
  { id: 's5', day: 'day1', time: '11:30', title: '북부 빈펄 사파리(Safari) 투어', type: 'PLACE', location: 'Vinpearl Safari Phu Quoc', memo: '사파리 버스 탑승 & 기린 레스토랑' },
  { id: 's6', day: 'day1', time: '15:30', title: '시쉘 푸꾸옥 체크인 ➔ [현장예약필요] 귀국/체크아웃 셔틀 예약', type: 'HOTEL', location: 'Seashells Phu Quoc Hotel & Spa', memo: '⚠️ 체크인 시 프런트에 12/14 체크아웃 셔틀 사전 예약 필수[cite: 3, 4]' },
  { id: 's7', day: 'day1', time: '18:30', title: '저녁식사: 중부 베트남 가정식 맛집 [메오키친]', type: 'RESTAURANT', location: 'Meo Kitchen Phu Quoc', memo: '쌀국수, 반쎄오, 분짜 추천' },
  { id: 's8', day: 'day1', time: '20:00', title: '즈엉동 야시장 산책 & 킹콩마트 쇼핑', type: 'PLACE', location: 'Phu Quoc Night Market', memo: '도보 이동 가능 (망고 & 슈슈 땅콩)' },

  // Day 2
  { id: 's9', day: 'day2', time: '09:30', title: '북부 그랜드월드 / 빈원더스 / 아쿠아리움', type: 'PLACE', location: 'Grand World Phu Quoc', memo: '베니스 수상도시 & 초대형 아쿠아리움' },
  { id: 's10', day: 'day2', time: '14:00', title: '시쉘 호텔 수영장 휴식 & 리조트 힐링', type: 'HOTEL', location: 'Seashells Phu Quoc Hotel & Spa', memo: '인피니티 풀 바다 전망 휴식' },
  { id: 's11', day: 'day2', time: '18:00', title: '저녁식사: 중부 시푸드 강추 맛집 [빈산]', type: 'RESTAURANT', location: 'Binh San Seafood Phu Quoc', memo: '랍스터, 맛조개, 치즈새우 바비큐' },

  // Day 3
  { id: 's12', day: 'day3', time: '11:00', title: '시쉘 체크아웃 ➔ 남부 라페스타 힐튼 이동', type: 'CAR', location: 'La Festa Phu Quoc, Curio Collection by Hilton', memo: '그랩 7인승 호출 또는 호텔 차량 (약 35분 소요)' },
  { id: 's13', day: 'day3', time: '14:30', title: '남부 사오비치(Sao Beach) 에메랄드 해변 휴양', type: 'PLACE', location: 'Sao Beach Phu Quoc', memo: '새하얀 모래사장 & 코코넛 스무디' },
  { id: 's14', day: 'day3', time: '18:30', title: '저녁식사: 남부 맛집 [하이봇 Hibot] 스테이크', type: 'RESTAURANT', location: 'Hibot Restaurant Sunset Town', memo: '⚠️ 3개 하이봇 중 반드시 스테이크 판매 지점으로 방문!' },

  // Day 4
  { id: 's15', day: 'day4', time: '09:30', title: '남부 혼똔섬 해상 케이블카 & 아쿠아토피아 워터파크', type: 'PLACE', location: 'Hon Thom Cable Car Station', memo: '세계 최장 해상 케이블카' },
  { id: 's16', day: 'day4', time: '17:00', title: '선셋타운 산책 & 키스 브릿지(Kiss Bridge) 노을', type: 'PLACE', location: 'Kiss Bridge Phu Quoc', memo: '남부 일몰 명소 포토존' },
  { id: 's17', day: 'day4', time: '19:30', title: '키스 오브 더 씨(Kiss of the Sea) 불꽃쇼 & 심포니 물쇼', type: 'PLACE', location: 'Sunset Town Phu Quoc', memo: '남부 필수 야간 멀티미디어 불꽃 분수쇼' },

  // Day 5
  { id: 's18', day: 'day5', time: '12:00', title: '라페스타 힐튼 체크아웃 & 프런트 무료 짐보관', type: 'HOTEL', location: 'La Festa Phu Quoc, Curio Collection by Hilton', memo: '체크아웃 후 짐 무료 보관 가능[cite: 9]' },
  { id: 's19', day: 'day5', time: '14:00', title: '선셋타운 감성 카페 & 기념품 쇼핑', type: 'PLACE', location: 'Sunset Town Phu Quoc', memo: '마지막 남부 힐링 & 카페 타임' },
  { id: 's20', day: 'day5', time: '18:00', title: '공항 샌딩 (힐튼 유료 밴 [사전예약필요] 또는 그랩 7인승)', type: 'CAR', location: 'Phu Quoc International Airport', memo: '호텔 16인승 밴(136만동)은 사전예약 필수 / 또는 그랩 7인승 호출' },
  { id: 's21', day: 'day5', time: '20:45', title: '비엣젯 VJ976 푸꾸옥(PQC) 출발 ➔ 인천행', type: 'FLIGHT', location: 'Phu Quoc International Airport', memo: '20:45 출발 (12/17 목 04:00 인천 T1 도착)[cite: 2]' },
  { id: 's22', day: 'day5', time: '04:00', title: '인천공항 T1 도착 & 장기주차장 출차', type: 'CAR', location: '인천국제공항 제1여객터미널 장기주차장', memo: '무인 정산기 결제 후 안전 귀가' },
];

const initialDocs = [
  {
    id: 'd_transfer_guide',
    category: '호텔/셔틀',
    title: '🚐 전 구간 픽업 / 샌딩 / 이동 예약 가이드',
    code: '사전 예약 여부 총정리',
    memo: '1️⃣ [12/12 입국 픽업: ✅예약완료]: 푸꾸옥 공항 ➔ 시쉘 (무료 픽업 확정 / 피켓 기사: +84 786 920 789)\n2️⃣ [12/14 체크아웃 셔틀: ⚠️현장예약필요]: 시쉘 ➔ 시내 이동 시 체크인할 때 프런트에 예약 필수\n3️⃣ [12/14 호텔 간 이동: 🚗당일호출]: 시쉘 ➔ 라페스타 힐튼 (그랩 7인승 또는 택시, 약 35분)\n4️⃣ [12/16 출국 샌딩: ⚠️사전예약/유료]: 힐튼 ➔ 공항 (무료셔틀 없음. 호텔 16인승 밴 1,360,800 VND 이용 시 항공편 사전 회신 필요, 또는 그랩 7인승 호출)',
    imgUrl: '',
    rawEmail: ''
  },
  {
    id: 'd_flight_tickets',
    category: '항공권',
    title: '✈️ 비엣젯 항공 왕복 E-티켓 (5인)',
    code: '예약번호 1400828892050635[cite: 1, 2]',
    memo: '• 출국(VJ977): 12/12(토) 05:00 ICN T1 ➔ 08:50 PQC[cite: 2]\n• 귀국(VJ976): 12/16(수) 20:45 PQC ➔ 12/17 04:00 ICN T1[cite: 2]\n• 수하물: 1인당 위탁 20kg + 기내 7kg[cite: 2]',
    imgUrl: '',
    rawEmail: ''
  },
  {
    id: 'd_seashells_room',
    category: '호텔/셔틀',
    title: '🏨 시쉘 푸꾸옥 호텔 & 스파 (12/12 ~ 12/14)',
    code: '체크인 15:00 / 야시장&마사지 도보권[cite: 3, 4]',
    memo: '• 룸1 (3인): Agoda #1764447810 (Twin Ocean View / 조식3인)[cite: 6]\n• 룸2 (2인): Trip.com #1400828467787978 (King City View / 조식2인)[cite: 3, 4]\n• 픽업 기사: +84 786 920 789 / 📞 숙소: +84 297 7300 999[cite: 6]',
    imgUrl: '',
    rawEmail: ''
  },
  {
    id: 'd_lafesta_info',
    category: '호텔/셔틀',
    title: '🏨 라페스타 푸꾸옥 힐튼 (12/14 ~ 12/16)',
    code: '체크인 15:00 / 선셋타운 위치[cite: 9, 10]',
    memo: '• 룸1 (3인): Agoda #1764537797 (King Capri Terrace / 조식3인)[cite: 7]\n• 룸2 (2인): Trip.com #1400828468433911 (King Classico / 조식2인)[cite: 9, 10]\n• 짐 보관: 12/16 체크아웃 후 당일 리셉션 무료 보관 가능[cite: 9]\n• 샌딩: 유료 16인승 밴 편도 136만동 (사전예약) / 📞 +84 297 3525 555',
    imgUrl: '',
    rawEmail: ''
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDay, setSelectedDay] = useState('day1');
  const [checkCategory, setCheckCategory] = useState('전체');
  
  const [items, setItems] = useState(initialSchedules);
  const [docs, setDocs] = useState(initialDocs);
  const [expenses, setExpenses] = useState([
    { id: 'e1', title: '비엣젯 항공권 (5인 왕복 총액)', vnd: 59070000, krw: 2953500 },
    { id: 'e2', title: '인천공항 5일 장기주차비 (준중형 SUV)', vnd: 900000, krw: 45000 },
  ]);

  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem('my_personal_checklists_v14');
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

  const [emailText, setEmailText] = useState('');
  const [docCategory, setDocCategory] = useState('호텔/셔틀');
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
    localStorage.setItem('my_personal_checklists_v14', JSON.stringify(checklists));
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

    if (text.includes('식당') || text.includes('밥') || text.includes('저녁') || text.includes('점심') || text.includes('야시장') || text.includes('카페') || text.includes('먹기') || text.includes('빈산') || text.includes('메오키친') || text.includes('하이봇')) type = 'RESTAURANT';
    else if (text.includes('호텔') || text.includes('체크인') || text.includes('체크아웃') || text.includes('리조트') || text.includes('숙소') || text.includes('씨쉘') || text.includes('힐튼')) type = 'HOTEL';
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
    <div style={{ maxWidth: '460px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif', borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. 상단 브리핑 HUD */}
      <header style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '16px 18px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#38BDF8', backgroundColor: 'rgba(56,189,248,0.15)', padding: '3px 8px', borderRadius: '6px' }}>
            푸꾸옥 4박 5일 가족 여행 🌴
          </span>
          <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 'bold' }}>
            ● 실시간 연동
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

        {/* 날씨 바 */}
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

        {/* 환율 공식 & 예시 바 */}
        <div style={{ marginTop: '8px', backgroundColor: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.3)', padding: '7px 10px', borderRadius: '8px', fontSize: '11px', color: '#E0F2FE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>💡 <b>간이 공식:</b> VND ÷ 20 ≈ 원화</span>
          <span style={{ color: '#38BDF8', fontWeight: 'bold' }}>예: 10만 동 ≈ 5,000원</span>
        </div>

        {/* 크로스체크 주의사항 */}
        <div style={{ marginTop: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', color: '#FECACA', textAlign: 'center' }}>
          ⚠️ <b>크로스체크 필수:</b> 항공·호텔·셔틀 정보는 변동될 수 있으니 원본 바우처와 재확인하세요.
        </div>
      </header>

      {/* 2. 5개 탭 네비게이션 */}
      <nav style={{ display: 'flex', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 10 }}>
        {[
          { id: 'schedule', label: '일정', icon: '📅' },
          { id: 'route', label: '권역/동선', icon: '🗺️' },
          { id: 'docs', label: '바우처/주차', icon: '🎫' },
          { id: 'tips', label: '실전꿀팁', icon: '💡' },
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

      {/* 3. 메인 콘텐츠 영역 */}
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        
        {/* TAB 1: 일정표 */}
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

            {/* AI 대충 입력 스마트 정리창 */}
            <form onSubmit={handleSmartAddSchedule} style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B' }}>✨ AI 대충 입력 스마트 정리</span>
                <span style={{ fontSize: '10px', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>자연어 분석</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="예: 저녁 7시 메오키친 쌀국수 / 13일 아침 9시 케이블카"
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

            {/* 일정 목록 */}
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

        {/* TAB 2: 여행 권역 및 동선도 */}
        {activeTab === 'route' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: '#FFF', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '11px', opacity: 0.85, fontWeight: 'bold' }}>PHU QUOC TRAVEL ROUTE MAP</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px' }}>푸꾸옥 북부 ➔ 중부 ➔ 남부 권역별 이동 동선도</div>
              <div style={{ fontSize: '12px', marginTop: '6px', opacity: 0.9 }}>
                💡 시간대별 상세 일정과 예약 바우처는 <b>[일정]</b> 및 <b>[바우처/주차]</b> 탭에서 확인하세요.
              </div>
            </div>

            {/* 권역별 인터랙티브 다이어그램 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B', marginBottom: '12px', textAlign: 'center' }}>
                🧭 푸꾸옥 핵심 권역 동선 구조도
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                
                {/* 1. 북부 */}
                <div style={{ backgroundColor: '#ECFDF5', border: '2px solid #10B981', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b style={{ color: '#065F46', fontSize: '13px' }}>🌲 [북부 권역] 테마파크 & 사파리</b>
                    <span style={{ fontSize: '10px', backgroundColor: '#A7F3D0', color: '#065F46', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>차량 45~50분</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#047857', marginTop: '4px' }}>
                    • <b>동선:</b> 빈펄 사파리(기린식당) ➔ 빈원더스 ➔ 아쿠아리움 ➔ 그랜드월드
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '12px', fontWeight: 'bold' }}>
                  ⬇️ (그랩 택시 약 45분 / 빈버스 무료셔틀) ⬇️
                </div>

                {/* 2. 중부 */}
                <div style={{ backgroundColor: '#EFF6FF', border: '2px solid #2563EB', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b style={{ color: '#1E40AF', fontSize: '13px' }}>🏙️ [중부 권역] 시내 & 숙소 (씨쉘 리조트)</b>
                    <span style={{ fontSize: '10px', backgroundColor: '#BFDBFE', color: '#1E40AF', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>공항 15분</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#1D4ED8', marginTop: '4px' }}>
                    • <b>동선:</b> 푸꾸옥 공항 ➔ 씨쉘 호텔 ➔ 즈엉동 야시장(도보) ➔ 맛집(메오키친/빈산)
                  </div>
                </div>

                <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '12px', fontWeight: 'bold' }}>
                  ⬇️ (그랩 7인승 대형 택시 약 35분 / 호텔 유료 밴) ⬇️
                </div>

                {/* 3. 남부 */}
                <div style={{ backgroundColor: '#FFF7ED', border: '2px solid #F97316', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b style={{ color: '#9A3412', fontSize: '13px' }}>🌊 [남부 권역] 볼거리 중심 & 숙소 (라페스타 힐튼)</b>
                    <span style={{ fontSize: '10px', backgroundColor: '#FED7AA', color: '#9A3412', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>공항 25~30분</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#C2410C', marginTop: '4px' }}>
                    • <b>동선:</b> 라페스타 힐튼 ➔ 사오비치 ➔ 혼똔섬 케이블카 ➔ 선셋타운(키스브릿지 노을/불꽃쇼)
                  </div>
                </div>
              </div>
            </div>

            {/* 권역 간 이동 가이드 요약 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>
                ⏱️ 권역 간 이동 시간 & 이동 수단
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155', lineHeight: '1.5' }}>
                <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: '8px', borderLeft: '3px solid #2563EB' }}>
                  <b>• 공항 ➔ 씨쉘(중부):</b> 약 15~20분 (호텔 무료 픽업 셔틀 확정)
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: '8px', borderLeft: '3px solid #10B981' }}>
                  <b>• 중부 ➔ 북부(사파리):</b> 약 45~50분 (그랩 호출 또는 무료 빈버스 이용)
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: '8px', borderLeft: '3px solid #F97316' }}>
                  <b>• 중부 ➔ 남부(라페스타 힐튼):</b> 약 35분 (5인 가족 그랩 7인승 대형 택시 추천)
                </div>
                <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: '8px', borderLeft: '3px solid #EF4444' }}>
                  <b>• 남부(힐튼) ➔ 공항:</b> 약 25~30분 (호텔 16인승 밴 사전예약 또는 그랩 호출)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 바우처/주차 (공항 주차 메모 및 바우처 통합) */}
        {activeTab === 'docs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* 인천공항 T1 주차 메모 및 셔틀 카드 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B' }}>🚗 인천공항 T1 장기주차 (준중형 SUV)</span>
                <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 'bold' }}>5일 45,000원</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={myCarLocation}
                  onChange={(e) => setMyCarLocation(e.target.value)}
                  placeholder="예: 장기 P2 주차타워 2층 B구역"
                  style={{ flex: 1, padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
                <button
                  onClick={() => { setParkingSavedMsg(true); setTimeout(() => setParkingSavedMsg(false), 2000); }}
                  style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '8px', padding: '0 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  저장
                </button>
              </div>
              {parkingSavedMsg && <div style={{ fontSize: '11px', color: '#059669', fontWeight: 'bold', marginBottom: '8px' }}>✅ 주차 위치가 안전하게 저장되었습니다.</div>}
              
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', fontSize: '11px', color: '#475569', lineHeight: '1.5' }}>
                • <b>T1 무료 순환셔틀:</b> 04:30 ~ 24:00 (8~16분 간격 운행)<br />
                • <b>🚨 심야(00:00~04:30) 셔틀 미운행:</b> 05:00 비행기(02:30 공항도착) 시 도보 이동이 용이한 P1/P2 주차타워 주차를 권장합니다.
              </div>
            </div>

            {/* 예약 바우처 리스트 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B' }}>📋 내 보관함 & 호텔/항공 바우처</div>
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

            {/* 신규 바우처 등록창 */}
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
          </div>
        )}

        {/* TAB 4: 실전꿀팁 (베트남 & 푸꾸옥 현지 여행 완벽 가이드) */}
        {activeTab === 'tips' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div style={{ background: 'linear-gradient(135deg, #065F46, #059669)', color: '#FFF', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '11px', opacity: 0.85, fontWeight: 'bold' }}>VIETNAM & PHU QUOC LOCAL GUIDE</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px' }}>베트남 푸꾸옥 실전 100% 꿀팁 백과</div>
              <div style={{ fontSize: '12px', marginTop: '6px', opacity: 0.9 }}>
                현지에서 당황하지 않고 알뜰하고 안전하게 여행하는 핵심 노하우입니다.
              </div>
            </div>

            {/* 1. 화폐 및 환전 꿀팁 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>
                💵 화폐 & 환전 & 팁(Tip) 문화
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                <div style={{ backgroundColor: '#FEF2F2', padding: '10px 12px', borderRadius: '8px', borderLeft: '4px solid #EF4444' }}>
                  <b>• 훼손 지폐 수취 거부:</b> 베트남은 모서리가 1mm라도 찢어지거나 낙서된 지폐는 상점에서 받지 않습니다. 거스름돈을 받을 때 바로 확인하세요.
                </div>
                <div style={{ backgroundColor: '#EFF6FF', padding: '10px 12px', borderRadius: '8px', borderLeft: '4px solid #2563EB' }}>
                  <b>• 지폐 색상 혼동 주의:</b> <b>50만 동(약 2.6만 원)</b>과 <b>2만 동(약 1천 원)</b>은 둘 다 파란색 계열이라 어두운 야시장/택시에서 착각하기 매우 쉽습니다!
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px' }}>
                  <b>• 베트남 매너 팁 기준:</b><br />
                  - 마사지: 60분 5만 동(약 2,500원) / 90분 7~10만 동(약 3,500~5,000원)<br />
                  - 호텔 벨보이/하우스키핑: 2만~5만 동(약 1,000~2,500원)
                </div>
              </div>
            </div>

            {/* 2. 교통 & 그랩(Grab) 안전 수칙 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>
                🚖 교통 & 그랩(Grab) 호객 방지
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                <div style={{ backgroundColor: '#FFFBEB', padding: '10px 12px', borderRadius: '8px', borderLeft: '4px solid #F59E0B' }}>
                  <b>• 호객 택시 탑승 절대 금지:</b> 공항/야시장에서 "그랩? 마이 프렌드" 하며 타라는 기사는 미터기 조작 바가지 사기 택시입니다.
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px' }}>
                  <b>• 그랩 이용 팁:</b> 한국에서 카드를 미리 등록해두면 현금 잔돈 실랑이 없이 하차 시 자동 결제되어 매우 안전합니다. 탑승 전 반드시 앱의 <b>차량 번호판</b>을 확인하세요.
                </div>
              </div>
            </div>

            {/* 3. 수질 & 식수 안전 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>
                🚰 식수 & 수질 안전 수칙
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                <div>• 호텔 수돗물은 석회질과 배관 노후화로 인해 <b>음용 불가</b>입니다.</div>
                <div>• 양치질을 할 때도 생수(무료 제공 생수)를 사용하시는 것을 권장합니다.</div>
                <div>• 피부가 예민한 가족이 있다면 <b>샤워기 필터</b>를 챙겨가면 안심하고 씻을 수 있습니다.</div>
              </div>
            </div>

            {/* 4. 푸꾸옥 투어 & 쇼핑 공략 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>
                🦁 푸꾸옥 투어 & 쇼핑 명당 공략
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
                <div style={{ backgroundColor: '#ECFDF5', padding: '10px 12px', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
                  <b>• 빈펄 사파리 버스 명당:</b> 사파리 전용 버스 탑승 시 <b>오른쪽 좌석</b>에 앉아야 사자, 호랑이, 곰 등 맹수들을 바로 눈앞에서 관람할 수 있습니다.
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px' }}>
                  <b>• 기린 레스토랑:</b> 오전 일찍 방문해야 기린들이 배부르기 전에 먹이(바나나/당근)를 적극적으로 받아먹습니다.
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px' }}>
                  <b>• 킹콩마트 쇼핑 추천:</b> 푸꾸옥 특산 <b>통후추</b>, <b>슈슈 땅콩</b>, <b>체리쉬 망고 젤리</b>, <b>코코넛 카푸치노 커피(ARCHCAFE)</b>가 가성비 선물 1순위입니다.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 예산/준비 (종합 7대 카테고리 체크리스트) */}
        {activeTab === 'tools' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* 정밀 실시간 환율 계산기 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B' }}>💱 정밀 실시간 환율 계산기</span>
                <span style={{ fontSize: '10px', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                  1 VND ≈ {(exchangeRate).toFixed(4)} KRW
                </span>
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
                  {Math.round((Number(vndInput) || 0) * exchangeRate).toLocaleString()} 원
                </span>
              </div>
              
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                (간이 공식 ÷ 20 적용 시: 약 {Math.round((Number(vndInput) || 0) / 20).toLocaleString()} 원)
              </div>

              <div style={{ display: 'flex', gap: '6px', marginTop: '10px', overflowX: 'auto' }}>
                {[
                  { label: '5만 동', val: '50000' },
                  { label: '10만 동', val: '100000' },
                  { label: '50만 동', val: '500000' },
                  { label: '100만 동', val: '1000000' },
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

            {/* 가계부 지출 내역 */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
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

            {/* 해외여행 종합 준비물 체크리스트 (카테고리 필터 탑재) */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E293B' }}>🎒 해외여행 종합 준비물 체크</span>
                <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 'bold' }}>
                  {checklists.filter(c => c.checked).length} / {checklists.length} 완료
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '10px' }}>
                🔒 본인 기기에만 개별 저장되므로 자유롭게 체크하세요.
              </div>

              {/* 카테고리 필터 탭 */}
              <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '10px' }}>
                {checklistCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCheckCategory(cat)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: checkCategory === cat ? '#2563EB' : '#E2E8F0',
                      backgroundColor: checkCategory === cat ? '#EFF6FF' : '#FFFFFF',
                      color: checkCategory === cat ? '#1D4ED8' : '#64748B',
                      fontSize: '11px',
                      fontWeight: checkCategory === cat ? 'bold' : 'normal',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 준비물 추가 폼 */}
              <form onSubmit={handleAddChecklist} style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                <select
                  value={newCheckCat}
                  onChange={(e) => setNewCheckCat(e.target.value)}
                  style={{ width: '95px', padding: '7px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '11px', backgroundColor: '#FFF' }}
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
                  style={{ flex: 1, padding: '7px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '12px' }}
                />
                <button type="submit" style={{ backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', padding: '0 10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  추가
                </button>
              </form>

              {/* 준비물 체크 목록 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto' }}>
                {filteredChecklists.map((chk) => (
                  <div
                    key={chk.id}
                    onClick={() => handleToggleCheck(chk.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      backgroundColor: chk.checked ? '#F8FAFC' : '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #F1F5F9',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: chk.checked ? '#94A3B8' : '#1E293B', textDecoration: chk.checked ? 'line-through' : 'none' }}>
                      <span>{chk.checked ? '✅' : '⬜'}</span>
                      <span style={{ fontSize: '10px', backgroundColor: '#F1F5F9', color: '#64748B', padding: '2px 5px', borderRadius: '4px' }}>
                        {chk.category}
                      </span>
                      <span>{chk.text}</span>
                    </div>
                    <button onClick={(e) => handleDeleteChecklist(chk.id, e)} style={{ border: 'none', background: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '2px' }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 바우처 사진 확대 모달 */}
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