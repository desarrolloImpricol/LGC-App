import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CundiAmarillasPage } from '../pages/cundi-amarillas/cundi-amarillas';
import { CundiEmpleosPage } from '../pages/cundi-empleos/cundi-empleos';
import { CundiEventosPage } from '../pages/cundi-eventos/cundi-eventos';
import { CundiNoticiasPage } from '../pages/cundi-noticias/cundi-noticias';
import { CrearNoticiaPage } from '../pages/crear-noticia/crear-noticia';
import { CrearEventoPage } from '../pages/crear-evento/crear-evento';
import { CrearAmarillaPage } from '../pages/crear-amarilla/crear-amarilla';
import { DetalleNoticiaPage } from '../pages/detalle-noticia/detalle-noticia';
import { DetalleEventoPage } from '../pages/detalle-evento/detalle-evento';
import { RecuperarClavePage } from '../pages/recuperar-clave/recuperar-clave';
import { LoginPage } from '../pages/login/login';
import { DetalleDepartamentoPage } from '../pages/detalle-departamento/detalle-departamento';
import { ColombiaPage } from '../pages/colombia/colombia';
import { PublicarPage } from '../pages/publicar/publicar';
import { RegistroPage } from '../pages/registro/registro';
import { MunicipiosPage } from '../pages/municipios/municipios';
import { InicioSesionPage } from '../pages/inicio-sesion/inicio-sesion';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SecureStorage } from '@ionic-native/secure-storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Ng2ImgToolsModule } from 'ng2-img-tools';
import { Facebook } from '@ionic-native/facebook';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Deeplinks } from '@ionic-native/deeplinks';
import firebase from 'firebase';
import { IonicStorageModule } from '@ionic/storage';
import { ListasProvider } from '../providers/listas/listas';
import { TwitterConnect } from '@ionic-native/twitter-connect';




//configuracion firebase
export const firebaseConfig = {
  apiKey: "AIzaSyAkZ46Foccq3CfTDVSy2V8sHOD0lkZNmLE",
  authDomain: "laguiacolombia-5e516.firebaseapp.com",
  databaseURL: "https://laguiacolombia-5e516.firebaseio.com",
  projectId: "laguiacolombia-5e516",
  storageBucket: "laguiacolombia-5e516.appspot.com",
  messagingSenderId: "64367296687"
};

firebase.initializeApp(firebaseConfig)
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CundiAmarillasPage,
    CundiEmpleosPage,
    CundiEventosPage,
    CundiNoticiasPage,
    LoginPage,
    RegistroPage,
    InicioSesionPage,
    RecuperarClavePage,
    DetalleNoticiaPage,
    CrearNoticiaPage,
    PublicarPage,
    CrearEventoPage,
    DetalleEventoPage,
    CrearAmarillaPage,
    MunicipiosPage,
    ColombiaPage,
    DetalleDepartamentoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    Ng2ImgToolsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CundiAmarillasPage,
    CundiEmpleosPage,
    CundiEventosPage,
    CundiNoticiasPage,
    LoginPage,
    RegistroPage,
    InicioSesionPage,
    RecuperarClavePage,
    DetalleNoticiaPage,
    CrearNoticiaPage,
    PublicarPage,
    CrearEventoPage,
    DetalleEventoPage,
    CrearAmarillaPage,
    MunicipiosPage,
    ColombiaPage,
    DetalleDepartamentoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SecureStorage,
    NativeStorage,
    AuthServiceProvider,
    Camera,
    Facebook,
    SocialSharing,
    File,
    FileTransfer,
    Deeplinks,
    ListasProvider,
    TwitterConnect
  ]
})
export class AppModule { }
