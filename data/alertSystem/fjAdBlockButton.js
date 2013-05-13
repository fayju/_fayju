// 
//  fjAdBlockButton.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-10-25.
//  Copyright 2012 fayju. All rights reserved.
// 


class fjAdBlockButton extends fjPulseButton{
	private var isUsed:boolean = false;
	
 
 	//var defaultAd:Texture;
 
	private var definition:Hashtable = new Hashtable();
	var location:String = "gameOverBox";
	var startTexture:Texture;
	var targetMaterial:Material;
	var displayOnLoad:boolean = true;
	private var isDisplayed:boolean = false;
	var noLocalAd:boolean = true;
	private var alertIsReady:boolean = false;
	function Start(){
		
 		//set in visible
		//targetRenderer.enabled = false;
		startTexture = targetMaterial.mainTexture;
		GameSettingsData.GetInstance().init();
		
		NotificationCenter.DefaultCenter().AddObserver(gameObject, "OnLevelComplete");
		
		
		
		hideButton();
	
		if(collider != null){
			collider.enabled = false;
		}
 	  
		 
		/*if(definition.ContainsKey("type")){
			
			if(definition["type"] == "chartboostinter"){
						if(GameSettingsData.GetInstance().chartBoostEnabled()){
							#if UNITY_IPHONE
//IPHONEPLUGIN 							ChartBoostBinding.cacheInterstitial("block");
							#endif
						}
			}
			
		}*/
	 
				/*	{"campaign":"getgamenet",
					"image":"http://images.gamenet.com/blocks/getgamenet1.png",
					"type":"external",
					"payload":"itms-apps://itunes.apple.com/app/id521070578?mt=8",
					"reward":"none",
					"rewardpayload":0,
					"priority":1,
					"weight":1,
					"impressions":999999,
					"voidBlock":true,
					"campaignID":60,
					"interactionIDimp":556,
					"interactionIDclick":557,
					"px1":"test",
					"px2":"test",
					"px3":"test",
					"px4":"test",
					"px5":"test",
					"px6":"0",
					"px7":"0",
					"px8":"0"}*/
					
		//load the image?
		
		super.Start();
		///check location if navigation hide
		StartCoroutine("handleAd");

	}
	function OnDisable(){
		 targetMaterial.mainTexture = startTexture;
	}
	function hideButton(){
		if(!hidden){
			var component:Component[] = scaleTarget.GetComponentsInChildren(Renderer, true);
			for(var comp:Component in component){
				var rend:Renderer = comp as Renderer;
			 
				rend.enabled = false;

			}
			collider.enabled = false;
		  
			hidden = true;
		}
	}
	function handleAd(){
 	  	yield GameSettingsData.GetInstance().waitForLoaded();
		definition=   AdBlocksHandler.GetInstance().GetBlock(location);//returns hashList
		alertIsReady = true;
		if(displayOnLoad){
			//forceActive();
			OnDisplayAd();
		}
		
	}
	function forceActive(){
		gameObject.SetActive(true);
	}
	function OnLevelComplete(){
		forceActive();
		OnDisplayAd();
		
	}
	function OnDisplayAd(){
		//wait until game settings data is ready
		if(!alertIsReady){
			Debug.Log("alert not ready");
		return;
	}
		AdBlocksHandler.GetInstance().incrBlockImpressions(location+"_freq");
		Debug.Log("display alert");
		if(isDisplayed){
			return;
		}
		if(!definition){
			Debug.Log("no definition");
			return;
		}
		if(!definition.ContainsKey("campaign")){
			Debug.Log("no campaign");
			return;
		}
		if(!definition.ContainsKey("impressions")){
			Debug.Log("no impressions");
			return;
		}
			Debug.Log("imp "+(definition["impressions"]));
	 		AdBlocksHandler.GetInstance().ShowBlock(location, definition["campaign"], definition["impressions"] );// as String == "default");//an
		 
		// impression
		if(definition.ContainsKey("image") || definition.ContainsKey("localimage") ){
			var isShown:boolean = false;
			if(	definition.ContainsKey("image")){
				
						var www : WWW =  new WWW(definition["image"]);  //"http://www.fayju.com/blog/wp-content/uploads/2012/10/test.png"

			     		Debug.Log("loading image "+definition["image"]);
				    		yield www;
		 
						if (www.error != null ){
					        Debug.Log(www.error);
				 
						}else{
							//if the scene changes inbetween a load of this add we will need to ignore this
					 
							 	if( www.texture.width > 100){
									isShown = true;
									//employ settings for touch etc
						    		targetMaterial.mainTexture = www.texture;
							
									//trackit
									if(definition.ContainsKey("interactionIDimp")){
										definition["interactionID"] = definition["interactionIDimp"];
										TrackingHandler.GetInstance().TrackEvent(definition);
									}
								}
				
						}
						
						
						if(!isShown){
							definition = AdBlocksHandler.GetInstance().defaultBlock();	
						}
					}
					if(definition.ContainsKey("localimage")){
						var atexture:Texture = Resources.Load(definition["localimage"]);
						targetMaterial.mainTexture = atexture;
						if(noLocalAd){
							return;
						}
						isShown = true;
						
					}
					
				
					
					
				
						//does it have button functionality?
					showButton();
				
				if(definition.ContainsKey("payload")){
					if(collider != null){
						collider.enabled = true;
					}
				}
			
		 isDisplayed = true;
		}
		
	
		//called when the game over window is launched
	}
	function doAction(){
		if(!isUsed){
			super.doAction();
			Debug.Log("do play button action");
			//perform blockaction
		 	GameSettingsData.GetInstance().doBlockAction(definition);
	 			if(definition.ContainsKey("interactionIDclick")){
					definition["interactionID"] = definition["interactionIDclick"];
					if(definition["voidBlock"]  == true){
						AdBlocksHandler.GetInstance().VoidBlock(location +(definition["campaign"] as String));
					}
					TrackingHandler.GetInstance().TrackEvent(definition);
				}
			isUsed = true;
			 Invoke("unuse", 1);
		}
		
	}
	function unuse(){
		isUsed = false;
	}
 
/*

	//"447769692533","447781480190","18/11/10","13:07","Hello William"
	
	//"447769692533","447781480190","18/11/10","13:29","Hello again 1" "447769692533","447781480190","18/11/10","13:29","Hello again 2" "447769692533","447781480190","18/11/10","13:29","And 3"
	//http://ws.textanywhere.net/HTTPRX/GetTextInbound.aspx?Client_Id=CU0623654&Client_Pass=squid1&Inbound_Number=447781480190
*/

}
