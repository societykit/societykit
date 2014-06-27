CustomPages = {};

CustomPages.pages = [ "market" ];

CustomPages.template = Template.customPage;
CustomPages.template.isPage = function(page) {
  return ( page === Page.getPage() );
}
