import { Injectable } from '@angular/core';
//Importa biblioteca de Firebase Authentication
import { AngularFireAuth} from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
//Importa biblioteca de Router
import { Router } from '@angular/router';
import { User } from '../entities';


@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(
    private fireauth: AngularFireAuth, 
    private router: Router, 
    private firestore: AngularFirestore,
  ) { }


  getObject( id: string, path: string){
    
    //obtiene playlist segun el id
    return this.firestore//accede a Firestore
    .collection(path)//especifica la colección
    .doc(id)//especifica el documento
    .valueChanges()//obtiene el documento
  }
  //login method
  //Método para Acceder al sistema
  //Necesita parámetro: objeto User
  login(user: any) {
    //método de firebase para acceder al sistema mediante el correo y contraseña
    return this.fireauth.signInWithEmailAndPassword(user.mail,user.password);
    
  }

  //register method
  //Función para Registrarse en el sistema
  //Necesita parámetros: objeto usuario
  register(user: User) {
    //método de firebase para registrarse en el sistema mediante el correo y contraseña
    
    console.log("user value: ", user)
    //método de firebase para registrarse en el sistema mediante el correo y contraseña
    return this.fireauth.createUserWithEmailAndPassword(user.mail, user.password);
  }
  //Función para crear usuario en firestore
  //Necesita parámetros: objeto usuario, dirección de la colección
  createUser(user: User, path: string){
    console.log("datos usuario: ", user)
    //ubica segun la dirección en la colección correspondiente
    this.firestore.collection(path)
    //crea segun la id registrada en direauthentication
    .doc(user.id)
    //establece al usuario segun los campos de usuario
    .set({id: user.id,
      mail: user.mail,
      name: user.name,
      long: user.long,
      lati: user.lati,
    });
  }

  createGeo(){
    console.log("Inicio de creación de geolocalización");
    if(localStorage.getItem("longString")){
    
    const path = "geolocation";
    const id = this.firestore.createId();//crea un ID
    localStorage.setItem("geoID", id);//asignación de Geolocation
    this.firestore.collection(path)
    .doc(id)
    .set({
      id: id,
      uid : localStorage.getItem("idUser"),
      name : localStorage.getItem("nameUser"),
      longitude : localStorage.getItem("longString"),
      latitude : localStorage.getItem("latiString"),
    })
    }
    else{
      alert("error al crear geolocation")
    }
  }
  
  updateGeo(){
    console.log("Actualización de geolocalización");
    console.log("Longitud: ",localStorage.getItem("longString"));
    console.log("Latitud: ",localStorage.getItem("latiString"));
    const path = "users";
    return this.firestore.collection(path)
      .doc(localStorage.getItem("idUser"))//referencia al documento por id
      //actualización de latitud y longitud
      .update({
        long : localStorage.getItem("longString"),
        lati : localStorage.getItem("latiString"),
    })
  }

  //logout method
  //Método para Salir del sistema
  //No necesita parámetros
  logout(){
    //método de firebase para salir del sistema
    this.fireauth.signOut().then(()=>{
      //deshabilitar el token
      localStorage.clear();
      //redieccionar al Inicio de sesión
      this.router.navigate(['/login']);
    }, err=>{
      alert(err.message);

    })
  }

  //forgot password method
  //Método para reestablecer contraseña
  //Necesita parámetro: correo
  forgotPassword(email : string) {
    //método de firebase para reestablecer contraseña mediante correo
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      //redireccionar al dashboard
      alert("Revisa tu correo");
      
    }, err => {
      console.log("error: ", err)
      alert('Something went wrong');
    })
  }
  
  getlocation(): Promise<any>{
    return new Promise ((resolve, reject) =>{
      navigator.geolocation.getCurrentPosition(resp=>{
        resolve ({long: resp.coords.longitude, lati: resp.coords.latitude})
        
      })

    })
  }
  showUsers(){
    //dirección de las playlists
    const path =  "users";
    //retorna los documentos de la colección segun la dirección
    return this.firestore.collection(path)
    .snapshotChanges();//obtiene los documentos
  }
  sendEmailForVarification(user : any) {
    console.log(user);
    user.sendEmailVerification().then((res : any) => {
      this.router.navigate(['/verify']);
    }, (err : any) => {
      alert('Something went wrong. Not able to send mail to your email.')
    })
  }

}
