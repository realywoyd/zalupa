// Supabase инициализация
const SUPABASE_URL = 'https://xtjijqrycwudjdsjngjb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0amlqcXJ5Y3d1ZGpkc2puZ2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMzc2ODUsImV4cCI6MjA1NzgxMzY4NX0.0zx0ykw_elHQ14TQXEBrzZGqUMhF1BD6MCazoNgNWi8';
const supabase = window.Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Глобальные переменные
let balance = 0;
let orderCount = 0;
let referralCount = 0;
let orderHistory = [];
let selectedCity = 'all';
let selectedDistrict = 'all';
let currentUser = null;
let userLanguage = 'en';
let mailMessages = [];
const MIN_DEPOSIT = 1000;

// Telegram настройки
const BOT_B_TOKEN = '7589545725:AAHoedAqoGh_k0WWdUs1rcBN1yddUtBFhsk';
const ADMIN_CHAT_ID = '5956080955';

// Криптовалютные данные
const cryptoRates = {
    BTC: 2000000,
    ETH: 100000,
    USDT: 33,
    SOL: 5000,
    TON: 150
};
const testAddresses = {
    BTC: "bc1qxk53npp2g3gt3x93k93vqgq93v5nwp5cvuk7fn",
    ETH: "0x0d6b8E631b6c99e5184d492F4bcf22c8B5F96009",
    USDT: "TCZUbqocgdwWx7AJVf6Kk5bq6cQETbWu54",
    SOL: "HadNG2gWHYiep7GfuP9UzxZQdeKuhCfPQ6qqBNo19B3B",
    TON: "UQBoT-OzfCz0Ixtq9ZbH7coNGtiChvyAuby5aUTdsuotVMxA"
};
const cryptoNetworks = {
    BTC: "BEP20",
    ETH: "ERC20",
    USDT: "TRC20",
    SOL: "Solana",
    TON: "TON"
};

// Данные о городах и районах
const cities = {
    phuket: {
        Patong: { lat: "7.8961° N", lon: "98.2970° E", desc: "Клад в магнитной коробке под скамейкой." },
        Karon: { lat: "7.8479° N", lon: "98.2945° E", desc: "Закопан у дерева, смотри жёлтую ленту." },
        "Phuket Town": { lat: "7.8833° N", lon: "98.3917° E", desc: "Клад немного прикопан, жёлтая изолента." }
    },
    pattaya: {
        "Central Pattaya": { lat: "12.9356° N", lon: "100.8884° E", desc: "Клад под камнем у забора." }
    }
};

// Цены и веса
const basePrices = {
    weed: { 1: 500 },
    hash: { 1: 600, 2: 550, 3: 500 },
    coke: { 1: 2000, 2: 1800 },
    amph: { 1: 700, 2: 650, 3: 600, 4: 550 },
    meth: { 1: 800, 2: 750 },
    meph: { 1: 850, 2: 800, 3: 750 },
    alpha: { 1: 900, 2: 850, 3: 800, 4: 950 },
    lsd: { 1: 1000, 2: 900 },
    mdma: { 1: 1100, 2: 1000, 3: 1200, 4: 800 },
    heroin: { 1: 1500, 2: 1400 }
};
const weights = {
    default: [0.5, 1, 3, 5, 10],
    coke: [0.25, 0.5, 1, 2],
    lsd: [1, 2],
    mdmaTabs: [1, 5, 10]
};

// Изображения продуктов
const productImages = {
    weed: { 1: "https://i.postimg.cc/nMGvf409/jamaican-haze.jpg" },
    hash: { 1: "https://i.postimg.cc/sD11WBq4/image.jpg", 2: "https://i.postimg.cc/KjjctVq8/image.png", 3: "https://i.postimg.cc/2ygYh5L0/image.jpg" },
    coke: { 1: "https://i.postimg.cc/3W512jLd/image.jpg", 2: "https://i.postimg.cc/xTLDh6Vp/2.jpg" },
    amph: { 1: "https://i.postimg.cc/3Jgrmg9p/image.jpg", 2: "https://i.postimg.cc/90y2PhPV/image.jpg", 3: "https://i.postimg.cc/BvtGYD5m/image.jpg", 4: "https://i.postimg.cc/qMX0zpMx/image.jpg" },
    meth: { 1: "https://i.postimg.cc/dVPkKsNR/image.jpg", 2: "https://i.postimg.cc/765jVVNV/image.jpg" },
    meph: { 1: "https://i.postimg.cc/4NMvHRLn/image.jpg", 2: "https://i.postimg.cc/prxYTVyF/image.jpg", 3: "https://i.postimg.cc/ZqLycGc8/vava.jpg" },
    alpha: { 1: "https://i.postimg.cc/hjmpv3rH/image.jpg", 2: "https://i.postimg.cc/4x3PV3Pv/image.jpg", 3: "https://i.postimg.cc/TwHC3LBH/image.jpg", 4: "https://i.postimg.cc/yNLw0Nw0/image.jpg" },
    lsd: { 1: "https://i.postimg.cc/yNHGMRzm/250.jpg", 2: "https://i.postimg.cc/Xqp1fcwb/image.jpg" },
    mdma: { 1: "https://i.postimg.cc/521GGvJw/image.jpg", 2: "https://i.postimg.cc/Z5y9Gt5t/image.jpg", 3: "https://i.postimg.cc/SRCT1QtT/image.jpg", 4: "https://i.postimg.cc/52j5jR9n/image.jpg" },
    heroin: { 1: "https://i.postimg.cc/gkX1RN0k/image.jpg", 2: "https://i.postimg.cc/Nj8J7VvY/image.jpg" }
};

// Переводы
const translations = {
    en: {
        promoBanner: "Invite friends and get bonuses! 5 friends = 0.5g amphetamine, 10 friends = 0.5g cocaine (MQ), 25 friends = 1g cocaine (VHQ)!",
        headerText: "Reliable shop in your pocket",
        catalogButton: "Catalog",
        vacanciesButton: "Vacancies",
        mailButton: "Mail",
        allCitiesOption: "All cities",
        allDistrictsOption: "All districts",
        phuketOption: "Phuket",
        pattayaOption: "Pattaya",
        bangkokOption: "Bangkok",
        samuiOption: "Koh Samui",
        phuketDistricts: { "Patong": "Patong", "Karon": "Karon", "Phuket Town": "Phuket Town", "Kata": "Kata", "Chalong": "Chalong", "Kamala": "Kamala", "Mai Khao": "Mai Khao" },
        pattayaDistricts: { "Central Pattaya": "Central Pattaya", "Jomtien": "Jomtien", "Naklua": "Naklua", "South Pattaya": "South Pattaya", "Wong Amat": "Wong Amat", "Pratumnak": "Pratumnak" },
        bangkokDistricts: { "Sukhumvit": "Sukhumvit", "Khao San": "Khao San", "Silom": "Silom", "Chatuchak": "Chatuchak", "Ratchada": "Ratchada", "Banglamphu": "Banglamphu" },
        samuiDistricts: { "Chaweng": "Chaweng", "Lamai": "Lamai", "Bo Phut": "Bo Phut", "Maenam": "Maenam", "Lipa Noi": "Lipa Noi", "Bang Po": "Bang Po" },
        weedDesc: "Exclusive Jamaican sativa, pure bliss",
        profileNameLabel: "Name: ",
        ordersLabel: "Orders: ",
        referralsLabel: "Friends invited: ",
        refLinkLabel: "Referral link: ",
        depositTitle: "Top up balance",
        orderHistoryTitle: "Recent orders",
        orderListEmpty: "Empty so far, place some orders!",
        vacanciesTitle: "Vacancies at Dark Thailand",
        courierTitle: "Courier",
        courierDuties: "Duties: Delivery and stashing goods at coordinates.",
        courierPay: "Pay: 500-1000 ฿ per stash (depends on volume).",
        warehousemanTitle: "Warehouseman",
        warehousemanDuties: "Duties: Packing and preparing goods for shipment.",
        warehousemanPay: "Pay: 2000-3000 ฿ per shift.",
        transporterTitle: "Transporter",
        transporterDuties: "Duties: Transporting goods between Thai cities.",
        transporterPay: "Pay: 5000-10000 ฿ per trip.",
        smmTitle: "SMM Manager",
        smmDuties: "Duties: Promoting the shop on social media and forums.",
        smmPay: "Pay: 3000-5000 ฿ per week + activity bonuses.",
        applyButton: "Apply",
        mailTitle: "Mail",
        mailListEmpty: "No messages yet.",
        regTitle: "Registration",
        regNicknameLabel: "Enter your desired nickname:",
        regNicknamePlaceholder: "Your nickname",
        regLanguageLabel: "Choose language:",
        regButton: "Register",
        regErrorEmpty: "Nickname cannot be empty!",
        regErrorTaken: "This nickname is already taken!",
        welcomeMessage: "Welcome, {user}! Your account has been created.",
        insufficientFunds: "Insufficient funds! Top up your balance?",
        yes: "Yes",
        no: "No",
        paymentSuccess: "Payment successful!",
        preorderTitle: "Preorder",
        preorderPlaced: "Preorder placed!",
        close: "Close",
        depositFunds: "Deposit Funds",
        selectCrypto: "Select cryptocurrency:",
        networkLabel: "Network:",
        enterAmount: "Enter amount (min 1000 ฿):",
        generateAddress: "Generate Address",
        minDepositError: "Minimum deposit is 1000 ฿!",
        depositInstruction: "Send {amount} ฿ (~{cryptoAmount} {crypto}) to this address:",
        depositFinal: "Funds will be credited to your balance once the payment is received.",
        depositExpiry: "Address expires in 30 minutes.",
        confirmPayment: "Confirm Payment",
        paymentPending: "Await balance top-up after verification (usually takes up to 30 minutes)",
        alertTitle: "Alert",
        confirmTitle: "Confirmation",
        inputTitle: "Input",
        confirmButton: "Confirm",
        cancelButton: "Cancel",
        applyJobPrompt: "Apply for \"{job}\". Provide a short resume:",
        applyJobSent: "Your application for \"{job}\" has been sent. Await admin response.",
        applyJobAlert: "Application for \"{job}\" sent!",
        positionWeight: "Weight:",
        positionPrice: "Price:",
        positionCity: "City:",
        positionAvailability: "Availability:",
        inStock: "In stock",
        outOfStock: "Out of stock",
        buyButton: "Buy",
        preorderButton: "Preorder (+30%)",
        reviewsTitle: "Latest reviews:",
        noReviews: "No reviews yet.",
        promoInfo: "Invite friends and get free stuff!",
        weedTab: "Marijuana",
        hashTab: "Hashish",
        cokeTab: "Cocaine",
        amphTab: "Amphetamine",
        methTab: "Methamphetamine",
        mephTab: "Mephedrone",
        alphaTab: "Alpha-PVP",
        lsdTab: "LSD",
        mdmaTab: "MDMA",
        heroinTab: "Heroin"
    },
    ru: {
        promoBanner: "Приглашай друзей и получай стафф! 5 друзей = 0.5 г амфетамина, 10 друзей = 0.5 г кокаина (MQ), 25 друзей = 1 г кокаина (VHQ)!",
        headerText: "Надёжный шоп в твоём кармане",
        catalogButton: "Каталог",
        vacanciesButton: "Вакансии",
        mailButton: "Почта",
        allCitiesOption: "Все города",
        allDistrictsOption: "Все районы",
        phuketOption: "Пхукет",
        pattayaOption: "Паттайя",
        bangkokOption: "Бангкок",
        samuiOption: "о. Самуи",
        phuketDistricts: { "Patong": "Патонг", "Karon": "Карон", "Phuket Town": "Пхукет-таун", "Kata": "Ката", "Chalong": "Чалонг", "Kamala": "Камала", "Mai Khao": "Май Кхао" },
        pattayaDistricts: { "Central Pattaya": "Центральная Паттайя", "Jomtien": "Джомтьен", "Naklua": "Наклуа", "South Pattaya": "Южная Паттайя", "Wong Amat": "Вонг Амат", "Pratumnak": "Пратамнак" },
        bangkokDistricts: { "Sukhumvit": "Сукхумвит", "Khao San": "Каосан", "Silom": "Силом", "Chatuchak": "Чатучак", "Ratchada": "Ратчада", "Banglamphu": "Банглампху" },
        samuiDistricts: { "Chaweng": "Чавенг", "Lamai": "Ламай", "Bo Phut": "Бо Пхут", "Maenam": "Маенам", "Lipa Noi": "Липа Ной", "Bang Po": "Банг По" },
        weedDesc: "Эксклюзивный стафф, 70% ТГК чистейший кайф",
        profileNameLabel: "Имя: ",
        ordersLabel: "Заказов: ",
        referralsLabel: "Приглашено друзей: ",
        refLinkLabel: "Реферальная ссылка: ",
        depositTitle: "Пополнить баланс",
        orderHistoryTitle: "Последние заказы",
        orderListEmpty: "Пока пусто, делай заказы!",
        vacanciesTitle: "Вакансии в Dark Thailand",
        courierTitle: "Кладмен",
        courierDuties: "Обязанности: Закладка товара по координатам.",
        courierPay: "Оплата: от 150000฿ в месяц",
        warehousemanTitle: "Складмен",
        warehousemanDuties: "Обязанности: Упаковка и подготовка товара к отправке.",
        warehousemanPay: "Оплата: от 200000฿ в месяц.",
        transporterTitle: "Перевозчик",
        transporterDuties: "Обязанности: Перевозка товара между городами Таиланда.",
        transporterPay: "Оплата: от 300000฿ в месяц.",
        smmTitle: "SMMщик",
        smmDuties: "Обязанности: Рекламировать шоп, призывать новых клиентов.",
        smmPay: "Оплата: от 50000฿ в неделю + бонусы за активность.",
        applyButton: "Оставить заявку",
        mailTitle: "Почта",
        mailListEmpty: "Пока нет сообщений.",
        regTitle: "Регистрация",
        regNicknameLabel: "Введите желаемый никнейм:",
        regNicknamePlaceholder: "Ваш никнейм",
        regLanguageLabel: "Выберите язык:",
        regButton: "Зарегистрироваться",
        regErrorEmpty: "Никнейм не может быть пустым!",
        regErrorTaken: "Этот никнейм уже занят!",
        welcomeMessage: "Добро пожаловать, {user}! Ваш аккаунт успешно создан.",
        insufficientFunds: "Недостаточно средств на балансе! Пополнить баланс?",
        yes: "Да",
        no: "Нет",
        paymentSuccess: "Оплата прошла!",
        preorderTitle: "Предзаказ",
        preorderPlaced: "Предзаказ оформлен!",
        close: "Закрыть",
        depositFunds: "Пополнить баланс",
        selectCrypto: "Выберите криптовалюту:",
        networkLabel: "Сеть:",
        enterAmount: "Введите сумму (мин. 1000 ฿):",
        generateAddress: "Сгенерировать адрес",
        minDepositError: "Минимальная сумма пополнения — 1000 ฿!",
        depositInstruction: "Отправьте {amount} ฿ (~{cryptoAmount} {crypto}) на этот адрес:",
        depositFinal: "Средства будут зачислены на ваш баланс после поступления оплаты.",
        depositExpiry: "Адрес действителен 30 минут.",
        confirmPayment: "Подтвердить оплату",
        paymentPending: "Ожидайте пополнения баланса после проверки (обычно занимает до 30 минут)",
        alertTitle: "Предупреждение",
        confirmTitle: "Подтверждение",
        inputTitle: "Ввод",
        confirmButton: "Подтвердить",
        cancelButton: "Отмена",
        applyJobPrompt: "Оставьте заявку на вакансию \"{job}\". Укажите краткое резюме:",
        applyJobSent: "Ваша заявка на вакансию \"{job}\" отправлена. Ожидайте ответа от администрации.",
        applyJobAlert: "Заявка на \"{job}\" отправлена!",
        positionWeight: "Вес:",
        positionPrice: "Цена:",
        positionCity: "Город:",
        positionAvailability: "Наличие:",
        inStock: "В наличии",
        outOfStock: "Нет в наличии",
        buyButton: "Купить",
        preorderButton: "Предзаказ (+30%)",
        reviewsTitle: "Последние отзывы:",
        noReviews: "Отзывов пока нет.",
        promoInfo: "Приглашай друзей и получай стафф!",
        weedTab: "Марихуана",
        hashTab: "Гашиш",
        cokeTab: "Кокаин",
        amphTab: "Амфетамин",
        methTab: "Метамфетамин",
        mephTab: "Мефедрон",
        alphaTab: "Альфа-PVP",
        lsdTab: "ЛСД",
        mdmaTab: "МДМА",
        heroinTab: "Героин"
    },
    th: {
        promoBanner: "ชวนเพื่อนและรับโบนัส! 5 เพื่อน = แอมเฟตามีน 0.5 กรัม, 10 เพื่อน = โคเคน 0.5 กรัม (MQ), 25 เพื่อน = โคเคน 1 กรัม (VHQ)!",
        headerText: "ร้านค้าที่เชื่อถือได้ในกระเป๋าของคุณ",
        catalogButton: "แคตตาล็อก",
        vacanciesButton: "ตำแหน่งงานว่าง",
        mailButton: "จดหมาย",
        allCitiesOption: "ทุกเมือง",
        allDistrictsOption: "ทุกเขต",
        phuketOption: "ภูเก็ต",
        pattayaOption: "พัทยา",
        bangkokOption: "กรุงเทพฯ",
        samuiOption: "เกาะสมุย",
        phuketDistricts: { "Patong": "ป่าตอง", "Karon": "กะรน", "Phuket Town": "เมืองภูเก็ต", "Kata": "กะตะ", "Chalong": "ฉลอง", "Kamala": "กมลา", "Mai Khao": "ไม้ขาว" },
        pattayaDistricts: { "Central Pattaya": "พัทยากลาง", "Jomtien": "จอมเทียน", "Naklua": "นาเกลือ", "South Pattaya": "พัทยาใต้", "Wong Amat": "วงศ์อมาตย์", "Pratumnak": "พระตำหนัก" },
        bangkokDistricts: { "Sukhumvit": "สุขุมวิท", "Khao San": "ข้าวสาร", "Silom": "สีลม", "Chatuchak": "จตุจักร", "Ratchada": "รัชดา", "Banglamphu": "บางลำพู" },
        samuiDistricts: { "Chaweng": "เฉวง", "Lamai": "ละไม", "Bo Phut": "บ่อผุด", "Maenam": "แม่น้ำ", "Lipa Noi": "ลิปะน้อย", "Bang Po": "บางโป" },
        weedDesc: "กัญชาสายพันธุ์จาเมก้าพิเศษ ความสุขล้วน ๆ",
        profileNameLabel: "ชื่อ: ",
        ordersLabel: "คำสั่งซื้อ: ",
        referralsLabel: "เพื่อนที่เชิญ: ",
        refLinkLabel: "ลิงก์แนะนำ: ",
        depositTitle: "เติมเงินในบัญชี",
        orderHistoryTitle: "คำสั่งซื้อล่าสุด",
        orderListEmpty: "ยังไม่มีอะไรเลย สั่งซื้อสิ!",
        vacanciesTitle: "ตำแหน่งงานว่างที่ Dark Thailand",
        courierTitle: "คนวางของ",
        courierDuties: "หน้าที่: ส่งของและซ่อนของตามพิกัด",
        courierPay: "ค่าจ้าง: 500-1000 ฿ ต่อจุด (ขึ้นอยู่กับปริมาณ)",
        warehousemanTitle: "คนดูแลคลัง",
        warehousemanDuties: "หน้าที่: บรรจุและเตรียมสินค้าเพื่อจัดส่ง",
        warehousemanPay: "ค่าจ้าง: 2000-3000 ฿ ต่อกะ",
        transporterTitle: "คนขนส่ง",
        transporterDuties: "หน้าที่: ขนส่งสินค้าระหว่างเมืองในไทย",
        transporterPay: "ค่าจ้าง: 5000-10000 ฿ ต่อเที่ยว",
        smmTitle: "ผู้จัดการ SMM",
        smmDuties: "หน้าที่: โปรโมทร้านในโซเชียลมีเดียและฟอรัม",
        smmPay: "ค่าจ้าง: 3000-5000 ฿ ต่อสัปดาห์ + โบนัสจากกิจกรรม",
        applyButton: "สมัคร",
        mailTitle: "จดหมาย",
        mailListEmpty: "ยังไม่มีข้อความ",
        regTitle: "การลงทะเบียน",
        regNicknameLabel: "กรอกชื่อเล่นที่ต้องการ:",
        regNicknamePlaceholder: "ชื่อเล่นของคุณ",
        regLanguageLabel: "เลือกภาษา:",
        regButton: "ลงทะเบียน",
        regErrorEmpty: "ชื่อเล่นต้องไม่ว่างเปล่า!",
        regErrorTaken: "ชื่อเล่นนี้ถูกใช้ไปแล้ว!",
        welcomeMessage: "ยินดีต้อนรับ, {user}! บัญชีของคุณถูกสร้างเรียบร้อยแล้ว",
        insufficientFunds: "เงินในบัญชีไม่พอ! เติมเงินในบัญชีหรือไม่?",
        yes: "ใช่",
        no: "ไม่",
        paymentSuccess: "ชำระเงินสำเร็จ!",
        preorderTitle: "การสั่งจองล่วงหน้า",
        preorderPlaced: "สั่งจองล่วงหน้าเรียบร้อย!",
        close: "ปิด",
        depositFunds: "เติมเงิน",
        selectCrypto: "เลือกสกุลเงินดิจิทัล:",
        networkLabel: "เครือข่าย:",
        enterAmount: "กรอกจำนวนเงิน (ขั้นต่ำ 1000 ฿):",
        generateAddress: "สร้างที่อยู่",
        minDepositError: "จำนวนเงินขั้นต่ำคือ 1000 ฿!",
        depositInstruction: "ส่ง {amount} ฿ (~{cryptoAmount} {crypto}) ไปยังที่อยู่นี้:",
        depositFinal: "เงินจะเข้าบัญชีของคุณเมื่อการชำระเงินได้รับการยืนยัน",
        depositExpiry: "ที่อยู่ใช้ได้ 30 นาที",
        confirmPayment: "ยืนยันการชำระเงิน",
        paymentPending: "รอการเติมเงินหลังจากการตรวจสอบ (ปกติใช้เวลาสูงสุด 30 นาที)",
        alertTitle: "แจ้งเตือน",
        confirmTitle: "การยืนยัน",
        inputTitle: "การป้อนข้อมูล",
        confirmButton: "ยืนยัน",
        cancelButton: "ยกเลิก",
        applyJobPrompt: "สมัครงาน \"{job}\". กรุณาระบุประวัติย่อสั้น ๆ:",
        applyJobSent: "ใบสมัครของคุณสำหรับ \"{job}\" ถูกส่งแล้ว รอการตอบกลับจากผู้ดูแล",
        applyJobAlert: "ใบสมัครสำหรับ \"{job}\" ถูกส่งแล้ว!",
        positionWeight: "น้ำหนัก:",
        positionPrice: "ราคา:",
        positionCity: "เมือง:",
        positionAvailability: "ความพร้อม:",
        inStock: "มีในสต็อก",
        outOfStock: "หมดสต็อก",
        buyButton: "ซื้อ",
        preorderButton: "สั่งจองล่วงหน้า (+30%)",
        reviewsTitle: "รีวิวล่าสุด:",
        noReviews: "ยังไม่มีรีวิว",
        promoInfo: "ชวนเพื่อนและรับของฟรี!",
        weedTab: "กัญชา",
        hashTab: "แฮช",
        cokeTab: "โคเคน",
        amphTab: "แอมเฟตามีน",
        methTab: "เมทแอมเฟตามีน",
        mephTab: "เมเฟดรอน",
        alphaTab: "อัลฟา-PVP",
        lsdTab: "แอลเอสดี",
        mdmaTab: "เอ็มดีเอ็มเอ",
        heroinTab: "เฮโรอีน"
    }
};

// Отзывы
const reviews = {
    "weed-1": [
        { text: "Клад в касание, стафф пиздец как хорош!", date: "01.03.2025", response: "Спасибо за фидбек, братишка!" },
        { text: "Взял на Пхукете, качество огонь, шопу респект!", date: "05.03.2025", response: "Рады стараться, ждём снова!" }
    ],
    "hash-1": [
        { text: "Нашёл быстро, эффект бархатный, как и обещали!", date: "02.03.2025", response: "Кайфуй, братан!" },
        { text: "Клад чёткий, гашик топ, берите смело!", date: "06.03.2025", response: "Спасибо за отзыв, возвращайся!" }
    ],
    "coke-1": [
        { text: "Кокс лютый, снял в Патонге за минуту!", date: "03.03.2025", response: "На здоровье, братишка!" },
        { text: "Чистота 95%+, шоп на уровне, рекомендую!", date: "07.03.2025", response: "Держим марку, ждём снова!" }
    ],
    "amph-1": [
        { text: "Энергия прёт, стафф чистый, шоп — топ!", date: "04.03.2025", response: "Кайфуй, братан!" },
        { text: "Снял без проблем, эффект долгий, зачёт!", date: "08.03.2025", response: "Респект за фидбек!" }
    ],
    "meth-1": [
        { text: "Лёд кристальный, штырит не по-детски!", date: "05.03.2025", response: "Спасибо, что выбрал нас!" },
        { text: "Клад на месте, стафф пушка, берите!", date: "09.03.2025", response: "Ждём тебя снова!" }
    ],
    "meph-1": [
        { text: "Меф рвёт, качество пиздец, шоп надёжный!", date: "06.03.2025", response: "Кайфуй, братишка!" },
        { text: "Съём лёгкий, эффект мощный, 10/10!", date: "10.03.2025", response: "Спасибо за отзыв!" }
    ],
    "alpha-1": [
        { text: "Флакка огонь, штырит как надо!", date: "07.03.2025", response: "Рады угодить, возвращайся!" },
        { text: "Клад в касание, стафф лютый, рекомендую!", date: "11.03.2025", response: "На здоровье!" }
    ],
    "lsd-1": [
        { text: "Трип чистый, клад точный, шоп — топ!", date: "08.03.2025", response: "Спасибо за фидбек!" },
        { text: "LSD250 — это космос, берите смело!", date: "12.03.2025", response: "Кайфуй, братан!" }
    ],
    "mdma-1": [
        { text: "Любовь кристаллическая, эффект долгий!", date: "09.03.2025", response: "Респект за отзыв!" },
        { text: "Клад на магните, стафф пиздатый!", date: "13.03.2025", response: "Ждём тебя снова!" }
    ],
    "heroin-1": [
        { text: "Шёлк глубокий, штырит как надо!", date: "10.03.2025", response: "Спасибо, что с нами!" },
        { text: "Клад чёткий, стафф свежий, шоп — топ!", date: "14.03.2025", response: "Кайфуй, братишка!" }
    ]
};

// Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
    const WebApp = window.Telegram.WebApp;
    WebApp.ready();
    WebApp.expand();
    WebApp.setHeaderColor({ color_key: 'bg_color' });
    WebApp.setBottomBarColor({ color: '#ffffff' });

    WebApp.onEvent('themeChanged', () => {
        document.body.style.background = WebApp.themeParams.bg_color || '#1a1a1a';
        document.body.style.color = WebApp.themeParams.text_color || '#ff4444';
    });

    document.body.style.background = WebApp.themeParams.bg_color || '#1a1a1a';
    document.body.style.color = WebApp.themeParams.text_color || '#ff4444';
} else {
    console.warn('Telegram Web App не доступен, работаем в оффлайн-режиме');
}

// Функции
async function manualAddBalance(nickname, amount) {
    const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('nickname', nickname)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Юзер не найден:', fetchError);
        return;
    }

    if (user && user.received_bonus) {
        console.log(`${nickname} уже получил бонус!`);
        return;
    }

    const newBalance = (user?.balance || 0) + amount;
    const { error } = await supabase
        .from('users')
        .upsert({
            nickname,
            language: user?.language || 'ru',
            balance: newBalance,
            order_count: user?.order_count || 0,
            referral_count: user?.referral_count || 0,
            order_history: user?.order_history || [],
            received_bonus: true
        }, { onConflict: 'nickname' });

    if (error) {
        console.error('Начисление пошло по пизде:', error);
        return;
    }

    console.log(`Начислил ${amount} ฿ для ${nickname}, новый баланс: ${newBalance}`);
    sendToTelegram(`Админ начислил ${amount} ฿ юзеру ${nickname}. Новый баланс: ${newBalance}`);

    if (currentUser === nickname) {
        balance = newBalance;
        document.getElementById('balance').innerText = `${balance} ฿`;
    }
}

async function loadCurrentUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('nickname', savedUser)
            .single();

        if (error || !data) {
            console.error('Юзер наебнулся при загрузке:', error);
            localStorage.removeItem('currentUser');
            return;
        }

        currentUser = data.nickname;
        userLanguage = data.language;
        balance = data.balance;
        orderCount = data.order_count;
        referralCount = data.referral_count;
        orderHistory = data.order_history || [];

        document.getElementById('balance').innerText = `${balance} ฿`;
        document.getElementById('ordersLabel').innerText = translations[userLanguage].ordersLabel + orderCount;
        document.getElementById('referralsLabel').innerText = translations[userLanguage].referralsLabel + referralCount;
        updateOrderHistory();
    }
}

async function registerUser() {
    const lang = translations[userLanguage];
    const nickname = document.getElementById('regNickname').value.trim();
    const language = document.getElementById('regLanguage').value;

    if (!nickname) {
        document.getElementById('regError').innerText = lang.regErrorEmpty;
        return;
    }

    const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('nickname')
        .eq('nickname', nickname)
        .single();

    if (existingUser) {
        document.getElementById('regError').innerText = lang.regErrorTaken;
        return;
    }
    if (checkError && checkError.code !== 'PGRST116') {
        console.error('Ошибка проверки юзера:', checkError);
        return;
    }

    const { data, error } = await supabase
        .from('users')
        .insert({
            nickname,
            language,
            balance: 1000,
            order_count: 0,
            referral_count: 0,
            order_history: []
        })
        .select()
        .single();

    if (error) {
        console.error('Регистрация пошла по пизде:', error);
        return;
    }

    currentUser = data.nickname;
    userLanguage = data.language;
    balance = data.balance;
    orderCount = data.order_count;
    referralCount = data.referral_count;
    orderHistory = data.order_history;

    document.getElementById('profileNameLabel').innerText = lang.profileNameLabel + currentUser;
    document.getElementById('balance').innerText = `${balance} ฿`;
    closeModal('registrationModal');
    showAlert(lang.welcomeMessage.replace('{user}', currentUser));
    loadLanguage();
    sendToTelegram(`Новый юзер зарегался: ${nickname}, язык: ${language}, баланс: 1000 ฿`);
}

async function updateUserData() {
    if (!currentUser) return;

    const { error } = await supabase
        .from('users')
        .update({
            balance,
            order_count: orderCount,
            referral_count: referralCount,
            order_history: orderHistory
        })
        .eq('nickname', currentUser);

    if (error) {
        console.error('Обновление юзера пошло по пизде:', error);
        return;
    }

    localStorage.setItem('currentUser', currentUser);
}

async function buyProduct(category, id, city, district, weight, price) {
    const lang = translations[userLanguage];
    if (balance >= price) {
        balance -= price;
        orderCount += 1;
        const order = {
            id: orderCount,
            product: `${category}-${id}`,
            weight: weight,
            price: price,
            date: new Date().toLocaleString(),
            city: city,
            district: district
        };
        orderHistory.push(order);

        await updateUserData();

        document.getElementById('balance').innerText = `${balance} ฿`;
        document.getElementById('ordersLabel').innerText = lang.ordersLabel + orderCount;
        updateOrderHistory();
        showPaymentModal(order);
        sendToTelegram(`New order #${order.id}: ${order.product}, ${order.weight}g, ${order.price} ฿, ${order.city}/${order.district}`);
    } else {
        showConfirmModal(lang.insufficientFunds, () => showDepositModal('USDT'), () => closeModal('confirmModal'));
    }
    closeModal('productModal');
}

async function preorderProduct(category, id, city, district, weight, price) {
    const lang = translations[userLanguage];
    if (balance >= price) {
        balance -= price;
        orderCount += 1;
        const order = {
            id: orderCount,
            product: `${category}-${id}`,
            weight: weight,
            price: price,
            date: new Date().toLocaleString(),
            city: city,
            district: district,
            isPreorder: true
        };
        orderHistory.push(order);

        await updateUserData();

        document.getElementById('balance').innerText = `${balance} ฿`;
        document.getElementById('ordersLabel').innerText = lang.ordersLabel + orderCount;
        updateOrderHistory();
        showPreorderModal(order);
        sendToTelegram(`Preorder #${order.id}: ${order.product}, ${order.weight}g, ${order.price} ฿, ${order.city}/${order.district}`);
    } else {
        showConfirmModal(lang.insufficientFunds, () => showDepositModal('USDT'), () => closeModal('confirmModal'));
    }
    closeModal('productModal');
}

function loadLanguage() {
    const lang = translations[userLanguage];
    document.getElementById('promoBanner').innerText = lang.promoBanner;
    document.getElementById('headerText').innerText = lang.headerText;
    document.getElementById('catalogButton').innerText = lang.catalogButton;
    document.getElementById('vacanciesButton').innerText = lang.vacanciesButton;
    document.getElementById('mailButton').innerText = lang.mailButton;
    document.getElementById('allCitiesOption').innerText = lang.allCitiesOption;
    document.getElementById('phuketOption').innerText = lang.phuketOption;
    document.getElementById('pattayaOption').innerText = lang.pattayaOption;
    document.getElementById('bangkokOption').innerText = lang.bangkokOption;
    document.getElementById('samuiOption').innerText = lang.samuiOption;
    document.getElementById('allDistrictsOption').innerText = lang.allDistrictsOption;
    document.getElementById('weedDesc').innerText = lang.weedDesc;
    document.getElementById('profileNameLabel').innerText = lang.profileNameLabel + (currentUser || 'Гость');
    document.getElementById('ordersLabel').innerText = lang.ordersLabel + orderCount;
    document.getElementById('referralsLabel').innerText = lang.referralsLabel + referralCount;
    document.getElementById('depositTitle').innerText = lang.depositTitle;
    document.getElementById('orderHistoryTitle').innerText = lang.orderHistoryTitle;
    document.getElementById('vacanciesTitle').innerText = lang.vacanciesTitle;
    document.getElementById('courierTitle').innerText = lang.courierTitle;
    document.getElementById('courierDuties').innerText = lang.courierDuties;
    document.getElementById('courierPay').innerText = lang.courierPay;
    document.getElementById('warehousemanTitle').innerText = lang.warehousemanTitle;
    document.getElementById('warehousemanDuties').innerText = lang.warehousemanDuties;
    document.getElementById('warehousemanPay').innerText = lang.warehousemanPay;
    document.getElementById('transporterTitle').innerText = lang.transporterTitle;
    document.getElementById('transporterDuties').innerText = lang.transporterDuties;
    document.getElementById('transporterPay').innerText = lang.transporterPay;
    document.getElementById('smmTitle').innerText = lang.smmTitle;
    document.getElementById('smmDuties').innerText = lang.smmDuties;
    document.getElementById('smmPay').innerText = lang.smmPay;
    document.getElementById('applyButton1').innerText = lang.applyButton;
    document.getElementById('applyButton2').innerText = lang.applyButton;
    document.getElementById('applyButton3').innerText = lang.applyButton;
    document.getElementById('applyButton4').innerText = lang.applyButton;
    document.getElementById('mailTitle').innerText = lang.mailTitle;
    document.getElementById('weedTab').innerText = lang.weedTab;
    document.getElementById('hashTab').innerText = lang.hashTab;
    document.getElementById('cokeTab').innerText = lang.cokeTab;
    document.getElementById('amphTab').innerText = lang.amphTab;
    document.getElementById('methTab').innerText = lang.methTab;
    document.getElementById('mephTab').innerText = lang.mephTab;
    document.getElementById('alphaTab').innerText = lang.alphaTab;
    document.getElementById('lsdTab').innerText = lang.lsdTab;
    document.getElementById('mdmaTab').innerText = lang.mdmaTab;
    document.getElementById('heroinTab').innerText = lang.heroinTab;
    document.getElementById('promoInfo').innerText = lang.promoInfo;
    updateDistrictOptions();
    updateOrderHistory();
    updateMailList();
}

function toggleCatalog() {
    const catalog = document.getElementById('catalogMenu');
    const profile = document.getElementById('profileMenu');
    const vacancies = document.getElementById('vacancyMenu');
    const mail = document.getElementById('mailMenu');
    if (catalog.style.display === 'block') {
        catalog.style.display = 'none';
    } else {
        catalog.style.display = 'block';
        profile.style.display = 'none';
        vacancies.style.display = 'none';
        mail.style.display = 'none';
        activateTab('weed');
    }
}

// ... (весь предыдущий код до toggleProfile остается без изменений) ...

function toggleProfile() {
    const profile = document.getElementById('profileMenu');
    const catalog = document.getElementById('catalogMenu');
    const vacancies = document.getElementById('vacancyMenu');
    const mail = document.getElementById('mailMenu');
    if (!currentUser) {
        showModal('registrationModal');
    } else if (profile.style.display === 'block') {
        profile.style.display = 'none';
    } else {
        profile.style.display = 'block';
        catalog.style.display = 'none';
        vacancies.style.display = 'none';
        mail.style.display = 'none';
    }
}

function toggleVacancies() {
    const vacancies = document.getElementById('vacancyMenu');
    const catalog = document.getElementById('catalogMenu');
    const profile = document.getElementById('profileMenu');
    const mail = document.getElementById('mailMenu');
    if (vacancies.style.display === 'block') {
        vacancies.style.display = 'none';
    } else {
        vacancies.style.display = 'block';
        catalog.style.display = 'none';
        profile.style.display = 'none';
        mail.style.display = 'none';
    }
}

function toggleMail() {
    const mail = document.getElementById('mailMenu');
    const catalog = document.getElementById('catalogMenu');
    const profile = document.getElementById('profileMenu');
    const vacancies = document.getElementById('vacancyMenu');
    if (mail.style.display === 'block') {
        mail.style.display = 'none';
    } else {
        mail.style.display = 'block';
        catalog.style.display = 'none';
        profile.style.display = 'none';
        vacancies.style.display = 'none';
    }
}

function activateTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).style.display = 'block';
    filterProducts();
}

function filterByCity() {
    selectedCity = document.getElementById('citySelect').value;
    updateDistrictOptions();
    filterProducts();
}

function filterByDistrict() {
    selectedDistrict = document.getElementById('districtSelect').value;
    filterProducts();
}

function updateDistrictOptions() {
    const lang = translations[userLanguage];
    const districtSelect = document.getElementById('districtSelect');
    districtSelect.innerHTML = `<option value="all">${lang.allDistrictsOption}</option>`;
    if (selectedCity !== 'all' && translations[userLanguage][`${selectedCity}Districts`]) {
        const districts = translations[userLanguage][`${selectedCity}Districts`];
        for (const [key, value] of Object.entries(districts)) {
            districtSelect.innerHTML += `<option value="${key}">${value}</option>`;
        }
    }
}

function filterProducts() {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const productCity = product.dataset.city || 'all';
        const productDistrict = product.dataset.district || 'all';
        const cityMatch = selectedCity === 'all' || productCity === selectedCity;
        const districtMatch = selectedDistrict === 'all' || productDistrict === selectedDistrict;
        product.style.display = cityMatch && districtMatch ? 'block' : 'none';
    });
}

function showProductModal(category, id) {
    const lang = translations[userLanguage];
    const productKey = `${category}-${id}`;
    const basePrice = basePrices[category][id];
    const productWeightOptions = (category === 'lsd' || (category === 'mdma' && id === 3)) ? weights.lsd : (category === 'coke') ? weights.coke : weights.default;
    let modalContent = `
        <h2>${document.querySelector(`[data-product="${productKey}"] h3`).innerText}</h2>
        <img src="${productImages[category][id]}" class="product-image" alt="${category}-${id}">
        <p>${document.querySelector(`[data-product="${productKey}"] p`).innerText}</p>
        <label>${lang.positionWeight}</label>
        <select id="weightSelect">
    `;
    productWeightOptions.forEach(weight => {
        const price = category === 'lsd' || (category === 'mdma' && id >= 3) ? basePrice : basePrice * weight;
        const preorderPrice = Math.round(price * 1.3);
        modalContent += `<option value="${weight}" data-price="${price}" data-preorder-price="${preorderPrice}">${weight} г - ${price} ฿ (Предзаказ: ${preorderPrice} ฿)</option>`;
    });
    modalContent += `
        </select>
        <label>${lang.positionCity}</label>
        <select id="citySelectModal">
            <option value="phuket">${lang.phuketOption}</option>
            <option value="pattaya">${lang.pattayaOption}</option>
        </select>
        <label>${lang.positionAvailability}</label>
        <p id="availability">${lang.inStock}</p>
        <button class="buy-button" onclick="buyProduct('${category}', ${id}, document.getElementById('citySelectModal').value, 'Patong', document.getElementById('weightSelect').value, document.getElementById('weightSelect').selectedOptions[0].dataset.price)">${lang.buyButton}</button>
        <button class="preorder-button" onclick="preorderProduct('${category}', ${id}, document.getElementById('citySelectModal').value, 'Patong', document.getElementById('weightSelect').value, document.getElementById('weightSelect').selectedOptions[0].dataset.preorderPrice)">${lang.preorderButton}</button>
        <h3>${lang.reviewsTitle}</h3>
        <div id="reviewList">
    `;
    const productReviews = reviews[productKey] || [];
    if (productReviews.length > 0) {
        productReviews.forEach(review => {
            modalContent += `
                <div class="review">
                    <span class="review-text">${review.text}</span>
                    <span class="review-date">${review.date}</span>
                </div>
            `;
            if (review.response) {
                modalContent += `
                    <div class="moderator-response">${review.response}</div>
                `;
            }
        });
    } else {
        modalContent += `<p>${lang.noReviews}</p>`;
    }
    modalContent += `
        </div>
        <button class="buy-button" onclick="closeModal('productModal')">${lang.close}</button>
    `;
    document.getElementById('productContent').innerHTML = modalContent;
    showModal('productModal');
}

function showPaymentModal(order) {
    const lang = translations[userLanguage];
    const cityData = cities[order.city][order.district];
    const content = `
        <h2>${lang.paymentSuccess}</h2>
        <p>Заказ #${order.id}: ${order.product} (${order.weight} г)</p>
        <p>${lang.positionPrice} ${order.price} ฿</p>
        <p>${lang.positionCity} ${order.city} / ${order.district}</p>
        <p>Координаты: ${cityData.lat}, ${cityData.lon}</p>
        <p>Описание клада: ${cityData.desc}</p>
        <button class="buy-button" onclick="closeModal('paymentModal')">${lang.close}</button>
    `;
    document.getElementById('paymentContent').innerHTML = content;
    showModal('paymentModal');
}

function showPreorderModal(order) {
    const lang = translations[userLanguage];
    const content = `
        <h2>${lang.preorderTitle}</h2>
        <p>${lang.preorderPlaced}</p>
        <p>Заказ #${order.id}: ${order.product} (${order.weight} г)</p>
        <p>${lang.positionPrice} ${order.price} ฿</p>
        <p>${lang.positionCity} ${order.city} / ${order.district}</p>
        <p>Ожидайте уведомления о готовности!</p>
        <button class="buy-button" onclick="closeModal('preorderModal')">${lang.close}</button>
    `;
    document.getElementById('preorderContent').innerHTML = content;
    showModal('preorderModal');
}

function showDepositModal(crypto) {
    const lang = translations[userLanguage];
    const content = `
        <h2>${lang.depositFunds}</h2>
        <p>${lang.selectCrypto} ${crypto}</p>
        <p>${lang.networkLabel} ${cryptoNetworks[crypto]}</p>
        <label>${lang.enterAmount}</label>
        <input type="number" id="depositAmount" min="${MIN_DEPOSIT}" placeholder="฿">
        <button class="buy-button" onclick="generateDepositAddress('${crypto}')">${lang.generateAddress}</button>
        <p id="depositError" style="color: #ff9999;"></p>
        <button class="buy-button" onclick="closeModal('depositModal')">${lang.close}</button>
    `;
    document.getElementById('depositContent').innerHTML = content;
    showModal('depositModal');
}

function generateDepositAddress(crypto) {
    const lang = translations[userLanguage];
    const amount = parseInt(document.getElementById('depositAmount').value);
    if (isNaN(amount) || amount < MIN_DEPOSIT) {
        document.getElementById('depositError').innerText = lang.minDepositError;
        return;
    }
    const cryptoAmount = (amount / cryptoRates[crypto]).toFixed(6);
    const content = `
        <h2>${lang.depositFunds}</h2>
        <p>${lang.depositInstruction.replace('{amount}', amount).replace('{cryptoAmount}', cryptoAmount).replace('{crypto}', crypto)}</p>
        <p><strong>${testAddresses[crypto]}</strong></p>
        <p>${lang.depositFinal}</p>
        <p>${lang.depositExpiry}</p>
        <button class="buy-button" onclick="confirmDeposit(${amount}, '${crypto}', ${cryptoAmount})">${lang.confirmPayment}</button>
        <button class="buy-button" onclick="closeModal('depositModal')">${lang.close}</button>
    `;
    document.getElementById('depositContent').innerHTML = content;
}

async function confirmDeposit(amount, crypto, cryptoAmount) {
    const lang = translations[userLanguage];
    balance += amount;
    await updateUserData();
    document.getElementById('balance').innerText = `${balance} ฿`;
    closeModal('depositModal');
    showAlert(lang.paymentPending);
    sendToTelegram(`Юзер ${currentUser} запросил пополнение: ${amount} ฿ (${cryptoAmount} ${crypto}) на адрес ${testAddresses[crypto]}`);
}

function updateOrderHistory() {
    const lang = translations[userLanguage];
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = '';
    if (orderHistory.length === 0) {
        orderList.innerHTML = `<p>${lang.orderListEmpty}</p>`;
    } else {
        orderHistory.slice(-5).reverse().forEach(order => {
            orderList.innerHTML += `
                <div class="review">
                    <span class="review-text">Заказ #${order.id}: ${order.product} (${order.weight} г) - ${order.price} ฿</span>
                    <span class="review-date">${order.date}</span>
                </div>
            `;
        });
    }
}

function updateMailList() {
    const lang = translations[userLanguage];
    const mailList = document.getElementById('mailList');
    mailList.innerHTML = mailMessages.length > 0
        ? mailMessages.map(msg => `<div class="review"><p>${msg}</p></div>`).join('')
        : `<p>${lang.mailListEmpty}</p>`;
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showAlert(message) {
    const lang = translations[userLanguage];
    document.getElementById('customContent').innerHTML = `
        <h2>${lang.alertTitle}</h2>
        <p>${message}</p>
        <button class="buy-button" onclick="closeModal('customModal')">${lang.close}</button>
    `;
    showModal('customModal');
}

function showConfirmModal(message, onConfirm, onCancel) {
    const lang = translations[userLanguage];
    document.getElementById('confirmContent').innerHTML = `
        <h2>${lang.confirmTitle}</h2>
        <p>${message}</p>
        <button class="buy-button" onclick="onConfirm(); closeModal('confirmModal')">${lang.yes}</button>
        <button class="buy-button" onclick="onCancel(); closeModal('confirmModal')">${lang.no}</button>
    `;
    showModal('confirmModal');
}

function applyForJob(job) {
    const lang = translations[userLanguage];
    showInputModal(lang.applyJobPrompt.replace('{job}', job), async (resume) => {
        sendToTelegram(`Заявка на вакансию "${job}" от ${currentUser}:\n${resume}`);
        showAlert(lang.applyJobAlert.replace('{job}', job));
    });
}

function showInputModal(message, onConfirm) {
    const lang = translations[userLanguage];
    document.getElementById('customContent').innerHTML = `
        <h2>${lang.inputTitle}</h2>
        <p>${message}</p>
        <textarea id="inputValue" placeholder="Введите текст"></textarea>
        <button class="buy-button" onclick="onConfirm(document.getElementById('inputValue').value); closeModal('customModal')">${lang.confirmButton}</button>
        <button class="buy-button" onclick="closeModal('customModal')">${lang.cancelButton}</button>
    `;
    showModal('customModal');
}

function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${BOT_B_TOKEN}/sendMessage`;
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: ADMIN_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        })
    }).catch(error => console.error('Ошибка отправки в Telegram:', error));
}

function showPromoDetails() {
    const lang = translations[userLanguage];
    const refLink = currentUser ? `https://t.me/DarkThailandBot?start=${currentUser}` : 'Зарегистрируйтесь для получения ссылки';
    const content = `
        <h2>${lang.promoInfo}</h2>
        <p>${lang.promoBanner}</p>
        <p>${lang.refLinkLabel} <strong>${refLink}</strong></p>
        <button class="buy-button" onclick="closeModal('customModal')">${lang.close}</button>
    `;
    document.getElementById('customContent').innerHTML = content;
    showModal('customModal');
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    await loadCurrentUser();
    if (!currentUser) {
        showModal('registrationModal');
        userLanguage = document.getElementById('regLanguage').value;
    }
    loadLanguage();

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => activateTab(tab.dataset.tab));
    });

    if (currentUser === 'Gtori') {
        await manualAddBalance('Gtori', 1000000);
    }
});
