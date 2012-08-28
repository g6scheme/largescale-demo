(function(app){
    
    // Module for handling item counts
    app.core.define('#todo-counter', function(f){  
        var counter = null, currentCount =0;
        return {
            init:function(){
                counter = f.find('#count')[0];
                f.subscribe({
                    'entry-validated' : this.updateCounter
                });

            },
            destroy:function(){
                counter = null;
                currentCount = 0;
            },

            updateCounter:function(){
                currentCount++;
                f.setHTML(counter,currentCount);
                f.publish({
                    type : 'counter-updated'
                });
            }
        } 
    });

    // Module for handling clean-up post entry being added
    app.core.define('#todo-field', function(f){
        var input;
        return {
            init:function(){
                var that = this;
                input = f.getEl();

                f.subscribe({
                    'entry-validated' : this.clearEntry       
                });
            },
            destroy:function(){
            
            },
            clearEntry:function(){
                input.value = "";
            }
        };  
    });

    // Module for handling the detection and publication of new entries
    app.core.define('#todo-entry', function(f){
        var input, button;
        return {
            init: function (){

                input = f.find('input')[0],
                button = f.find('button')[0];

                f.bind(button, 'click', this.handleEntry);
                f.bind(input, 'keydown', this.handleKey);

            },

            destroy: function(){
                f.unbind(button, "click", this.handleEntry);
                f.unbind(input, "keydown", this.handleKey);
                input = button = reset = null;     
            },

            handleEntry: function (){
                f.publish({
                    type : 'new-entry',
                    data : {value: input.value, id: f.newGUID()}
                });
            },

            handleKey: function(e){
                if(e.which == 13){
                    f.publish({
                        type : 'new-entry',
                        data : {value: input.value, id: f.newGUID()}
                    });

                }
            }
        }
    });

    app.core.define('#validate', function(f){
        return {
            init: function(){
                f.subscribe({
                    'new-entry' : this.validateEntry    
                });
            },

            destroy: function(){
            },

            validateEntry: function ( todoItem ){
                if(todoItem.value == ""){
                   f.publish({
                        type : 'input-error',
                        data : {value: 'Please ensure your input is valid'}
                    });
                }else{
                     f.publish({
                        type : 'entry-validated',
                        data : todoItem
                    });
                }
            }
        }    
    });

    app.core.define('#error', function(f){
        var errorNotice;
        
        return {
            init: function(){
                errorNotice = f.find('#alert')[0];

                f.subscribe({
                    'input-error' : this.showError        
                });

            },

            destroy: function(){
                errorNotice = null;
            },

            showError: function( msg ){
                f.setHTML(errorNotice, msg.value);
            }
        }    
    });

    app.core.define("#todo-list", function (f) {
        var todo, todoItems, renderedItems;
        
        return {
            init : function () {
                todo = f.find("ul")[0];
                todoItems = {};

                f.subscribe({
                    'entry-validated' : this.addItem        
                });

            },

            destroy : function () {
                todo = todoItems = null;
                f.ignore(['add-item']);
            },

            addItem : function ( todoItem ) {
                var entry; 

                entry = f.createElement("li", { 
                    id : "todo-" + todoItem.id, 
                    children : [
                            f.createElement("span", { 'class' : 'item_name',text : todoItem.value })
                        ],
                    'class' : 'todo_entry' 
                });
                
                todo.appendChild(entry);
                
                entry = f.find('#todo-' + todoItem.id)[0];
                f.css(entry, {'color': f.getRandomColor(), 'background': f.getRandomColor()});
                f.animate(entry, {'line-height':'50'}, 500);
                todoItems[todoItem.id] = 1;
                
            }
        };
    });

    app.core.startAll();

})(app);
