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

-   Each attribute must follow the following format *attribute_name: type*

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

### Metadata

Each attribute & model can have additional information inside the **Documentation** field in staruml

It must follow a json key format

> key_name: value

This are the keys (options) enabled by the extension

-   read

-   write

-   views

-   default

-   length

-   options