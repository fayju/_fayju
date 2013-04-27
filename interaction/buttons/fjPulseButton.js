#pragma strict
// 
//  fjPulseButton.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-05-30.
//  Copyright 2012 fayju. All rights reserved.
// 

class fjPulseButton extends InteractiveGameObject{
	
 
 
	var isOn:boolean = false;
	private var hidden:boolean = false;
	var oneTouch:boolean = true;
	private var useTrigger:boolean = true;
	
	public var scaleTarget:GameObject;
	public var scaleUp:float = 1.15;
	//do we want a little spin?
	function Start(){
		startButton();
		super.Start();
	}
	function startButton(){
		 if(!scaleTarget){
			scaleTarget = gameObject;
		}
		if(collider != null && useTrigger){
			collider.isTrigger = true;
		}
	//	setOff();
	}

	function onBeginTouch(io:InteractionObject){
 		//show hit state 
		if(!isOn ){
			print("set him on");
			setOn();
		}
	}
	function onMoveTouch(io:InteractionObject){
		//is it still a valid hit?
	}
	function onStationaryTouch(io:InteractionObject){
	
	}
	function onEndTouch(io:InteractionObject){
		//open a url
		//is it still active 
		
		if(isOn){
			
				var isOk:boolean = true;
				if(oneTouch){
					if(ProxyTouchManager.DefaultManager().getTouches().length > 1){//Input.touchCount
						isOk = false;
					}
				}
				if(isOk){
					doAction();
				}
		
		}
			setOff();
	}
	function onLostTouch(io:InteractionObject){
		
		setOff();
	}	
	function onCancelTouch(io:InteractionObject){
		setOff();
	}
	function doAction(){
			var audio:AudioSource = scaleTarget.GetComponent(AudioSource) as AudioSource;
			if(audio != null){
				audio.Play();
			}
			return;
	}
	function setOn(){
		//expand
		Debug.Log("set Button on");
		iTween.ScaleTo(scaleTarget,{"scale":Vector3(scaleUp,scaleUp,scaleUp), "time":0.3, "easetype":"easeOutElastic"});
	//	iTween.MoveTo(scaleTarget,{"scale":Vector3(1.3,1.3,1.3), "time":0.3, "easetype":"elastic"});
		isOn = true;
	 	
	}
	function setOff(){
		Debug.Log("set Button off");
		iTween.ScaleTo(scaleTarget,{"scale":Vector3(1.0,1.0,1.0), "time":0.3, "easetype":"easeInElastic"});
		isOn = false;
	
	}
	function showButton(){
		if(hidden){
			scaleTarget.SetActive(true);
			var component:Component[] = scaleTarget.GetComponentsInChildren(Renderer, true);
			for(var comp:Component in component){
				var rend:Renderer = comp as Renderer;
				rend.gameObject.SetActive(true);
				rend.enabled = true;

			}
			collider.enabled = true;
		hidden = false;
		}
		setOff();
	}
	function hideButton(){
		if(!hidden){
			var component:Component[] = scaleTarget.GetComponentsInChildren(Renderer, true);
			for(var comp:Component in component){
				var rend:Renderer = comp as Renderer;
			 
				rend.enabled = false;

			}
			collider.enabled = false;
			scaleTarget.SetActive(false);
			hidden = true;
		}
	}
}
