// 
//  CloseWindowButton.js
//  Assets
//  
//  Created by Gareth Bushell on 2011-05-26.
//  Copyright 2011 fayju. All rights reserved.
// 

class ConfirmWindowButton extends fjPulseButton {
 	private var isUsed:boolean = false;
	var copy:TextDisplay;
	var hasActions:boolean = false;//ie just close
	var actions:ArrayList;
	var hasTracking:boolean = false;//ie just close
	var tracking:Hashtable;
	
	var alertId:String = "";
	var alertName:String = "";
	var voidAlert:boolean = false;
	function doAction(){
		if(!isUsed){
			super.doAction();
			isUsed = true;
			//reenstate is WindowSystem is not going to destroy on close
		 	Invoke("unuse", 1);
	
				if(voidAlert){
					AlertsHandler.GetInstance().VoidAlert(alertId);
				}
				if(hasTracking){
					processTracking();
				}
				if(hasActions){
					processActions();
				}
				
				WindowSystem.GetInstance().confirmWindow();
		
		}
	}
	function processTracking(){
			TrackingHandler.GetInstance().TrackEvent(tracking);
	}
	function processActions(){
		for(var i:int = 0; i< actions.Count; i++){
			var entry:Hashtable = actions[i] as Hashtable;
			if(entry){
				
				if(entry.ContainsKey("type")  ){
					Debug.Log(entry["type"]);
						switch(entry["type"]){
							
							case "coins":
								if(entry.ContainsKey("payload")){
									//Debug.Log("open window "+entry["payload"].ToString());
									var pl:int =  int.Parse(entry["payload"].ToString());
									if(pl > 0){
										 Debug.Log("ADD REWARDED COINS HERE>>>>>>"+pl);
										
									}
								}
							break;
							case "vunglevideo":
							 	if(entry.ContainsKey("payload")){
								 	fjVungleManager.GetInstance().PlayVideo(entry["payload"].ToString());
								}else{
									fjVungleManager.GetInstance().PlayVideo();
								}
							break;
							case "chartboost":
								if(GameSettingsData.GetInstance().chartBoostEnabled()){
										#if UNITY_IPHONE
									//IPHONEPLUGIN 	ChartBoostBinding.showMoreApps();
										#endif
								}
							break;
							case "chartboostinter":
								if(GameSettingsData.GetInstance().chartBoostEnabled()){
										#if UNITY_IPHONE
									//IPHONEPLUGIN 	ChartBoostBinding.showInterstitial("alert");
										#endif
								}
							break;
							#if UNITY_IPHONE
							case "tapjoy":
							//IPHONEPLUGIN 	TapjoyCurrencyController.GetInstance().showWall();
							break;
							case "tapjoyinter":
								//IPHONEPLUGIN 	if(!TapjoyCurrencyController.GetInstance().ShowAdd()){
								//IPHONEPLUGIN 		TapjoyCurrencyController.GetInstance().showWall();
								//IPHONEPLUGIN 	}
							break;
							#endif
							case "flurry":

							break;
							case "none":
							
							break;
							case "web":
								if(entry.ContainsKey("payload")){
									Debug.Log("open window "+entry["payload"].ToString());
									Application.OpenURL (entry["payload"].ToString());
								}
							break;
							case "external":
								if(entry.ContainsKey("payload")){
									Debug.Log("open window "+entry["payload"].ToString());
									Application.OpenURL (entry["payload"].ToString());
								}
							break;
							
							case "internal":
								if(entry.ContainsKey("payload")){
									InternalAlertHandler.GetInstance().ProcessInternalAlert(entry["payload"].ToString());
								}
							break;
								case "none":

								break;
						}
				}
			
			
			}
		}
	}
	function defineButton(buttonDef:Hashtable){
		/*
			{"text":"YES","voidAlert":"true",
			"actions":
			[
			{"type":"chartboost","payload":"none"}
			],
			"tracking":
			{"campaignID":60,"interactionID":555,"px1":"Visit Geekbeach","px2":"Check out Chartboost games?","px4":"","px5":"Unknown--Unknown--","px6":"4","px7":"0","px9":"0","enabled":true}
			}
			*/
			var acopy:String = "OK";
			if(buttonDef.ContainsKey("text")){
				acopy =  GameSettingsData.GetInstance().MonsterSafe(buttonDef["text"].ToString());
			}
			if(acopy == ""){
				hideButton();
				return;	
			}
			copy.DrawText(acopy);
			
			
			if(buttonDef.ContainsKey("actions")){
				actions = buttonDef["actions"] as ArrayList;
				if(actions){
					if(actions.Count > 0){
						hasActions = true;	
					}
				}
			}
			if(buttonDef.ContainsKey("tracking")){
				tracking = buttonDef["tracking"] as Hashtable;
				if(tracking){
						hasTracking = true;	
				}

			}
			
			if(buttonDef.ContainsKey("voidAlert")){
				var va:String = buttonDef["voidAlert"].ToString();
				voidAlert =  (va == "true");
				
			}
			
			if(actions){//caching
				for(var i:int = 0; i< actions.Count; i++){
					var entry:Hashtable = actions[i] as Hashtable;
					if(entry){

						if(entry.ContainsKey("type")  ){
							Debug.Log(entry["type"]);
								switch(entry["type"]){
									case "chartboost":
										if(GameSettingsData.GetInstance().chartBoostEnabled()){
												#if UNITY_IPHONE
												//ChartBoostBinding.cacheMoreApps();
												#endif
										}
									break;
									case "chartboostinter":
										if(GameSettingsData.GetInstance().chartBoostEnabled()){
											#if UNITY_IPHONE
										//IPHONEPLUGIN 	ChartBoostBinding.cacheInterstitial("alert");
											#endif
										}
									break;
									case "tapjoy":
											
									break;
									case "flurry":

									break;
									case "none":

									break;
									case "web":
									 
									break;
									case "external":
									 
									break;
								}
						}


					}
				}
			}
			
			//VoidAlert?
	}
	function unuse():void{
		isUsed = false;
	}

 
 
}