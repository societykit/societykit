# Relations

Add relations between collections in autoForm.

With Relations you can:

* Create fields for autoForm for creating relation(s) to another collection
* Define allowed relation types between two collections
* Output the items of one collection that are related to an item in another collection


**At the moment, this package is in heavy development phase.
You can create fields for insert forms and fields for viewing the items with relations.**


## Installation
In a Meteor app directory, enter:
```
$ meteor add skit:relations
```

## Defining schemas with relations

### Define a relation type
As an example in these docs, I will use a case where you want to
create a relationship named "isMemberOf" between the collections
of "societies" and "people".

First, add a relation type between two collections.

```
// server/societies.js
skitRelations.setRelationType({

  relationType: "isMemberOf",
  cl1: {
    cl: "societies",
    attrs: ["name"],
    minCount: 0,
    maxCount: Infinity,
  },
  cl2: {
    cl: "people",
    attrs: ["firstName","lastName],
    minCount: 0,
    maxCount: Infinity
  }
});
```

### Define a SimpleSchema that includes relations
Define a schema that includes relations (of previously specified relation types):
```
// lib/societies.js (both client and server)
skitRelations.setSchema = function( name, cl, {
  name: {
    type: String,
    label: "Name",
    max: 200
  },
  issues: {
    type: "skitRelation"
    relation: {"societies","relatedTo","people"},
    label: "Members"
  }
});
```


## Creating a form
### Add relation field(s) to your autoForm
A relation field is inserted into your autoForm by:
```
{{> skitRelationField}}
```

### Create your form
So your complete autoForm could look like this:
```
<!-- client/societies.html -->
<template name="insertSociety">
{{#autoForm id="insertSociety" collection=db schema=schema }}

  <fieldset>
    <legend>Create a new society</legend>
    {{> afQuickField name='name'}}
    {{> skitRelationField name="members" mode="insert"}}
  </fieldset>
  <button type="submit" class="btn btn-primary">Insert</button>

{{/autoForm}}
</template>

### Connect the schema and your collection to your autoForm
Connect the previously created schema to your autoForm.
In addition, you also need provide your Meteor.Collection
so that existing items can be shown to the user as options
and non-existing items that user submits can be created.
```
Template.insertSociety.helpers({
  db: SocietiesCollection,
  schema: skitRelations.getFormSchema = function("societies")
});
```

### Register your form
Finally, register your form that uses the (above created) SimpleSchema with relations
```
// client/societies.js
skitRelations.setForm = function( "#formId", "societies", "insert"/"update" )

```
NOTE: At the moment, only the "insert" form works.


## Outputting your collection
This is how to print out your collection that has relations.
Often times you might be doing this from other files of your app, which
want to print out or edit the societies and their relationships to people.
```
<!-- client/youApp.html -->
{{#each getSocieties }}
  {{> society}}
{{/each}}
```


```
// client/yourApp.js
Template.home.helpers({
  getSocieties: function() {
    return skitSocieties.db.find({},{sort:["name","asc"]});
  }
});


```
<!-- client/societies.html -->
<template name="society">
<div class="society">
  <h3>{{name}}</h3>
  <p>
    Members: {{> skitRelationField name="members" mode="view" cl="skitSocieties"}}
  </p>
</div>
</template>

```



## Contributing
Anyone is welcome to contribute. Just fork, make your changes and submit a pull request.
Thanks a lot in advance!


## Society Kit
This library was created as a part of the Society Kit web app that allows
people to create new voluntary societies with own economics, rules, 
decision-making procedures, and so on. It also informs these virtual
societies by collecting data from various open databases and from 
the users themselves. More information can be found on:
* [www.societykit.org](https://www.societykit.org)
* [github.com/societykit](https://github.com/societykit/societykit)

