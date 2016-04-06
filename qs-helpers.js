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
                nodoString = '<li class="group" data-grupo="'+nodoData.grupo+'" data-grupo-padre="'+nodoData.grupoPadre+'">' 
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
            //return new Handlebars.SafeString('<ul class="arbol"><li class="group"><div><a href="#">Nombre de grupo 1</a></div><div>Condiciones mayor a x y unidad de medida</div>  <span class="label">Iniciador</span><a class="btn">Agregar grupo</a><ul><li class="group"><div><a href="#">Nombre de grupo 1-1</a></div><div>Condiciones mayor a x y unidad de medida</div> <a class="btn">Agregar grupo</a><ul></ul><div>Sin grupos hijos</div></li><li class="group"><div><a href="#">Nombre de grupo 1-2</a></div><div>Condiciones mayor a x y unidad de medida</div>    <a class="btn">Agregar grupo</a><ul></ul><div>Sin grupos hijos</div></li></ul><div class="hidden">Sin grupos hijos</div></li><li class="group"><div><a href="#">Nombre de grupo 2</a></div><div>Condiciones mayor a x y unidad de medida</div>  <span class="label">Iniciador</span><a class="btn">Agregar grupo</a><ul></ul><div>Sin grupos hijos</div></li></ul>');
            //arbol += getNodo();
            arbol += '</ul>';
            return new Handlebars.SafeString(arbol);
        });


    });
})(SUGAR.App); 