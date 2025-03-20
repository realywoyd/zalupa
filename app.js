// Глобальные переменные
let balance = 0;
let orderCount = 0;
let referralCount = 0;
let orderHistory = [];
let selectedCity = 'all';
let selectedDistrict = 'all';
let currentUser = null;
let userLanguage = 'ru';
let mailMessages = [];
const MIN_DEPOSIT = 1000;

const BOT_B_TOKEN = '7589545725:AAHoedAqoGh_k0WWdUs1rcBN1yddUtBFhsk';
const ADMIN_CHAT_ID = '5956080955';

const cryptoRates = { BTC: 2000000, ETH: 100000, USDT: 33, SOL: 5000, TON: 150 };
const testAddresses = {
    BTC: "bc1qxk53npp2g3gt3x93k93vqgq93v5nwp5cvuk7fn",
    ETH: "0x0d6b8E631b6c99e5184d492F4bcf22c8B5F96009",
    USDT: "TCZUbqocgdwWx7AJVf6Kk5bq6cQETbWu54",
    SOL: "HadNG2gWHYiep7GfuP9UzxZQdeKuhCfPQ6qqBNo19B3B",
    TON: "UQBoT-OzfCz0Ixtq9ZbH7coNGtiChvyAuby5aUTdsuotVMxA"
};
const cryptoNetworks = { BTC: "BEP20", ETH: "ERC20", USDT: "TRC20", SOL: "Solana", TON: "TON" };

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

const basePrices = {
    weed: { 1: 500 }, hash: { 1: 600, 2: 550, 3: 500 }, coke: { 1: 2000, 2: 1800 },
    amph: { 1: 700, 2: 650, 3: 600, 4: 550 }, meth: { 1: 800, 2: 750 },
    meph: { 1: 850, 2: 800, 3: 750 }, alpha: { 1: 900, 2: 850, 3: 800, 4: 950 },
    lsd: { 1: 1000, 2: 900 }, mdma: { 1: 1100, 2: 1000, 3: 1200, 4: 800 },
    heroin: { 1: 1500, 2: 1400 }
};

const weights = {
    default: [0.5, 1, 3, 5, 10], coke: [0.25, 0.5, 1, 2], lsd: [1, 2], mdmaTabs: [1, 5, 10]
};

const productImages = {
    weed: { 1: "https://i.postimg.cc/nMGvf409/jamaican-haze.jpg" },
    hash: { 1: "https://i.postimg.cc/sD11WBq4/image.jpg" },
    coke: { 1: "https://i.postimg.cc/3W512jLd/image.jpg" },
    amph: { 1: "https://i.postimg.cc/3Jgrmg9p/image.jpg" },
    meth: { 1: "https://i.postimg.cc/dVPkKsNR/image.jpg" },
    meph: { 1: "https://i.postimg.cc/4NMvHRLn/image.jpg" },
    alpha: { 1: "https://i.postimg.cc/hjmpv3rH/image.jpg" },
    lsd: { 1: "https://i.postimg.cc/yNHGMRzm/250.jpg" },
    mdma: { 1: "https://i.postimg.cc/521GGvJw/image.jpg" },
    heroin: { 1: "https://i.postimg.cc/gkX1RN0k/image.jpg" }
};

const translations = {
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
        phuketDistricts: { "Patong": "Патонг", "Karon": "Карон", "Phuket Town": "Пхукет-таун" },
        pattayaDistricts: { "Central Pattaya": "Центральная Паттайя" },
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
        promoInfo: "Приглашай друзей и получай стафф!"
    }
    // Добавьте переводы для 'en' и 'th', если нужно
};

document.addEventListener('DOMContentLoaded', async () => {
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
    }

    async function manualAddBalance(nickname, amount) {
        try {
            const userRef = db.collection('users').doc(nickname);
            const userDoc = await userRef.get();
            if (userDoc.exists && userDoc.data().received_bonus) {
                console.log(`${nickname} уже получил бонус!`);
                return;
            }
            const newBalance = (userDoc.exists ? userDoc.data().balance : 0) + amount;
            await userRef.set({
                balance: newBalance,
                received_bonus: true
            }, { merge: true });
            if (currentUser === nickname) {
                balance = newBalance;
                document.getElementById('balance').innerText = `${balance} ฿`;
            }
            sendToTelegram(`Админ начислил ${amount} ฿ юзеру ${nickname}. Новый баланс: ${newBalance}`);
        } catch (error) {
            console.error('Ошибка начисления:', error);
        }
    }

    async function loadCurrentUser() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                const userDoc = await db.collection('users').doc(savedUser).get();
                if (userDoc.exists) {
                    const user = userDoc.data();
                    currentUser = savedUser;
                    userLanguage = user.language;
                    balance = user.balance || 0;
                    orderCount = user.order_count || 0;
                    referralCount = user.referral_count || 0;
                    orderHistory = user.order_history || [];

                    document.getElementById('balance').innerText = `${balance} ฿`;
                    document.getElementById('ordersLabel').innerText = translations[userLanguage].ordersLabel + orderCount;
                    document.getElementById('referralsLabel').innerText = translations[userLanguage].referralsLabel + referralCount;
                    updateOrderHistory();
                } else {
                    localStorage.removeItem('currentUser');
                }
            } catch (error) {
                console.error('Ошибка загрузки юзера:', error);
                localStorage.removeItem('currentUser');
            }
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

        try {
            const userDoc = await db.collection('users').doc(nickname).get();
            if (userDoc.exists) {
                document.getElementById('regError').innerText = lang.regErrorTaken;
                return;
            }

            await db.collection('users').doc(nickname).set({
                nickname,
                language,
                balance: 1000,
                order_count: 0,
                referral_count: 0,
                order_history: []
            });

            currentUser = nickname;
            userLanguage = language;
            balance = 1000;
            orderCount = 0;
            referralCount = 0;
            orderHistory = [];

            document.getElementById('profileNameLabel').innerText = lang.profileNameLabel + currentUser;
            document.getElementById('balance').innerText = `${balance} ฿`;
            closeModal('registrationModal');
            showAlert(lang.welcomeMessage.replace('{user}', currentUser));
            loadLanguage();
            sendToTelegram(`Новый юзер зарегался: ${nickname}, язык: ${language}, баланс: 1000 ฿`);
            localStorage.setItem('currentUser', currentUser);
        } catch (error) {
            console.error('Ошибка регистрации:', error);
        }
    }

    async function updateUserData() {
        if (!currentUser) return;
        try {
            await db.collection('users').doc(currentUser).set({
                nickname: currentUser,
                language: userLanguage,
                balance,
                order_count: orderCount,
                referral_count: referralCount,
                order_history: orderHistory
            }, { merge: true });
        } catch (error) {
            console.error('Ошибка обновления юзера:', error);
        }
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
                text: message
            })
        }).catch(error => console.error('Ошибка отправки в Telegram:', error));
    }

    function showPromoDetails() {
        const lang = translations[userLanguage];
        const refLink = currentUser ? `https://t.me/DarkThailandBot?start=${currentUser}` : "Зарегистрируйтесь для получения ссылки!";
        const content = `
            <h2>${lang.promoInfo}</h2>
            <p>${lang.promoBanner}</p>
            <p>${lang.refLinkLabel} <strong>${refLink}</strong></p>
            <button class="buy-button" onclick="closeModal('customModal')">${lang.close}</button>
        `;
        document.getElementById('customContent').innerHTML = content;
        showModal('customModal');
    }

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

    window.toggleCatalog = toggleCatalog;
    window.toggleProfile = toggleProfile;
    window.toggleVacancies = toggleVacancies;
    window.toggleMail = toggleMail;
    window.showProductModal = showProductModal;
    window.buyProduct = buyProduct;
    window.preorderProduct = preorderProduct;
    window.registerUser = registerUser;
    window.applyForJob = applyForJob;
    window.showDepositModal = showDepositModal;
    window.generateDepositAddress = generateDepositAddress;
    window.confirmDeposit = confirmDeposit;
    window.showPromoDetails = showPromoDetails;
});
