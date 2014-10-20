
// Generic helper functions for all templates

// Function: If it is true, mark that the value of the field "field" is CHECKED to be "value"
// Used by: Items.item.add, Items.item.edit
UI.registerHelper("checked", function (field, value) {
  if( this[field] === value ) {
    return 'checked="checked" ';
  }
  else {
    return '';
  }
});

// Function: If it is true, mark that the value of the field "field" is SELECTED to be "value"
// Used by: Items.item.add, Items.item.edit
UI.registerHelper("selected", function (field, value) {
  if( this.selected === this.value ) {
    return 'selected="selected" ';
  }
  else {
    return '';
  }
});