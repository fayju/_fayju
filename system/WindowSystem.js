// 
//  WindowSystem.js
//  Assets
//  
//  Created by Gareth Bushell on 2011-05-26.
//  Copyright 2011 fayju. All rights reserved.
// 
#pragma strict
public class WindowSystem extends MonoBehaviour{
	//PURPOSE to send a message to loc all interaction and also sends a message to reenstate other interaction
	//this is only valid during one scene
	//manages its own interaction layer 
	//assumes all other interaction is disabled and it is the windows responsibility to exit
	
	private static var instance : WindowSystem;
	private var currentWindow:GameObject;
	private var prevWindow:GameObject;
	private var callFunction:Function;
	private var windowOpen:boolean = false;
	private var nextWindow:String = "";
	
	static function GetInstance ():WindowSystem {
	    // If the defaultCenter doesn't already exist, we need to create it
	    if (!instance) {
			// Because the NotificationCenter is a component, we have to create a GameObject to attach it to.
		    var gameObjectInstance: GameObject = new GameObject("Default Window Navigator");
		    // Add the NotificationCenter component, and set it as the defaultCenter
		    instance = gameObjectInstance.AddComponent(WindowSystem);
			DontDestroyOnLoad(gameObjectInstance);
		    
	    } 
	    return instance;
	}
	//WindowSystem.GetInstance().isWindowOpen();
	function isWindowOpen():boolean{
		return windowOpen;
	}
	function launchWindow(launchWindow:String ) {
		launchWindow(launchWindow, false);
	}
	//eg monsters token purchase window WindowSystem.GetInstance().launchWindow("BuyTokenBook");
	function launchWindow(resource:String, forceNew:boolean) {
		
		//deactivate otherlayers
		
		nextWindow = "";
		//force pause on teh game
		NotificationCenter.DefaultCenter().PostNotification(gameObject, "OnPauseGame");//a window is opening ensure game is paused
		
		EnvironmentCenter.DefaultCenter().allowMenuRotate();
		
			if(forceNew && windowOpen){
			//	closeWindow();
				if(currentWindow != null){
					currentWindow.SendMessage("deActivateWindow", SendMessageOptions.DontRequireReceiver);
				}
				
				//windowOpen = false;
			 
			}
		//a window will take care of itself and should only be visible by itself as it carries its own camera 
		if(windowOpen ) {//its not been shut so window goes in a queue
			
			//currentWindow.SendMessage("deActivateWindow", SendMessageOptions.DontRequireReceiver);
			//Destroy(currentWindow);
			nextWindow = resource;
		}else{
		 
			currentWindow = Instantiate(Resources.Load(resource));
			currentWindow.SendMessage("activateWindow", SendMessageOptions.DontRequireReceiver);//this starts 
			
		}
		if(currentWindow == null){
			Debug.Log("window "+resource+"failed to create");
		}else{
			
			windowOpen = true;
			Debug.Log("windowOpen set to true");
			NotificationCenter.DefaultCenter().PostNotification(gameObject, "OnLockInteraction");

		}
	
	}
/*	function launchWindow(resource:String, message:String) {
		launchWindow(resource);
	//	currentWindow.SendMessage("SetMessage", message, SendMessageOptions.DontRequireReceiver);
	}
	function launchWindow(resource:String, message:String, buttonType:String) {
		launchWindow(resource);
		currentWindow.SendMessage("SetMessage", message, SendMessageOptions.DontRequireReceiver);
		currentWindow.SendMessage("SetButtons", buttonType, SendMessageOptions.DontRequireReceiver);
	}
	function launchWindow(resource:String, message:String, callFunction:Function) {
		this.callFunction = callFunction;
		launchWindow(resource, message);
		currentWindow.SendMessage("SetMessage", message, SendMessageOptions.DontRequireReceiver);
	}*/
	
	//WindowSystem.GetInstance().closeWindow();
	function closeWindow(){
		//perhaps a caching of teh window elements here ie if it has been opened then hide and deactivate 
		//then when requested again within the same scene just un hide but allow it to be destroyed through the passage between scenes
		//EnvironmentCenter.DefaultCenter().stopMenuRotate();
		if(!currentWindow)
		return;
		
		currentWindow.SendMessage("deActivateWindow", SendMessageOptions.DontRequireReceiver);
	 
	 
			NotificationCenter.DefaultCenter().PostNotification(gameObject, "OnUnLockInteraction");
		if(nextWindow != ""){
			launchWindow(nextWindow);
		}else{
			Debug.Log("windowOpen set to false");
			 
			windowOpen = false;
		} 
		nextWindow = "";
	 
		
	 
	}
	
	function confirmWindow() {
		if(callFunction != null) {
			callFunction();
		}
		closeWindow();
	}
 
}
