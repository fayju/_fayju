#pragma strict
// 
//  AdBlocksHandler.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-10-25.
//  Copyright 2012 fayju. All rights reserved.
// 
//AdBlocksHandler.GetInstance().getBlockImpressions(dName);
class AdBlocksHandler extends MonoBehaviour{
	
	public static var instance:AdBlocksHandler;
	
	public static function GetInstance():AdBlocksHandler{
		if(!instance){
				var go:GameObject = GameObject.Find("GameSettingsDataGameObject");
			 		if(!go){
						go = new GameObject("GameSettingsDataGameObject");
					}
					instance = go.GetComponent(AdBlocksHandler);
					if(!instance){
						instance = go.AddComponent(AdBlocksHandler);
					}
				 
					if(!instance){
						Debug.Log("Blocks not set up properly");
					}
		}
		return instance;
	}
	/*
	
	"blocks":[ 
	{ "name":"gameOverBox", "frequency":3, "blockDefinitions": [ 
	 
				{"campaign":"getgamenet",
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
				"px8":"0"},
 {"campaign":"visitgamenet","image":"http://images.gamenet.com/blocks/visitgamenet1.png","type":"web","payload":"http://www.gamenet.com","reward":"none","rewardpayload":0,"priority":1,"weight":1,"impressions":999999,"voidBlock":true,"campaignID":60,"interactionIDimp":556,"interactionIDclick":557,"px1":"test","px2":"test","px3":"test","px4":"test","px5":"test","px6":"0","px7":"0","px8":"0"}, {"campaign":"getfreecoins","image":"http://images.gamenet.com/blocks/freecoins1.png","type":"tapjoy","payload":"tapjoy","reward":"none","rewardpayload":0,"priority":1,"weight":1,"impressions":999999,"voidBlock":true,"campaignID":60,"interactionIDimp":556,"interactionIDclick":557,"px1":"test","px2":"test","px3":"test","px4":"test","px5":"test","px6":"0","px7":"0","px8":"0"}, {"campaign":"chartboostinter","image":"http://images.gamenet.com/blocks/getgamenet1.png","type":"chartboostinter","payload":"itms-apps://itunes.apple.com/app/id521070578?mt=8","reward":"none","rewardpayload":0,"priority":1,"weight":1,"impressions":999999,"voidBlock":true,"campaignID":60,"interactionIDimp":556,"interactionIDclick":557,"px1":"test","px2":"test","px3":"test","px4":"test","px5":"test","px6":"0","px7":"0","px8":"0"}, {"campaign":"chartboost","image":"http://images.gamenet.com/blocks/getgamenet1.png","type":"chartboost","payload":"itms-apps://itunes.apple.com/app/id521070578?mt=8","reward":"none","rewardpayload":0,"priority":1,"weight":1,"impressions":999999,"voidBlock":true,"campaignID":60,"interactionIDimp":556,"interactionIDclick":557,"px1":"test","px2":"test","px3":"test","px4":"test","px5":"test","px6":"0","px7":"0","px8":"0"}, {"campaign":"twittergamenet","image":"http://images.gamenet.com/blocks/getgamenet1.png","type":"external","payload":"http://www.twitter.com/gamenet","reward":"batteries","rewardpayload":100,"priority":1,"weight":1,"impressions":5,"voidBlock":true,"campaignID":60,"interactionIDimp":556,"interactionIDclick":557,"px1":"test","px2":"test","px3":"test","px4":"test","px5":"test","px6":"0","px7":"0","px8":"0"} ] } ],
*/


	//AlertsHandler.GetInstance().currentDisplayAlert;
	var blocks:ArrayList;
	var blocksEnabled:boolean = false;
 
	 	
	var currentDisplayBlock:Hashtable;
	var selectionList:Hashtable;
 
 	function defaultBlock():Hashtable{
	//randomness if needed // potentially interactive
	return {"campaign":"default", "localimage":"_AdDefaultPlacement", "impressions":-1 };
	}
	function ShowBlock(location:String,campaign:String, maxImpressions:int){//} isDefault:boolean){
		//creates an impression of the currently selected block
	 

		var isDefault:boolean = ( campaign == "default");//an
	
		
		//if its the last impression then reset the whole list to wipe it
	if(!isDefault){
	if(selectionList.ContainsKey(location)){
		 var currentBlockOrder:int = PlayerPrefs.GetInt( "currentBlockOrder_"+location, 0);
	
		
		var Found = false;
		currentBlockOrder++;
			 var priorityRandomArray:ArrayList = selectionList[location] as ArrayList;
			if(currentBlockOrder >= priorityRandomArray.Count){
				currentBlockOrder = 0;
			}
			
			var cbl:int = currentBlockOrder;
			//	make sure its found it may have been voided
			for(var i:int = cbl ; i < priorityRandomArray.Count ; i++){
					if(!isVoidBlock(location+priorityRandomArray[i]) && !Found){
						currentBlockOrder = i;
						Found = true;
					}
			}
		 
		if(!Found){
			currentBlockOrder = 0;
		}
	
		PlayerPrefs.SetInt( "currentBlockOrder_"+location, currentBlockOrder);
		
		//ok 
		incrBlockImpressions(location+ campaign );
			
			if(maxImpressions != 0){
				if(getBlockImpressions(location+campaign) > maxImpressions){
					//we are done 
					Debug.Log("block seen too many times");
					resetList();
				}
			}
			
	}
	}	//
	 
	}
	function resetList(){
		SetUpBlocks(blocks);
	}
	//"gameOverBox"
	function SetUpBlocks(ar:ArrayList){
		blocksEnabled = true;
	blocks = ar;
	selectionList = new Hashtable();

	
	 		for(var i:int = 0; i < blocks.Count; i++){
				var entry:Hashtable = blocks[i] as Hashtable;
				if(entry.ContainsKey("name")){
					Debug.Log("decodiong block "+entry["name"]);
				 	var priorityList:ArrayList = new ArrayList();
					var maxPriority:int = 20;
					for(var pr:int = 0; pr <= maxPriority; pr++){
						priorityList.Add(new HashArray());
					}
					var blockGroup:Hashtable = blocks[i] as Hashtable;
					
					var blockList:ArrayList = blockGroup["blockDefinitions"] as ArrayList;
					
					var freq:int =  blockGroup["frequency"];
					//inits the freq
					var curFreq:int = PlayerPrefs.GetInt((entry["name"]+"_freq")+"_impressionsC", freq);
					//setBlockImpressions(, freq);
					var priorityRandomArray:ArrayList = new ArrayList();
						for(var b:int = 0; b < blockList.Count; b++){

								//find the next alert that can display
								var currentBlock:Hashtable = blockList[b] as Hashtable;
								if(currentBlock.ContainsKey("campaign") && currentBlock.ContainsKey("image") && currentBlock.ContainsKey("priority") && currentBlock.ContainsKey("impressions")){
									//add names to priorities
									
								 
									var p:int = int.Parse(currentBlock["priority"].ToString());
								 		var imp:int = int.Parse(currentBlock["impressions"].ToString());
										var impCount:int = getBlockImpressions((entry["name"] as String)+( currentBlock["campaign"] as String));
										if(impCount < imp){//just don't add it

											if(currentBlock.ContainsKey("weight") && p < maxPriority){
												var myWeight :int = currentBlock["weight"];
												for(var w:int = 0; w < myWeight; w++){
													var phash:HashArray = priorityList[p] as HashArray;
													phash.Add(currentBlock["campaign"]);
													priorityList[p] = phash;
												}	
											}
										}
								
								}
										
						}
						
					 	//run through prioritylists and jumble the arrays
					
					
						for(var pd:int = maxPriority; pd >= 0 ; pd--){
								var phasha:HashArray = priorityList[pd] as HashArray;
							phasha.ShuffleArray();
							for(var h:int = 0; h < phasha.length; h++){
								if(!isVoidBlock((entry["name"] as String)+phasha.Get(h)) ){
									priorityRandomArray.Add(phasha.Get(h));
								}
							}
							//randomize
						}
						
						
							//then add then together highest priority to lowest 
					 PlayerPrefs.SetInt( "currentBlockOrder_"+entry["name"], 0);
					Debug.Log(entry["name"]+" "+priorityRandomArray.ToString());
					 selectionList[entry["name"]] = priorityRandomArray;
						
					
					
					 

				 
				}
			}
	}
	//AdBlocksHandler.GetInstance().GetBlock("gameOverBox");//returns hashList
	function GetBlock(location:String):Hashtable{
		
		//does freq allow it?
		
		
		if(!blocksEnabled ){
			Debug.Log("not enabled ");
			return defaultBlock();
		}
		if(!selectionList.ContainsKey(location)){
			Debug.Log("no location "+location);
			return defaultBlock();
		}
		if(!blocks)
		return defaultBlock();
		//get the block is different to show the block
		 
	  
		//run through blocks and find locations
		var isFound:boolean = false;

		var blockGroup:Hashtable;
		for(var i:int = 0; i < blocks.Count; i++){
			var entry:Hashtable = blocks[i] as Hashtable;
			if(entry.ContainsKey("name")){
				if(entry["name"] == location){
						blockGroup = blocks[i] as Hashtable;
						
					
						isFound = true;
						
					
					
				}
			}
		}
		

			if(!isFound){
				Debug.Log("failed to find Alert Group object "+location);
				return defaultBlock();
			}else{
				if(blockGroup.ContainsKey("frequency")){
					var freq:int =  blockGroup["frequency"];
					Debug.Log("testing freq :"+freq);
					Debug.Log("get block "+getBlockImpressions(location+"_freq"));
					var gb:int = getBlockImpressions(location+"_freq");
					if(gb >  freq){
						Debug.Log("reset blocks ");
						resetBlockImpressions(location+"_freq");
					}

						if(getBlockImpressions(location+"_freq") == freq){//first time it will be	 
								//show it
						}else{
								Debug.Log("to frequent "+location);
								return defaultBlock();
						}
				}
			}
			if(!blockGroup.ContainsKey("blockDefinitions")){
				Debug.Log("not found blockDefinitions");
				return defaultBlock();
			}

			var blockList:ArrayList = blockGroup["blockDefinitions"] as ArrayList;
			if(blockList.Count < 1){
			 
			 	Debug.Log("blockList not a list");
				return defaultBlock();
			}
			
			//run through the alerts
			var displayBlock:Hashtable;
			isFound = false;
			
			 var currentBlockOrder:int = PlayerPrefs.GetInt( "currentBlockOrder_"+location, 0);
			 var priorityRandomArray:ArrayList = selectionList[location] as ArrayList;
			if(priorityRandomArray.Count > currentBlockOrder){
	
			var selectedName:String = priorityRandomArray[currentBlockOrder];

			for(i = 0; i < blockList.Count; i++){
			
					//find the next alert that can display
					var currentBlock:Hashtable = blockList[i] as Hashtable;
					//can it be launched?
					//check integrety ?
					//
						if(currentBlock.ContainsKey("campaign") && currentBlock.ContainsKey("image") && currentBlock.ContainsKey("impressions") && currentBlock.ContainsKey("type")){
					
							var dName:String = currentBlock["campaign"].ToString();
							//
								if(dName == selectedName){
					 			if( canDisplayBlock(location+dName) ){// it may also have been voided
 
										var acnt:int = currentBlock["impressions"];//how many times it can show before voided
										
										//var lcount:int = getBlockImpressions(dName);
								
										//put void lert in here 
									 	//if( lcount <= acnt){//its been called to many time*/
												//proceeding
												if(!isFound){
									 				displayBlock = currentBlock;
													isFound = true;
												}
											 
				 
									//	}else{
											//been called to man times?
											
											
									//	}
									}
										//alert counts?//timeBetweenMatchingAlerts
							}
						}
					}
			}
			
			if(!isFound){
					Debug.Log("no block picked from list");
			
					return defaultBlock();
			}
				Debug.Log("process block ");
				//not an impression here just a request to load
				
			//	if(isValidBlock(displayBlock)){
					return displayBlock;
			//	}
				
				
 			 
		
			
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
	function canDisplayBlock(block:String):boolean{
		//PlayerPrefs.GetBool(name+"_voided", false)
		 
		if(isVoidBlock(block)){
			Debug.Log("block is void "+block);
		 	return false;
		}
		
		var canDisplay:boolean = true;
		if(getBlockImpressions(block) == 0 ){
			//never launched
			canDisplay = true;
		}else{
			//it has launched before so ...
		  
		}
		
		return canDisplay;
		
	}
	/*function isValidBlock(block:Hashtable){
		if(block.ContainsKey("campaign"))
	}*/
	
	/*
	
	function processAlert(alert:Hashtable){
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
		GameSettingsData.GetInstance().SetTimeStamp(dName,true);//set time since launch
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
			case "chartboostinter":
				ChartBoostBinding.showInterstitial(currentDisplayAlert["name"].ToString());
			break;
		}
		
	}
	
	*/
//AlertsHandler.GetInstance().VoidAlert
	function VoidBlock(name:String){
		PlayerPrefs.SetInt(name+"_Blockvoided", 1);
	}
	function isVoidBlock(name:String):boolean{
		return (PlayerPrefs.GetInt(name+"_Blockvoided", 0) == 1);
	}
 
 
	function getBlockImpressions(name:String):int{
		 var cnt:int = PlayerPrefs.GetInt(name+"_impressionsC", 0);
		return cnt;
		//return alertLaunchTimes[name];
	}
	function incrBlockImpressions(name:String){
	
		 var cnt:int = PlayerPrefs.GetInt(name+"_impressionsC", 0);
		cnt++;
		
			Debug.Log("inrement impressions for "+name+" "+cnt);
		PlayerPrefs.SetInt(name+"_impressionsC", cnt);
		//return alertLaunchTimes[name];
	}
	function setBlockImpressions(name:String, amt:int){
		PlayerPrefs.SetInt(name+"_impressionsC", amt);
	}
 	function resetBlockImpressions(name:String){
 
	setBlockImpressions(name, 0);
		//return alertLaunchTimes[name];
	}
	/*
		alertsHandler.alertsEnabled = settingsData["alertsEnabled"];
		alertsHandler.a = settingsData["timeBetweenAlerts"];
		alertsHandler.timeBetweenMatchingAlerts = settingsData["timeBetweenMatchingAlerts"];
		alertsHandler.defaultAlertMaxCount = settingsData["defaultAlertMaxCount"];
	*/
}
