({
    extendFrom: 'RecordLayout',

    
    initialize: function () {
        this._super('initialize', arguments);
        //debugger;
        this.on('subpanel:change', function () {
            console.log('arguments', arguments);
            debugger;
        });
    }
})