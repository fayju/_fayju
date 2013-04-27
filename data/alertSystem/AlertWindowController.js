// 
//  InteractiveWindowController.js
//  Assets
//  
//  Created by Gareth Bushell on 2011-05-26.
//  Copyright 2011 fayju. All rights reserved.
// 
class AlertWindowController extends InteractiveWindowController{
	
	
	var buttons:ConfirmWindowButton[];
	var copyDisplay:TextDisplayParagraph;
	var titleDisplay:TextDisplay;
	
  	function activateWindow(){
		//call in favours to set up the alert window
		//get the alert
		var currentAlert:Hashtable = AlertsHandler.GetInstance().currentDisplayAlert;
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
		if(currentAlert.ContainsKey("body")){
			var body:String =  GameSettingsData.GetInstance().MonsterSafe(currentAlert["body"].ToString());
			 copyDisplay.updateText(body);
		}
		if(currentAlert.ContainsKey("title")){
			var title:String =  GameSettingsData.GetInstance().MonsterSafe(currentAlert["title"].ToString());
			 titleDisplay.DrawText(title);
		}
		var alertButtons:ArrayList = currentAlert["buttons"] as ArrayList;
		if(alertButtons.Count >= buttons.length){
			for(var i:int =0 ; i < buttons.length; i++){
				buttons[i].alertId = currentAlert["name"].ToString() + currentAlert["version"].ToString();
				buttons[i].alertName= currentAlert["name"].ToString();
				buttons[i].defineButton(alertButtons[i] as Hashtable);
			}
		}else{
			if(alertButtons.Count == 1){
			//	buttons[0].hide();
			//	buttons[1].
			}
		}
		super.activateWindow();
		 
	}
	
}