#pragma strict
// 
//  fjRestorePurchasesButton.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-10-09.
//  Copyright 2012 fayju. All rights reserved.
// 
class fjRestorePurchasesButton extends fjPulseButton {
 	private var isUsed:boolean = false;
 
	function Start():void{
		super.Start();
		///check location if navigation hide

		//hideButton();			
	 
 
	}
	
	function doAction(){
		if(!isUsed){
			super.doAction();
			#if UNITY_IPHONE
			//EtceteraBinding.showBezelActivityViewWithLabel("connecting...");
			NotificationCenter.DefaultCenter().PostNotification(gameObject, "OnLockInteraction");
//IPHONEPLUGIN 			StoreKitBinding.restoreCompletedTransactions();
			#endif
		 	Invoke("unuse",0.4);
			isUsed = true;
			 
		}
	}
	function unuse(){
		isUsed = false;
	}
 
}