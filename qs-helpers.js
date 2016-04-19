/**
 * Handlebars helpers.
 *
 * These functions are to be used in handlebars templates.
 * @class Handlebars.helpers
 * @singleton
 */
(function(app) {
    app.events.on("app:init", function() {
        /**
         * convert a string to upper case
         */
        Handlebars.registerHelper("ppArbol", function (text)
        {   
            //debugger;
            var arbol = '<ul class="pp-arbol grupos">';
            //debugger;
            function getNodo(nodoData, nodoString) {
                nodoString = '<li class="group" data-grupo="'+nodoData.grupo+'" data-grupo-padre="'+nodoData.grupoPadre+'" >' 
                + '<div class="header">' + (nodoData.iniciador ? '<span class="label iniciador">Iniciador</span>' : '')+'<a href="#" class="name">'+nodoData.name+'</a>'
                + '<span class="condicion">'+nodoData.condicion+'</span>'
                + '<a class="btn agregar-grupo">Encadenamiento</a>'
                + '</div>'
                if(nodoData.grupos.length){
                    nodoString += '<ul class="grupos">';
                    _.each(nodoData.grupos, function (nodoHijoData) {
                        nodoString += getNodo(nodoHijoData, '');
                    });
                    nodoString += '</ul>';
                }
                else{
                    nodoString += '<div class="sin-grupos">Sin grupos hijos</div>';    
                }
                nodoString += '</li>';
                return nodoString;
            }
            //debugger;
            _.each(this.arbol, function (nodoData) {
               arbol += getNodo(nodoData, '');
            });
            arbol += '</ul>';
            return new Handlebars.SafeString(arbol);
        });

        Handlebars.registerHelper("regalosArbol", function (text)
        { 
            function getNodo(nodoData, buffer) {
                buffer = '<li class="grupo" data-module="'+nodoData.module+'" data-grupo="'+nodoData.grupo+'">';
                buffer += '<span class="name">'+nodoData.name+'</span>';
                buffer += '<div class="btn-group">';
                buffer += '<a class="btn dropdown-toggle" data-toggle="dropdown"><i class="fa fa-caret-down"></i></a><ul class="dropdown-menu">';
                buffer += '<li><a name="create-group-descuento" data-module="QS_DescuentosFinancieros">Crear descuento</a></li>';
                buffer += '<li><a name="create-group-volumen"  data-module="QS_VolumenRegalo">Crear volumen de regalo</a></li>';
                buffer += '</ul></div>';
                if(nodoData.grupos.length){
                    buffer += '<ul class="grupos">';
                    _.each(nodoData.grupos, function(nodoGrupo) {
                        buffer += getNodo(nodoGrupo);
                    });
                    buffer += '</ul>';
                }
                else{
                    buffer += '<div class="sin-grupos">Sin grupos hijos</div>';
                }

                buffer += '</li>';
                return buffer;
            }
            var arbol = '<ul class="regalos-arbol">';
            _.each(this.arbol, function (nodoGrupo) {
                arbol += getNodo(nodoGrupo, arbol);
            });
            arbol += '</ul>';
            return new Handlebars.SafeString(arbol);
        });


    });
})(SUGAR.App); 