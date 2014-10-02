SafeText = Object.create(Object);

SafeText.clean = function(input) {
  
  
  // TODO: input.settings, etc.
  
  
  // TODO: Clean it a bit...
  
  
  var cleaned = input.text;
  var cleanStatus = "good";
  
  input.original = input.text;
  input.text = cleaned;
  input.cleanStatus = cleanStatus;
  
  return input;
}
