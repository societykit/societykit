


// Generic helper functions for all templates

// Function: If it is true, mark that the value of the field "field" is CHECKED to be "value"
// Used by: dropdowns of items classesUI.registerHelper("checked", function (field, value) {
UI.registerHelper("checked", function () {
  console.log("HELPER: CHECKED???");
  return ( this.selected === this.value );
});

// Function: If it is true, mark that the value of the field "field" is SELECTED to be "value"
// Used by: dropdowns of items classes
UI.registerHelper("selected", function () {
  console.log("HELPER: SELECTED???");
  console.log(EJSON.stringify(this) );
  return ( this.selected === this.value );
  
});


/* Function: NL2BR( string )
Operation: Converts 'new line' characters of the string into <br /> tags
Used by: When outputting text that was received from a <textarea>,
         this function can be used to show the line breaks correctly.
*/
UI.registerHelper("nl2br", function (string) {
  var br = "<br />";
  return (string + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+br+'$2');
});


// GOOGLE ANALYTICS TRACKER (UNCOMMENT THIS WHEN DEPLOYING IN PRODUCTION!)
/*
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-57244803-1', 'auto');
ga('send', 'pageview');
*/