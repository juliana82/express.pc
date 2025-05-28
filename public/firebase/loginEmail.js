import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBV4NFnpYxLJZSrfmtmzKEsTvMaCxFVAxI",
  authDomain: "expresspc-45886.firebaseapp.com",
  projectId: "expresspc-45886",
  storageBucket: "expresspc-45886.firebasestorage.app",
  messagingSenderId: "889958295208",
  appId: "1:889958295208:web:4ba8210fc02275177a449d",
  measurementId: "G-N69C5EDCNK"
};

// Configurações do Firebase (certifique-se de que firebaseConfig está definido)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Função para login
document.getElementById("submitSignIn")?.addEventListener("click", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const role = userDoc.data().role;
      console.log("Tipo de usuário:", role);
      
      switch(role) {
        case "professor":
          window.location.href = "../professor.html";
          break;
        case "funcionario":
          window.location.href = "../funcionario.html";
          break;
        case "admin":
          window.location.href = "../admin.html";
          break;
        default:
          alert("Tipo de usuário não reconhecido: " + role);
      }
    } else {
      alert("Dados do usuário não encontrados.");
    }
  } catch (error) {
    console.error("Erro detalhado:", error);
    alert(`Erro no login: ${error.message}`);
  }
});
// Exemplo de documento

// Verificação de autenticação
export function checkAuthRedirect() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "../index.html";
    }
  });
}