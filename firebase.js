// Importando as funções necessárias do Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Configuração do Firebase do seu projeto
const firebaseConfig = {
  apiKey: "AIzaSyBV4NFpYxLZSrfmtmzKEsTWaCxFVAXi",
  authDomain: "expressofc-45886.firebaseapp.com",
  projectId: "expressofc-45886",
  storageBucket: "expressofc-45886.appspot.com",
  messagingSenderId: "88995295208",
  appId: "1:88995295208:web:4ba281fc02275177a449d",
  measurementId: "G-N69C5EDCNK"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
