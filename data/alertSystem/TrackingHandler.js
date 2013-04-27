#pragma strict
// 
//  TrackingHandler.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-10-07.
//  Copyright 2012 fayju. All rights reserved.
// 
class TrackingHandler extends MonoBehaviour{
	
	public static var instance:TrackingHandler;
	
	public static function GetInstance():TrackingHandler{
		if(!instance){
				var go:GameObject = GameObject.Find("GameSettingsDataGameObject");
			 	if(!go){
					go = new GameObject("GameSettingsDataGameObject");
				}
				instance = go.GetComponent(TrackingHandler);
				if(!instance){
					instance = go.AddComponent(TrackingHandler);
				}
				if(!instance){
					Debug.Log("TrackingHandler not set up properly");
				}
		}
		return instance;
	}
	

	var tracking:ArrayList;//these are the names tracking events
	var rawplotEnabled:boolean = false;
	var rawplotCampaignID:int = 60;
	var rawplotViewInteractionID:int = 553;
	
	
	/*	"rawplotEnabled":true,
		"rawplotCampaignID":60,
		"rawplotViewInteractionID":553,
	*/
	function TrackLocation(name:String){
		TrackLocation(name, new Hashtable());
	}
	function TrackLocation(name:String, vars:Hashtable){
		
		//if(GameSettingsData.GetInstance().chartBoostEnabled()){
			//	ChartBoostBinding.trackEvent(name);
		//}
		if(!rawplotEnabled)
		return;
		//get the tracking from the trackinglist by name
		//merge with vars
		var track:Hashtable;
		var isFound:boolean = false;
			for (var i:int = 0; i < tracking.Count; i++) {
				var entry:Hashtable = tracking[i] as Hashtable;
				if(entry["name"] == name){
					track = tracking[i] as Hashtable;
					isFound = true;
				}
			}
			
			if(!isFound){
				Debug.Log("failed to find Tracking object");
				return;
			}
		
		
		//merge the tables	
	 
			for(var str:String in vars.Keys){
				 Debug.Log(str +" : "+vars[str]); 
				if(!track.ContainsKey(str)){
					track.Add(str, vars[str]);
				}
			}
			TrackEvent(track);
	}
	function TrackEvent(){
		TrackEvent(new Hashtable());
	}
	function TrackEvent(vars:Hashtable){
		
		if(!rawplotEnabled)
		return;
		
		
		var item:TrackItem = new TrackItem();
		
		
		item.interactionId =GameSettingsData.GetInstance().interactionId;
		item.campaignId = GameSettingsData.GetInstance().campaignId;
			item.clientId =GameSettingsData.GetInstance().clientId;
			item.sessionId = GameSettingsData.GetInstance().sessionId;
		
		for(var str:String in vars.Keys){
		//	 Debug.Log(str +" : "+vars[str] ); 
			switch(str){
				case "px1":
					item.strings[0] = vars[str].ToString ();
				break;
				case "px2":
					item.strings[1] = vars[str].ToString ();
				break;
				case "px3":
					item.strings[2] = vars[str].ToString ();
				break;
				case "px4":
					item.strings[3] = vars[str].ToString ();
				break;
				case "px5":
					item.strings[4] = vars[str].ToString ();
				break;
				case "px6":
					item.ints[0] = int.Parse(vars[str].ToString ());
				break;
				case "px7":
					item.ints[1] = int.Parse(vars[str].ToString ());
				break;
				case "px8":
					item.ints[2] = int.Parse(vars[str].ToString ());
				break;
				case "px9":
					item.ints[3] = int.Parse(vars[str].ToString ());
				break;
				
				case "interactionID":
					item.interactionId = vars[str].ToString ();
				break;
				case "campaignID":
					item.campaignId = vars[str].ToString ();
				break;
					case "url":
						item.url = vars[str].ToString ();
					break;
			
			}
		}
		
		
		TrackTheItem(item);
	}
	function TrackTheItem(item:TrackItem){
	  var interactionCount:int = PlayerPrefs.GetInt ( "Rawplot_interactionCount" , 0 );
	interactionCount++;
	 PlayerPrefs.SetInt ( "Rawplot_interactionCount" , interactionCount );
 
/*Debug.Log(item.url );
Debug.Log(item.campaignId  );
Debug.Log(item.interactionId );
Debug.Log(item.clientId );
Debug.Log(item.sessionId );
Debug.Log(item.strings );
Debug.Log(item.ints+"" );*/
			var url:String = item.url + "?ca=" + item.campaignId + "&in=" + item.interactionId + "&us=" + item.clientId + "&se=" + item.sessionId + "&so=0&px1=" + WWW.EscapeURL(item.strings[0]).Replace("+","%20") + "&px2=" + WWW.EscapeURL (item.strings[1]).Replace ("+","%20") + "&px3=" + WWW.EscapeURL (item.strings[2]).Replace ("+","%20") + "&px4=" + WWW.EscapeURL (item.strings[3]).Replace ("+","%20") + "&px5=" + WWW.EscapeURL (item.strings[4]).Replace ("+","%20") + "&px6=" + WWW.EscapeURL (item.ints[0].ToString()).Replace ("+","%20") + "&px7=" +  WWW.EscapeURL (item.ints[1].ToString()).Replace ("+","%20") + "&px8=" + WWW.EscapeURL (item.ints[2].ToString()).Replace ("+","%20") + "&px9=" + WWW.EscapeURL (item.ints[3].ToString()).Replace ("+","%20")+ "&px10=" + (interactionCount).ToString () + "&r=&h=";
		 	Debug.Log ("Track( " + url + " )");
			var www:WWW = new WWW (url);
			yield www;
		
		
	}
}
class TrackItem{
	var strings:String[] = new String[5];
	var ints:int[] = new int[4];
	var url:String = "http://www.rawplot.com/raw/plot.txt";
	
	var campaignId:String ="";
	var interactionId:String ="";
	var clientId:String ="";
	var sessionId:String ="";
	function TrackItem(){
		for(var i:int = 0; i < 5; i++){
			strings[i] = "";
		}
		for(i = 0; i < 3; i++){
			ints[i] = 0;
		}
	}

}