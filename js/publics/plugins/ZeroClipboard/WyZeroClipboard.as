package {
	// Simple Set Clipboard System
	// Author: Joseph Huckaby
	
	import flash.display.LoaderInfo;
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.*;
	import flash.external.ExternalInterface;
	import flash.system.Security;
	import flash.system.System;
	import flash.text.TextField;
	import flash.utils.*;
	import flash.system.Capabilities;
	
	public class WyZeroClipboard extends Sprite {
		
		private var id:String = '';
		private var button:Sprite;
		private var clipText:String = '';
		
		public function WyZeroClipboard() {
			// constructor, setup event listeners and external interfaces
			stage.scaleMode = StageScaleMode.EXACT_FIT;
			flash.system.Security.allowDomain("*");
			stage.scaleMode=StageScaleMode.NO_SCALE;
			stage.align="TL";
			// import flashvars
			var flashvars:Object = LoaderInfo( this.root.loaderInfo ).parameters;
			
			id = flashvars.id;
			id = id?id.split("\\").join("\\\\"):"";
			// invisible button covers entire stage
			button = new Sprite();
			button.buttonMode = true;
			button.useHandCursor = true;
			//button.graphics.beginFill(0xFFFFFFF);/////////////
			button.graphics.beginFill(0xCCFF00);      
			button.alpha = 0.0;
			button.graphics.drawRect(0, 0, flashvars?Math.floor(flashvars.width||100):100, flashvars?Math.floor(flashvars.height||50):50);
						
			var textField:TextField=new TextField();
			textField.text="";//
			textField.textColor = 0xFFFFFFF;
			button.addChild(textField);
			textField.mouseEnabled=false;

			addChild(button);
			button.addEventListener(MouseEvent.CLICK, clickHandler);
			if(ExternalInterface.available)
			{
				button.addEventListener(MouseEvent.MOUSE_OVER, function(event:Event) {
					ExternalInterface.call( 'WyZeroClipboard.dispatch',  'mouseOver', metaData() );
				} );
				button.addEventListener(MouseEvent.MOUSE_OUT, function(event:Event) {
					ExternalInterface.call( 'WyZeroClipboard.dispatch',  'mouseOut', metaData() );
				} );
				button.addEventListener(MouseEvent.MOUSE_DOWN, function(event:Event) {
					ExternalInterface.call( 'WyZeroClipboard.dispatch',  'mouseDown', metaData() );
				} );
				button.addEventListener(MouseEvent.MOUSE_UP, function(event:Event) {
					ExternalInterface.call( 'WyZeroClipboard.dispatch',  'mouseUp', metaData() );
				} );
			}
			if(ExternalInterface.available)
			{
				// external functions
				ExternalInterface.addCallback("setHandCursor", setHandCursor);
				ExternalInterface.addCallback("setText", setText);
				ExternalInterface.addCallback("setSize", setSize);
				
				// signal to the browser that we are ready
				ExternalInterface.call( 'WyZeroClipboard.dispatch',  'load', metaData() );
			}
		}
		
		// metaData
    //
    // The metaData function will take a mouseEvent, and an extra object to
    // create a meta object of more info. This will let the page know if
    // certain modifier keys are down
    //
    // returns an Object of extra event data
    private function metaData(event:MouseEvent = void, extra:Object = void):Object {

      // create the default options, contains flash version
      var normalOptions:Object = {
        flashVersion : Capabilities.version
      }

      // if an event is passed in, return what modifier keys are pressed
      if (event) {
        normalOptions.altKey = event.altKey;
        normalOptions.ctrlKey = event.ctrlKey;
        normalOptions.shiftKey = event.shiftKey;
      }

      // for everything in the extra object, add it to the normal options
      for(var i:String in extra) {
        normalOptions[i] = extra[i];
      }

      return normalOptions;
    }
		
		public function setText(newText) {
			// set the maximum number of files allowed
			clipText = newText;
		}
		
		public function setHandCursor(enabled:Boolean) {
			// control whether the hand cursor is shown on rollover (true)
			// or the default arrow cursor (false)
			button.useHandCursor = enabled;
		}
		
		private function clickHandler(event:Event):void {
			// user click copies text to clipboard
			// as of flash player 10, this MUST happen from an in-movie flash click event
			System.setClipboard( clipText );
			ExternalInterface.call( 'WyZeroClipboard.dispatch', 'complete', clipText );
		}
		
		// setSize
    	//
    	// Sets the size of the button to equal the size of the hovered object.
    	//
   	 	// returns nothing
    	public function setSize(width:Number, height:Number): void {
      		button.width = width;
      		button.height = height;
    	}
	}
}