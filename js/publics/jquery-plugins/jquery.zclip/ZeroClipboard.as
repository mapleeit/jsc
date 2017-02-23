﻿package {
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
	
	public class ZeroClipboard extends Sprite {
		
		private var id:String = '';
		private var button:Sprite;
		private var clipText:String = '';
		
		public function ZeroClipboard() {
			// constructor, setup event listeners and external interfaces
			stage.scaleMode = StageScaleMode.EXACT_FIT;
			flash.system.Security.allowDomain("*");
			stage.scaleMode=StageScaleMode.NO_SCALE;
			stage.align="TL";
			// import flashvars
			var flashvars:Object = LoaderInfo( this.root.loaderInfo ).parameters;
			
			id = Number(flashvars.id) ? flashvars.id : "";
			id = id?id.split("\\").join("\\\\"):"";
			// invisible button covers entire stage
			button = new Sprite();
			button.buttonMode = true;
			button.useHandCursor = true;
			button.graphics.beginFill(0xFFFFFFF);/////////////
			button.graphics.drawRect(0, 0, flashvars?Math.floor(flashvars.width||100):100, flashvars?Math.floor(flashvars.height||50):50);
						
			var textField:TextField=new TextField();
			textField.text="copy url";//
			textField.textColor = 0x1D719E;
			button.addChild(textField);
			textField.mouseEnabled=false;

			addChild(button);
			button.addEventListener(MouseEvent.CLICK, clickHandler);
			if(ExternalInterface.available)
			{
				button.addEventListener(MouseEvent.MOUSE_OVER, function(event:Event) {
					ExternalInterface.call( 'ZeroClipboard.dispatch', id, 'mouseOver', null );
				} );
				button.addEventListener(MouseEvent.MOUSE_OUT, function(event:Event) {
					ExternalInterface.call( 'ZeroClipboard.dispatch', id, 'mouseOut', null );
				} );
				button.addEventListener(MouseEvent.MOUSE_DOWN, function(event:Event) {
					ExternalInterface.call( 'ZeroClipboard.dispatch', id, 'mouseDown', null );
				} );
				button.addEventListener(MouseEvent.MOUSE_UP, function(event:Event) {
					ExternalInterface.call( 'ZeroClipboard.dispatch', id, 'mouseUp', null );
				} );
			}
			if(ExternalInterface.available)
			{
				// external functions
				ExternalInterface.addCallback("setHandCursor", setHandCursor);
				ExternalInterface.addCallback("setText", setText);
				
				// signal to the browser that we are ready
				if(Number(id)) { //for xss by hibincheng
					ExternalInterface.call( 'ZeroClipboard.dispatch', id, 'load', null );
				}
			}
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
			ExternalInterface.call( 'ZeroClipboard.dispatch', id, 'complete', clipText );
		}
	}
}