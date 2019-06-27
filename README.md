# Seed star-uml

This repository holds the source code of the **seed star-uml extension** written mainly in javascript.

## Pre-requisites:

-   Download & install [Node js](https://nodejs.org/en/download/) or an equivalent.
-   Download & install [Visual Studio code](https://code.visualstudio.com/) or an equivalent (optional).

### To start coding and build:

-   Clone this repository in the folder:

    -   MacOS: ~/Library/Application Support/StarUML/extensions/user
    -   Windows: C:\\Users\\\AppData\\Roaming\\StarUML\\extensions\\user
    -   Linux: ~/.config/StarUML/extensions/user 

-   Install dependencies

```bash
$ npm install
```

-   Open staruml and run extension in tools > SeedBuilder

## Extension usage

-   To start using the extension create a new **ER-Diagram**

-   Each model (table) must follow the following format *MODEL_NAME*

-   It is not necessary to include primary keys because these are generated **automatically**

-   Each attribute must follow the following format *attribute_name: type*

-   To enable authentication requirements, the diagram needs a **USER** model that includes extra attributes besides (email, password, name & last_name). Example: profile_image.

    > in case you do not need add attributes, leave the model empty.


### Attributes types

Each attribute can have the following types

-   int: Integer type

-   string: String type (varchar)

    >  This data type needs *length* attribute in metadata

-   date: Datetime type

-   boolean: Bool type

-   float: Float/Double type

-   enum: Enum type (string with defined values)

>  This data type needs *options* attribute in metadata

-   text: Text type (long string)

### Relations & fk

-   Each one to any relation must include an attribute to reference the parent model

> Example: if a Car model has many Wheels, Wheels model must have a *car: Car* attribute  

### Metadata

Each attribute & model can have additional information inside the **Documentation** field in staruml

It must follow a json key format

> key_name: value

This are the keys (options) enabled by the extension

-   read: Define whether an attribute or model can be read

    - default: true

-   write: Define whether an attribute or model can be written / changed or deleted

    - default: true

-   views: Define which views to render on the front-end platform. Ex. ReactJs
   
    -  options:
        - all
        - read_only (list, details)
        - write_only (form)
    -  default: all

-   default: Define the default value of an attribute

    - default(date): now
    - default(bool): false

-   length: Define the maximum length of a string

    > required for all string attributes

-   options: Define the available options of an enum

    > required for all enum attributes

### Common errors

-   When delete a relation, press right click and select **delete from model** otherwise it is preserved and could generate duplicates

-   Deeply analyzes one-to-one relationships because they are usually used for very particular cases