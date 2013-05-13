#pragma strict
// 
//  GameSettingsData.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-10-07.
//  Copyright 2012 fayju. All rights reserved.
// 
class GameSettingsData extends MonoBehaviour{

/*
never destroyed will load the settings in and then be called to track and pop alerts 
when game exits it will call the data again to refresh it 
*/
	public static var instance:GameSettingsData;
	
	public static function GetInstance():GameSettingsData{
		if(!instance){
			//look for GO
			var go:GameObject = GameObject.Find("GameSettingsDataGameObject");
			if(!go){
				go = new GameObject("GameSettingsDataGameObject");
			}
			instance = go.GetComponent(GameSettingsData);
			if(!instance){
				instance = go.AddComponent(GameSettingsData);
			}
			instance.init();
			DontDestroyOnLoad(go);
		}
		return instance;
	}
	private var bundleVersion:String = "1.4";
	private var isinited:boolean = false;
	private var isloaded:boolean = false;
	 var sessionId:String;
	 var clientId:String;
	 var interactionId:String;
	 var campaignId:String;
	 var isFayjuGame:boolean = true;
	private var lastPauseTime:float = 0.0;
	private var MIN_TIME:float =  60.0 * 3.0;
	private var defaultSettingsPath:String = "_data/settings";
	private var defaultUrl:String = "http://www.fayju.com/frogbox/settings.php?game=fayjuball";//MonsterAte";//
	private var moreGamesURL:String = "";
	private var moreGamesText:String = "GET MORE GAMES!";
	private var moreGamesType:String = "external";
	
	
	private var homePageURL:String = "http://www.fayju.com/";
	private var homePageText:String = "";
	private var homePageType:String = "external";
	
	private var twitterPageURL:String = "http://www.twitter.com/fayju";
	private var twitterPageText:String = "";
	private var twitterPageType:String = "external";
	
	private var facebookPageURL:String = "http://www.facebook.com/fayjugames";
	private var facebookPageText:String = "";
	private var facebookPageType:String = "external";
	
	
 	var settingsData:Hashtable;
	var ServerConnectionTimeOut:int = 10;
	//GameSettingsData.GetInstance().campaignID + "&in=" + GameSettingsData.GetInstance().interactionID + "&us=" + GameSettingsData.GetInstance().clientId + "&se=" + GameSettingsData.GetInstance().sessionId
	private var trackingHandler:TrackingHandler;
	private var alertsHandler:AlertsHandler;
	private var blocksHandler:AdBlocksHandler;
	function waitForLoaded(){
		while(!isloaded){
			yield;
		}
		
	}
	//GameSettingsData.GetInstance().init();
	function init(){
		if(isinited)
		return;
		
		SetTimeStamp("TotalGameTime"+bundleVersion);
		SetClientId();
		
		alertsHandler =  gameObject.AddComponent(AlertsHandler);
		trackingHandler = gameObject.AddComponent(TrackingHandler);
		blocksHandler =  gameObject.AddComponent(AdBlocksHandler);
		StartNewSession ();
		
		clientId = GetClientId();
		sessionId = GetSessionId();
		
		isinited = true;
		//init the object for the first time
		LoadSettingsFile();
	}
	//GameSettingsData.GetInstance().SetTimeStamp(id);
	function SetTimeStamp(stamp:String){
		SetTimeStamp(stamp, false);
	}
	function SetTimeStamp(stamp:String, forceOverride:boolean ){
		var prevString:String = PlayerPrefs.GetString(stamp, "");
		if(prevString == "" || forceOverride == true){//if its not been set
			var dateTime:System.DateTime = System.DateTime.Now;
			var nowString:String = dateTime.ToString();
			PlayerPrefs.SetString(stamp, nowString);
		}
	}
	function GetTimePassed(stamp:String):int{
			SetTimeStamp(stamp);//just in case its not set
			var dateTime:System.DateTime = System.DateTime.Now;
			var prevString:String = PlayerPrefs.GetString(stamp, "");
			var prevTime:System.DateTime = System.DateTime.Parse(prevString);
			var passed:System.TimeSpan = dateTime.Subtract(prevTime);
			var passedSeconds:int = Mathf.Floor(passed.TotalSeconds);
		 
	 		passedSeconds = passedSeconds < 0 ? 0 : passedSeconds;
			return passedSeconds;
	}
	/*
	function OnGUI(){
		
			GUI.Label(Rect (40, Screen.height - 100, 200, 20), "time :"+GetTimePassed("NTestTimeStamp")+ " "+ System.DateTime.Now.ToString());
	}
	*/
	//GameSettingsData.GetInstance().LoadSettingsFile();//call before any bullshit
	function LoadSettingsFile () {
			//load in all the data 
			/*
				var text:TextAsset = Resources.Load(defaultSettingsPath);
				settingsDataRaw = text.text;
				settingsData =  MiniJSON.jsonDecode(settingsDataRaw);
			*/
			SetTimeStamp("lastLoadSettingsTimeStamp", true );
			var settingsDataRaw:String = "";
			//do we have internet access?
			 
			if (Application.internetReachability != NetworkReachability.NotReachable ){
			//yes go get it and then yield wait for it
				var form = new WWWForm();
				var settingsjson:WWW;
				if(isFayjuGame){
					settingsjson = WWW(defaultUrl);
				}else{
			    //form.AddField("frameCount", Time.frameCount.ToString());
				form.AddField("type", "live"); //- this is used for debugging or clean versions and we can set different values in the CMS based on this - 'live', 'debug' or 'clean'
		 		form.AddField("udid", SystemInfo.deviceUniqueIdentifier);
				form.AddField("os", SystemInfo.operatingSystem );// - send in operating system (e.g. 'iPhoneOS5.1.1')
				form.AddField("connection",  Application.internetReachability.ToString ());// - send in connection status - (e.g.i PhoneOS5.1.1-ReachableViaLocalAreaNetwork) 
				form.AddField("client", clientId);// - send in unique ID that importantly stays constant for that game install on that device - needs to say constant through updates as well (e.g. '7fac5d3c9946528825a658600afdca3a2483a9b9dd5de4043d3a9fedb24749a7')
				form.AddField("device", SystemInfo.deviceModel);// - send in device (e.g. 'iPad3Gen' or 'Samsung HTC')
				form.AddField("platform", Application.platform.ToString());// - send on platform ('IPhonePlayer' for all IOS, 'OSXPlayer' for macstore, 'Android' for android)
				form.AddField("version",  bundleVersion);// - send in app version number (e.g. 1.1.2)
		     	form.AddField("bundle",  bundleVersion);// safeguard
				form.AddField("gameversionlifetime",""+GetTimePassed("TotalGameTimePassed"+bundleVersion) );
		// ======================
		// = MONSTERS VARIABLES =
		// ======================
//				form.AddField("totalStars",ScoreData2.GetInstance().getAllStarsAchieved() ); //   - good to see what level people are on so we can give alerts encouraging
//				form.AddField("totalPlatinum",ScoreData2.GetInstance().getAllPlatinumStarsAchieved() );// - as above
				
				//Debug.Log(form.data+"");
			//	form.AddField("gradesUnlocked", );// - we can give alerts saying how cool next grade is and what it contains if we know this
			//	itemsBought - very useful to know if a user has bought stuff already - not sure how best to send that in
		// ======================
		// = MONSTERS VARIABLES =
		// ======================
		    	settingsjson = WWW(defaultUrl, form);
				}
	 			SetTimeStamp("serverConnectionTimeStamp", true);
				while(!settingsjson.isDone && settingsjson.error==null && GetTimePassed("serverConnectionTimeStamp")< ServerConnectionTimeOut)
		        {
						yield settingsjson;
				}
				
				if (settingsjson.error != null){
			        	Debug.Log("error "+settingsjson.error);
					 	settingsDataRaw = GetLocalSettings();
				}else{
					if(!settingsjson.isDone){
						Debug.Log("server Time out");
						settingsDataRaw = GetLocalSettings();
					}else{
						Debug.Log("json from server");
					 	settingsDataRaw = settingsjson.text;
					}
				}
		    	
			}else{
			//or 
			//have we loaded settinsg before  ? 
				settingsDataRaw = GetLocalSettings();
			}
			settingsDataRaw = WWW.UnEscapeURL(settingsDataRaw);
		 
			Debug.Log("parse "+settingsDataRaw);
			//parse it
			settingsData =  MiniJSON.jsonDecode(settingsDataRaw);	
			var isValid:boolean = true;
			if (MiniJSON.lastDecodeSuccessful () && settingsData != null) {

			}else{
				Debug.Log("WARNING :: error decoding live json going local");
					settingsDataRaw = GetLocalSettings();
						Debug.Log("parse local "+settingsDataRaw);
						settingsData =  MiniJSON.jsonDecode(settingsDataRaw);
					if(!MiniJSON.lastDecodeSuccessful () || settingsDataRaw == null){
							Debug.Log("WARNING :: error decoding local json");
							isValid = false;
					}
			}
			/*
			"moreGamesURL":"http://www.gamenet.com/moregames",
			"alertsEnabled":true,
			"timeBetweenAlerts":100,
			"timeBetweenMatchingAlerts":25000,
			"defaultAlertMaxCount":10000,
			
			"rawplotEnabled":true,
			"rawplotCampaignID":60,
			"rawplotViewInteractionID":553,
			*/
			if(isValid){
				//more games button
				if(settingsData.ContainsKey("moreGamesURL")){
					moreGamesURL = settingsData["moreGamesURL"];
				}
				if(settingsData.ContainsKey("moreGamesText")){
						moreGamesText = MonsterSafe(settingsData["moreGamesText"]);
				}
				if(settingsData.ContainsKey("moreGamesType")){
						moreGamesType = settingsData["moreGamesType"];
				}
				//home page url
				if(settingsData.ContainsKey("homePageURL")){
					homePageURL = settingsData["homePageURL"];
				}
				if(settingsData.ContainsKey("homePageText")){
						homePageText = MonsterSafe(settingsData["homePageText"]);
				}
				if(settingsData.ContainsKey("homePageType")){
						homePageType = settingsData["homePageType"];
				}
				//twitter page url
				if(settingsData.ContainsKey("twitterPageURL")){
					twitterPageURL = settingsData["twitterPageURL"];
				}
				if(settingsData.ContainsKey("twitterPageText")){
						twitterPageText = MonsterSafe(settingsData["twitterPageText"]);
				}
				if(settingsData.ContainsKey("twitterPageType")){
						twitterPageType = settingsData["twitterPageType"];
				}	
				//twitter page url
				if(settingsData.ContainsKey("facebookPageURL")){
					facebookPageURL = settingsData["facebookPageURL"];
				}
				if(settingsData.ContainsKey("facebookPageText")){
						facebookPageText = MonsterSafe(settingsData["facebookPageText"]);
				}
				if(settingsData.ContainsKey("facebookPageType")){
						facebookPageType = settingsData["facebookPageType"];
				}
				
				
				//bring in the bloxks see blocksHandler	
				if(settingsData.ContainsKey("blocks")){
					Debug.Log("Enable blocks");
					blocksHandler.SetUpBlocks(settingsData["blocks"] as ArrayList);
					blocksHandler.blocksEnabled = true;
					//no global defaults
				}
				
				//bring in alerts see alertsHandler
				if(settingsData.ContainsKey("alerts") && settingsData.ContainsKey("alertsEnabled") && settingsData.ContainsKey("timeBetweenAlerts") && settingsData.ContainsKey("timeBetweenMatchingAlerts") && settingsData.ContainsKey("defaultAlertMaxCount")){
					alertsHandler.alerts  = settingsData["alerts"] as ArrayList;//a list of alerts grouped by locations
			
					alertsHandler.alertsEnabled = settingsData["alertsEnabled"] == true;
				 	alertsHandler.timeBetweenAlerts = int.Parse(settingsData["timeBetweenAlerts"].ToString());
					alertsHandler.timeBetweenMatchingAlerts = int.Parse(settingsData["timeBetweenMatchingAlerts"].ToString());
					alertsHandler.defaultAlertMaxCount = int.Parse(settingsData["defaultAlertMaxCount"].ToString()) ;
				}else{
					Debug.Log("failed to get alert info");
				}
				
				if(!isFayjuGame){
				//set up tracking (this will need to be split to my tracking)
				if(settingsData.ContainsKey("tracking") && settingsData.ContainsKey("rawplotEnabled") && settingsData.ContainsKey("rawplotCampaignID") && settingsData.ContainsKey("rawplotViewInteractionID")){
					trackingHandler.tracking  = settingsData["tracking"] as ArrayList;//a list of tracking objects by names by location
					trackingHandler.rawplotEnabled = settingsData["rawplotEnabled"] == true;
					campaignId = settingsData["rawplotCampaignID"].ToString();
					interactionId = settingsData["rawplotViewInteractionID"].ToString();
				}else{
					Debug.Log("failed to get tracking info");
				}
			}else{
				trackingHandler.tracking  = new ArrayList();
				trackingHandler.rawplotEnabled = false;
			}
			//check it has what it needs if not go default
			}
			trackingHandler.TrackEvent();
			
			isloaded = true;
			//done 
	}
	function chartBoostEnabled():boolean{
		
	 
	 	if(settingsData.ContainsKey("chartBoostEnabled")){
			return settingsData["chartBoostEnabled"] == true;
		}
		return false; 
	}

	function MonsterSafe(text:String):String{
		
		return text;//
		text = text.ToLower();
		var rep:String = "";
		for(var t :int = 0; t < text.length; t++){
			var skipAdd:boolean = false;
				if(text[t] == "?"){
					skipAdd = true;
						rep = rep+"Y";
				} 
				if(text[t] == ","){
					skipAdd = true;
						rep = rep+"Z";
				}
				if(text[t] == "/"){
					skipAdd = true;
						rep = rep+"X";
				}
				if(text[t] == "."){
					skipAdd = true;
						rep = rep+"W";
				}
				if(text[t] == "="){
					skipAdd = true;
						rep = rep+"V";
				}

			if(!skipAdd){
				rep = rep+text[t];
			}

		}
		//text = rep;
		
		
		return rep;
	}

	function doBlockAction(block:Hashtable){
		if(block.ContainsKey("type")){
			switch(block["type"]){
				case "external":
					if(block.ContainsKey("payload")){
						Application.OpenURL(block["payload"]);
					}
				break;
				case "web":
						if(block.ContainsKey("payload")){
							Application.OpenURL(block["payload"]);
						}
				break;
				case "vunglevideo":
				 	if(block.ContainsKey("payload")){
					 	fjVungleManager.GetInstance().PlayVideo(block["payload"].ToString());
					}else{
						fjVungleManager.GetInstance().PlayVideo();
					}
				break;
				case "chartboost":
					if(GameSettingsData.GetInstance().chartBoostEnabled()){
						fjChartboostManager.GetInstance().MoreGames();
					}
					
					
				
				break;
				case "chartboostinter":
				
					if(GameSettingsData.GetInstance().chartBoostEnabled()){
							fjChartboostManager.GetInstance().ShowInterstitial("block");
					}
				break;
					#if UNITY_IPHONE
					case "tapjoy":
					//IPHONEPLUGIN 	TapjoyCurrencyController.GetInstance().showWall();
					break;
					case "tapjoyinter":
					//IPHONEPLUGIN 	if(!TapjoyCurrencyController.GetInstance().ShowAdd()){
					//IPHONEPLUGIN 	TapjoyCurrencyController.GetInstance().showWall();
					//IPHONEPLUGIN 	}
					break;
					#endif
				case "internal":
					if(block.ContainsKey("payload")){
						InternalAlertHandler.GetInstance().ProcessInternalAlert(block["payload"].ToString());
					}
				break;
				case "none":
				
				break;
			}
		}
		
	}
	function GetHomePageText():String{
		return homePageText;
	}
	function HomePageAction(){		
			switch(homePageType){
					#if UNITY_IPHONE
					case "tapjoy":
						//IPHONEPLUGIN TapjoyCurrencyController.GetInstance().showWall();
					break;
					case "tapjoyinter":
					  //IPHONEPLUGIN   	if(!TapjoyCurrencyController.GetInstance().ShowAdd()){
					  //IPHONEPLUGIN   		TapjoyCurrencyController.GetInstance().showWall();
					  //IPHONEPLUGIN   	}
					break;
					#endif
				case "chartboost":
			      if(GameSettingsData.GetInstance().chartBoostEnabled()){
						fjChartboostManager.GetInstance().MoreGames();
			      	 
				    }

				break;
				case "chartboostinter":
					if(GameSettingsData.GetInstance().chartBoostEnabled()){
							 fjChartboostManager.GetInstance().ShowInterstitial("moreGames");
					}
				break;
					case "external":
							Application.OpenURL(homePageURL);
					break;
					case "none":

					break;
					case "internal":
							InternalAlertHandler.GetInstance().ProcessInternalAlert(homePageURL);
					break;
				default:
						Application.OpenURL(homePageURL);
				break;
			}
	}
	function GetTwitterPageText():String{
		return twitterPageText;
	}
	function TwitterAction(){
		switch(twitterPageType){
			 
				case "external":
						Application.OpenURL(twitterPageURL);
				break;
				case "internal":
						InternalAlertHandler.GetInstance().ProcessInternalAlert(twitterPageURL);
				break;
			default:
					Application.OpenURL(twitterPageURL);
			break;
		}
	}
	function GetFacebookPageText():String{
		return facebookPageText;
	}
	function FaceBookAction(){
		switch(facebookPageType){
			 
				case "external":
						Application.OpenURL(facebookPageURL);
				break;
				case "internal":
						InternalAlertHandler.GetInstance().ProcessInternalAlert(facebookPageURL);
				break;
			default:
					Application.OpenURL(facebookPageURL);
			break;
		}
	}
	function GetMoreGamesText():String{
		return moreGamesText;
	}
	function MoreGamesAction(){
		switch(moreGamesType){
				#if UNITY_IPHONE
				case "tapjoy":
					//IPHONEPLUGIN TapjoyCurrencyController.GetInstance().showWall();
				break;
				case "tapjoyinter":
				  //IPHONEPLUGIN   	if(!TapjoyCurrencyController.GetInstance().ShowAdd()){
				  //IPHONEPLUGIN   		TapjoyCurrencyController.GetInstance().showWall();
				  //IPHONEPLUGIN   	}
				break;
				#endif
				
			case "vunglevideo":
			 //	if(alert.ContainsKey("payload")){
			//	 	fjVungleManager.GetInstance().PlayVideo(alert["payload"].ToString());
			//	}else{
					fjVungleManager.GetInstance().PlayVideo();
			//	}
			break;
			case "chartboost":
		      if(GameSettingsData.GetInstance().chartBoostEnabled()){
		      	fjChartboostManager.GetInstance().MoreGames();
			    }
				
			break;
			case "chartboostinter":
				if(GameSettingsData.GetInstance().chartBoostEnabled()){
					 
						fjChartboostManager.GetInstance().ShowInterstitial("moreGames");//IPHONEPLUGIN 
						 
				}
			break;
			case "external":
					Application.OpenURL(moreGamesURL);
			break;
				case "none":
				
				break;
				case "internal":
				 
						InternalAlertHandler.GetInstance().ProcessInternalAlert(moreGamesURL);
				 
				break;
			default:
				//if(GameSettingsData.GetInstance().chartBoostEnabled()){
					
				 
					Application.OpenURL(moreGamesURL);
				 
			break;
		}
	}
	function GetLocalSettings(){
		var settingsDataRaw:String = PlayerPrefs.GetString ("rawSettingsData"+bundleVersion,"");
		if(settingsDataRaw == ""){
			//just go with default settings
			Debug.Log("load local ");
			var text:TextAsset = Resources.Load(defaultSettingsPath);
			settingsDataRaw = text.text;

		}
		return settingsDataRaw;
	}
	/*
	Arrays
	tracking ArrayList  breakdown to - tracking Objects {"name":"landingPage","campaignID":60,"interactionID":556,"px4":"","px5":"Unknown--Unknown--","px9":"0","enabled":true},
	alerts ArrayList	breakdown to - alertsGroups {"name":"viewGameOver","alertDefinitions":[ alertObject,alertObject]}
	
	alert Definition
						{
						"name":"Get Gamenet App",
						"version":"1",
						"enabled":true,
						"type":"Internal",
						"criteria": {"count":2},
						"priority":1,
						"count":3,
						"title":"Geek Beach News","body":"Get the Gamenet App for free games every day",
						"buttons":[
						{"text":"Not Now","voidAlert":"false"},
						{"text":"YES","voidAlert":"true",
						"actions":	[{"type":"external","payload":"itms-apps://itunes.apple.com/app/gamenet/id521070578?mt=8"}],
						"tracking": {"campaignID":60,"interactionID":555,"px1":"Get Gamenet App","px2":"Get the Gamenet App for free games every day","px4":"","px5":"Unknown--Unknown--","px6":"2","px7":"0","px9":"0","enabled":true}
						}
						],
						
						"tracking":
						{"campaignID":60,"interactionID":554,"px1":"Get Gamenet App","px2":"Get the Gamenet App for free games every day","px4":"","px5":"Unknown--Unknown--","px6":"2","px7":"0","px9":"0","enabled":true}
						}
	
	defaults
	//booleans
	//"FAADEnabled":false,
	//"playHavenEnabled":false,
	
	"tapJoyEnabled":false,//stop it from loading
	"chartBoostEnabled":false,//stop it from loading
	"appODayEnabled":false;

	"moreGamesURL":"http://www.gamenet.com/moregames",
	"alertsEnabled":true,
	"timeBetweenAlerts":100,
	"timeBetweenMatchingAlerts":25000,
	"defaultAlertMaxCount":10000,
	"rawplotEnabled":true,
	"rawplotCampaignID":60,
	"rawplotViewInteractionID":553,
	
	*/
	
	
	//handle the session and stuff variables
	function OnApplicationPause (tempBool : boolean) {
	     if (tempBool) {
	          // if the argument for this function is true, the app has just been paused
 				lastPauseTime = Time.realtimeSinceStartup;
				
	     }
	     else {
	          // if the argument for this function is false, then the app has just been resumed
			//
				if ( GetTimePassed("lastLoadSettingsTimeStamp") > MIN_TIME)
				{
					StartNewSession ();
					LoadSettingsFile();
				}
	 
	     }
	}
	function OnApplicationFocus (focus : boolean) {
		if (focus) {
		//	StartNewSession ();
		}
	}
  	function StartNewSession(){
		Debug.LogWarning("GameSettingsData - New sessionId set");
		PlayerPrefs.SetString ("TrackingSession", GenerateNewKey(32));  
		PlayerPrefs.Save();
	}
	function GetSessionId():String{
			return PlayerPrefs.GetString ("TrackingSession");  
	}
	function SetClientId():String{
			var newId:String = GenerateNewKey(64);
			var id:String =  PlayerPrefs.GetString ("TrackingClient");
			Debug.Log("client id found  :"+id);
			if(id.length < 2){
				PlayerPrefs.SetString ("TrackingClient", newId);
				id = newId;
			}
			if(newId == id){
					Debug.LogWarning("GameSettingsData - New clientId set");
			}
			PlayerPrefs.Save();
			return id;
	}
	function GetClientId():String{

			return PlayerPrefs.GetString ("TrackingClient", "");  ;
	}
	private function GenerateNewKey( length :int ):String
	{

		var key:String = Md5Sum(SystemInfo.deviceName + Time.time.ToString() + (UnityEngine.Random.value).ToString ()) + Md5Sum(System.DateTime.Now.ToString() +  Application.systemLanguage.ToString() + (UnityEngine.Random.value).ToString ());
		return key.Substring(0, length);	
	}
	private function Md5Sum(strToEncrypt: String)
	{
		var encoding = System.Text.UTF8Encoding();
		var bytes = encoding.GetBytes(strToEncrypt);

		// encrypt bytes
		var md5 = System.Security.Cryptography.MD5CryptoServiceProvider();
		var hashBytes:byte[] = md5.ComputeHash(bytes);

		// Convert the encrypted bytes back to a string (base 16)
		var hashString = "";

		for (var i = 0; i < hashBytes.Length; i++)
		{
			hashString += System.Convert.ToString(hashBytes[i], 16).PadLeft(2, "0"[0]);
		}

		return hashString.PadLeft(32, "0"[0]);
	}
	
	
}