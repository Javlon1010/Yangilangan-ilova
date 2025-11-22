// Firebase kutubxonalari avtomatik yuklanishi uchun
if (typeof firebase === 'undefined') {
    console.error('Firebase kutubxonasi yuklanmadi!');
}

// Firebase konfiguratsiyasi
const firebaseConfig = {
    apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "ilova-ff6cb.firebaseapp.com",
    databaseURL: "https://ilova-ff6cb-default-rtdb.firebaseio.com",
    projectId: "ilova-ff6cb",
    storageBucket: "ilova-ff6cb.appspot.com",
    messagingSenderId: "123456789000",
    appId: "1:123456789000:web:aaaaaaaaaaaaaaaaaaaaaa"
};

// Firebase ni ishga tushirish
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase muvaffaqiyatli ishga tushdi!');
} catch (error) {
    console.error('Firebase ishga tushirishda xatolik:', error);
}

const database = firebase.database();

// Firebase funksiyalari
const FirebaseManager = {
    // Telefondan yangi mahsulot qabul qilish
    listenForScannedProducts(callback) {
        database.ref('scannedProducts').on('child_added', (snapshot) => {
            const product = snapshot.val();
            console.log('Yangi mahsulot qabul qilindi:', product);
            callback(product);
            // O'chirish
            snapshot.ref.remove();
        });
    },

    // Kompyuterdan telefonga yuborish
    sendToPhone(productData) {
        return database.ref('fromComputer').push({
            ...productData,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    },

    // Telefon ulanganligini tekshirish
    checkPhoneConnection(callback) {
        database.ref('phoneConnected').on('value', (snapshot) => {
            callback(snapshot.exists());
        });
    },

    // Telefon ulanganligini bildirish
    setPhoneConnected() {
        database.ref('phoneConnected').set(true);
    },

    // Telefon uzilganligini bildirish
    setPhoneDisconnected() {
        database.ref('phoneConnected').remove();
    }
};