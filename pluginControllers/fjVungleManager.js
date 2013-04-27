#pragma strict
import System.Collections.Generic;
// 
//  fjVungleManager.js
//  Assets
//  
//  Created by Gareth Bushell on 2013-04-09.
//  Copyright 2013 Fayju Ltd. All rights reserved.
// 


class fjVungleManager extends MonoBehaviour{
	private static var instance:fjVungleManager;
	
	public static function GetInstance():fjVungleManager{
		if(!instance){
			var gameObjectInstance:GameObject = new GameObject("fjVungleManager");
			instance = gameObjectInstance.AddComponent(fjVungleManager);
			gameObjectInstance.AddComponent(FayjuBallVungleEventListener);
			DontDestroyOnLoad(gameObjectInstance);
		}
		return instance;
	}
	public var isEnabled:boolean = true;
	private var listener:FayjuBallVungleEventListener;
	function StartVungle(vungleId:String){
		
		if(!isEnabled)
		return;
		listener = gameObject.GetComponent(FayjuBallVungleEventListener);
		
		#if UNITY_IPHONE
			var userData = new Dictionary.<String,Object>();
			userData["gender"] = 0; // 0 unknown, 1 male, 2 femail
			userData["adOrientation"] = 1; // 0 unknown, 1 portrait, 2 landscape
			userData["locationEnabled"] = true;
			//userData["age"] = 21;
			VungleBinding.startWithAppIdAndUserData(vungleId, userData );
			//VungleBinding.setCacheSize( 12 );//default is 20
		 
		#endif
	}
	function isAvailable():boolean{
		if(!isEnabled)
		return;
			
		return VungleBinding.isAdAvailable();
	}
	function PlayVideo(){
		if(!isEnabled)
		return false;
		VungleBinding.playModalAd( true );
	}
	function PlayVideo(action:String){
		if(!isEnabled)
		return;
		//what action oare we looking for
		VungleBinding.playInsentivisedAd( action, true );
	}
	function vungleMoviePlayedEventComplete(){
		if(listener.videoComplete){
			//we can unlock whatever
		}
		AlertsHandler.GetInstance().showSimpleMessage("output", listener.results, "OK");
 
		
	}
}