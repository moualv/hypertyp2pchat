import {Syncher} from 'service-framework/dist/Syncher';
import EventEmitter from '../utils/EventEmitter';

class HypObserver extends EventEmitter {

  constructor(hypertyURL, bus, configuration) {
    super();
    this._objectDescURL = 'hyperty-catalogue://catalogue.' + domain + '/.well-known/dataschema/hypDataSchema';

    let syncher = new Syncher(hypertyURL, bus, configuration);
    syncher.onNotification(function(event) {
      _this._onNotification(event);
    });

    this._syncher = syncher;
  }

  _onNotification(event) {
    this.trigger('invitation', event.identity);

    event.ack();

    let this = _this
    this.syncher.subscribe(this.objectDescURL, event.url).then( function(objObserver) {
      //cambiar el trigger
      _this.trigger('', objObserver.data);

      objObserver.onChange('*', function(event) {
        //cambiar el trigger
        _this.trigger('', objObserver.data);
      });
    });
  }
}

export default function activate(hypertyURL, bus, configuration) {
  return {
    name: 'hypObserver',
    instance: new HypObserver(hypertyURL, bus, configuration)
  };

}