import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


// Configurações do Firebase

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Função para login e redirecionamento baseado no tipo de usuário
const loginBtn = document.getElementById("submitSignIn");
loginBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    // Realiza o login com Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Busca o documento do usuário no Firestore
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const role = docSnap.data().role;


      // Redireciona para a página de acordo com o tipo
      if (role === "professor") {
        window.location.href = "professor.html";
      } else if (role === "funcionario") {
        window.location.href = "funcionario.html";
      } else {
        alert("Tipo de usuário desconhecido.");
      }
    } else {
      alert("Usuário não encontrado no banco de dados.");
    }
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Email ou senha incorretos.");
  }
});

// Função para verificar se o usuário está logado 
export function checkAuthRedirect() {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "index.html"; // Redireciona para a página de login
    }
  });
}

