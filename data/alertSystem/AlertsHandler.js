#pragma strict
// 
//  AlertsHandler.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-10-07.
//  Copyright 2012 fayju. All rights reserved.
// 
class AlertsHandler extends MonoBehaviour{
	
	public static var instance:AlertsHandler;
	
	public static function GetInstance():AlertsHandler{
		if(!instance){
				var go:GameObject = GameObject.Find("GameSettingsDataGameObject");
			 		if(!go){
						go = new GameObject("GameSettingsDataGameObject");
					}
					instance = go.GetComponent(AlertsHandler);
					if(!instance){
						instance = go.AddComponent(AlertsHandler);
					}
				 
					if(!instance){
						Debug.Log("Alerts not set up properly");
					}
		}
		return instance;
	}
	//AlertsHandler.GetInstance().currentDisplayAlert;
	var alerts:ArrayList;
	var alertsEnabled:boolean = false;
	var timeBetweenAlerts:int = 100;
	var timeBetweenMatchingAlerts:int = 25000;
	var defaultAlertMaxCount:int = 10000;
	
	var lastAlertLaunch:float = 0;
	var firstAlert:boolean = true;
	private var alertLaunchTimes:Hashtable = new Hashtable();
	private var alertBlankSpots:Hashtable = new Hashtable();
	private var gameNotShownAlert:boolean = true;
	var currentDisplayAlert:Hashtable;
	
 
	function checkAlert(location:String){
		if(!alerts)
		return;
		Debug.Log("check alerts");
		//if(!alertsEnabled)
		//return;
		setImpression(location);
		if(GameSettingsData.GetInstance().GetTimePassed("anyAlertLastlaunched") > timeBetweenAlerts || firstAlert){
			
		 
			firstAlert = false;
		}else{
			Debug.Log("not enough time");
			 
			return;
		}
		
	
	 
		//how long since last alert?
		
		
		//run through alerts and find locations
		var isFound:boolean = false;

		 var alertGroup:Hashtable;
		for(var i:int = 0; i < alerts.Count; i++){
			var entry:Hashtable = alerts[i] as Hashtable;
			if(entry.ContainsKey("name")){
				if(entry["name"] == location){
						alertGroup = alerts[i] as Hashtable;
						isFound = true;
					
				}
			}
		}
		
			if(!isFound){
				Debug.Log("failed to find Alert Group object "+location);
			 
				return;
			}
			if(!alertGroup.ContainsKey("alertDefinitions")){
					Debug.Log("not found alertDefinitions");
			 
				return;
			}

			
			var alertList:ArrayList = alertGroup["alertDefinitions"] as ArrayList;
			if(alertList.Count < 1){
			 
			 	Debug.Log("alertList not a list");
				return;
			}
			
			//run through the alerts
			var displayAlert:Hashtable;
			isFound = false;
			for(i = 0; i < alertList.Count; i++){
			
					//find the next alert that can display
					var currentAlert:Hashtable = alertList[i] as Hashtable;
					//each alert here gets an inpression increment
				
					
					//timeBetweenMatchingAlerts = 10;
					
					//can it be launched?
					//check integrety
						if(currentAlert.ContainsKey("name") && currentAlert.ContainsKey("version") && currentAlert.ContainsKey("count") && currentAlert.ContainsKey("type") && currentAlert.ContainsKey("buttons")){
					
							var dName:String = currentAlert["name"].ToString() + currentAlert["version"].ToString();
							//
							var myTime:int = timeBetweenMatchingAlerts;
							if(currentAlert.ContainsKey("timebetween")){
								var atime:int = currentAlert["timebetween"];
								if(atime > 0){
									myTime = atime;
								}
							}
						
					 			if( canLaunchAlert(dName, myTime)){// it may also have been voided
									setImpression(dName);
									//check criteria?
									//if(!isFound){	//replace with selected and set via priority
										
										
									 var acnt:int = currentAlert["count"];//how many times it can show before voided
										
										var lcount:int = getAlertLaunchCount(dName);
								
										//put void lert in here 
									 	if( lcount <= acnt || Application.isEditor){//its been called to many time*/
											//proceeding
											var checkPriority:boolean = false;
											
										 	if(currentAlert.ContainsKey("criteria")){
												var criteria:Hashtable = currentAlert["criteria"] as Hashtable;
												if(criteria.ContainsKey("count")){
													var crite:int = criteria["count"];
													var spots:int = getImpressions(dName);
													if(	spots >= crite ){
														checkPriority = true;
															
													}else{
															Debug.Log("not impressions to meet criteria");
													}
												}
											}else{ 
												//its not been voided
												checkPriority = true;
											 
									 		}
											if(checkPriority){
												if(isFound){
													//compare priority
													if(displayAlert.ContainsKey("priority") ){
														if(currentAlert.ContainsKey("priority")){
															var dPriority:int = displayAlert["priority"];
															var cPriority:int = currentAlert["priority"];
															if(dPriority >= cPriority ){
																//no change
															}else{
																displayAlert = currentAlert;
															}
														}else{
															//no change
														}
													}else{
														if(currentAlert.ContainsKey("priority")){
															displayAlert = currentAlert;
														}else{
															//no change
														}
													}
												 
													isFound = true;
													
												}else{
													displayAlert = currentAlert;
													isFound = true;	
												}
											}
											
										}
					 		//};
					}
				 
				}
			}
			
			if(!isFound){
					Debug.Log("no alert picked from list");
			
				return;
			}
				Debug.Log("process alert");
 
			processAlert(displayAlert);
			
			/*
			{
			"name":"Visit Geekbeach",
			"version":"1","enabled":true,"type":"Internal","criteria": {"count":4},"priority":1,"count":1,
			"title":"Monsters News","body":"Check out Chartboost games?",
			"buttons":[
			{"text":"Not Now","voidAlert":"false"},
			{"text":"YES","voidAlert":"true",
			"actions":
			[
			{"type":"chartboost","payload":"none"}
			],
			"tracking":
			{"campaignID":60,"interactionID":555,"px1":"Visit Geekbeach","px2":"Check out Chartboost games?","px4":"","px5":"Unknown--Unknown--","px6":"4","px7":"0","px9":"0","enabled":true}
			}
			],
			"tracking":
			{"campaignID":60,"interactionID":554,"px1":"Visit Geekbeach","px2":"Check out Chartboost games?","px4":"","px5":"Unknown--Unknown--","px6":"4","px7":"0","px9":"0","enabled":true}
			}
			
			*/
	}
	function canLaunchAlert(alert:String, myTime:int):boolean{
		//PlayerPrefs.GetBool(name+"_voided", false)
		if(Application.isEditor){
			return true;
		}
		if(isVoidAlert(alert)){
			return false;
		}
		
		var canLaunch:boolean = false;
		if(getAlertLaunchCount(alert) == 0 ){
			//never launched
			canLaunch = true;
		}else{
			//it has launched before so ...
			var timeSinceLastLaunch:int = GameSettingsData.GetInstance().GetTimePassed("alert_"+alert);
			
			if(timeSinceLastLaunch >= myTime){
				canLaunch = true;
			}
			
		}
		
		return canLaunch;
		
	}
	function showSimpleMessage(title:String, message:String, button:String){
			var alert:Hashtable = {"type":"localMessage", "name":"localMessage" , "version": "one"} ;
			var buttonAr :ArrayList = new ArrayList();

			alert["title"]= title;
			alert["body"] = message;
			/*
				buttons[i].alertId = currentAlert["name"].ToString() + currentAlert["version"].ToString();
				buttons[i].alertName= currentAlert["name"].ToString();
				*/
			var blankButton:Hashtable = {"text":"","voidAlert":"false" , "alertId": "localMessageOne", "alertName":"localMessage"};
			var actions:ArrayList = new ArrayList();
			var actionButton:Hashtable = {"text":button,"voidAlert":"false","actions":actions , "alertId": "localMessageOne", "alertName":"localMessage"};
			buttonAr.Add(blankButton);
			buttonAr.Add(actionButton);
			alert["buttons"] = buttonAr;


			AlertsHandler.GetInstance().showMessage(alert);



	}
		function showMessage(alert:Hashtable){
		/*	//{"type":"message", "title":"helo world", "body":"what the alrt says", "buttons"};
			"buttons":[
			{"text":"","voidAlert":"false"},
			{"text":"OK","voidAlert":"false",
			"actions":
			[
			],
			*/
		//	messageOndisplay = true;
			//get rid of any existing alerts
				currentDisplayAlert = alert;
				WindowSystem.GetInstance().launchWindow("windows/_isolationCamera_Alert");

		}
	function processAlert(alert:Hashtable){
		gameNotShownAlert = false;
		GameSettingsData.GetInstance().SetTimeStamp("anyAlertLastlaunched", true);
		yield WaitForSeconds(0.5);
		//	if(currentAlert.ContainsKey("name") && currentAlert.ContainsKey("version") && currentAlert.ContainsKey("count") && currentAlert.ContainsKey("type") && settingsData.ContainsKey("buttons")){
		//PASSED
		Debug.Log("alert process");
		currentDisplayAlert = alert;
		var dName:String = currentDisplayAlert["name"].ToString() + currentDisplayAlert["version"].ToString();
		incrAlertLaunchCount(dName);
		var counts:int = currentDisplayAlert["count"];
		if(getAlertLaunchCount(dName) >= counts){
			//void it
			VoidAlert(dName);
		}
		GameSettingsData.GetInstance().SetTimeStamp("alert_"+dName, true);
		 
		//does it have tracking?
		if(alert.ContainsKey("tracking")){
			var tracking:Hashtable = alert["tracking"] as Hashtable;
			TrackingHandler.GetInstance().TrackEvent(tracking);
		}

		//will need to looks at how an alert is structured
		if(!alert.ContainsKey("buttons")){
			return;
		}
		//make the buttons objects 
		switch(alert["type"]){
			case "Internal":
				WindowSystem.GetInstance().launchWindow("windows/_isolationCamera_Alert");
			break;
			case "BlueBox":
				WindowSystem.GetInstance().launchWindow("windows/_isolationCamera_Alert");
			//launch blue box
			//do I want etc ?
			break;
			case "vunglevideo":
			 	if(alert.ContainsKey("payload")){
				 	fjVungleManager.GetInstance().PlayVideo(alert["payload"].ToString());
				}else{
					fjVungleManager.GetInstance().PlayVideo();
				}
			break;
			case "chartboostinter":
				#if UNITY_IPHONE
				  
				//IPHONEPLUGIN ChartBoostBinding.showInterstitial(currentDisplayAlert["name"].ToString());
				#endif
			break;
			case "tapjoyinter":
				#if UNITY_IPHONE
				//IPHONEPLUGIN TapjoyCurrencyController.GetInstance().ShowAdd();
				#endif
			break;
			case "rate":
					#if UNITY_IPHONE
					var rateId:String = "425652036";
			 		//IPHONEPLUGIN 	EtceteraBinding.askForReview( "Rate Dune Rider?", "If you like the game please rate it", "itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id="+rateId );
			 		#endif
			break;
		}
		
	}
//AlertsHandler.GetInstance().VoidAlert
	function VoidAlert(name:String){
		PlayerPrefs.SetInt(name+"_voided", 1);
	}
	function isVoidAlert(name:String):boolean{
		return (PlayerPrefs.GetInt(name+"_voided", 0) == 1);
	}
	function getImpressions(name:String):int{
		 
			return PlayerPrefs.GetInt(name+"_impressions",0);
	}
	function setImpression(name:String){
		
		
		var cnt:int = PlayerPrefs.GetInt(name+"_impressions", 0);
		cnt++;
		PlayerPrefs.SetInt(name+"_impressions", cnt);
		 
	}
	function getTimeSinceAlert(name:String):int{
		if(!alertLaunchTimes.ContainsKey(name)){
			
			return -1;
		}
		return alertLaunchTimes[name];
	}
	function getAlertLaunchCount(name:String):int{
		 var cnt:int = PlayerPrefs.GetInt(name+"_launches", 0);
		return cnt;
		//return alertLaunchTimes[name];
	}
	function incrAlertLaunchCount(name:String){
		 var cnt:int = PlayerPrefs.GetInt(name+"_launches", 0);
		cnt++;
		PlayerPrefs.SetInt(name+"_launches", cnt);
		//return alertLaunchTimes[name];
	}
 
	/*
		alertsHandler.alertsEnabled = settingsData["alertsEnabled"];
		alertsHandler.timeBetweenAlerts = settingsData["timeBetweenAlerts"];
		alertsHandler.timeBetweenMatchingAlerts = settingsData["timeBetweenMatchingAlerts"];
		alertsHandler.defaultAlertMaxCount = settingsData["defaultAlertMaxCount"];
	*/
}
