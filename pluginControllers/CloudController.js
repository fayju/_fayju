// 
//  CloudController.js
//  Assets
//  
//  Created by Gareth Bushell on 2011-09-02.
//  Copyright 2011 fayju. All rights reserved.
// 

class CloudController extends MonoBehaviour{
	private static var instance:CloudController;
	
	public static function GetInstance():CloudController{
		if(!instance){
			var gameObjectInstance:GameObject = new GameObject("CloudController");
			instance = gameObjectInstance.AddComponent(CloudController);
			gameObjectInstance.AddComponent(DuneCloudListener);
			DontDestroyOnLoad(gameObjectInstance);
		}
		return instance;
	}

	private var didSync:boolean = false;
	function OnApplicationPause(isPause:boolean):void{
		if(!isPause){
		 
			 	syncUp();
	 
		}
	}
	function init () {
	
	  	syncUp();
	 
	}
	function syncUp () {
		/*
		 	if(iCloudBinding.isiCloudAvailable())// P31Prefs.iCloudAvailable )
	 	{
		  	Debug.Log("ask to sync");
 				didSync = iCloudBinding.synchronize();
	 
		 	}
		 	else
		 	{
		  	Debug.Log( "iCloud is not available" );
		  }
		*/
	}
 
 
	function stepCloud(){
		/*
 		if(iCloudBinding.isiCloudAvailable() && didSync){
 			var opens:int = PlayerPrefs.GetInt("totalOpens", 0);
			opens++;
			PlayerPrefs.SetInt("totalOpens", opens);
 			iCloudBinding.setInt(PlayerPrefs.GetInt("totalOpens", 0) , "opens_"+SystemInfo.deviceUniqueIdentifier);
		} 
		*/
	}
	//CloudController.GetInstance().checkAllUnlockedItems();
 
	function checkAllUnlockedItems():void{
		return;
	 
		
	}
	//what to save
	//money for sure
	//cars and lands that are unlocked

	// ===========================
	// = Responses from listener =
	// ===========================
	function changeKey (key:String) {
		Debug.Log( key+" < key changed ");	
		
	}
 
}