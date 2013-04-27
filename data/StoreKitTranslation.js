#pragma strict
// 
//  StoreKitTranslation.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-10-09.
//  Copyright 2012 fayju. All rights reserved.
// 

class StoreKitTranslation extends MonoBehaviour{
	
	
	static var instance:StoreKitTranslation;
	static function GetInstance():StoreKitTranslation{
		if(!instance){
 
			instance = FindObjectOfType(StoreKitTranslation);
		  	if(!instance){
				var go:GameObject = new GameObject("tempStoreKitTranslation");
				instance = go.AddComponent(StoreKitTranslation);
			}
		}
		return instance;
	}
	
	function unlockPurchase(data:Hashtable){
		//{"productId":transaction.productIdentifier,"transactionId":transaction.transactionIdentifier, "receipt":transaction.base64EncodedTransactionReceipt,"success":false}
	 	//track purchase
		/*
		switch(data["productId"]){
				case "com.geekbeach.amonsteratemyhomework.unlockallgrade2":
					ScoreData2.GetInstance().unlockZone(1,true);
				break;
				case "com.geekbeach.amonsteratemyhomework.unlockallgrade3":
					ScoreData2.GetInstance().unlockZone(2, true);
				break;
				case "com.geekbeach.amonsteratemyhomework.unlockallgrade4":
					ScoreData2.GetInstance().unlockZone(3,true);
				break;
				case "com.geekbeach.amonsteratemyhomework.unlockallgrade5":
					ScoreData2.GetInstance().unlockZone(4,true);
				break;
				case "com.geekbeach.amonsteratemyhomework.unlockallgrade6":
					ScoreData2.GetInstance().unlockZone(5,true);
				break;
			}*/
				NotificationCenter.DefaultCenter().PostNotification(gameObject, "OnUnlockZone");
				NotificationCenter.DefaultCenter().PostNotification(gameObject, "OnUnLockInteraction");
		 
		
	}
	function trackPurchase(data:Hashtable){
			TrackingHandler.GetInstance().TrackLocation("purchaseProduct",{"px1":data["productId"], "px2":data["receipt"], "px3":""+data["success"]});
	
	}
	function purchaseActionComplete(){
			NotificationCenter.DefaultCenter().PostNotification(gameObject, "OnUnLockInteraction");
	}
	function restoreComplete(){
			NotificationCenter.DefaultCenter().PostNotification(gameObject, "OnUnLockInteraction");
			NotificationCenter.DefaultCenter().PostNotification(gameObject, "OnUnlockZone");
	}
	
}
 