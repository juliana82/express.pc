import firebase from 'firebase/app';
import 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

function getMicrosoftProvider(tenantId = 'common' , loginHint = null) {
    const provider = new firebase.auth.OAuthProvider('microsoft.com');
};
const firebaseConfig = {
  apiKey: "AIzaSyBV4NFnpYxLJZSrfmtmzKEsTvMaCxFVAxI",
  authDomain: "expresspc-45886.firebaseapp.com",
  projectId: "expresspc-45886",
  storageBucket: "expresspc-45886.firebasestorage.app",
  messagingSenderId: "889958295208",
  appId: "1:889958295208:web:4ba8210fc02275177a449d",
  measurementId: "G-N69C5EDCNK"
};
//configuraçoes de escopo
provider.addScope('email.read');


const params ={
    prompt: 'consent',
    tenant: tenantId,
};

if(loginHint){
    params.login_hint = loginHint; // sugere conta para login
}

provider.setCustomParameters(params);

return provider;

export function signInWithMicrosoftPopup(tenantId, loginHint) {
  const provider = getMicrosoftProvider(tenantId, loginHint);
  
  return firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error("Erro no login com Microsoft:", error);
      throw error;
    });
}

export function singInWithMicrosoftRedirect(tenantId, loginHint) {
 const provider = getMicrosoftProvider(tenantId, loginHint);
 return firebase.auth().singInWithRedirect(provider);
} 


export function handLleMicrosoftRedirectRsult(){
    return firebase.auth()
    .getRedirectResult()
    .then((result) =>{
        if(result.user){
            return result;
        }
        return null;
    })
     .cath((error) => {
        console.error("Erro ao lidar com o resultado do redirecionamento:", error);
        throw error;
     }   
)};


export function linkMicrosoftAccount(tenanId){
    if(!firebase.auth().currentUser){
        return promise.reject(new Error("Nenhum usuário logado"));        
 }
const provider = getMicrosoftProvider(tenantId);

return firebase.auth()
.currentUser
.linlWhinthPopup(provider)
.then((result) => {
    return result;
})
.cath((error) => {
    console.error("Erro ao vincular conta Microsoft:", error);
    throw error;
});
}

export function reauthenticateWithMicrosoft(tenantId){
    if(!firebase.auth().currentUser){
        return promise.reject(new Error("Nenhum usuário logado"));

 }
    const  provider =getMicrosoftProvider(tenantId);

    return firebase.auth()
    .currentUser
    .reauthenticateWithPopup(provider)
    .then((result) => {
        return result;
    })
    .catch((error) => {
        console.error("Erro ao reautenticar com Microsoft:", error);
        throw error;
    });
}

export function onAuthStateChanged(callback) {
    return firebase.auth().onAuthStateChanged(callback);
}

export function signOut() {
    return firebase.auth().signOut()

}
