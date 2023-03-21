import { ProformaPage } from './../proforma/proforma.page';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { finalize, Observable } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  quoteForm: FormGroup;

  unregisteredCol: AngularFirestoreCollection<any>;

  Url!: Observable<string>;

  orderId!: string;
isCamera:boolean = false;
  downloadUrl!: string;
  base64Image!: string;
  selectedFile!: File;
  uploadPercent!: Observable<number>;
  constructor(private http: HttpClient,
              private afs: AngularFirestore,
              private loadingController: LoadingController,
              private alertCtrl: AlertController,
              private storage: AngularFireStorage,
              private modalController: ModalController,
              private data: Storage,
              private fb: FormBuilder) {
                this.quoteForm = this.fb.group({
                  pickup:[, [Validators.required]],
                  drop:[, [Validators.required]]
                })

                this.unregisteredCol = this.afs.collection<any>("Orders");
                this.data.create();
                
                
  }

  async openCamera(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      source: CameraSource.Prompt,
      resultType: CameraResultType.Base64,
    });
    console.log(image.base64String);
    this.base64Image = 'data:image/jpeg;base64,' +image.base64String;
 
 
    this.uploadOne();
    // Can be set to the src of an image now
    // imageElement.src = imageUrl;

  }
  async presentLoading(msg: string) {
    const loading = await this.loadingController.create({
      message: msg,
    });
    await loading.present();
  }
  async submit(){
   
    this.presentLoading("Please wait...")
    let id = this.afs.createId();
    let obj = {
      pickup: this.quoteForm.value.pickup,
      drop: this.quoteForm.value.drop,
      isSubmitted: true,
      image:this.downloadUrl,
      createdAt: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      orderId: id,
      userId:"",
      images: "",
      sender: {
        Address:"",
        FullName:"",
        MobileNo:"",
        Name:"",
        SAddress:"",
        completeAddress:"",
        gst:""
      },
      receiver:  {
        Address:"",
        FullName:"",
        MobileNo:"",
        Name:"",
        SAddress:"",
        completeAddress:"",
        gst:""
      },
      first: "",
      vehicleType: "",
      date:"",
      time: "",
      endTime: "",
      startTime: "",
      ishelper: false,
      ispacking: false,
      status:'pink',
      isCompleted: false,
      isRejected: false,
      isAccepted: false,
      message:"Order status will appear here",
      startOTP: "",
      stopOTP: "",
      orderLiveTime: 90,
      serviceProviderId:"",
      serviceProvider: "",
      SPMobileNo:"",
      DriverMobileNo:"",
      VehNo:"",
      Freight:0,
      adv:0,
      helper:0,
      package: 0,
      waiting: 0,
      cancel:0,
      payment: "",
      conNo: "",
      gstType:"",
      gstPercent:0,
      isVehicleAuto: "",
      vehicleImageUrl: ""


    }
    this.orderId = id;

    this.unregisteredCol.doc(id).set(obj).then(async (done) =>{
      console.log(done);
      console.log(id);
      
      this.loadingController.dismiss();
      this.fetchOrderUpdate(id);
      
    }).catch((error) => this.loadingController.dismiss() );
    
  }

  async fetchOrderUpdate(id:any){
    this.presentLoading("Please Wait Fetching Quote...");

    this.afs.doc(`Orders/${id}`)
    .valueChanges(['modified', 'added'])
    .subscribe((data: any) =>{
      console.log(data);
      if(data?.['status'] === 'grey'){
        //Show proforma here
        this.presentModalProforma(data);

        this.loadingController.dismiss();
      }
      
    }, (error) =>{
      this.loadingController.dismiss();
    })
  }
 
  async uploadOne(){
    let loading = await this.loadingController.create({
      message: "Uploading image..."
    })
    await loading.present();
  
      var currentDate = Date.now();
      const file: any = this.base64ToImage(this.base64Image);
      const filePath = `Images/${currentDate}`;
      const fileRef = this.storage.ref(filePath);
  
      const task = this.storage.upload(`Images/${currentDate}`, file);
      task.snapshotChanges()
        .pipe(finalize(async () => {
            this.Url = fileRef.getDownloadURL();
            await loading.dismiss();
            this.Url.subscribe(downloadURL => {
              if (downloadURL) {
                this.showSuccesfulUploadAlert();
                console.log(downloadURL);
                this.downloadUrl = downloadURL;
              }
              
            });
          
        })
        )
        .subscribe(url => {
          if (url) {
            console.log(url);
            // this.UrlOne = url;
          }
        }, async (error) =>{
            await loading.dismiss();
            console.log(error);
            
        });
    }

    async presentModalProforma(quote: any) {
      const modal = await this.modalController.create({
      component: ProformaPage,
      backdropDismiss: false,
      componentProps: { quote: quote }
      });
    
      await modal.present();
    
    }

    async showSuccesfulUploadAlert() {
      const alert = await this.alertCtrl.create({
        cssClass: 'basic-alert',
        header: 'Uploaded',
        subHeader: 'Image uploaded successfully',
        buttons: ['OK']
      });
  
      await alert.present();
    }
  
    base64ToImage(dataURI:any) {
      const fileDate = dataURI.split(',');
      // const mime = fileDate[0].match(/:(.*?);/)[1];
      const byteString = atob(fileDate[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: 'image/png' });
      return blob;
    }
    

    
  

}
