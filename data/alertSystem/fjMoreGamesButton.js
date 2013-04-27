// 
//  fjMoreGamesButton.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-10-09.
//  Copyright 2012 fayju. All rights reserved.
// 


class fjMoreGamesButton extends fjPulseButton{
	private var isUsed:boolean = false;
	var useGUIDisable:boolean = false;
	var copyDisplay:TextDisplay;
	function Start():void{
		/*	if(!useGUIDisable){
			overrideHide = true;
		}*/
		
		if(copyDisplay){
			copyDisplay.DrawText(GameSettingsData.GetInstance().GetMoreGamesText());
		}
		super.Start();
		///check location if navigation hide

	}
	function doAction(){
		if(!isUsed){
			super.doAction();
			Debug.Log("do play button action");
			GameSettingsData.GetInstance().MoreGamesAction();
	 
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
