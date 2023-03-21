import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-proforma',
  templateUrl: './proforma.page.html',
  styleUrls: ['./proforma.page.scss'],
})
export class ProformaPage implements OnInit {

  @Input() quote!:any;
  FreightCharges: any;
  advanceCharges: any;
  cancelCharges: any;
  helperCharges: any;
  waitingCharges: any;
  packagingCharges: any;
  totalCharges: any;
  grandTotalCharges: any;
  paymentCharges: any;
  gstCharges: any;

  cgst: any;
  sgst: any;

  ugst: any;
  igst: any;

  isHelper: any;
  isPacking: any;

  senderObj: any;
  receiverObj: any;

  gstType: any;
  gstPercent: any;

  companyName = "FRUGAL INNOVATIONS PVT LTD";

  gst = "27AACCF5797L1ZY";
  companyAddress = "VASUDHA STASHA, WARJE PUNE 411021 MAHARASHTRA.";

  todaysDate= "";
  invoiceNumber: any;
  currentYear: any;
  futureYear: any;

  private orderCollection!: AngularFirestoreCollection<any>;
  orders!: Observable<any[]>;

  createOrderSub: Subscription = new Subscription;

  isGst:boolean = false;
  isCgstSgst: boolean = false;
  isIgstUIgst: boolean = false;
  invoicestartvalue: any= 0;

  constructor(private modalController: ModalController,
    private db: AngularFireDatabase,
    private afs: AngularFirestore,
   
              private http: HttpClient) { 
                this.db.object('key').valueChanges().subscribe((val: any) =>{
                  console.log(val);
                  this.invoicestartvalue =val;
                  this.generateInvoiceNumber(val);
                  
                })
              }


  ngOnInit() {
    console.log(this.quote);
    this.currentYear = moment().format("YY");
    this.futureYear = moment().add(1, "year").format("YY");
    console.log("Current Year:- "+ this.currentYear);
    console.log("Future Year:- "+ this.futureYear);
    
    this.todaysDate = moment().format("DD/MM/YYYY");

    this.advanceCharges = this.quote['adv'];
    this.cancelCharges = this.quote['cancel'];
    this.helperCharges = this.quote['helper'];
    this.waitingCharges = this.quote['waiting'];
    this.packagingCharges = this.quote['package'];
    this.paymentCharges = this.quote['payment'];
    this.gstPercent = this.quote['gstPercent'];
    this.gstType = this.quote['gstType'];
    this.isHelper = this.quote['ishelper'];
    this.isPacking = this.quote['ispacking'];
    this.FreightCharges = this.quote['Freight'];

    this.senderObj = this.quote['sender'];
    this.receiverObj = this.quote['receiver'];
    this.invoiceNumber = this.generateInvoiceNumber(this.invoicestartvalue);
    console.log(this.invoiceNumber);
    if(this.gstType == "IGST"){
      this.isGst = true;
      this.isCgstSgst = false;
      this.isIgstUIgst = false;
    }

    else if(this.gstType == "CGSTSGST"){
      this.isGst = false;
      this.isCgstSgst = true;
      this.isIgstUIgst = false; 
      let percent = this.gstPercent;
      this.cgst = this.gstPercent / 2;
      this.sgst = this.gstPercent / 2;
      console.log(`CGST ${this.cgst} SGST ${this.sgst}`);
      
    }
    else if(this.gstType == "CGSTUGST"){
      this.isGst = false;
      this.isCgstSgst = false;
      this.isIgstUIgst = true; 
      let percent = this.gstPercent;
      this.cgst = this.gstPercent / 2;
      this.ugst = this.gstPercent / 2;
      console.log(`CGST ${this.cgst} UGST ${this.ugst}`);
    }
    

    console.log(`gstType:- ${this.gstType} and Percent is:- ${this.gstPercent}`);
    this.calculateTotalAndGST(this.helperCharges, this.packagingCharges, this.cancelCharges, this.FreightCharges, 0,this.waitingCharges);
    
  }

  close(){
    this.modalController.dismiss();
  }

  GoToRegistrationPage(){
    console.log("Go TO Registration Page");
    
  }
  generateInvoiceNumber(value:any){
    let incValue = parseInt(value);
    let plusOneValue = incValue + 1;
    console.log("incValue:- "+ incValue);
    
    console.log(this.currentYear+ this.futureYear+"/"+ plusOneValue);
    this.invoiceNumber = this.currentYear+ this.futureYear+"/"+ plusOneValue;

    


  }

  calculateTotalAndGST(helper:any, packing:any, cancel:any, freight:any, insurance:any,waiting:any){
    let h = parseInt(helper);
    let p = parseInt(packing);
    let c = parseInt(cancel);
    let f = parseInt(freight);
    let i = parseInt(insurance);
    let w = parseInt(waiting);
    let total = f ;
    console.log(`helper ${h}`);
    console.log(`packing ${p}`);
    console.log(`cancel ${c}`);
    console.log(`frieght ${f}`);
    console.log(`insurance ${i}`);
    console.log(`waititng ${w}`);
    
    console.log(`Total is ${total}`);
    this.totalCharges = total;

    if(this.isCgstSgst){
      let gst = (f * this.gstPercent) / 100;
      this.gstCharges = gst;
  
      let cgst = (f * this.gstPercent) / 100;
      let sgst = (f * this.gstPercent) / 100;
  
      this.cgst = cgst;
      this.sgst = sgst;
  
      this.grandTotalCharges = total + cgst + sgst;
      console.log(`Grand total is:- ${this.grandTotalCharges}`);
    }

    if(this.isGst){
      let gst = (f * this.gstPercent) / 100;
      this.gstCharges = gst;
  
   
  
      this.grandTotalCharges = total + gst;
      console.log(`Grand total is:- ${this.grandTotalCharges}`);
    }

    if(this.isIgstUIgst){
     
  
      let igst = (f * this.gstPercent) / 100;
      let ugst = (f * this.gstPercent) / 100;
  
      this.igst = igst;
      this.ugst = ugst;
  
      this.grandTotalCharges = total + igst + ugst;
      console.log(`Grand total is:- ${this.grandTotalCharges}`);
    }
    
    
  }
  }


