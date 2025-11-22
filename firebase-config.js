// Firebase konfiguratsiyasi - VERCELL UCHUN
const firebaseConfig = {
    apiKey: "AIzaSyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    authDomain: "ilova-ff6cb.firebaseapp.com",
    databaseURL: "https://ilova-ff6cb-default-rtdb.firebaseio.com",
    projectId: "ilova-ff6cb",
    storageBucket: "ilova-ff6cb.appspot.com",
    messagingSenderId: "123456789000",
    appId: "1:123456789000:web:aaaaaaaaaaaaaaaaaaaaaa"
};

// Firebase ni ishga tushirish
function initializeFirebase() {
    try {
        // Firebase allaqachon ishga tushganligini tekshirish
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase Vercel da ishga tushdi!');
        } else {
            firebase.app(); // Allaqachon ishga tushgan app dan foydalanish
        }
        return firebase.database();
    } catch (error) {
        console.error('❌ Firebase ishga tushirishda xatolik:', error);
        return null;
    }
}

// Database ni olish
const database = initializeFirebase();

// Firebase funksiyalari
const FirebaseManager = {
    // Database mavjudligini tekshirish
    isDatabaseReady() {
        return database !== null;
    },

    // Telefondan yangi mahsulot qabul qilish
    listenForScannedProducts(callback) {
        if (!this.isDatabaseReady()) {
            console.error('Database tayyor emas!');
            return;
        }
        
        database.ref('scannedProducts').on('child_added', (snapshot) => {
            const product = snapshot.val();
            console.log('📱 Telefondan yangi mahsulot:', product);
            callback(product);
            snapshot.ref.remove();
        });
    },

    // Telefon ulanganligini tekshirish
    checkPhoneConnection(callback) {
        if (!this.isDatabaseReady()) return;
        
        database.ref('phoneConnected').on('value', (snapshot) => {
            callback(snapshot.exists());
        });
    },

    // Telefon ulanganligini bildirish
    setPhoneConnected() {
        if (!this.isDatabaseReady()) return;
        database.ref('phoneConnected').set(true);
    },

    // Test yozish
    testConnection() {
        if (!this.isDatabaseReady()) return;
        
        database.ref('vercelTest').set({
            message: 'Vercel test',
            timestamp: new Date().toISOString(),
            url: window.location.href
        }).then(() => {
            console.log('✅ Vercel test yozildi');
        }).catch(error => {
            console.error('❌ Vercel test xatosi:', error);
        });
    }
};

// Vercel muhitini tekshirish
console.log('🌐 Vercel muhiti:', {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    href: window.location.href
});

// 2 soniyadan keyin test ishga tushadi
setTimeout(() => {
    if (FirebaseManager.isDatabaseReady()) {
        FirebaseManager.testConnection();
    }
}, 2000);