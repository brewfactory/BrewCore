BrewCore
========

SparkCore edition of the [Brewberry][1] homebrew solution.

What is this?
-------------
[SparkCore][2] powered BIAB brewing system. Brew you own beer.

 - You can set and schedule the temperature steps
 - Collect logs from your brew into a MongoDB
 - Visualize your previous brew logs

**The front-end:**

![Brew scheduler][3]

![Logs][4]
 
Used technologies
-----------------

 - NodeJS (with KOA and SocketIO)
 - AngularJS
 - MongoDB

The SparkCore side
-----------------
You need to flash your SparkCore with the [spark-core-pid-temperature][5] frimware.

Install
-------

### Prerequisites ###

* Node.js >= v0.11.0 (install with [NVM](https://github.com/creationix/nvm))
* Bower (install with: ```npm install -g bower``)

### Setting up the project ###

Installing dependencies from NPM:
```
npm install
```

Installing client-side dependencies from Bower:
```
bower install
```
### Running the project ###

```
npm start
```
or
```
node --harmony app.js
```


  [1]: https://github.com/brewfactory/Brewberry
  [2]: https://www.spark.io/
  [3]: https://www.dropbox.com/s/fr43wy29lvuuvku/Screen%20Shot%202014-06-30%20at%2009.00.33.png
  [4]: https://www.dropbox.com/s/zuq4uum6gsx1595/Screen%20Shot%202014-06-30%20at%2009.01.04.png
  [5]: https://github.com/brewfactory/spark-core-pid-temperature