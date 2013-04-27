#pragma strict
// 
//  fjGUIBoxEditor.js
//  Assets
//  
//  Created by Gareth Bushell on 2012-05-16.
//  Copyright 2012 fayju. All rights reserved.
// 

@CustomEditor(fjGUIBox) 
class fjGUIBoxEditor extends Editor {
 
    function OnInspectorGUI() {
        var fjbox : fjGUIBox = target as fjGUIBox;
        var forceDraw:boolean = false;
        EditorGUILayout.BeginVertical ();
		if(!fjbox.material){
			fjbox.material = Resources.Load("_textDisplayDefaultMaterial") as Material;
		}
		fjbox.material = EditorGUILayout.ObjectField ("Box Material", fjbox.material, Material, false) as Material;
		 
	 
		
		EditorGUILayout.PrefixLabel ("lightMap");
		var oldUvScale:float = fjbox.uvScale;
		fjbox.uvScale = EditorGUILayout.FloatField("Uv2 Scale",fjbox.uvScale);
		if(oldUvScale != fjbox.uvScale){
			forceDraw = true;
		}
		var oldUseUV2:boolean = fjbox.useUV2;
		fjbox.useUV2 =  EditorGUILayout.Toggle("Use UV2 Layer", oldUseUV2);
		if(fjbox.useUV2 != oldUseUV2){
				forceDraw = true;
		}
		EditorGUILayout.PrefixLabel ("Pixel Inset");
		if(!fjbox.pixelInset){
			fjbox.pixelInset = new fjGUIBoxDefinition();
		}
		var oldPixelLeft:float = fjbox.pixelInset.left;
		fjbox.pixelInset.left = EditorGUILayout.FloatField("PixelInset Left",fjbox.pixelInset.left);
		if(oldPixelLeft != fjbox.pixelInset.left){
			forceDraw = true;
		}
		var oldPixelRight:float = fjbox.pixelInset.right;
		fjbox.pixelInset.right = EditorGUILayout.FloatField("PixelInset Right",fjbox.pixelInset.right);
		if(oldPixelRight != fjbox.pixelInset.right){
			forceDraw = true;
		}
		var oldPixelTop:float = fjbox.pixelInset.top;
		fjbox.pixelInset.top = EditorGUILayout.FloatField("PixelInset Top",fjbox.pixelInset.top);
		if(oldPixelTop != fjbox.pixelInset.top){
			forceDraw = true;
		}
		var oldPixelBottom:float = fjbox.pixelInset.bottom;
		fjbox.pixelInset.bottom = EditorGUILayout.FloatField("PixelInset Bottom",fjbox.pixelInset.bottom);
		if(oldPixelBottom != fjbox.pixelInset.bottom){
			forceDraw = true;
		}
		
		EditorGUILayout.PrefixLabel ("World Scale");
			
		//margin
		var oldMargin:float = fjbox.marginScale;
		fjbox.marginScale = EditorGUILayout.FloatField("Margin",fjbox.marginScale );
		if(oldMargin != fjbox.marginScale){
			forceDraw = true;
		}
		var oldworldSize:Rect = fjbox.worldSize;
		fjbox.worldSize = EditorGUILayout.RectField("fjBox position:", fjbox.worldSize);
		if(fjbox.worldSize != oldworldSize){
			forceDraw =true;
		}
		
	/*	//drawscale
		var oldScale:float = textDisplay.drawScale;
	
		textDisplay.drawScale = EditorGUILayout.FloatField("Draw Scale",textDisplay.drawScale );
		
		if(oldScale != textDisplay.drawScale){
			forceDraw = true;
		}
		//relative loc
		var lastloc:Vector3 = textDisplay.relativeLoc;
		textDisplay.relativeLoc = EditorGUILayout.Vector3Field ("Relative Loc",textDisplay.relativeLoc);
		if(lastloc != textDisplay.relativeLoc){
			forceDraw = true;
		}
		//draw on awake
		textDisplay.drawOnAwake = EditorGUILayout.Toggle ("Draw On Awake?", textDisplay.drawOnAwake);
		
		var lastAlign:TextChunkAlign = textDisplay.align;
		textDisplay.align = EditorGUILayout.EnumPopup( "align to:", textDisplay.align) ;
		if(lastAlign != textDisplay.align){
			forceDraw = true;
		}
		var oldText:String = 	textDisplay.displayText;
		textDisplay.displayText =  EditorGUILayout.TextField( "Display Text", textDisplay.displayText );
		if(oldText != textDisplay.displayText){
			forceDraw = true;
		}
		*/
		EditorGUILayout.BeginHorizontal();
        EditorGUILayout.PrefixLabel ("commit");
       	if ( GUILayout.Button("update Box")  || forceDraw) {
			fjbox.initialize();
			EditorUtility.SetDirty (target);
		}
		 
		EditorGUILayout.EndHorizontal();
		
	 
        EditorGUILayout.EndVertical ();

        
        
    }
}