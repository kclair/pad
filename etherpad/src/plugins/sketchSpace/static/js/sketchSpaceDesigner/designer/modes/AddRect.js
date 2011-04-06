dojo.provide("sketchSpaceDesigner.designer.modes.AddRect");

dojo.require("sketchSpaceDesigner.designer.modes.Zoom");

dojo.declare("sketchSpaceDesigner.designer.modes.AddRect", [sketchSpaceDesigner.designer.modes.Zoom], {
  enable: function () {
    this.inherited(arguments);
    this.shape = undefined;

    this.x = new dijit.layout.ContentPane({title:"Add:", content:"Rect"});
    this.designer.ui.options.addChild(this.x);
    this.designer.ui.options.layout();
  },
  disable: function () {
    this.inherited(arguments);
    if (this.shape !== undefined) {
      this.shape.removeShape();
    }
    this.x.destroy();
  },

  getContainerShape: function () { return this.designer.surface_transform; },

  onSetOptions: function () {
    if (this.shape !== undefined) {
      this.designer.setShapeFillAndStroke(this.shape, this.designer.options);
    }
  },
  onMouseDown: function (event) {
    this.inherited(arguments);
    if (event.button == 0 && !event.ctrlKey && !event.altKey && !event.shiftKey) {
      this.orig = this.getCurrentMouse(event);
      this.shape = dojox.gfx.utils.deserialize(this.getContainerShape(), {shape:{type:"rect", x:this.orig.x, y:this.orig.y, width:1, height:1}});
      this.onSetOptions();
    }
  },
  onMouseUp: function (event) {
    this.inherited(arguments);
    if (this.shape !== undefined) {
      this.designer.registerObjectShape(this.shape);
      this.designer.saveShapeToStr(this.shape);
      this.designer.imageUpdated();
      this.shape = undefined;
    }
  },
  onMouseMove: function (event) {
    this.inherited(arguments);
    if (this.shape !== undefined) {
      var mouse = this.getCurrentMouse(event);

      var shapeData = this.shape.getShape();
      if (mouse.x >= this.orig.x) {
        shapeData.x = this.orig.x;
        shapeData.width = mouse.x - this.orig.x;
      } else {
        shapeData.x = mouse.x;
        shapeData.width = this.orig.x - mouse.x;
      }
      if (mouse.y >= this.orig.y) {
        shapeData.y = this.orig.y;
        shapeData.height = mouse.y - this.orig.y;
      } else {
        shapeData.y = mouse.y;
        shapeData.height = this.orig.y - mouse.y;
      }
      this.shape.setShape(shapeData);
    }
  },
  onKeyUp: function (event) {
    this.inherited(arguments);
    if (event.keyCode == 27)
      this.designer.popMode();
  }
});
