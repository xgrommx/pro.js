'use strict';

describe('Pro.Property', function () {
  var obj;
  beforeEach(function () {
    obj = {a: 'my val', b: 5};
  });

  describe('#constructor', function () {

    it('initializes the property', function () {
      var property = new Pro.Property(obj, 'a');
      expect(property.type()).toEqual(Pro.Property.Types.simple);
      expect(property.state).toEqual(Pro.States.ready);
    });

    it('doesn\'t change the object structure.', function () {
      var property = new Pro.Property(obj, 'a');
      expect(obj.a).toEqual('my val');
    });

    it('stores the property in the proObject', function () {
      var property = new Pro.Property(obj, 'a');
      expect(property).toEqual(obj.__pro__.properties.a);
    });

    it('passing a getter can override a propertie value', function () {
      var property = new Pro.Property(obj, 'a', function () {
        return 70;
      });
      expect(obj.a).toEqual(70);
    });

  });

  describe('#destroy', function () {
    it('destroys the property', function () {
      var property = new Pro.Property(obj, 'a');
      property.destroy();
      expect(property.state).toEqual(Pro.States.destroyed);
    });

    it('doesn\'t change the object structure.', function () {
      var property = new Pro.Property(obj, 'a');
      property.destroy();
      expect(obj.a).toEqual('my val');
    });
  });

  describe('#get', function () {
    it('is the same as getting the original value', function () {
      var property = new Pro.Property(obj, 'a');
      expect(property.get()).toEqual(obj.a);
    });

    it('has the alias "g"', function () {
      var property = new Pro.Property(obj, 'a');
      expect(property.g).toBe(property.get);
    });

    it('adds listener for the current caller', function () {
      var property = new Pro.Property(obj, 'a'), func;
      obj.b = function () {
        return this.a + ' is cool';
      };
      func = obj.b;
      Pro.currentCaller = {
        property: new Pro.Property(obj, 'b'),
        call: function () {
          obj.b = func.call(obj);
        }
      };
      property.get();
      Pro.currentCaller = null;
      expect(property.listeners.length).toBe(1);

      property.notifyAll();
      expect(obj.b).toEqual('my val is cool');
    });
  });

  describe('#set', function () {
    it('it changes the original value', function () {
      var property = new Pro.Property(obj, 'a');
      property.set(5);
      expect(obj.a).toEqual(5);
    });

    it('has the alias "s"', function () {
      var property = new Pro.Property(obj, 'a');
      expect(property.s).toBe(property.set);
    });

    it('notifies the listeners of the property', function () {
      var property = new Pro.Property(obj, 'a');
      spyOn(property, 'willUpdate');
      property.set(3);

      expect(property.willUpdate).toHaveBeenCalled();
    });
  });

  describe('#willUpdate', function () {
    it('must be called in a flow', function () {
      var property = new Pro.Property(obj, 'a'), go;
      property.addListener(function () {});
      go = function () {
        property.willUpdate();
      };

      expect(go).toThrow('Not in running flow!');
    });

    it('executes the listeners of a property and passes to them a value Pro.Event', function () {
      var property = new Pro.Property(obj, 'a'), called = false;
      property.addListener(function (event) {
        called = true;

        expect(event instanceof Pro.Event).toBe(true);
        expect(event.source).toBeUndefined();
        expect(event.target).toBe(property);
        expect(event.type).toBe(Pro.Event.Types.value);

        expect(event.args.length).toBe(0);
      });

      property.oldVal = property.val;
      property.val = 10;
      Pro.flow.run(function () {
        property.willUpdate();
      });
      expect(called).toBe(true);
    });

    it('executes the listeners of a sub-property and passes to them a value Pro.Event', function () {
      var propertyA = new Pro.Property(obj, 'a'),
          propertyB = new Pro.Property(obj, 'b'),
          called = false, ev;
      propertyA.addListener({
        call: function (event) {
          ev = event;
          propertyB.oldVal = 5;
          propertyB.val = 15;
        },
        property: propertyB
      });

      propertyB.addListener(function (event) {
        called = true;

        expect(event instanceof Pro.Event).toBe(true);
        expect(event.source).not.toBeUndefined();
        expect(event.source).toBe(ev);
        expect(event.target).toBe(propertyB);
        expect(event.type).toBe(Pro.Event.Types.value);

        expect(event.args.length).toBe(0);
      });

      propertyA.oldVal = propertyA.val;
      propertyA.val = 10;
      Pro.flow.run(function () {
        propertyA.willUpdate();
      });
      expect(called).toBe(true);
    });
  });
});
