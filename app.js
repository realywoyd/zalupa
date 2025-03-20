// Импорт Firebase модулей
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";

// Конфигурация Firebase (замените на свои данные из Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBHt6hTJxSReZ5QNVhz_lZjwKJkqUihDoY",
  authDomain: "darkthai-5d1b3.firebaseapp.com",
  projectId: "darkthai-5d1b3",
  storageBucket: "darkthai-5d1b3.firebasestorage.app",
  messagingSenderId: "647851024011",
  appId: "1:647851024011:web:2194e7bd251ac725213e8e",
  measurementId: "G-DSV6TS86LG"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
} else {
    console.warn('Telegram Web App не доступен, работаем в оффлайн-режиме');
}

// Глобальные переменные
let selectedCity = 'all';
let selectedDistrict = 'all';
let currentUser = null;
let userLanguage = 'ru';
let mailMessages = [];
let pendingPayments = {};
const MIN_DEPOSIT = 1000;

const cryptoRates = {
    BTC: 2000000,
    ETH: 100000,
    USDT: 33,
    SOL: 5000,
    TON: 200
};

const testAddresses = {
    BTC: "bc1qxk53npp2g3gt3x93k93vqgq93v5nwp5cvuk7fn",
    ETH: "0x0d6b8E631b6c99e5184d492F4bcf22c8B5F96009",
    USDT: "TCZUbqocgdwWx7AJVf6Kk5bq6cQETbWu54",
    SOL: "HadNG2gWHYiep7GfuP9UzxZQdeKuhCfPQ6qqBNo19B3B",
    TON: "UQAXS4W2EW4gTFvpZqf-zR1zDrnLcNkjpZOkh-2EXFjwQ2Vh"
};

const cryptoNetworks = {
    BTC: "BEP20",
    ETH: "ERC20",
    USDT: "TRC20",
    SOL: "Solana",
    TON: "TON"
};

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
        regErrorEmpty: "ชื่อเล่นต้องไม่ว่างเปล่า!",
        regErrorTaken: "ชื่อเล่นนี้ถูกใช้แล้ว!",
        welcomeMessage: "ยินดีต้อนรับ {user}! บัญชีของคุณถูกสร้างเรียบร้อยแล้ว",
        insufficientFunds: "เงินในบัญชีไม่พอ! เติมเงินในบัญชีหรือไม่?",
        yes: "ใช่",
        no: "ไม่",
        paymentSuccess: "ชำระเงินสำเร็จ!",
        preorderTitle: "สั่งจองล่วงหน้า",
        preorderPlaced: "สั่งจองล่วงหน้าเรียบร้อย!",
        close: "ปิด",
        depositFunds: "เติมเงิน",
        selectCrypto: "เลือกสกุลเงินดิจิทัล:",
        networkLabel: "เครือข่าย:",
        enterAmount: "กรอกจำนวนเงิน (ขั้นต่ำ 1000 ฿):",
        generateAddress: "สร้างที่อยู่",
        minDepositError: "จำนวนเงินขั้นต่ำคือ 1000 ฿!",
        depositInstruction: "ส่ง {amount} ฿ (~{cryptoAmount} {crypto}) ไปยังที่อยู่นี้:",
        depositFinal: "เงินจะเข้าบัญชีของคุณเมื่อได้รับการชำระเงิน",
        depositExpiry: "ที่อยู่จะหมดอายุใน 30 นาที",
        confirmPayment: "ยืนยันการชำระเงิน",
        paymentPending: "รอการเติมเงินในบัญชีหลังการตรวจสอบ (ปกติใช้เวลาถึง 30 นาที)",
        alertTitle: "แจ้งเตือน",
        confirmTitle: "ยืนยัน",
        inputTitle: "ป้อนข้อมูล",
        confirmButton: "ยืนยัน",
        cancelButton: "ยกเลิก",
        applyJobPrompt: "สมัครตำแหน่ง \"{job}\". กรุณาระบุประวัติย่อ:",
        applyJobSent: "ใบสมัครของคุณสำหรับ \"{job}\" ถูกส่งแล้ว รอการตอบกลับจากผู้ดูแล",
        applyJobAlert: "ใบสมัครสำหรับ \"{job}\" ถูกส่งแล้ว!",
        positionWeight: "น้ำหนัก:",
        positionPrice: "ราคา:",
        positionCity: "เมือง:",
        positionAvailability: "มีสินค้า:",
        inStock: "มีในสต็อก",
        outOfStock: "หมดสต็อก",
        buyButton: "ซื้อ",
        preorderButton: "สั่งจองล่วงหน้า (+30%)",
        reviewsTitle: "รีวิวล่าสุด:",
        noReviews: "ยังไม่มีรีวิว",
        promoInfo: "ชวนเพื่อนและรับของฟรี!",
        weedTab: "กัญชา",
        hashTab: "กัญชาอัด",
        cokeTab: "โคเคน",
        amphTab: "แอมเฟตามีน",
        methTab: "เมทแอมเฟตามีน",
        mephTab: "เมเฟดรอน",
        alphaTab: "อัลฟ่า-PVP",
        lsdTab: "แอลเอสดี",
        mdmaTab: "เอ็มดีเอ็มเอ",
        heroinTab: "เฮโรอีน"
    }
};

const cities = {
    phuket: {
        "Patong": { lat: "7.8961", lon: "98.2966", desc: "Клад в районе пляжа, за баром у пальмы, магнит под скамейкой." },
        "Karon": { lat: "7.8467", lon: "98.2945", desc: "Тайник у забора храма, в кустах, смотри под камнем." },
        "Phuket Town": { lat: "7.8833", lon: "98.3917", desc: "Возле старого рынка, в щели стены, аккуратно." },
        "Kata": { lat: "7.8202", lon: "98.2988", desc: "Под мостиком у пляжа, в пакете, закопано 10 см." },
        "Chalong": { lat: "7.8461", lon: "98.3398", desc: "Рядом с пирсом, в трубе, магнит." },
        "Kamala": { lat: "7.9506", lon: "98.2842", desc: "У кафе на углу, под мусоркой, не копай глубоко." },
        "Mai Khao": { lat: "8.1333", lon: "98.3000", desc: "Возле заброшенного ангара, в траве, магнит." }
    },
    pattaya: {
        "Central Pattaya": { lat: "12.9386", lon: "100.8891", desc: "За клубом, в щели стены, смотри под вывеской." },
        "Jomtien": { lat: "12.8996", lon: "100.8678", desc: "У пляжа, под скамейкой, магнит приклеен." },
        "Naklua": { lat: "12.9751", lon: "100.9078", desc: "Рядом с рыбным рынком, в урне, пакет." },
        "South Pattaya": { lat: "12.9236", lon: "100.8825", desc: "У ночного рынка, за киоском, магнит." },
        "Wong Amat": { lat: "12.9667", lon: "100.8833", desc: "На пляже, в камнях, смотри внимательно." },
        "Pratumnak": { lat: "12.9167", lon: "100.8667", desc: "У смотровой площадки, в кустах, закопано." }
    },
    bangkok: {
        "Sukhumvit": { lat: "13.7367", lon: "100.5333", desc: "Возле метро, за киоском, магнит под скамейкой." },
        "Khao San": { lat: "13.7592", lon: "100.4972", desc: "Рядом с баром, в щели забора, аккуратно." },
        "Silom": { lat: "13.7234", lon: "100.5342", desc: "У ночного рынка, под мусоркой, магнит." },
        "Chatuchak": { lat: "13.7992", lon: "100.5489", desc: "На рынке, за прилавком, в пакете." },
        "Ratchada": { lat: "13.7692", lon: "100.5733", desc: "Возле клубов, в кустах, закопано 10 см." },
        "Banglamphu": { lat: "13.7611", lon: "100.4989", desc: "У канала, под мостиком, магнит." }
    },
    samui: {
        "Chaweng": { lat: "9.5357", lon: "100.0644", desc: "На пляже, за баром, в камнях, магнит." },
        "Lamai": { lat: "9.4682", lon: "100.0483", desc: "У ночного рынка, под скамейкой, закопано." },
        "Bo Phut": { lat: "9.5657", lon: "100.0258", desc: "Рядом с пирсом, в кустах, смотри под камнем." },
        "Maenam": { lat: "9.5703", lon: "100.0014", desc: "На пляже, за кафе, магнит под доской." },
        "Lipa Noi": { lat: "9.4969", lon: "99.9364", desc: "У пирса, в щели забора, аккуратно." },
        "Bang Po": { lat: "9.5778", lon: "99.9833", desc: "На пляже, в траве, закопано 10 см." }
    }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена');
    setupEventListeners();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loadCurrentUser();
            loadLanguage();
        } else {
            showLoginModal();
        }
    });
    initTabs();
    updateProductCards();
});

function setupEventListeners() {
    document.getElementById('catalogButton').addEventListener('click', toggleCatalog);
    document.getElementById('vacanciesButton').addEventListener('click', toggleVacancies);
    document.getElementById('mailButton').addEventListener('click', toggleMail);
    document.querySelector('.profile-button').addEventListener('click', toggleProfile);
    document.getElementById('citySelect').addEventListener('change', filterByCity);
    document.getElementById('districtSelect').addEventListener('change', filterByDistrict);
    document.getElementById('registerButton').addEventListener('click', registerUser);
    document.getElementById('cancelRegButton').addEventListener('click', hideRegistrationModal);
    document.getElementById('loginButton').addEventListener('click', loginUser);
    document.getElementById('showRegFromLoginButton').addEventListener('click', showRegistrationFromLogin);
    document.getElementById('logoutButton').addEventListener('click', logout);
    document.getElementById('promoDetailsButton').addEventListener('click', showPromoDetails);
    document.getElementById('depositBTC').addEventListener('click', () => showDepositModal('BTC'));
    document.getElementById('depositETH').addEventListener('click', () => showDepositModal('ETH'));
    document.getElementById('depositUSDT').addEventListener('click', () => showDepositModal('USDT'));
    document.getElementById('depositSOL').addEventListener('click', () => showDepositModal('SOL'));
    document.getElementById('depositTON').addEventListener('click', () => showDepositModal('TON'));
    document.getElementById('applyButton1').addEventListener('click', () => applyForJob('Кладмен'));
    document.getElementById('applyButton2').addEventListener('click', () => applyForJob('Складмен'));
    document.getElementById('applyButton3').addEventListener('click', () => applyForJob('Перевозчик'));
    document.getElementById('applyButton4').addEventListener('click', () => applyForJob('SMMщик'));
}

function loadLanguage() {
    const lang = translations[userLanguage] || translations['ru'];
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
    document.getElementById('profileNameLabel').innerText = lang.profileNameLabel + (currentUser?.email.split('@')[0] || 'Гость');
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
    updateOrderHistory();
    updateMailList();
}

async function loadCurrentUser() {
    if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            userLanguage = userData.language || 'ru';
            const balance = userData.balance || 0;
            const orderCount = userData.orderCount || 0;
            const referralCount = userData.referralCount || 0;
            document.getElementById('balance').innerText = `${balance} ฿`;
            document.getElementById('ordersLabel').innerText = `${translations[userLanguage].ordersLabel}${orderCount}`;
            document.getElementById('referralsLabel').innerText = `${translations[userLanguage].referralsLabel}${referralCount}`;
            updateOrderHistory();
        }
    }
}

async function updateOrderHistory() {
    const lang = translations[userLanguage];
    const orderList = document.getElementById('orderList');
    if (!currentUser) return;
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const userOrders = ordersSnapshot.docs
        .filter(doc => doc.data().userId === currentUser.uid)
        .map(doc => doc.data());
    orderList.innerHTML = userOrders.length ? userOrders.map(order => `
        <div class="review">
            <span class="review-text">Заказ ${order.productId} (${order.weight}г) за ${order.price}฿ в ${order.city}, ${order.district} (${order.date})</span>
            <span class="review-date">${order.status || 'Завершён'}</span>
        </div>
    `).join('') : `<p>${lang.orderListEmpty}</p>`;
}

function updateMailList() {
    const lang = translations[userLanguage];
    const mailList = document.getElementById('mailList');
    mailList.innerHTML = mailMessages.length ? mailMessages.map(msg => `
        <div class="review">
            <span class="review-text">${msg.text}</span>
            <span class="review-date">${msg.date}</span>
        </div>
    `).join('') : `<p>${lang.mailListEmpty}</p>`;
}

function updateDistricts() {
    const districtSelect = document.getElementById('districtSelect');
    districtSelect.innerHTML = `<option value="all">${translations[userLanguage].allDistrictsOption}</option>`;
    if (selectedCity !== 'all' && cities[selectedCity]) {
        const districts = translations[userLanguage][`${selectedCity}Districts`];
        for (let district in districts) {
            districtSelect.innerHTML += `<option value="${district}">${districts[district]}</option>`;
        }
    }
    filterByDistrict();
}

function filterByCity() {
    selectedCity = document.getElementById('citySelect').value || 'all';
    updateDistricts();
    updateProductCards();
    logEvent(analytics, 'select_city', { city: selectedCity, user: currentUser?.email || 'Гость' });
}

function filterByDistrict() {
    selectedDistrict = document.getElementById('districtSelect').value || 'all';
    updateProductCards();
    logEvent(analytics, 'select_district', { district: selectedDistrict, city: selectedCity, user: currentUser?.email || 'Гость' });
}

function filterProducts() {
    const products = document.querySelectorAll('.product-card');
    products.forEach(card => {
        const productId = card.dataset.product;
        const availableCities = Object.keys(cities);
        let isVisible = true;
        if (selectedCity !== 'all') {
            if (!availableCities.includes(selectedCity)) {
                isVisible = false;
            } else if (selectedDistrict !== 'all' && !cities[selectedCity][selectedDistrict]) {
                isVisible = false;
            }
        }
        card.style.display = isVisible ? 'block' : 'none';
    });
}

function toggleCatalog() {
    const catalogMenu = document.getElementById('catalogMenu');
    const profileMenu = document.getElementById('profileMenu');
    const vacancyMenu = document.getElementById('vacancyMenu');
    const mailMenu = document.getElementById('mailMenu');
    catalogMenu.style.display = catalogMenu.style.display === 'block' ? 'none' : 'block';
    profileMenu.style.display = 'none';
    vacancyMenu.style.display = 'none';
    mailMenu.style.display = 'none';
}

function toggleProfile() {
    const profileMenu = document.getElementById('profileMenu');
    const catalogMenu = document.getElementById('catalogMenu');
    const vacancyMenu = document.getElementById('vacancyMenu');
    const mailMenu = document.getElementById('mailMenu');
    profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
    catalogMenu.style.display = 'none';
    vacancyMenu.style.display = 'none';
    mailMenu.style.display = 'none';
    if (!currentUser) showLoginModal();
    else loadCurrentUser();
}

function toggleVacancies() {
    const vacancyMenu = document.getElementById('vacancyMenu');
    const catalogMenu = document.getElementById('catalogMenu');
    const profileMenu = document.getElementById('profileMenu');
    const mailMenu = document.getElementById('mailMenu');
    vacancyMenu.style.display = vacancyMenu.style.display === 'block' ? 'none' : 'block';
    catalogMenu.style.display = 'none';
    profileMenu.style.display = 'none';
    mailMenu.style.display = 'none';
}

function toggleMail() {
    const mailMenu = document.getElementById('mailMenu');
    const catalogMenu = document.getElementById('catalogMenu');
    const profileMenu = document.getElementById('profileMenu');
    const vacancyMenu = document.getElementById('vacancyMenu');
    mailMenu.style.display = mailMenu.style.display === 'block' ? 'none' : 'block';
    catalogMenu.style.display = 'none';
    profileMenu.style.display = 'none';
    vacancyMenu.style.display = 'none';
    updateMailList();
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs[0].classList.add('active');
    tabContents[0].style.display = 'block';
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            tabContents.forEach(content => content.style.display = 'none');
            const content = document.getElementById(tab.dataset.tab);
            if (content) {
                content.style.display = 'block';
                if (!content.innerHTML.trim()) {
                    content.innerHTML = '<p>Нет товаров, скоро будут!</p>';
                }
            }
            filterProducts();
        });
    });
}

async function updateProductCards() {
    const lang = translations[userLanguage] || translations['ru'];
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        const category = content.id;
        const categoryProducts = products.filter(p => p.category === category);
        content.innerHTML = categoryProducts.length
            ? categoryProducts.map(product => `
                <div class="product-card" data-product="${category}-${product.id}">
                    <img src="${product.image_url || 'https://via.placeholder.com/150'}" class="product-image" alt="${product.name}">
                    <h3 onclick="showProductModal('${category}', '${product.id}')">${product.name}</h3>
                    <p>${product.description || 'Описание отсутствует'}</p>
                    <p class="price">${lang.positionPrice} ${product.base_price || 0} ฿/г</p>
                    <p class="crypto-price">~${((product.base_price || 0) / cryptoRates.USDT).toFixed(2)} USDT/г</p>
                    <button class="buy-button" onclick="buyProduct('${product.id}', 1, ${product.base_price || 0}, '${selectedCity}', '${selectedDistrict}')">${lang.buyButton}</button>
                    <button class="preorder-button" onclick="preorderProduct('${product.id}', 1, ${(product.base_price || 0) * 1.3}, '${selectedCity}', '${selectedDistrict}')">${lang.preorderButton}</button>
                </div>
            `).join('')
            : '<p>Нет товаров в этой категории.</p>';
    });
    filterProducts();
}

async function showProductModal(category, id) {
    const lang = translations[userLanguage];
    const productDoc = await getDoc(doc(db, 'products', id));
    if (!productDoc.exists()) return;
    const product = productDoc.data();
    let content = `
        <img src="${product.image_url}" class="product-image" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}. Этот продукт — чистый кайф для тех, кто знает толк в стаффе.</p>
    `;
    if (selectedCity === 'all' || selectedDistrict === 'all') {
        content += `
            <p>Выбери город и район, чтобы увидеть позиции.</p>
            <button class="buy-button" onclick="hideModal('productModal')">${lang.close}</button>
        `;
    } else {
        const cityName = translations[userLanguage][`${selectedCity}Option`];
        const districtName = translations[userLanguage][`${selectedCity}Districts`][selectedDistrict];
        content += `<h3>${cityName} - ${districtName}</h3>`;
        const inStock = true; // Здесь можно добавить логику проверки наличия
        const weight = 1; // Пример веса
        const price = product.base_price * weight;
        const preorderPrice = price * 1.3;
        const unit = (category === 'lsd' || (category === 'mdma' && id === '3')) ? 'шт' : 'г';
        content += `
            <p>${lang.positionWeight}: ${weight} ${unit} | ${lang.positionPrice}: ${price} ฿ (~${(price / cryptoRates.USDT).toFixed(2)} USDT) | 
            ${lang.positionAvailability}: ${inStock ? lang.inStock : lang.outOfStock}</p>
        `;
        if (inStock) {
            content += `<button class="buy-button" onclick="buyProduct('${id}', ${weight}, ${price}, '${selectedCity}', '${selectedDistrict}')">${lang.buyButton}</button>`;
        }
        content += `<button class="preorder-button" onclick="preorderProduct('${id}', ${weight}, ${preorderPrice}, '${selectedCity}', '${selectedDistrict}')">${lang.preorderButton}</button>`;
    }
    content += `<button class="buy-button" onclick="hideModal('productModal')">${lang.close}</button>`;
    document.getElementById('productContent').innerHTML = content;
    document.getElementById('productModal').style.display = 'flex';
}

async function buyProduct(productId, weight, price, city, district) {
    const lang = translations[userLanguage];
    const total = price * weight;
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();
    if (userData.balance < total) {
        showConfirmModal(`${lang.insufficientFunds}`, () => {
            showDepositModal();
            hideModal('confirmModal');
        }, () => hideModal('confirmModal'), lang.yes, lang.no);
    } else {
        const newBalance = userData.balance - total;
        const newOrderCount = (userData.orderCount || 0) + 1;
        await updateDoc(doc(db, 'users', currentUser.uid), {
            balance: newBalance,
            orderCount: newOrderCount
        });
        await addDoc(collection(db, 'orders'), {
            userId: currentUser.uid,
            productId,
            weight,
            price: total,
            city,
            district,
            date: new Date().toLocaleDateString(),
            status: 'completed'
        });
        document.getElementById('balance').innerText = `${newBalance} ฿`;
        document.getElementById('ordersLabel').innerText = `${lang.ordersLabel}${newOrderCount}`;
        updateOrderHistory();
        showAlertModal(`${lang.paymentSuccess}`, () => hideModal('customModal'));
        logEvent(analytics, 'purchase', { productId, total, city, district, user: currentUser.email });
    }
}

async function preorderProduct(productId, weight, price, city, district) {
    const lang = translations[userLanguage];
    const total = price * weight;
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();
    if (userData.balance < total) {
        showConfirmModal(`${lang.insufficientFunds}`, () => {
            showDepositModal();
            hideModal('confirmModal');
        }, () => hideModal('confirmModal'), lang.yes, lang.no);
    } else {
        const newBalance = userData.balance - total;
        const newOrderCount = (userData.orderCount || 0) + 1;
        await updateDoc(doc(db, 'users', currentUser.uid), {
            balance: newBalance,
            orderCount: newOrderCount
        });
        await addDoc(collection(db, 'orders'), {
            userId: currentUser.uid,
            productId,
            weight,
            price: total,
            city,
            district,
            date: new Date().toLocaleDateString(),
            status: 'preorder'
        });
        document.getElementById('balance').innerText = `${newBalance} ฿`;
        document.getElementById('ordersLabel').innerText = `${lang.ordersLabel}${newOrderCount}`;
        updateOrderHistory();
        showAlertModal(`${lang.preorderPlaced}`, () => hideModal('customModal'));
        logEvent(analytics, 'preorder', { productId, total, city, district, user: currentUser.email });
    }
}

function showDepositModal(crypto = 'USDT') {
    const lang = translations[userLanguage];
    let content = `
        <h2>${lang.depositFunds}</h2>
        <select id="cryptoSelect" onchange="updateDepositAddress()">
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="USDT">Tether (USDT)</option>
            <option value="SOL">Solana (SOL)</option>
            <option value="TON">Toncoin (TON)</option>
        </select>
        <p>${lang.networkLabel} ${cryptoNetworks[crypto]}</p>
        <input type="number" id="depositAmount" placeholder="${lang.enterAmount}" min="${MIN_DEPOSIT}">
        <button class="buy-button" onclick="generateDepositAddress()">${lang.generateAddress}</button>
    `;
    document.getElementById('depositContent').innerHTML = content;
    document.getElementById('cryptoSelect').value = crypto;
    showModal('depositModal');
}

function updateDepositAddress() {
    const crypto = document.getElementById('cryptoSelect').value;
    const network = document.getElementById('depositContent').querySelector('p');
    if (network) network.innerText = `${translations[userLanguage].networkLabel} ${cryptoNetworks[crypto]}`;
}

function generateDepositAddress() {
    const lang = translations[userLanguage];
    const amountInput = document.getElementById('depositAmount');
    const amount = parseFloat(amountInput.value) || 0;
    if (amount < MIN_DEPOSIT) {
        showAlertModal(`${lang.minDepositError}`, () => hideModal('customModal'));
        return;
    }
    const crypto = document.getElementById('cryptoSelect').value;
    const cryptoAmount = (amount / cryptoRates[crypto]).toFixed(6);
    const address = testAddresses[crypto];
    const content = `
        <h2>${lang.depositFunds}</h2>
        <p>${lang.depositInstruction.replace('{amount}', amount).replace('{cryptoAmount}', cryptoAmount).replace('{crypto}', crypto)}</p>
        <p>${address}</p>
        <p>${lang.depositFinal}</p>
        <p>${lang.depositExpiry}</p>
        <button class="buy-button" onclick="confirmDeposit('${crypto}', ${amount}, '${address}')">${lang.confirmPayment}</button>
        <button class="buy-button" onclick="hideModal('depositModal')">${lang.close}</button>
    `;
    document.getElementById('depositContent').innerHTML = content;
    pendingPayments[address] = { amount, crypto, timestamp: Date.now() };
    logEvent(analytics, 'deposit_request', { amount, crypto, user: currentUser?.email });
}

async function confirmDeposit(crypto, amount, address) {
    const lang = translations[userLanguage];
    showAlertModal(`${lang.paymentPending}`, async () => {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();
        const newBalance = (userData.balance || 0) + amount;
        await updateDoc(doc(db, 'users', currentUser.uid), { balance: newBalance });
        document.getElementById('balance').innerText = `${newBalance} ฿`;
        delete pendingPayments[address];
        showAlertModal(`${lang.paymentSuccess}`, () => hideModal('customModal'));
        logEvent(analytics, 'deposit_success', { amount, crypto, user: currentUser.email });
    });
    hideModal('depositModal');
}

function showRegistrationModal() {
    document.getElementById('registrationModal').style.display = 'flex';
}

function hideRegistrationModal() {
    document.getElementById('registrationModal').style.display = 'none';
}

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

function hideLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

async function registerUser() {
    const lang = translations[userLanguage];
    const nickname = document.getElementById('regNickname').value.trim();
    const password = document.getElementById('regPassword').value;
    const language = document.getElementById('regLanguage').value;

    if (!nickname) {
        showAlertModal(lang.regErrorEmpty, () => hideModal('customModal'));
        return;
    }

    if (!password) {
        showAlertModal('Пароль не может быть пустым!', () => hideModal('customModal'));
        return;
    }

    try {
        // Создаём email на основе nickname (Firebase Auth требует email)
        const email = `${nickname}@darkthailand.com`;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Сохраняем данные пользователя в Firestore
        await setDoc(doc(db, 'users', user.uid), {
            nickname,
            email,
            language,
            balance: 0,
            orderCount: 0,
            referralCount: 0,
            createdAt: new Date().toISOString()
        });

        currentUser = user;
        userLanguage = language;
        loadLanguage();
        hideRegistrationModal();
        showAlertModal(lang.welcomeMessage.replace('{user}', nickname), () => hideModal('customModal'));
        logEvent(analytics, 'sign_up', { method: 'email', user: email });
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            showAlertModal(lang.regErrorTaken, () => hideModal('customModal'));
        } else {
            showAlertModal(`Ошибка регистрации: ${error.message}`, () => hideModal('customModal'));
        }
    }
}

async function loginUser() {
    const nickname = document.getElementById('loginNickname').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!nickname || !password) {
        showAlertModal('Введите никнейм и пароль!', () => hideModal('customModal'));
        return;
    }

    try {
        const email = `${nickname}@darkthailand.com`;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        currentUser = user;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            userLanguage = userData.language || 'ru';
            loadLanguage();
            loadCurrentUser();
            hideLoginModal();
            logEvent(analytics, 'login', { method: 'email', user: email });
        }
    } catch (error) {
        showAlertModal(`Ошибка входа: ${error.message}`, () => hideModal('customModal'));
    }
}

function showRegistrationFromLogin() {
    hideLoginModal();
    showRegistrationModal();
}

async function logout() {
    try {
        await signOut(auth);
        currentUser = null;
        userLanguage = 'ru';
        loadLanguage();
        showLoginModal();
        toggleProfile();
        logEvent(analytics, 'logout', { user: currentUser?.email || 'Гость' });
    } catch (error) {
        showAlertModal(`Ошибка выхода: ${error.message}`, () => hideModal('customModal'));
    }
}

function showPromoDetails() {
    const lang = translations[userLanguage];
    const content = `
        <h2>${lang.promoInfo}</h2>
        <p>Приглашайте друзей и получайте бонусы:</p>
        <ul>
            <li>5 друзей = 0.5 г амфетамина</li>
            <li>10 друзей = 0.5 г кокаина (MQ)</li>
            <li>25 друзей = 1 г кокаина (VHQ)</li>
        </ul>
        <button class="buy-button" onclick="hideModal('customModal')">${lang.close}</button>
    `;
    document.getElementById('customContent').innerHTML = content;
    showModal('customModal');
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showAlertModal(message, onClose) {
    const lang = translations[userLanguage];
    const content = `
        <h2>${lang.alertTitle}</h2>
        <p>${message}</p>
        <button class="buy-button" onclick="hideModal('customModal'); ${onClose ? 'onClose()' : ''}">${lang.close}</button>
    `;
    document.getElementById('customContent').innerHTML = content;
    showModal('customModal');
}

function showConfirmModal(message, onConfirm, onCancel, confirmText, cancelText) {
    const lang = translations[userLanguage];
    const content = `
        <h2>${lang.confirmTitle}</h2>
        <p>${message}</p>
        <button class="buy-button" onclick="onConfirm();">${confirmText || lang.confirmButton}</button>
        <button class="buy-button" onclick="onCancel();">${cancelText || lang.cancelButton}</button>
    `;
    document.getElementById('confirmContent').innerHTML = content;
    showModal('confirmModal');
}

async function applyForJob(job) {
    const lang = translations[userLanguage];
    showConfirmModal(
        lang.applyJobPrompt.replace('{job}', job),
        async () => {
            const resume = prompt(lang.inputTitle, '');
            if (resume) {
                await addDoc(collection(db, 'applications'), {
                    userId: currentUser.uid,
                    job,
                    resume,
                    date: new Date().toLocaleDateString(),
                    status: 'pending'
                });
                mailMessages.push({
                    text: lang.applyJobSent.replace('{job}', job),
                    date: new Date().toLocaleDateString()
                });
                updateMailList();
                showAlertModal(lang.applyJobAlert.replace('{job}', job), () => hideModal('customModal'));
                logEvent(analytics, 'apply_job', { job, user: currentUser.email });
            }
            hideModal('confirmModal');
        },
        () => hideModal('confirmModal'),
        lang.confirmButton,
        lang.cancelButton
    );
}
