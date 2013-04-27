#pragma strict
// 
//  fjChartboostManager.js
//  Assets
//  
//  Created by Gareth Bushell on 2013-04-09.
//  Copyright 2013 __MyCompanyName__. All rights reserved.
// 

class fjChartboostManager extends MonoBehaviour{
	private static var instance:fjChartboostManager;
	
	public static function GetInstance():fjChartboostManager{
		if(!instance){
			var gameObjectInstance:GameObject = new GameObject("fjChartboostManager");
			instance = gameObjectInstance.AddComponent(fjChartboostManager);
			 gameObjectInstance.AddComponent(FayjuBallChartBoostEventListener);
			DontDestroyOnLoad(gameObjectInstance);
		}
		return instance;
	}
	
	public var isEnabled:boolean = true;
	private var listener:FayjuBallChartBoostEventListener;
	function StartChartboost(appId:String, appSignature:String ){
		
		if(!isEnabled)
		return;
		listener = gameObject.GetComponent(FayjuBallChartBoostEventListener);
		
		#if UNITY_IPHONE
		 
		 	ChartBoostBinding.init(appId,appSignature, true );
			ChartBoostBinding.cacheMoreApps();
			ChartBoostBinding.cacheInterstitial("alert");
			ChartBoostBinding.cacheInterstitial("block");
			ChartBoostBinding.cacheInterstitial("moregames");
		#endif
	}
	function isAvailable():boolean{
		if(!isEnabled)
		return false;
			
		return true; 
	}
 	function MoreGames(){
		ChartBoostBinding.showMoreApps();
	}
	function ShowInterstitial(){
		ShowInterstitial("default");
	}
	function ShowInterstitial(displayType:String, name:String){
			ShowInterstitial(displayType);
	}
	function ShowInterstitial(displayType:String){
	 
			ChartBoostBinding.showInterstitial( displayType);
	 
	}	
	function TrackEvent(eType:String){
			ChartBoostBinding.trackEvent(eType );
	}
 
/*
	if( GUILayout.Button( "Is Interstitial Cached?" ) )
	{
		Debug.Log( "is cached: " + ChartBoostBinding.hasCachedInterstitial( "default" ) );
	}





	if( GUILayout.Button( "Cache More Apps" ) )
	{
		ChartBoostBinding.cacheMoreApps();
	}


	if( GUILayout.Button( "Show More Apps" ) )
	{
		ChartBoostBinding.showMoreApps();
	}
*/

 
/*

	if( GUILayout.Button( "Track Event" ) )
	{
		ChartBoostBinding.trackEvent( "some_event" );
	}


	if( GUILayout.Button( "Track Event with Metadata" ) )
	{
		var dict = new Dictionary<string,string>();
		dict.Add( "key", "theValue" );
		ChartBoostBinding.trackEventWithMetadata( "some_event_with_data", dict );
	}


	if( GUILayout.Button( "Track Event with Value" ) )
	{
		ChartBoostBinding.trackEventWithValue( "event_with_value", 123 );
	}


	if( GUILayout.Button( "Track Event with Value and Metadata" ) )
	{
		var dict = new Dictionary<string,string>();
		dict.Add( "key", "theValue" );
		ChartBoostBinding.trackEventWithValueAndMetadata( "event_with_value_and_data", 9809823, dict );
	}
	*/
	//AlertsHandler.GetInstance().showSimpleMessage("output", listener.results, "OK");
	 
}