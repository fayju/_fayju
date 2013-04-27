// 
//  SceneNavigation.js
//  Assets
//  
//  Created by Gareth Bushell on 2011-05-25.
//  Copyright 2011 fayju. All rights reserved.
// 
#pragma strict

public class SceneNavigator extends MonoBehaviour{
	
	private static var instance : SceneNavigator;
	
	static function GetInstance () : SceneNavigator {
	    // If the defaultCenter doesn't already exist, we need to create it
	    if (!instance) {
	      
	        // Because the NotificationCenter is a component, we have to create a GameObject to attach it to.
	        var gameObjectInstance: GameObject = GameObject.Find("Default Scene Navigator");
			if(!gameObjectInstance){
				gameObjectInstance = new GameObject("Default Scene Navigator"); 
			}
	        // Add the NotificationCenter component, and set it as the defaultCenter
	        instance = gameObjectInstance.GetComponent(SceneNavigator);
			if(!instance){
				instance = gameObjectInstance.AddComponent(SceneNavigator);	
			}

			DontDestroyOnLoad(gameObjectInstance);
	    } 
	    return instance;
	}

	private var lastSceneSelected:String = "";
	private var sceneToLoad:String = "defaultScene";
	private var loadingScreen:String = "defaultScene";	
	
	private var isLoadingScene:boolean= false;

//	SceneNavigator.GetInstance().loadScene("scene"[, delay])
	function loadScene(scene:String):void{
		 loadScene(scene, 0.0);
	}
	
	function loadScene(scene:String, delay:float){
		if(!isLoadingScene){
			#if UNITY_IPHONE
//ETC				EtceteraBinding.showActivityView();
			#endif
			
			isLoadingScene = true;
			lastSceneSelected = Application.loadedLevelName;
			//go to the loading screen to hang
			sceneToLoad = scene;
			if(delay > 0){
				Invoke("goLoadingScene", delay);
			}else{
				goLoadingScene();
			}
			//when the loadingscreen is loaded it will issue a signal to say so
		}else{
			Debug.Log("you can only load one scene at a time ... chill "+scene+" "+sceneToLoad);
		}
	}
	
	function loadPreviousScene():void {
		if(lastSceneSelected == "") {
			loadScene(lastSceneSelected);
		}
	}
	
	function goLoadingScene():void {
		//	Debug.Log("scene hopper "+sceneToLoad+" "+lastSceneSelected+" "+loadingScreen+" "+Application.loadedLevelName);
		//AdvertizingCenter.DefaultCenter().stopAds();
		 Application.LoadLevel(loadingScreen);
	}
	
	//SceneNavigator.GetInstance().loadingSceneComplete();
	function loadingSceneComplete(){
		Invoke("loadSelectedScene",0.4);
	}
	
	function loadSelectedScene():IEnumerator{	
		Application.LoadLevel(sceneToLoad);
	}
	
	//SceneNavigator.GetInstance().sceneLoadingComplete() allows more scene loading
	function sceneLoadingComplete():void{
		#if UNITY_IPHONE
//ETC				 EtceteraBinding.hideActivityView();
		#endif
		isLoadingScene = false;
	}
 
}
